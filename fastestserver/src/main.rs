extern crate actix_web;
extern crate env_logger;

use std::fmt::Debug;

use actix_cors::Cors;
use actix_web::http::header;
use actix_web::web::Json;
use actix_web::{error, get, post, web, App, HttpRequest, HttpServer, Result};
use derive_more::Display;
use fastestserver::db::{
    GameMongo, InGameNameMongo, LevelUpdate, LevelUpdateMongo, MonthlyCheck, MonthlyCheckAggregate,
    PlayHistory, PlayHistoryMongo, PlayingNow, PlayingTime, RankUpdate, RankUpdateMongo,
};
use fastestserver::types::{
    AllLevelResponse, AllRankResponse, InsertLevelRequest, InsertRankRequest, InsertRequest,
    LevelResponse, MinecraftJoinedOrLeftRequest, RankResponse,
};
use futures::stream::TryStreamExt;
use mongodb::bson::oid::ObjectId;
use mongodb::bson::{doc, from_bson, Bson};
use mongodb::options::ClientOptions;
use mongodb::{Client, Database};
use serde;

#[derive(Debug, Clone)]
struct AppState {
    db_prefix: DBInfo, // example: http://admin:admin@localhost:5984/nextpex
    bot_conn: (String, i32),
}

#[derive(Debug, Clone)]
struct DBInfo {
    db: mongodb::Database,
}

#[derive(Debug, Display)]
enum DBError {
    DBError(String),
    ConflictError,
}

type DBResult<T> = std::result::Result<T, DBError>;

fn conv_to_db_err<T: Debug>(_err: T) -> DBError {
    eprintln!("DBError: {:?}", _err);
    DBError::DBError("db error".to_owned())
}

fn conv_db_err<T: Debug>(_err: T) -> error::Error {
    eprintln!("DBError: {:?}", _err);
    error::ErrorInternalServerError("db error")
}

impl actix_web::error::ResponseError for DBError {}

#[get("/level/all")]
async fn get_all_levels(data: web::Data<AppState>) -> Result<Json<AllLevelResponse>> {
    let mut level_iter = data
        .db_prefix
        .db
        .collection::<LevelUpdateMongo>("level_updates")
        .aggregate(
            [
                // doc! {
                //     "$sort": doc! {
                //         "time": -1
                //     }
                // },
                doc! {
                    "$lookup": doc! {
                        "from": "users",
                        "localField": "user",
                        "foreignField": "_id",
                        "as": "username"
                    }
                },
                doc! {
                    "$unset": [
                        "user",
                        "old_level"
                    ]
                },
                doc! {
                    "$set": doc! {
                        "username": doc! {
                            "$getField": doc! {
                                "field": "username",
                                "input": doc! {
                                    "$arrayElemAt": [
                                        "$username",
                                        0
                                    ]
                                }
                            }
                        },
                        "level": "$new_level"
                    }
                },
                doc! {
                    "$unset": "new_level"
                },
            ],
            None,
        )
        .await
        .map_err(|e| conv_db_err(e))?;

    let mut level_map = std::collections::HashMap::<String, Vec<LevelResponse>>::new();
    while let Some(doc) = level_iter.try_next().await.map_err(|e| conv_db_err(e))? {
        let level: LevelUpdate = mongodb::bson::from_bson(mongodb::bson::Bson::Document(doc))
            .map_err(|e| conv_db_err(e))?;
        let response = LevelResponse {
            level: level.level,
            time: level.time.timestamp_millis() / 1000,
        };
        level_map
            .entry(level.username.clone())
            .or_insert_with(Vec::new)
            .push(response);
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

    let mut rank_iter = data
        .db_prefix
        .db
        .collection::<RankUpdateMongo>("rank_updates")
        .aggregate(
            [
                doc! {
                    "$match": doc! {
                        "rank_type": rank_type
                    }
                },
                doc! {
                    "$unset": [
                        "old_rank",
                        "old_rank_name"
                    ]
                },
                doc! {
                    "$set": doc! {
                        "rank": "$new_rank",
                        "rank_name": "$new_rank_name"
                    }
                },
                doc! {
                    "$unset": [
                        "new_rank",
                        "new_rank_name"
                    ]
                },
                doc! {
                    "$lookup": doc! {
                        "from": "users",
                        "localField": "user",
                        "foreignField": "_id",
                        "as": "username"
                    }
                },
                doc! {
                    "$set": doc! {
                        "username": doc! {
                            "$getField": doc! {
                                "input": doc! {
                                    "$first": "$username"
                                },
                                "field": "username"
                            }
                        }
                    }
                },
                doc! {
                    "$unset": [
                        "user",
                        "rank_type"
                    ]
                },
            ],
            None,
        )
        .await
        .map_err(|e| conv_db_err(e))?;

    let mut rank_map = std::collections::HashMap::<String, Vec<RankResponse>>::new();
    while let Some(doc) = rank_iter.try_next().await.map_err(|e| conv_db_err(e))? {
        let rank: RankUpdate = mongodb::bson::from_bson(mongodb::bson::Bson::Document(doc))
            .map_err(|e| conv_db_err(e))?;
        let response = RankResponse {
            rank: rank.rank,
            rank_name: rank.rank_name,
            time: rank.time.timestamp_millis() / 1000,
        };
        rank_map
            .entry(rank.username.clone())
            .or_insert_with(Vec::new)
            .push(response);
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

    let agg = [
        doc! {
            "$sort": doc! {
                "started_at": -1
            }
        },
        doc! {
            "$limit": limit
        },
        doc! {
            "$lookup": doc! {
                "from": "users",
                "localField": "user",
                "foreignField": "_id",
                "as": "username"
            }
        },
        doc! {
            "$set": doc! {
                "username": doc! {
                    "$getField": doc! {
                        "input": doc! {
                            "$first": "$username"
                        },
                        "field": "username"
                    }
                }
            }
        },
        doc! {
            "$lookup": doc! {
                "from": "games",
                "localField": "game",
                "foreignField": "_id",
                "as": "gamename"
            }
        },
        doc! {
            "$set": doc! {
                "gamename": doc! {
                    "$getField": doc! {
                        "input": doc! {
                            "$first": "$gamename"
                        },
                        "field": "name"
                    }
                }
            }
        },
        doc! {
            "$unset": [
                "user",
                "game"
            ]
        },
    ];

    let mut docs = data
        .db_prefix
        .db
        .collection::<PlayHistoryMongo>("play_history")
        .aggregate(agg, None)
        .await
        .map_err(conv_db_err)?;

    let mut playing_times: Vec<PlayingTime> = Vec::new();
    while let Some(doc) = docs.try_next().await.map_err(conv_db_err)? {
        let history: PlayHistory = from_bson(Bson::Document(doc)).map_err(conv_db_err)?;

        playing_times.push(PlayingTime {
            username: history.username,
            gamename: history.gamename,
            started_at: history.started_at.timestamp_millis() / 1000,
            ended_at: history.ended_at.timestamp_millis() / 1000,
        });
    }

    Ok(web::Json(playing_times))
}

#[get("/check/monthly")]
async fn get_monthly_playing_time(data: web::Data<AppState>) -> Result<Json<Vec<MonthlyCheck>>> {
    let agg = [
        doc! {
            "$lookup": doc! {
                "from": "users",
                "localField": "user",
                "foreignField": "_id",
                "as": "username"
            }
        },
        doc! {
            "$set": doc! {
                "username": doc! {
                    "$getField": doc! {
                        "input": doc! {
                            "$first": "$username"
                        },
                        "field": "username"
                    }
                }
            }
        },
        doc! {
            "$lookup": doc! {
                "from": "games",
                "localField": "game",
                "foreignField": "_id",
                "as": "gamename"
            }
        },
        doc! {
            "$set": doc! {
                "gamename": doc! {
                    "$getField": doc! {
                        "input": doc! {
                            "$first": "$gamename"
                        },
                        "field": "name"
                    }
                }
            }
        },
        doc! {
            "$unset": [
                "user",
                "game"
            ]
        },
        doc! {
            "$addFields": doc! {
                "playtime": doc! {
                    "$dateDiff": doc! {
                        "startDate": "$started_at",
                        "endDate": "$ended_at",
                        "unit": "second"
                    }
                },
                "year": doc! {
                    "$year": "$started_at"
                },
                "month": doc! {
                    "$month": "$started_at"
                }
            }
        },
        doc! {
            "$unset": [
                "started_at",
                "ended_at"
            ]
        },
        doc! {
            "$group": doc! {
                "_id": doc! {
                    "year": "$year",
                    "month": "$month",
                    "username": "$username",
                    "gamename": "$gamename"
                },
                "playtime": doc! {
                    "$sum": "$playtime"
                }
            }
        },
    ];

    let mut docs = data
        .db_prefix
        .db
        .collection::<PlayHistoryMongo>("play_history")
        .aggregate(agg, None)
        .await
        .map_err(conv_db_err)?;

    let mut monthly_checks: Vec<MonthlyCheck> = Vec::new();
    while let Some(doc) = docs.try_next().await.map_err(conv_db_err)? {
        let history: MonthlyCheckAggregate = from_bson(Bson::Document(doc)).map_err(conv_db_err)?;

        monthly_checks.push(MonthlyCheck {
            username: history._id.username,
            gamename: history._id.gamename,
            year: history._id.year,
            month: history._id.month,
            playtime: history.playtime,
        });
    }

    Ok(web::Json(monthly_checks))
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
    in_game_name: &str,
    db: &Database,
) -> Result<Option<ObjectId>> {
    let user_id = db
        .collection::<InGameNameMongo>("in_game_names")
        .find_one(
            doc! {
                "in_game_name": in_game_name
            },
            None,
        )
        .await
        .map_err(conv_db_err)?;

    Ok(user_id.map(|u| u.user))
}

async fn game_existence_check(game_name: &str, db: &Database) -> Result<bool> {
    let user_id = db
        .collection::<GameMongo>("games")
        .find_one(
            doc! {
                "name": game_name
            },
            None,
        )
        .await
        .map_err(conv_db_err)?;

    Ok(user_id.is_some())
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

    let mut client_options = ClientOptions::parse("mongodb://localhost:27017/nextpex?w=majority")
        .await
        .unwrap();

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

        let client = Client::with_options(client_options.clone()).unwrap();
        let db = client.database("nextpex");

        App::new()
            .app_data(web::Data::new(AppState {
                db_prefix: DBInfo { db: db },
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
