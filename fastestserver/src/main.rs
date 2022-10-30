extern crate actix_web;
extern crate env_logger;
extern crate r2d2;
extern crate r2d2_sqlite;

use actix_cors::Cors;
use actix_web::http::header;
use actix_web::web::Json;
use actix_web::{error, get, post, web, App, HttpRequest, HttpServer, Result};
use derive_more::{Display, Error};
use fastestserver::db::{LevelUpdate, MonthlyCheck, PartialRankUpdate, PlayingNow, PlayingTime};
use fastestserver::types::{
    AllLevelResponse, AllRankResponse, InsertLevelRequest, InsertRankRequest, InsertRequest,
    LevelResponse, MinecraftJoinedOrLeftRequest, RankResponse,
};
use r2d2::PooledConnection;
use r2d2_sqlite::SqliteConnectionManager;
use rusqlite::params;
use serde;

#[derive(Debug, Clone)]
struct AppState {
    pool: r2d2::Pool<SqliteConnectionManager>,
    secret_key: String,
    bot_conn: (String, i32),
}

#[derive(Debug, Display, Error)]
enum DBError {
    DBError(rusqlite::Error),
}

impl From<rusqlite::Error> for DBError {
    fn from(err: rusqlite::Error) -> Self {
        DBError::DBError(err)
    }
}

fn conv_db_err<T>(_err: T) -> error::Error {
    error::ErrorInternalServerError("db error")
}

impl actix_web::error::ResponseError for DBError {}

#[get("/level/all")]
async fn get_all_levels(data: web::Data<AppState>) -> Result<Json<AllLevelResponse>> {
    let db = data.pool.get().map_err(conv_db_err)?;

    let mut stmt = db
        .prepare("select username,newlevel,timeat from levelupdate order by timeat desc")
        .map_err(conv_db_err)?;
    let level_iter = stmt
        .query_map([], |row| {
            Ok(LevelUpdate {
                new_level: row.get_unwrap(1),
                time_at: row.get_unwrap(2),
                username: row.get_unwrap(0),
            })
        })
        .unwrap();

    let mut level_map = std::collections::HashMap::<String, Vec<LevelResponse>>::new();
    for level in level_iter {
        let level = level.unwrap();
        match level_map.get_mut(&level.username) {
            Some(v) => {
                v.push(LevelResponse {
                    level: level.new_level,
                    time: level.time_at,
                });
            }
            None => {
                level_map.insert(
                    level.username,
                    vec![LevelResponse {
                        level: level.new_level,
                        time: level.time_at,
                    }],
                );
            }
        }
    }
    Ok(web::Json(AllLevelResponse { levels: level_map }))
}

#[get("/rank/{rank_type}/all")]
async fn get_all_ranks(
    data: web::Data<AppState>,
    path: web::Path<(String,)>,
) -> Result<Json<AllRankResponse>> {
    let db = data.pool.get().map_err(conv_db_err)?;

    let rank_type = &path.0;
    if *rank_type != "trio" && *rank_type != "arena" {
        return Err(error::ErrorBadRequest("invalid rank type"));
    }

    let mut stmt = db
        .prepare("select username,newrank,newrankname,timeat from rankupdate WHERE ranktype=? order by timeat desc")
        .map_err(conv_db_err)?;
    let rank_iter = stmt
        .query_map([rank_type], |row| {
            Ok(PartialRankUpdate {
                new_rank: row.get_unwrap(1),
                new_rank_name: row.get_unwrap(2),
                time_at: row.get_unwrap(3),
                username: row.get_unwrap(0),
            })
        })
        .unwrap();

    let mut rank_map = std::collections::HashMap::<String, Vec<RankResponse>>::new();
    for rank in rank_iter {
        let rank = rank.unwrap();
        match rank_map.get_mut(&rank.username) {
            Some(v) => {
                v.push(RankResponse {
                    rank: rank.new_rank,
                    rank_name: rank.new_rank_name,
                    time: rank.time_at,
                });
            }
            None => {
                rank_map.insert(
                    rank.username,
                    vec![RankResponse {
                        rank: rank.new_rank,
                        rank_name: rank.new_rank_name,
                        time: rank.time_at,
                    }],
                );
            }
        }
    }
    Ok(web::Json(AllRankResponse { ranks: rank_map }))
}

#[get("/check/now")]
async fn get_now_playing(data: web::Data<AppState>) -> Result<Json<Vec<PlayingNow>>> {
    let db = data.pool.get().map_err(conv_db_err)?;

    let mut stmt = db
        .prepare("select username,gamename,startedat from playingnow order by startedat desc")
        .map_err(conv_db_err)?;
    let playing_iter = stmt
        .query_map([], |row| {
            Ok(PlayingNow {
                username: row.get_unwrap(0),
                gamename: row.get_unwrap(1),
                started_at: row.get_unwrap(2),
            })
        })
        .unwrap();

    Ok(web::Json(playing_iter.map(|x| x.unwrap()).collect()))
}

#[derive(Debug, Clone, serde::Deserialize)]
struct LimitQuery {
    limit: Option<u32>,
}

#[get("/check/history")]
async fn get_latest_game_sessions(
    data: web::Data<AppState>,
    limit: web::Query<LimitQuery>,
) -> Result<Json<Vec<PlayingTime>>> {
    let limit = limit.limit.unwrap_or(20);

    let db = data.pool.get().map_err(conv_db_err)?;
    let mut stmt = db.prepare("select username,gamename,startedat,endedat from playingtime order by endedat desc limit ?").map_err(conv_db_err)?;
    let iter = stmt
        .query_map([limit], |row| {
            Ok(PlayingTime {
                username: row.get_unwrap(0),
                gamename: row.get_unwrap(1),
                started_at: row.get_unwrap(2),
                ended_at: row.get_unwrap(3),
            })
        })
        .map_err(conv_db_err)?;

    Ok(web::Json(iter.map(|x| x.unwrap()).collect()))
}

#[get("/check/monthly")]
async fn get_monthly_playing_time(data: web::Data<AppState>) -> Result<Json<Vec<MonthlyCheck>>> {
    let db = data.pool.get().map_err(conv_db_err)?;

    let mut stmt = db
        .prepare("select username,gamename,month,year,playtime from monthlycheck")
        .map_err(conv_db_err)?;

    let iter = stmt
        .query_map([], |row| {
            Ok((
                row.get_unwrap(0),
                row.get_unwrap(1),
                row.get_unwrap(2),
                row.get_unwrap(3),
                row.get_unwrap(4),
            ))
        })
        .map_err(conv_db_err)?;

    let s2i = |s: String| s.parse::<i32>().ok();

    let vec = iter
        .map(|x| {
            let (username, gamename, month, year, playtime) = x.unwrap();
            Some(MonthlyCheck {
                username,
                gamename,
                month: s2i(month)?,
                year: s2i(year)?,
                playtime,
            })
        })
        .collect::<Vec<Option<MonthlyCheck>>>();
    let vec_len = vec.len();

    let clean_vec = vec
        .into_iter()
        .filter(|x| x.is_some())
        .map(|x| x.unwrap())
        .collect::<Vec<MonthlyCheck>>();

    if vec_len != clean_vec.len() {
        return Err(conv_db_err(()));
    }

    Ok(web::Json(clean_vec))
}

// type DBPool = r2d2::Pool<SqliteConnectionManager>;

// trait DBConnLike {
//     fn get_conn(self) -> Result<&PooledConnection<SqliteConnectionManager>>;
// }

// impl DBConnLike for DBPool {
//     fn get_conn(self) -> Result<&'a PooledConnection<SqliteConnectionManager>> {
//         self.get().map_err(conv_db_err)
//     }
// }

// impl <'a> DBConnLike for &'a PooledConnection<SqliteConnectionManager> {
//     fn get_conn(self) -> Result<&'a PooledConnection<SqliteConnectionManager>> {
//         Ok(self)
//     }
// }

async fn get_username_from_ingamename(
    db: &PooledConnection<SqliteConnectionManager>,
    in_game_name: &str,
) -> Result<Option<String>> {
    let mut stmt = db
        .prepare("select username from ingamename where ingamename=?")
        .map_err(conv_db_err)?;
    let mut rows = stmt
        .query_map([in_game_name], |row| Ok(row.get_unwrap(0)))
        .map_err(conv_db_err)?;
    let row = rows.next();
    match row {
        Some(row) => Ok(Some(row.unwrap())),
        None => Ok(None),
    }
}

async fn game_existence_check(
    db: &PooledConnection<SqliteConnectionManager>,
    game_name: &str,
) -> Result<bool> {
    let mut stmt = db
        .prepare("select gamename from game where gamename=?")
        .map_err(conv_db_err)?;
    let mut rows = stmt
        .query_map([game_name], |row| Ok(row.get_unwrap::<usize, String>(0)))
        .map_err(conv_db_err)?;
    let row = rows.next();
    Ok(row.is_some())
}

#[post("/check")]
async fn insert_check(data: web::Data<AppState>, req: web::Json<InsertRequest>) -> Result<String> {
    let mut db = data.pool.get().map_err(conv_db_err)?;

    let username = get_username_from_ingamename(&db, &req.in_game_name).await?;
    let username = match username {
        None => return Err(error::ErrorNotFound("in-game name not found")),
        Some(username) => username,
    };
    match req.r#type.as_str() {
        "start" => {
            if !game_existence_check(&db, &req.game_name).await? {
                return Err(error::ErrorNotFound("game not found"));
            }
            let tx = db.transaction().map_err(conv_db_err)?;
            tx.execute(
                "insert into playingnow (username,gamename,startedat) values (?,?,?) ON CONFLICT(username) DO UPDATE SET gamename=?,startedat=?", params![&username, &req.game_name, &req.time, &req.game_name, &req.time]).map_err(conv_db_err)?;

            tx.commit().map_err(conv_db_err)?;
            return Ok("".to_string());
        }
        "stop" => {
            if !game_existence_check(&db, &req.game_name).await? {
                return Err(error::ErrorNotFound("game not found"));
            }

            let tx = db.transaction().map_err(conv_db_err)?;

            let (gamename, started_at) = {
                // retrive start info from playingnow table
                let mut stmt = tx
                    .prepare("select gamename,startedat from playingnow where username=?")
                    .map_err(conv_db_err)?;
                let mut rows = stmt
                    .query_map([&username], |row| {
                        Ok((row.get_unwrap(0), row.get_unwrap(1)))
                    })
                    .map_err(conv_db_err)?;
                match rows.next() {
                    Some(row) => row.unwrap(),
                    None => return Err(error::ErrorNotFound("start entry not found")),
                }
            };

            let gamename: String = gamename;
            let started_at: i32 = started_at;

            // if game names do not match, reject the request
            if gamename != req.game_name {
                return Err(error::ErrorBadRequest(
                    "game name does not match with start info",
                ));
            }

            // delete from playingnow table
            tx.execute("delete from playingnow where username=?", params![username])
                .map_err(conv_db_err)?;

            // insert into playingtime table
            tx.execute(
                "insert into playingtime (username,gamename,startedat,endedat) values (?,?,?,?)",
                params![username, req.game_name, started_at, req.time],
            )
            .map_err(conv_db_err)?;

            tx.commit().map_err(conv_db_err)?;

            return Ok("".to_string());
        }
        _ => {
            return Err(error::ErrorBadRequest("type must be 'start' or 'stop"));
        }
    }
}

#[post("/level")]
async fn insert_level_update(
    data: web::Data<AppState>,
    req: web::Json<InsertLevelRequest>,
) -> Result<String> {
    let mut db = data.pool.get().map_err(conv_db_err)?;

    let username = get_username_from_ingamename(&db, &req.in_game_name).await?;
    let username = match username {
        None => return Err(error::ErrorNotFound("in-game name not found")),
        Some(username) => username,
    };

    let tx = db.transaction().map_err(conv_db_err)?;

    tx.execute(
        "insert into levelupdate (username,oldlevel,newlevel,timeat) values (?,?,?,?)",
        params![&username, req.old_level, req.new_level, req.time],
    )
    .map_err(conv_db_err)?;

    tx.commit().map_err(conv_db_err)?;

    Ok("".to_string())
}

#[post("/rank")]
async fn insert_rank_update(
    data: web::Data<AppState>,
    req: web::Json<InsertRankRequest>,
) -> Result<String> {
    let mut db = data.pool.get().map_err(conv_db_err)?;

    let username = get_username_from_ingamename(&db, &req.in_game_name).await?;
    let username = match username {
        None => return Err(error::ErrorNotFound("in-game name not found")),
        Some(username) => username,
    };

    let tx = db.transaction().map_err(conv_db_err)?;

    tx.execute(
        "insert into rankupdate (username,oldrank,oldrankname,newrank,newrankname,timeat,ranktype) values (?,?,?,?,?,?,?)",
        params![&username, req.old_rank, &req.old_rank_name, req.new_rank, &req.new_rank_name, req.time, &req.rank_type],
    )
    .map_err(conv_db_err)?;

    tx.commit().map_err(conv_db_err)?;

    Ok("".to_string())
}

fn validate_secret(req: &HttpRequest, data: &web::Data<AppState>) -> Result<()> {
    let secret = req.headers().get("X-Nextpex-Secret");
    match secret {
        None => Err(error::ErrorUnauthorized("need auth")),
        Some(secret) => {
            if secret != &data.secret_key {
                Err(error::ErrorUnauthorized("invalid secret"))
            } else {
                Ok(())
            }
        }
    }
}

fn conv_zmq_err<T>(_err: T) -> error::Error {
    error::ErrorInternalServerError("internal IPC error")
}

fn make_requester(zmq_conn: &(String, i32)) -> Result<zmq::Socket> {
    let context = zmq::Context::new();
    let requester = context.socket(zmq::REQ).unwrap();

    let conn = format!("tcp://{}:{}", zmq_conn.0, zmq_conn.1);

    conv_zmq_err(requester.connect(&conn))
}

fn validate_zmq_response(msg: &zmq::Message) -> bool {
    match msg.as_str() {
        None => false,
        Some(s) => s == "ok",
    }
}

#[post("/minecraft/joined")]
async fn minecraft_joined(
    data: web::Data<AppState>,
    req: HttpRequest,
    body: web::Json<MinecraftJoinedOrLeftRequest>,
) -> Result<String> {
    validate_secret(&req, &data)?;

    let requester = make_requester(&data.bot_conn)?;
    let mut msg = zmq::Message::new();

    let mut db = data.pool.get().map_err(conv_db_err)?;
    let mut stmt =
        db.prepare("insert into minecraft_players(playername) VALUES(?) ON CONFLICT DO NOTHING")?;
    stmt.execute([&body.0.username])?;

    match requester.send(format!("connected:{}", &body.0.username)) {
        Err(e) => {
            eprintln!("zmq error: {:?}", &e);
            return Err(conv_zmq_err(&e));
        }
        _ => {}
    }

    Ok("".to_string())
}

#[post("/minecraft/left")]
async fn minecraft_left(
    data: web::Data<AppState>,
    req: HttpRequest,
    body: web::Json<MinecraftJoinedOrLeftRequest>,
) -> Result<String> {
    validate_secret(&req, &data)?;

    let mut conn = data
        .redis
        .get_async_connection()
        .await
        .map_err(conv_zmq_err)?;

    redis::pipe()
        .srem("mc_players", &body.username)
        .lpush("mc_event", format!("disconnected:{}", &body.username))
        .query_async(&mut conn)
        .await
        .map_err(conv_zmq_err)?;

    Ok("".to_string())
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();

    let manager = SqliteConnectionManager::file("data/db.sqlite3");
    let pool = r2d2::Pool::new(manager).unwrap();

    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin_fn(|origin, _req_head| true)
            .allowed_methods(vec!["GET", "POST"])
            .allowed_headers(vec![header::AUTHORIZATION, header::ACCEPT])
            .allowed_header(header::CONTENT_TYPE)
            .supports_credentials()
            .max_age(3600);
        let secret_key = std::env::var("SECRET_KEY").expect("SECRET_KEY not set");

        let bot_addr = std::env::var("BOT_ADDR").expect("BOT_ADDR not set");
        let bot_port = std::env::var("BOT_PORT")
            .expect("BOT_PORT not set")
            .parse::<i32>()
            .expect("BOT_PORT is not integer");

        App::new()
            .app_data(web::Data::new(AppState {
                pool: pool.clone(),
                secret_key,
                bot_conn: (bot_addr, bot_port),
            }))
            .wrap(cors)
            .service(get_all_levels)
            .service(get_all_ranks)
            .service(get_now_playing)
            .service(get_latest_game_sessions)
            .service(get_monthly_playing_time)
            .service(insert_check)
            .service(insert_level_update)
            .service(insert_rank_update)
            .service(minecraft_joined)
            .service(minecraft_left)
    })
    .bind(("0.0.0.0", 9000))?
    .run()
    .await
}
