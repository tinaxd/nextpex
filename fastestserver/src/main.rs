use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use derive_more::{Display, Error};
use fastestserver::db::LevelUpdate;
use rusqlite::{Connection, Result};

struct AppState {
    db: Connection,
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
async fn get_all_levels(data: web::Data<AppState>) -> impl Responder {
    let db = &data.db;

    let mut stmt = db
        .prepare("select username,newlevel,timeat from levelupdate order by timeat desc")
        .map_err(conv_db_err)
        .unwrap();
    let level_iter = stmt
        .query_map([], |row| {
            Ok(LevelUpdate {
                new_level: row.get(0).unwrap(),
                time_at: row.get(1).unwrap(),
                username: row.get(2).unwrap(),
            })
        })
        .unwrap();

    let mut levelMap = std::collections::HashMap::new();
    for level in level_iter {
        let level = level.unwrap();
        levelMap.insert(level.username, level);
    }
    HttpResponse::Ok().body("hello")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let conn = Connection::open("db.sqlite3")?;

    HttpServer::new(|| {
        App::new()
            .app_data(AppState { db: conn })
            .service(hello)
            .service(echo)
            .route("/hey", web::get().to(manual_hello))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
