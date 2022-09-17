use serde;

#[derive(Debug, Clone)]
pub struct LevelUpdate {
    pub new_level: i32,
    pub time_at: i32,
    pub username: String,
}

#[derive(Debug, Clone)]
pub struct RankUpdate {
    pub username: String,
    pub old_rank: Option<i32>,
    pub new_rank: i32,
    pub old_rank_name: Option<String>,
    pub new_rank_name: String,
    pub time_at: i32,
    pub rank_type: String,
}

#[derive(Debug, Clone)]
pub struct PartialRankUpdate {
    pub username: String,
    // pub old_rank: Option<i32>,
    pub new_rank: i32,
    // pub old_rank_name: Option<String>,
    pub new_rank_name: String,
    pub time_at: i32,
    // pub rank_type: String,
}

#[derive(Debug, Clone, serde::Serialize)]
pub struct PlayingTime {
    pub username: String,
    pub gamename: String,
    pub started_at: i32,
    pub ended_at: i32,
}

#[derive(Debug, Clone, serde::Serialize)]
pub struct PlayingNow {
    pub username: String,
    pub gamename: String,
    pub started_at: i32,
}

#[derive(Debug, Clone, serde::Serialize)]
pub struct MonthlyCheck {
    pub username: String,
    pub gamename: String,
    pub month: i32,
    pub year: i32,
    pub playtime: i32, // in seconds
}
