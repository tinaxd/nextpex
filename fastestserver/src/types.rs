use std::collections::HashMap;

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct LevelResponse {
    pub level: i32,
    pub time: i64,
}

#[derive(Serialize, Deserialize)]
pub struct AllLevelResponse {
    pub levels: HashMap<String, Vec<LevelResponse>>,
}

#[derive(Serialize, Deserialize)]
pub struct RankResponse {
    pub rank: i32,
    pub rank_name: String,
    pub time: i64,
}

#[derive(Serialize, Deserialize)]
pub struct AllRankResponse {
    pub ranks: HashMap<String, Vec<RankResponse>>,
}

#[derive(Serialize, Deserialize)]
pub struct InsertRequest {
    pub in_game_name: String,
    pub r#type: String,
    pub time: i64,
    pub game_name: String,
}

#[derive(Serialize, Deserialize)]
pub struct InsertLevelRequest {
    pub in_game_name: String,
    pub old_level: i32,
    pub new_level: i32,
    pub time: i64,
}

#[derive(Serialize, Deserialize)]
pub struct InsertRankRequest {
    pub in_game_name: String,
    pub old_rank: i32,
    pub old_rank_name: String,
    pub new_rank: i32,
    pub new_rank_name: String,
    pub time: i64,
    pub rank_type: String,
}

#[derive(Serialize, Deserialize)]
pub struct MinecraftJoinedOrLeftRequest {
    pub username: String,
}
