extern crate redis;
extern crate reqwest;
extern crate serde;
extern crate serde_json;
extern crate serenity;
extern crate tokio;

use std::cell::RefCell;
use std::collections::HashMap;
use std::env;
use std::sync::Arc;

use chrono::TimeZone;
use serenity::async_trait;
use serenity::framework::StandardFramework;
use serenity::model;
use serenity::model::channel::Message;
use serenity::model::gateway::Ready;
use serenity::model::prelude::*;
use serenity::model::prelude::{ActivityType, Emoji, GuildChannel, Presence};
use serenity::prelude::*;

use redis::AsyncCommands;

struct Handler {
    web_api: String,
    redis: redis::Client,
    watching_msg:
        Arc<Mutex<RefCell<HashMap<serenity::model::id::GuildId, serenity::model::id::MessageId>>>>,
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

async fn get_guild_ids(
    conn: &mut redis::aio::Connection,
) -> RedisResult<Vec<serenity::model::id::GuildId>> {
    match conn.smembers("guild_ids").await {
        Err(e) => Err(e),
        Ok(guild_ids) => {
            let mut guild_ids: Vec<u64> = guild_ids;
            guild_ids.sort();
            Ok(guild_ids
                .iter()
                .map(|x| serenity::model::id::GuildId(*x))
                .collect())
        }
    }
}

async fn get_target_channel(
    conn: &mut redis::aio::Connection,
    guild_id: &serenity::model::id::GuildId,
) -> RedisResult<Option<serenity::model::id::ChannelId>> {
    match conn.get(format!("mc_channel:{}", guild_id.0)).await {
        Err(e) => Err(e),
        Ok(channel_id) => match channel_id {
            Some(channel_id) => Ok(Some(serenity::model::id::ChannelId(channel_id))),
            None => Ok(None),
        },
    }
}

async fn set_target_channel(
    conn: &mut redis::aio::Connection,
    guild_id: &serenity::model::id::GuildId,
    channel_id: &serenity::model::id::ChannelId,
) -> RedisResult<()> {
    conn.set(format!("mc_channel:{}", guild_id.0), channel_id.0)
        .await
}

fn build_message(players: &[String]) -> String {
    if players.len() > 0 {
        let msg = "サーバーに参加中のプレイヤー:\n";
        let pls = players.join("\n");
        format!("{}{}", msg, pls)
    } else {
        "サーバーに参加中のプレイヤーはいません".to_string()
    }
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
                match get_target_channel(conn, &guild_id).await {
                    Err(e) => return Err(e.to_string()),
                    Ok(channel_id) => match channel_id {
                        Some(channel_id) => {
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

async fn find_apexable_role(
    ctx: &Context,
    guild: &model::id::GuildId,
) -> serenity::Result<Option<model::guild::Role>> {
    let roles = guild.roles(&ctx.http).await?;
    for (_, role) in roles {
        if role.name == "APEXable" {
            return Ok(Some(role));
        }
    }
    Ok(None)
}

async fn apex_role_change(
    ctx: &Context,
    member: &mut model::guild::Member,
    on: bool,
) -> serenity::Result<()> {
    match find_apexable_role(ctx, &member.guild_id).await? {
        None => Ok(()),
        Some(role) => {
            if on {
                member.add_role(&ctx.http, role.id).await?;
            } else {
                member.remove_role(&ctx.http, role.id).await?;
            }
            Ok(())
        }
    }
}

#[derive(Debug, Clone, serde::Serialize)]
struct NextpexCheckRequest {
    in_game_name: String,
    r#type: String,
    time: i64,
    game_name: String,
}

impl Handler {
    async fn send_game_notification(
        &self,
        member: &mut serenity::model::guild::Member,
        ctx: &Context,
        event: &GameEvent,
    ) -> serenity::Result<()> {
        let guild = &member.guild_id;
        let chan = find_channel(ctx, guild, "self-apexability").await?;
        if let Some(chan) = chan {
            let (tail, game, on) = match event {
                GameEvent::Start(game) => (format!("{} を始めました！", game), game, true),
                GameEvent::End(game) => (format!("{} をやめました！", game), game, false),
            };
            let content = format!("{} が {}", member.display_name(), tail);
            chan.say(&ctx.http, content).await?;

            if game == "Apex Legends" {
                apex_role_change(ctx, member, on).await?;
            }

            let member_name = &member.display_name();
            let is_start = on;
            let game_name = game;
            let time = chrono::Local::now();
            self.nextpex_apexability(member_name, is_start, game_name, &time)
                .await;
        }

        Ok(())
    }

    async fn nextpex_apexability<T: TimeZone>(
        &self,
        name: &str,
        is_start: bool,
        game_name: &str,
        time: &chrono::DateTime<T>,
    ) {
        let url = format!("{}/check", &self.web_api);
        let body = NextpexCheckRequest {
            in_game_name: name.to_string(),
            r#type: if is_start { "start" } else { "end" }.to_string(),
            time: time.timestamp(),
            game_name: game_name.to_string(),
        };
        let body = serde_json::to_string(&body);

        match body {
            Err(e) => println!("json serialize error: {:?}", e),
            Ok(body) => {
                let client = reqwest::Client::new();
                let res = client.post(url).body(body).send().await;
                match res {
                    Err(e) => println!("nextpex api error: {:?}", e),
                    Ok(res) => {
                        if !res.status().is_success() {
                            println!(
                                "nextpex api 
                            returned failure code: {:?}",
                                res
                            );
                        }
                    }
                }
            }
        }
    }

    async fn send_apexability_msg(
        &self,
        ctx: &Context,
        guild: &serenity::model::id::GuildId,
    ) -> serenity::Result<()> {
        let chan = find_channel(&ctx, guild, SELF_APEX_CHAN).await?;
        if let Some(chan) = chan {
            let content = "Apex Legends を始めたら :apex: リアクションをつけてください。やめたらリアクションを外してください。過去のメッセージにリアクションをつけても反応しません。Discord のステータスメッセージを公開している人はリアクションをつける必要はありません。";

            let emoji = find_emoji(&ctx, guild, "apex").await?;
            if let Some(emoji) = emoji {
                let msg = chan.say(&ctx.http, content).await?;
                self.set_watching_msg(guild.clone(), msg.id).await;
                msg.react(&ctx.http, emoji).await?;
                Ok(())
            } else {
                let guild_name = guild
                    .name(&ctx.cache)
                    .unwrap_or("<unknown guild>".to_string());
                println!(":apex: emoji not found in {}", guild_name);
                Ok(())
            }
        } else {
            Ok(())
        }
    }

    async fn set_watching_msg(
        &self,
        guild_id: serenity::model::id::GuildId,
        msg_id: serenity::model::id::MessageId,
    ) {
        let m = self.watching_msg.clone();
        let mut m = m.lock().await;
        let m = m.get_mut();
        m.insert(guild_id, msg_id);
    }

    async fn is_in_watching_msg(
        &self,
        guild_id: &serenity::model::id::GuildId,
        msg_id: &serenity::model::id::MessageId,
    ) -> bool {
        let m = self.watching_msg.clone();
        let m = m.lock().await;
        let m = m.borrow();

        match m.get(guild_id) {
            None => false,
            Some(waching_msg) => waching_msg == msg_id,
        }
    }

    async fn reaction_handler(
        &self,
        ctx: &Context,
        reaction: &Reaction,
        added: bool,
    ) -> Result<(), String> {
        let guild_id = reaction.guild_id.ok_or("no guild")?;
        let msg = reaction.message(ctx).await.map_err(|e| e.to_string())?;

        if !self.is_in_watching_msg(&guild_id, &msg.id).await {
            return Ok(());
        }

        let member = reaction
            .member
            .as_ref()
            .ok_or("no member field".to_string())?;

        match &member.nick {
            None => {}
            Some(nick) => {
                if nick == "Apex Police" {
                    return Ok(());
                }
            }
        }

        const APEX_GAME: &'static str = "Apex Legends";
        let event = if added {
            GameEvent::Start(APEX_GAME.to_string())
        } else {
            GameEvent::End(APEX_GAME.to_string())
        };

        let mut member = guild_id
            .member(&ctx.http, member.user.as_ref().ok_or("no user id")?.id)
            .await
            .map_err(|e| e.to_string())?;
        self.send_game_notification(&mut member, ctx, &event)
            .await
            .map_err(|e| e.to_string())?;

        Ok(())
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
        // println!("got message: {}", content);
        let prefix = "!minecraft ";
        if !content.starts_with(prefix) {
            return;
        }
        let content = &content[prefix.len()..];
        // println!("content: {} ", content);
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
        } else if content == "set" {
            match self.redis.get_async_connection().await {
                Err(e) => println!("RedisError: {:?}", e),
                Ok(mut conn) => {
                    if let Some(guild_id) = msg.guild_id {
                        let channel_id = msg.channel_id;
                        if let Err(e) = set_target_channel(&mut conn, &guild_id, &channel_id).await
                        {
                            println!("Error set_target_channel: {:?}", e);
                            return;
                        }
                        if let Err(why) = msg
                            .channel_id
                            .say(
                                &ctx.http,
                                "このチャンネルをMinecraftログインの通知先に設定しました",
                            )
                            .await
                        {
                            println!("Error sending message: {:?}", why);
                        }
                    }
                }
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
        {
            let ctx = ctx.clone();
            tokio::spawn(async move { redis_loop(conn, ctx) });
        }

        // send self-apexability msg
        let guilds = ready.guilds;
        for guild in guilds {
            if !guild.unavailable {
                let guild_id = guild.id;
                if let Err(e) = self.send_apexability_msg(&ctx, &guild_id).await {
                    println!("self apexability send Error: {:?}", e);
                }
            }
        }
    }

    // async fn guild_member_update(&self, _ctx: Context, _new: GuildMemberUpdateEvent) {}

    async fn presence_update(&self, ctx: Context, new_data: Presence) {
        // _new_data.user.id;
        // println!("presence_update: {:?}", _new_data);
        match self.redis.get_async_connection().await {
            Err(e) => println!("RedisError: {:?}", e),
            Ok(mut conn) => match detect_game_from_presence(&mut conn, &new_data).await {
                Err(e) => println!("Error: {:?}", e),
                Ok(game) => match game {
                    None => {}
                    Some(game) => {
                        let user = &new_data.user;
                        let guild_id = new_data.guild_id;
                        match guild_id {
                            None => {}
                            Some(guild_id) => match guild_id.member(&ctx, user.id).await {
                                Ok(mut member) => {
                                    if let Err(e) =
                                        self.send_game_notification(&mut member, &ctx, &game).await
                                    {
                                        println!("Error: {:?}", e);
                                    }
                                }
                                Err(e) => println!("Error: {:?}", e),
                            },
                        }
                    }
                },
            },
        }
    }

    async fn reaction_add(&self, ctx: Context, add_reaction: Reaction) {
        if let Err(e) = self.reaction_handler(&ctx, &add_reaction, true).await {
            println!("reaction_add Error: {:?}", e);
        }
    }

    async fn reaction_remove(&self, ctx: Context, removed_reaction: Reaction) {
        if let Err(e) = self.reaction_handler(&ctx, &removed_reaction, false).await {
            println!("reaction_add Error: {:?}", e);
        }
    }
}

#[derive(Debug, Clone)]
enum GameEvent {
    Start(String),
    End(String),
}

async fn detect_game_from_presence(
    conn: &mut redis::aio::Connection,
    new_presence: &Presence,
) -> RedisResult<Option<GameEvent>> {
    let user_id = &new_presence.user.id;

    let old_act = get_last_presence_of_user(conn, user_id)
        .await?
        .map(|a| vec![a]);

    let new_act = new_presence
        .activities
        .iter()
        .map(|a| ActivityCore {
            name: a.name.clone(),
            kind: a.kind,
        })
        .collect::<Vec<ActivityCore>>();

    let started = is_game_start(&old_act, &new_act);
    let stopped = is_game_stop(&old_act, &new_act);
    let status = (started, stopped);
    let result = Ok(match status {
        (None, None) => {
            // not related to game
            None
        }
        (Some(game), None) => {
            // game start
            Some(GameEvent::Start(game))
        }
        (None, Some(game)) => {
            // game stop
            Some(GameEvent::End(game))
        }
        (Some(_), Some(_)) => {
            // really reachable??
            println!("error???: started and stopped");
            None
        }
    });

    // update last presence
    let new_act_core = new_act
        .iter()
        .find(|a| a.kind == ActivityType::Playing)
        .map(|e| e.clone());
    set_presence_of_user(conn, user_id, &new_act_core).await?;
    result
}

#[derive(Debug, Clone)]
struct ActivityCore {
    pub kind: ActivityType,
    pub name: String,
}

async fn get_last_presence_of_user(
    conn: &mut redis::aio::Connection,
    user_id: &serenity::model::id::UserId,
) -> RedisResult<Option<ActivityCore>> {
    let act = conn.get(format!("activity:{}", user_id)).await?;
    match act {
        None => Ok(None),
        Some(act) => {
            let act: String = act;
            Ok(Some(ActivityCore {
                kind: ActivityType::Playing,
                name: act,
            }))
        }
    }
}

async fn set_presence_of_user(
    conn: &mut redis::aio::Connection,
    user_id: &serenity::model::id::UserId,
    act: &Option<ActivityCore>,
) -> RedisResult<()> {
    match act {
        Some(act) => {
            conn.set(format!("activity:{}", user_id), act.name.clone())
                .await?
        }
        None => conn.del(format!("activity:{}", user_id)).await?,
    }
    Ok(())
}

fn is_game_start(old_act: &Option<Vec<ActivityCore>>, new_act: &[ActivityCore]) -> Option<String> {
    // ゲームをプレイしていなかったことを確認
    if let Some(old_act) = old_act {
        for act in old_act {
            match act.kind {
                ActivityType::Playing => return None,
                _ => continue,
            }
        }
    }

    // 今ゲームをプレイしていることを確認
    for act in new_act {
        match act.kind {
            ActivityType::Playing => {
                return Some(act.name.clone());
            }
            _ => continue,
        }
    }
    None
}

fn is_game_stop(old_act: &Option<Vec<ActivityCore>>, new_act: &[ActivityCore]) -> Option<String> {
    // ゲームをプレイしていたことを確認
    let game_name = old_act
        .clone()
        .map(|old_act| {
            old_act
                .iter()
                .find(|act| act.kind == ActivityType::Playing)
                .map(|act| act.name.clone())
        })
        .flatten();

    match game_name {
        None => return None,
        Some(game_name) => {
            // 今ゲームをしていないことを確認
            if new_act.iter().all(|act| act.kind != ActivityType::Playing) {
                return Some(game_name);
            } else {
                return None;
            }
        }
    }
}

async fn find_channel(
    ctx: &Context,
    guild: &serenity::model::id::GuildId,
    chan_name: &str,
) -> serenity::Result<Option<GuildChannel>> {
    let channels = guild.channels(&ctx.http).await?;
    for channel in channels.values() {
        if channel.name == chan_name {
            return Ok(Some(channel.clone()));
        }
    }
    Ok(None)
}

const SELF_APEX_CHAN: &'static str = "self-apexability";

async fn find_emoji(
    ctx: &Context,
    guild: &serenity::model::id::GuildId,
    emoji_name: &str,
) -> serenity::Result<Option<Emoji>> {
    let emojis = guild.emojis(&ctx.http).await?;
    for emoji in emojis {
        if emoji.name == emoji_name {
            return Ok(Some(emoji));
        }
    }
    Ok(None)
}

#[tokio::main]
async fn main() {
    let web_api = env::var("WEB_API").expect("WEB_API not set");

    // Configure the client with your Discord bot token in the environment.
    let token = env::var("DISCORD_TOKEN").expect("DISCORD_TOKEN not set");
    // Set gateway intents, which decides what events the bot will be notified about
    let intents = GatewayIntents::GUILD_MESSAGES
        | GatewayIntents::DIRECT_MESSAGES
        | GatewayIntents::MESSAGE_CONTENT
        | GatewayIntents::GUILD_MEMBERS
        | GatewayIntents::GUILD_MESSAGE_REACTIONS
        | GatewayIntents::GUILD_PRESENCES;

    let r = redis::Client::open("redis://localhost:6379").expect("redis fail");

    // Create a new instance of the Client, logging in as a bot. This will
    // automatically prepend your bot token with "Bot ", which is a requirement
    // by Discord for bot users.
    let mut client = Client::builder(&token, intents)
        .event_handler(Handler {
            web_api,
            redis: r,
            watching_msg: Arc::new(Mutex::new(RefCell::new(HashMap::new()))),
        })
        .framework(StandardFramework::new())
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
