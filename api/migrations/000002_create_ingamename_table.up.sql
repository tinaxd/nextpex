create table if not exists InGameName(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    in_game_name VARCHAR(64) NOT NULL UNIQUE,
    player_id INTEGER NOT NULL,
    foreign key in_game_name_player(player_id) references Player(id)
);