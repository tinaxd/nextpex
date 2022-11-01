use serde;

#[derive(Debug, Clone, serde::Deserialize)]
pub struct DBResponse<T> {
    pub rows: Vec<T>,
}

#[derive(Debug, Clone, serde::Deserialize)]
pub struct DBValueOnly<T> {
    pub value: T,
}

#[derive(Debug, Clone, serde::Deserialize)]
pub struct DBKeyValue<K, V> {
    pub key: K,
    pub value: V,
}

#[derive(Debug, Clone, serde::Deserialize)]
pub struct GameValue {
    pub id: String,
    pub is_checked: bool,
}

#[derive(Debug, Clone, serde::Deserialize)]
pub struct LevelUpdate {
    pub level: i32,
    pub time: i64,
    pub user: String,
}

#[derive(Debug, Clone, serde::Deserialize)]
pub struct RankUpdate {
    pub user: String,
    pub rank: i32,
    pub rank_name: String,
    pub time: i64,
}

#[derive(Debug, Clone, serde::Deserialize)]
pub struct PlayHistory {
    pub user: String,
    pub game: String,
    pub started_at: Vec<i32>,
    pub ended_at: Vec<i32>,
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
