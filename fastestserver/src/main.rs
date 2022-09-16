extern crate r2d2;
extern crate r2d2_sqlite;

use actix_web::web::Json;
use actix_web::{error, get, web, App, HttpServer, Result};
use derive_more::{Display, Error};
use fastestserver::db::{LevelUpdate, PartialRankUpdate, RankUpdate};
use fastestserver::types::{AllLevelResponse, AllRankResponse, LevelResponse, RankResponse};
use r2d2_sqlite::SqliteConnectionManager;
use rusqlite::Connection;

#[derive(Debug, Clone)]
struct AppState {
    pool: r2d2::Pool<SqliteConnectionManager>,
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

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let manager = SqliteConnectionManager::file("db.sqlite3");
    let pool = r2d2::Pool::new(manager).unwrap();

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(AppState { pool: pool.clone() }))
            .service(get_all_levels)
            .service(get_all_ranks)
    })
    .bind(("127.0.0.1", 9000))?
    .run()
    .await
}