create table if not exists RankUpdate(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    old_rank INTEGER,
    new_rank INTEGER NOT NULL,
    rank_type VARCHAR(10) NOT NULL,
    time TIMESTAMP NOT NULL,
    player_id INTEGER NOT NULL,
    old_name VARCHAR(20),
    new_name VARCHAR(20) NOT NULL,
    foreign key rank_update_player(player_id) references Player(id)
);