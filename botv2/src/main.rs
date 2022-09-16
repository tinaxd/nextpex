extern crate redis;
extern crate serenity;
extern crate tokio;

use std::env;

use serenity::async_trait;
use serenity::model::channel::Message;
use serenity::model::gateway::Ready;
use serenity::prelude::*;

use redis::AsyncCommands;

struct Handler {
    redis: redis::Client,
}

type RedisResult<T> = std::result::Result<T, redis::RedisError>;

async fn get_players_from_redis(conn: &mut redis::aio::Connection) -> RedisResult<Vec<String>> {
    match conn.smembers("mc_players").await {
        Err(e) => Err(e),
        Ok(players) => {
            let mut players: Vec<String> = players;
            players.sort();
            Ok(players)
        }
    }
}

async fn get_guild_ids(conn: &mut redis::aio::Connection) -> RedisResult<Vec<String>> {
    match conn.smembers("guild_ids").await {
        Err(e) => Err(e),
        Ok(guild_ids) => {
            let mut guild_ids: Vec<String> = guild_ids;
            guild_ids.sort();
            Ok(guild_ids)
        }
    }
}

async fn get_target_channel(
    conn: &mut redis::aio::Connection,
    guild_id: &str,
) -> RedisResult<Option<i32>> {
    match conn.get(format!("mc_channel:{}", guild_id)).await {
        Err(e) => Err(e),
        Ok(channel_id) => match channel_id {
            Some(channel_id) => Ok(Some(channel_id)),
            None => Ok(None),
        },
    }
}

fn build_message(players: &[String]) -> String {
    let msg = "サーバーに参加中のプレイヤー:\n";
    let pls = players.join("\n");
    format!("{}{}", msg, pls)
}

async fn process_event(
    conn: &mut redis::aio::Connection,
    ctx: &Context,
    event: &str,
) -> Result<(), String> {
    let mut split = event.split(":");
    if let Some(event_name) = split.nth(0) {
        if let Some(text) = match event_name {
            "connected" => {
                if let Some(player) = split.nth(1) {
                    Some(format!("{} がサーバーに参加しました！", player))
                } else {
                    None
                }
            }
            "disconnected" => {
                if let Some(player) = split.nth(1) {
                    Some(format!("{} がサーバーから抜けました！", player))
                } else {
                    None
                }
            }
            _ => None,
        } {
            let guild_ids = get_guild_ids(conn).await.map_err(|e| e.to_string())?;
            for guild_id in guild_ids {
                match get_target_channel(conn, guild_id.as_str()).await {
                    Err(e) => return Err(e.to_string()),
                    Ok(channel_id) => match channel_id {
                        Some(channel_id) => {
                            let channel_id = serenity::model::id::ChannelId(channel_id as u64);
                            if let Err(e) = channel_id.say(&ctx.http, text.as_str()).await {
                                return Err(e.to_string());
                            }
                        }
                        None => {
                            println!("target channel for guild {} is not set", guild_id);
                        }
                    },
                }
            }
            Ok(())
        } else {
            Err(format!("unknown event name: {}", event_name))
        }
    } else {
        Err(format!("Error: event name not found"))
    }
}

async fn redis_loop(mut conn: redis::aio::Connection, ctx: Context) {
    loop {
        let event = conn.brpop("mc_event", 0).await;
        match event {
            Err(e) => println!("Error: {}", e),
            Ok(event) => {
                let event: (String, String) = event;
                let event = event.1;
                if let Err(e) = process_event(&mut conn, &ctx, &event).await {
                    println!("Error: {}", e);
                }
            }
        }
    }
}

#[async_trait]
impl EventHandler for Handler {
    // Set a handler for the `message` event - so that whenever a new message
    // is received - the closure (or function) passed will be called.
    //
    // Event handlers are dispatched through a threadpool, and so multiple
    // events can be dispatched simultaneously.
    async fn message(&self, ctx: Context, msg: Message) {
        let content = &msg.content;
        let prefix = "!minecraft ";
        if !content.starts_with(prefix) {
            return;
        }
        let content = &content[(prefix.len() + 1)..];
        if content == "players" {
            // Sending a message can fail, due to a network error, an
            // authentication error, or lack of permissions to post in the
            // channel, so log to stdout when some error happens, with a
            // description of it.
            match self.redis.get_async_connection().await {
                Ok(mut conn) => {
                    let players = get_players_from_redis(&mut conn).await;
                    match players {
                        Err(e) => println!("Error: {:?}", e),
                        Ok(players) => {
                            let text = build_message(&players);
                            if let Err(why) = msg.channel_id.say(&ctx.http, text).await {
                                println!("Error sending message: {:?}", why);
                            }
                        }
                    }
                }
                Err(e) => println!("RedisError: {:?}", e),
            }
        }
    }

    // Set a handler to be called on the `ready` event. This is called when a
    // shard is booted, and a READY payload is sent by Discord. This payload
    // contains data like the current user's guild Ids, current user data,
    // private channels, and more.
    //
    // In this case, just print what the current user's username is.
    async fn ready(&self, ctx: Context, ready: Ready) {
        println!("{} is connected!", ready.user.name);

        // start redis loop
        let conn = self
            .redis
            .get_async_connection()
            .await
            .expect("failed to get redis connection");
        tokio::spawn(async move { redis_loop(conn, ctx) });
    }
}

#[tokio::main]
async fn main() {
    // Configure the client with your Discord bot token in the environment.
    let token = env::var("DISCORD_TOKEN").expect("Expected a token in the environment");
    // Set gateway intents, which decides what events the bot will be notified about
    let intents = GatewayIntents::GUILD_MESSAGES
        | GatewayIntents::DIRECT_MESSAGES
        | GatewayIntents::MESSAGE_CONTENT;

    let r = redis::Client::open("redis://localhost:6379").expect("redis fail");

    // Create a new instance of the Client, logging in as a bot. This will
    // automatically prepend your bot token with "Bot ", which is a requirement
    // by Discord for bot users.
    let mut client = Client::builder(&token, intents)
        .event_handler(Handler { redis: r })
        .await
        .expect("Err creating client");

    // Finally, start a single shard, and start listening to events.
    //
    // Shards will automatically attempt to reconnect, and will perform
    // exponential backoff until it reconnects.
    if let Err(why) = client.start().await {
        println!("Client error: {:?}", why);
    }
}
