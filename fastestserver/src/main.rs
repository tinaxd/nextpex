extern crate actix_web;
extern crate env_logger;

use std::env;
use std::fmt::Debug;

use actix_cors::Cors;
use actix_web::http::header;
use actix_web::web::Json;
use actix_web::{error, get, post, web, App, HttpServer, Result};

use fastestserver::db::{
    GameMongo, InGameNameMongo, LevelUpdate, LevelUpdateMongo, MonthlyCheck, MonthlyCheckAggregate,
    PlayHistory, PlayHistoryMongo, PlayNow, PlayingNow, PlayingTime, RankUpdate, RankUpdateMongo,
};
use fastestserver::types::{
    AllLevelResponse, AllRankResponse, InsertLevelRequest, InsertRankRequest, InsertRequest,
    LevelResponse, RankResponse,
};
use futures::stream::TryStreamExt;
use mongodb::bson::oid::ObjectId;
use mongodb::bson::{doc, from_bson, Bson, DateTime};
use mongodb::options::{ClientOptions, UpdateOptions};
use mongodb::{Client, Database};
use serde;

#[derive(Debug, Clone)]
struct AppState {
    db_prefix: DBInfo, // example: http://admin:admin@localhost:5984/nextpex
}

#[derive(Debug, Clone)]
struct DBInfo {
    db: mongodb::Database,
}

fn conv_db_err<T: Debug>(_err: T) -> error::Error {
    eprintln!("DBError: {:?}", _err);
    error::ErrorInternalServerError("db error")
}

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
    let db = &data.db_prefix.db;

    let agg = [
        doc! {
            "$sort": doc! {
                "started_at": -1
            }
        },
        doc! {
            "$match": doc! {
                "ended_at": doc! {
                    "$exists": false
                }
            }
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

    let result = db
        .collection::<PlayHistoryMongo>("playing_history")
        .aggregate(agg, None)
        .await
        .map_err(|e| conv_db_err(e))?
        .try_collect::<Vec<_>>()
        .await
        .map_err(|e| conv_db_err(e))?;

    let mut playing_now = Vec::new();
    for doc in &result {
        let play_now: PlayNow =
            mongodb::bson::from_bson(mongodb::bson::Bson::Document(doc.clone()))
                .map_err(|e| conv_db_err(e))?;
        playing_now.push(PlayingNow {
            username: play_now.username,
            gamename: play_now.gamename,
            started_at: play_now.started_at.timestamp_millis() / 1000,
        });
    }

    Ok(web::Json(playing_now))
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
            "$match": doc! {
                "ended_at": doc! {
                    "$exists": true
                }
            }
        },
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
            "$match": doc! {
                "ended_at": doc! {
                    "$exists": true
                }
            }
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

async fn get_user_from_ingamename(in_game_name: &str, db: &Database) -> Result<Option<ObjectId>> {
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

async fn get_game_id(game_name: &str, db: &Database) -> Result<Option<ObjectId>> {
    let game = db
        .collection::<GameMongo>("games")
        .find_one(
            doc! {
                "name": game_name
            },
            None,
        )
        .await
        .map_err(conv_db_err)?;

    Ok(game.map(|g| g._id))
}

#[post("/check")]
async fn insert_check(data: web::Data<AppState>, req: web::Json<InsertRequest>) -> Result<String> {
    let db = &data.db_prefix.db;

    let user_id = get_user_from_ingamename(&req.in_game_name, &db).await?;
    let user_id = match user_id {
        None => return Err(error::ErrorNotFound("in-game name not found")),
        Some(username) => username,
    };
    match req.r#type.as_str() {
        "start" => match get_game_id(&req.game_name, &db).await? {
            None => return Err(error::ErrorNotFound("game not found")),
            Some(game_id) => {
                db.collection::<PlayHistoryMongo>("play_history")
                    .update_one(
                        doc! {
                            "user": user_id
                        },
                        doc! {
                            "$set": doc! {
                                "user": user_id,
                                "game": game_id,
                                "started_at": DateTime::from_millis(req.time * 1000),
                            },
                            "$unset": doc! {
                                "ended_at": 1
                            }
                        },
                        Some(UpdateOptions::builder().upsert(Some(true)).build()),
                    )
                    .await
                    .map_err(conv_db_err)?;
                return Ok("".to_string());
            }
        },
        "stop" => match get_game_id(&req.game_name, &db).await? {
            None => return Err(error::ErrorNotFound("game not found")),
            Some(game_id) => {
                let query = doc! {
                    "user": user_id,
                    "game": game_id,
                    "ended_at": doc! {
                        "$exists": false
                    }
                };
                let update = doc! {
                    "$set": doc! {
                        "ended_at": DateTime::from_millis(req.time*1000)
                    }
                };

                let result = db
                    .collection::<PlayHistoryMongo>("play_history")
                    .update_one(query, update, None)
                    .await
                    .map_err(conv_db_err)?;

                if result.modified_count == 0 {
                    return Err(error::ErrorNotFound("start entry not found"));
                }

                return Ok("".to_string());
            }
        },
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
    let db = &data.db_prefix.db;
    let username = get_user_from_ingamename(&req.in_game_name, &db).await?;
    let username = match username {
        None => return Err(error::ErrorNotFound("in-game name not found")),
        Some(username) => username,
    };

    db.collection::<LevelUpdateMongo>("level_updates")
        .insert_one(
            LevelUpdateMongo {
                user: username,
                new_level: req.new_level,
                old_level: req.old_level,
                time: DateTime::from_millis(req.time * 1000),
            },
            None,
        )
        .await
        .map_err(conv_db_err)?;

    Ok("".to_string())
}

#[post("/rank")]
async fn insert_rank_update(
    data: web::Data<AppState>,
    req: web::Json<InsertRankRequest>,
) -> Result<String> {
    let db = &data.db_prefix.db;
    let username = get_user_from_ingamename(&req.in_game_name, &db).await?;
    let username = match username {
        None => return Err(error::ErrorNotFound("in-game name not found")),
        Some(username) => username,
    };

    db.collection::<RankUpdateMongo>("rank_updates")
        .insert_one(
            RankUpdateMongo {
                user: username,
                new_rank: req.new_rank,
                new_rank_name: req.new_rank_name.to_owned(),
                old_rank: req.old_rank,
                old_rank_name: req.old_rank_name.to_owned(),
                time: DateTime::from_millis(req.time * 1000),
                rank_type: req.rank_type.to_owned(),
            },
            None,
        )
        .await
        .map_err(conv_db_err)?;

    Ok("".to_string())
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();

    let mongo_addr =
        env::var("MONGO_ADDR").unwrap_or_else(|_| "mongodb://localhost:27017".to_string());
    println!("MONGO_ADDR={}", mongo_addr.as_str());

    let client_options = ClientOptions::parse(format!("{}/nextpex?w=majority", mongo_addr))
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

        // let bot_addr = std::env::var("BOT_ADDR").expect("BOT_ADDR not set");
        // let bot_port = std::env::var("BOT_PORT")
        //     .expect("BOT_PORT not set")
        //     .parse::<i32>()
        //     .expect("BOT_PORT is not integer");

        let client = Client::with_options(client_options.clone()).unwrap();
        let db = client.database("nextpex");

        App::new()
            .app_data(web::Data::new(AppState {
                db_prefix: DBInfo { db: db },
                // bot_conn: (bot_addr, bot_port),
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
    })
    .bind(("0.0.0.0", 9000))?
    .run()
    .await
}
