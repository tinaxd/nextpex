extern crate r2d2;
extern crate r2d2_sqlite;

use actix_web::web::Json;
use actix_web::{error, get, web, App, HttpServer, Result};
use derive_more::{Display, Error};
use fastestserver::db::LevelUpdate;
use fastestserver::types::{AllLevelResponse, LevelResponse};
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

fn conv_db_err(err: rusqlite::Error) -> DBError {
    DBError::from(err)
}

impl actix_web::error::ResponseError for DBError {}

#[get("/level/all")]
async fn get_all_levels(data: web::Data<AppState>) -> Result<Json<AllLevelResponse>> {
    let db = data
        .pool
        .get()
        .map_err(|_| error::ErrorInternalServerError("db error"))?;

    let mut stmt = db
        .prepare("select username,newlevel,timeat from levelupdate order by timeat desc")
        .map_err(conv_db_err)
        .unwrap();
    let level_iter = stmt
        .query_map([], |row| {
            Ok(LevelUpdate {
                new_level: row.get_unwrap(0),
                time_at: row.get_unwrap(1),
                username: row.get_unwrap(2),
            })
        })
        .unwrap();

    let mut levelMap = std::collections::HashMap::<String, LevelResponse>::new();
    for level in level_iter {
        let level = level.unwrap();
        levelMap.insert(
            level.username.clone(),
            LevelResponse {
                level: level.new_level,
                time: level.time_at,
            },
        );
    }
    Ok(web::Json(AllLevelResponse { levels: levelMap }))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let manager = SqliteConnectionManager::file("db.sqlite3");
    let pool = r2d2::Pool::new(manager).unwrap();

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(AppState { pool: pool.clone() }))
            .service(get_all_levels)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
