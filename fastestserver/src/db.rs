use mongodb::bson::{oid::ObjectId, DateTime};
use serde::{self, Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct GameMongo {
    pub name: String,
    pub checked: bool,
    pub _id: ObjectId,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct LevelUpdateMongo {
    pub user: ObjectId,
    pub old_level: i32,
    pub new_level: i32,
    pub time: DateTime,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct RankUpdateMongo {
    pub user: ObjectId,
    pub old_rank: i32,
    pub old_rank_name: String,
    pub new_rank: i32,
    pub new_rank_name: String,
    pub time: DateTime,
    pub rank_type: String,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct PlayHistoryMongo {
    pub user: ObjectId,
    pub game: ObjectId,
    pub started_at: DateTime,
    pub ended_at: Option<DateTime>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct InGameNameMongo {
    pub user: ObjectId,
    pub in_game_name: String,
}

#[derive(Debug, Clone, serde::Deserialize)]
pub struct GameValue {
    pub id: String,
    pub is_checked: bool,
}

#[derive(Debug, Clone, serde::Deserialize)]
pub struct LevelUpdate {
    pub level: i32,
    pub time: DateTime,
    pub username: String,
}

#[derive(Debug, Clone, serde::Deserialize)]
pub struct RankUpdate {
    pub username: String,
    pub rank: i32,
    pub rank_name: String,
    pub time: DateTime,
}

#[derive(Debug, Clone, serde::Deserialize)]
pub struct PlayHistory {
    pub username: String,
    pub gamename: String,
    pub started_at: DateTime,
    pub ended_at: DateTime,
}

#[derive(Debug, Clone, serde::Deserialize)]
pub struct PlayNow {
    pub username: String,
    pub gamename: String,
    pub started_at: DateTime,
}

#[derive(Debug, Clone, serde::Deserialize)]
pub struct MonthlyCheckAggregate {
    pub _id: MonthlyCheckAggregateValue,
    pub playtime: i64,
}

#[derive(Debug, Clone, serde::Deserialize)]
pub struct MonthlyCheckAggregateValue {
    pub year: i32,
    pub month: i32,
    pub username: String,
    pub gamename: String,
}

#[derive(Debug, Clone)]
pub struct PartialRankUpdate {
    pub username: String,
    // pub old_rank: Option<i32>,
    pub new_rank: i32,
    // pub old_rank_name: Option<String>,
    pub new_rank_name: String,
    pub time_at: i64,
    // pub rank_type: String,
}

#[derive(Debug, Clone, serde::Serialize)]
pub struct PlayingTime {
    pub username: String,
    pub gamename: String,
    pub started_at: i64,
    pub ended_at: i64,
}

#[derive(Debug, Clone, serde::Serialize)]
pub struct PlayingNow {
    pub username: String,
    pub gamename: String,
    pub started_at: i64,
}

#[derive(Debug, Clone, serde::Serialize)]
pub struct MonthlyCheck {
    pub username: String,
    pub gamename: String,
    pub month: i32,
    pub year: i32,
    pub playtime: i64, // in seconds
}
