create table if not exists ApexabilityCheck(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    entry_type VARCHAR(5) NOT NULL,
    time TIMESTAMP NOT NULL,
    player_id INTEGER NOT NULL,
    foreign key apexability_check_player(player_id) references Player(id)
);