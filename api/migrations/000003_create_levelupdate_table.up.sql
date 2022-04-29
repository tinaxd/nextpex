create table if not exists LevelUpdate(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    old_level INTEGER,
    new_level INTEGER NOT NULL,
    time TIMESTAMP NOT NULL,
    player_id INTEGER NOT NULL,
    foreign key level_update_player(player_id) references Player(id)
);