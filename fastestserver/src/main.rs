extern crate actix_web;
extern crate env_logger;

use std::collections::HashMap;

use actix_cors::Cors;
use actix_web::http::header;
use actix_web::web::Json;
use actix_web::{error, get, post, web, App, HttpRequest, HttpServer, Result};
use derive_more::{Display, Error};
use fastestserver::db::{
    DBKeyValue, DBResponse, DBValueOnly, GameValue, LevelUpdate, MonthlyCheck, PartialRankUpdate,
    PlayHistory, PlayingNow, PlayingTime, RankUpdate,
};
use fastestserver::types::{
    AllLevelResponse, AllRankResponse, InsertLevelRequest, InsertRankRequest, InsertRequest,
    LevelResponse, MinecraftJoinedOrLeftRequest, RankResponse,
};
use serde;

#[derive(Debug, Clone)]
struct AppState {
    db_prefix: DBInfo, // example: http://admin:admin@localhost:5984/nextpex
    bot_conn: (String, i32),
}

#[derive(Debug, Clone)]
struct DBInfo {
    prefix: String,
    user: String,
    pass: String,
}

#[derive(Debug, Display)]
enum DBError {
    DBError(String),
    ConflictError,
}

type DBResult<T> = std::result::Result<T, DBError>;

fn conv_to_db_err<T>(_err: T) -> DBError {
    DBError::DBError("db error".to_owned())
}

fn conv_db_err<T>(_err: T) -> error::Error {
    error::ErrorInternalServerError("db error")
}

impl actix_web::error::ResponseError for DBError {}

#[derive(Debug, Clone, serde::Serialize)]
pub struct DummyParams {}

async fn db_get_params<T: for<'a> serde::Deserialize<'a>, P: serde::Serialize>(
    info: &DBInfo,
    endpoint: &str,
    query_params: Option<P>,
) -> DBResult<Vec<T>> {
    let uri = format!("{}{}", &info.prefix, endpoint);
    let client = awc::Client::default();

    let mut req = client.get(uri).basic_auth(&info.user, &info.pass);
    match query_params {
        Some(query_params) => {
            req = req.query(&query_params).map_err(|e| {
                eprintln!("query param err: {:?}", &e);
                conv_to_db_err(e)
            })?;
        }
        _ => {}
    }
    let mut res = req.send().await.map_err(|e| {
        eprintln!("get error: {:?}", &e);
        conv_to_db_err(e)
    })?;
    let res = res.json::<DBResponse<T>>().await.map_err(|e| {
        eprintln!("json parse error: {:?}", &e);
        eprintln!("original response: {:?}", &res);
        conv_to_db_err(e)
    })?;

    Ok(res.rows)
}

async fn db_get<T: for<'a> serde::Deserialize<'a>>(
    info: &DBInfo,
    endpoint: &str,
) -> DBResult<Vec<T>> {
    db_get_params::<T, DummyParams>(info, endpoint, None).await
}

async fn get_user_map(info: &DBInfo) -> DBResult<HashMap<String, String>> {
    let users = db_get::<DBKeyValue<String, String>>(info, "/_design/nextpex/_view/users").await?;

    let mut result = HashMap::new();
    for user in &users {
        result.insert(user.value.clone(), user.key.clone());
    }
    Ok(result)
}

async fn get_game_map(info: &DBInfo) -> DBResult<HashMap<String, String>> {
    let games =
        db_get::<DBKeyValue<String, GameValue>>(info, "/_design/nextpex/_view/games").await?;

    let mut result = HashMap::new();
    for game in &games {
        result.insert(game.value.id.clone(), game.key.clone());
    }
    Ok(result)
}

#[get("/level/all")]
async fn get_all_levels(data: web::Data<AppState>) -> Result<Json<AllLevelResponse>> {
    let level_iter =
        db_get::<DBValueOnly<LevelUpdate>>(&data.db_prefix, "/_design/nextpex/_view/level_updates")
            .await
            .map_err(conv_db_err)?;

    let users = get_user_map(&data.db_prefix).await.map_err(conv_db_err)?;

    let mut level_map = std::collections::HashMap::<String, Vec<LevelResponse>>::new();
    for level in level_iter {
        let level = level.value;
        let username = users.get(&level.user);
        if username.is_none() {
            continue;
        }
        let username = username.unwrap();
        match level_map.get_mut(username) {
            Some(v) => {
                v.push(LevelResponse {
                    level: level.level,
                    time: level.time,
                });
            }
            None => {
                level_map.insert(
                    username.clone(),
                    vec![LevelResponse {
                        level: level.level,
                        time: level.time,
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
    let rank_type = &path.0;
    if *rank_type != "trio" && *rank_type != "arena" {
        return Err(error::ErrorBadRequest("invalid rank type"));
    }

    let endpoint = if rank_type == "trio" {
        "/_design/nextpex/_view/rank_trio_updates"
    } else {
        "/_design/nextpex/_view/rank_arena_updates"
    };

    let rank_iter = db_get::<DBValueOnly<RankUpdate>>(&data.db_prefix, endpoint)
        .await
        .map_err(conv_db_err)?;

    let users = get_user_map(&data.db_prefix).await.map_err(conv_db_err)?;

    let mut rank_map = std::collections::HashMap::<String, Vec<RankResponse>>::new();
    for rank in rank_iter {
        let rank = rank.value;
        let username = users.get(&rank.user);
        if username.is_none() {
            continue;
        }
        let username = username.unwrap();
        match rank_map.get_mut(username) {
            Some(v) => {
                v.push(RankResponse {
                    rank: rank.rank,
                    rank_name: rank.rank_name,
                    time: rank.time,
                });
            }
            None => {
                rank_map.insert(
                    username.clone(),
                    vec![RankResponse {
                        rank: rank.rank,
                        rank_name: rank.rank_name,
                        time: rank.time,
                    }],
                );
            }
        }
    }
    Ok(web::Json(AllRankResponse { ranks: rank_map }))
}

#[get("/check/now")]
async fn get_now_playing(data: web::Data<AppState>) -> Result<Json<Vec<PlayingNow>>> {
    unimplemented!()
    // let db = data.pool.get().map_err(conv_db_err)?;

    // let mut stmt = db
    //     .prepare("select username,gamename,startedat from playingnow order by startedat desc")
    //     .map_err(conv_db_err)?;
    // let playing_iter = stmt
    //     .query_map([], |row| {
    //         Ok(PlayingNow {
    //             username: row.get_unwrap(0),
    //             gamename: row.get_unwrap(1),
    //             started_at: row.get_unwrap(2),
    //         })
    //     })
    //     .unwrap();

    // Ok(web::Json(playing_iter.map(|x| x.unwrap()).collect()))
}

#[derive(Debug, Clone, serde::Deserialize)]
struct LimitQuery {
    limit: Option<u32>,
}

#[derive(Debug, Clone, serde::Serialize)]
struct PlayHistoryQueryParam {
    limit: u32,
    descending: bool,
}

#[get("/check/history")]
async fn get_latest_game_sessions(
    data: web::Data<AppState>,
    limit: web::Query<LimitQuery>,
) -> Result<Json<Vec<PlayingTime>>> {
    let limit = limit.limit.unwrap_or(20);

    let histories = db_get_params::<DBValueOnly<PlayHistory>, PlayHistoryQueryParam>(
        &data.db_prefix,
        "/_design/nextpex/_view/play_history",
        Some(PlayHistoryQueryParam {
            limit: limit,
            descending: true,
        }),
    )
    .await
    .map_err(conv_db_err)?;

    let users = get_user_map(&data.db_prefix).await.map_err(conv_db_err)?;
    let games = get_game_map(&data.db_prefix).await.map_err(conv_db_err)?;

    let playing_times = histories
        .iter()
        .filter_map(|h| {
            let h = &h.value;
            let username = users.get(&h.user);
            if username.is_none() {
                return None;
            }
            let gamename = games.get(&h.game);
            if gamename.is_none() {
                return None;
            }
            Some(PlayingTime {
                username: username.unwrap().clone(),
                gamename: gamename.unwrap().clone(),
                started_at: *h.started_at.get(0).unwrap() as i64,
                ended_at: *h.ended_at.get(0).unwrap() as i64,
            })
        })
        .collect();

    Ok(web::Json(playing_times))
}

#[get("/check/monthly")]
async fn get_monthly_playing_time(data: web::Data<AppState>) -> Result<Json<Vec<MonthlyCheck>>> {
    unimplemented!()
    // let histories =
    //     db_get::<PlayHistory>(&data.db_prefix, "/_design/nextpex/_view/play_history", "")
    //         .await
    //         .map_err(conv_db_err)?;

    // let playingTimes = histories
    //     .iter()
    //     .map(|h| PlayingTime {
    //         username: h.user.clone(),
    //         gamename: h.game.clone(),
    //         started_at: *h.started_at.get(0).unwrap() as i64,
    //         ended_at: *h.ended_at.get(0).unwrap() as i64,
    //     })
    //     .collect();

    // Ok(web::Json(playingTimes))
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

async fn get_username_from_ingamename(in_game_name: &str) -> Result<Option<String>> {
    unimplemented!()
    // let mut stmt = db
    //     .prepare("select username from ingamename where ingamename=?")
    //     .map_err(conv_db_err)?;
    // let mut rows = stmt
    //     .query_map([in_game_name], |row| Ok(row.get_unwrap(0)))
    //     .map_err(conv_db_err)?;
    // let row = rows.next();
    // match row {
    //     Some(row) => Ok(Some(row.unwrap())),
    //     None => Ok(None),
    // }
}

async fn game_existence_check(game_name: &str) -> Result<bool> {
    unimplemented!()
    // let mut stmt = db
    //     .prepare("select gamename from game where gamename=?")
    //     .map_err(conv_db_err)?;
    // let mut rows = stmt
    //     .query_map([game_name], |row| Ok(row.get_unwrap::<usize, String>(0)))
    //     .map_err(conv_db_err)?;
    // let row = rows.next();
    // Ok(row.is_some())
}

#[post("/check")]
async fn insert_check(data: web::Data<AppState>, req: web::Json<InsertRequest>) -> Result<String> {
    unimplemented!()
    // let mut db = data.pool.get().map_err(conv_db_err)?;

    // let username = get_username_from_ingamename(&db, &req.in_game_name).await?;
    // let username = match username {
    //     None => return Err(error::ErrorNotFound("in-game name not found")),
    //     Some(username) => username,
    // };
    // match req.r#type.as_str() {
    //     "start" => {
    //         if !game_existence_check(&db, &req.game_name).await? {
    //             return Err(error::ErrorNotFound("game not found"));
    //         }
    //         let tx = db.transaction().map_err(conv_db_err)?;
    //         tx.execute(
    //             "insert into playingnow (username,gamename,startedat) values (?,?,?) ON CONFLICT(username) DO UPDATE SET gamename=?,startedat=?", params![&username, &req.game_name, &req.time, &req.game_name, &req.time]).map_err(conv_db_err)?;

    //         tx.commit().map_err(conv_db_err)?;
    //         return Ok("".to_string());
    //     }
    //     "stop" => {
    //         if !game_existence_check(&db, &req.game_name).await? {
    //             return Err(error::ErrorNotFound("game not found"));
    //         }

    //         let tx = db.transaction().map_err(conv_db_err)?;

    //         let (gamename, started_at) = {
    //             // retrive start info from playingnow table
    //             let mut stmt = tx
    //                 .prepare("select gamename,startedat from playingnow where username=?")
    //                 .map_err(conv_db_err)?;
    //             let mut rows = stmt
    //                 .query_map([&username], |row| {
    //                     Ok((row.get_unwrap(0), row.get_unwrap(1)))
    //                 })
    //                 .map_err(conv_db_err)?;
    //             match rows.next() {
    //                 Some(row) => row.unwrap(),
    //                 None => return Err(error::ErrorNotFound("start entry not found")),
    //             }
    //         };

    //         let gamename: String = gamename;
    //         let started_at: i32 = started_at;

    //         // if game names do not match, reject the request
    //         if gamename != req.game_name {
    //             return Err(error::ErrorBadRequest(
    //                 "game name does not match with start info",
    //             ));
    //         }

    //         // delete from playingnow table
    //         tx.execute("delete from playingnow where username=?", params![username])
    //             .map_err(conv_db_err)?;

    //         // insert into playingtime table
    //         tx.execute(
    //             "insert into playingtime (username,gamename,startedat,endedat) values (?,?,?,?)",
    //             params![username, req.game_name, started_at, req.time],
    //         )
    //         .map_err(conv_db_err)?;

    //         tx.commit().map_err(conv_db_err)?;

    //         return Ok("".to_string());
    //     }
    //     _ => {
    //         return Err(error::ErrorBadRequest("type must be 'start' or 'stop"));
    //     }
    // }
}

#[post("/level")]
async fn insert_level_update(
    data: web::Data<AppState>,
    req: web::Json<InsertLevelRequest>,
) -> Result<String> {
    unimplemented!()
    // let mut db = data.pool.get().map_err(conv_db_err)?;

    // let username = get_username_from_ingamename(&db, &req.in_game_name).await?;
    // let username = match username {
    //     None => return Err(error::ErrorNotFound("in-game name not found")),
    //     Some(username) => username,
    // };

    // let tx = db.transaction().map_err(conv_db_err)?;

    // tx.execute(
    //     "insert into levelupdate (username,oldlevel,newlevel,timeat) values (?,?,?,?)",
    //     params![&username, req.old_level, req.new_level, req.time],
    // )
    // .map_err(conv_db_err)?;

    // tx.commit().map_err(conv_db_err)?;

    // Ok("".to_string())
}

#[post("/rank")]
async fn insert_rank_update(
    data: web::Data<AppState>,
    req: web::Json<InsertRankRequest>,
) -> Result<String> {
    unimplemented!()
    // let mut db = data.pool.get().map_err(conv_db_err)?;

    // let username = get_username_from_ingamename(&db, &req.in_game_name).await?;
    // let username = match username {
    //     None => return Err(error::ErrorNotFound("in-game name not found")),
    //     Some(username) => username,
    // };

    // let tx = db.transaction().map_err(conv_db_err)?;

    // tx.execute(
    //     "insert into rankupdate (username,oldrank,oldrankname,newrank,newrankname,timeat,ranktype) values (?,?,?,?,?,?,?)",
    //     params![&username, req.old_rank, &req.old_rank_name, req.new_rank, &req.new_rank_name, req.time, &req.rank_type],
    // )
    // .map_err(conv_db_err)?;

    // tx.commit().map_err(conv_db_err)?;

    // Ok("".to_string())
}

fn conv_zmq_err<T>(_err: T) -> error::Error {
    error::ErrorInternalServerError("internal IPC error")
}

fn make_requester(zmq_conn: &(String, i32)) -> Result<zmq::Socket> {
    let context = zmq::Context::new();
    let requester = context.socket(zmq::REQ).unwrap();

    let conn = format!("tcp://{}:{}", zmq_conn.0, zmq_conn.1);

    Err(conv_zmq_err(requester.connect(&conn)))
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
    _req: HttpRequest,
    body: web::Json<MinecraftJoinedOrLeftRequest>,
) -> Result<String> {
    unimplemented!()
    // let requester = make_requester(&data.bot_conn)?;

    // let db = data.pool.get().map_err(conv_db_err)?;
    // let mut stmt = db
    //     .prepare("insert into minecraft_players(playername) VALUES(?) ON CONFLICT DO NOTHING")
    //     .map_err(conv_db_err)?;
    // stmt.execute([&body.0.username]).map_err(conv_db_err)?;

    // match requester.send(format!("connected:{}", &body.0.username).as_str(), 0) {
    //     Err(e) => {
    //         eprintln!("zmq error: {:?}", &e);
    //         return Err(conv_zmq_err(&e));
    //     }
    //     _ => {
    //         let mut msg = zmq::Message::new();
    //         match requester.recv(&mut msg, 0) {
    //             Err(e) => {
    //                 eprintln!("zmq res error: {:?}", &e);
    //                 return Err(conv_zmq_err(&e));
    //             }
    //             Ok(()) => {
    //                 if !validate_zmq_response(&msg) {
    //                     eprintln!("invalid zmq response: {:?}", &msg);
    //                     return Err(conv_zmq_err(()));
    //                 }
    //             }
    //         }
    //     }
    // }

    // Ok("".to_string())
}

#[post("/minecraft/left")]
async fn minecraft_left(
    data: web::Data<AppState>,
    _req: HttpRequest,
    body: web::Json<MinecraftJoinedOrLeftRequest>,
) -> Result<String> {
    unimplemented!()
    // let requester = make_requester(&data.bot_conn)?;

    // let db = data.pool.get().map_err(conv_db_err)?;
    // let mut stmt = db
    //     .prepare("delete from minecraft_players where playername=?")
    //     .map_err(conv_db_err)?;
    // stmt.execute([&body.0.username]).map_err(conv_db_err)?;

    // match requester.send(format!("disconnected:{}", &body.0.username).as_str(), 0) {
    //     Err(e) => {
    //         eprintln!("zmq error: {:?}", &e);
    //         return Err(conv_zmq_err(&e));
    //     }
    //     _ => {
    //         let mut msg = zmq::Message::new();
    //         match requester.recv(&mut msg, 0) {
    //             Err(e) => {
    //                 eprintln!("zmq res error: {:?}", &e);
    //                 return Err(conv_zmq_err(&e));
    //             }
    //             Ok(()) => {
    //                 if !validate_zmq_response(&msg) {
    //                     eprintln!("invalid zmq response: {:?}", &msg);
    //                     return Err(conv_zmq_err(()));
    //                 }
    //             }
    //         }
    //     }
    // }

    // Ok("".to_string())
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();

    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin_fn(|_origin, _req_head| true)
            .allowed_methods(vec!["GET", "POST"])
            .allowed_headers(vec![header::AUTHORIZATION, header::ACCEPT])
            .allowed_header(header::CONTENT_TYPE)
            .supports_credentials()
            .max_age(3600);

        let bot_addr = std::env::var("BOT_ADDR").expect("BOT_ADDR not set");
        let bot_port = std::env::var("BOT_PORT")
            .expect("BOT_PORT not set")
            .parse::<i32>()
            .expect("BOT_PORT is not integer");

        App::new()
            .app_data(web::Data::new(AppState {
                db_prefix: DBInfo {
                    prefix: "http://localhost:5984/nextpex".to_owned(),
                    user: "admin".to_owned(),
                    pass: "admin".to_owned(),
                },
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
