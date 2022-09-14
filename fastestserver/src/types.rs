use std::collections::HashMap;

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct LevelResponse {
    level: i32,
    time: i32,
}

#[derive(Serialize, Deserialize)]
struct AllLevelResponse {
    levels: HashMap<String, LevelResponse>,
}

#[derive(Serialize, Deserialize)]
struct RankResponse {
    rank: i32,
    rank_name: String,
    time: i32,
}

#[derive(Serialize, Deserialize)]
struct AllRankResponse {
    ranks: HashMap<String, RankResponse>,
}

#[derive(Serialize, Deserialize)]
struct InsertRequest {
    in_game_name: String,
    r#type: String,
    time: i32,
    game_name: String,
}

#[derive(Serialize, Deserialize)]
struct InsertLevelRequest {
    in_game_name: String,
    old_level: i32,
    new_level: i32,
    time: i32,
}

#[derive(Serialize, Deserialize)]
struct InsertRankRequest {
    in_game_name: String,
    old_rank: i32,
    old_rank_name: String,
    new_rank: i32,
    new_rank_name: String,
    time: i32,
    rank_type: String,
}
