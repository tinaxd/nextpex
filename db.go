package main

import (
	"database/sql"
	"time"

	"github.com/jmoiron/sqlx"

	_ "github.com/go-sql-driver/mysql"
)

const schemaPlayer = `
create table if not exists Player(
	id INTEGER AUTO_INCREMENT PRIMARY KEY,
	display_name VARCHAR(64) UNIQUE NOT NULL
);
`

const schemaInGameName = `create table if not exists InGameName(
	id INTEGER AUTO_INCREMENT PRIMARY KEY,
	in_game_name VARCHAR(64) NOT NULL UNIQUE,
	player_id INTEGER NOT NULL,
	foreign key in_game_name_player(player_id) references Player(id)
);
`

const schemaLevelUpdate = `create table if not exists LevelUpdate(
	id INTEGER AUTO_INCREMENT PRIMARY KEY,
	old_level INTEGER,
	new_level INTEGER NOT NULL,
	time TIMESTAMP NOT NULL,
	player_id INTEGER NOT NULL,
	foreign key level_update_player(player_id) references Player(id)
);
`

const schemaRankUpdate = `create table if not exists RankUpdate(
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
`

const schemaApexabilityCheck = `create table if not exists ApexabilityCheck(
	id INTEGER AUTO_INCREMENT PRIMARY KEY,
	entry_type VARCHAR(5) NOT NULL,
	time TIMESTAMP NOT NULL,
	player_id INTEGER NOT NULL,
	foreign key apexability_check_player(player_id) references Player(id)
);
`

var schemas = []string{
	schemaPlayer,
	schemaInGameName,
	schemaLevelUpdate,
	schemaRankUpdate,
	schemaApexabilityCheck,
}

type Player struct {
	ID          int    `db:"id"`
	DisplayName string `db:"display_name"`
}

type InGameName struct {
	ID         int    `db:"int"`
	InGameName string `db:"in_game_name"`
	PlayerID   int    `db:"player_id"`
}

type LevelUpdate struct {
	ID       int           `db:"id"`
	OldLevel sql.NullInt32 `db:"old_level"`
	NewLevel int           `db:"new_level"`
	Time     time.Time     `db:"time"`
	PlayerID int           `db:"player_id"`
}

type RankUpdate struct {
	ID       int            `db:"id"`
	OldRank  sql.NullInt32  `db:"old_rank"`
	NewRank  int            `db:"new_rank"`
	RankType string         `db:"rank_type"`
	Time     time.Time      `db:"time"`
	PlayerID int            `db:"player_id"`
	OldName  sql.NullString `db:"old_name"`
	NewName  string         `db:"new_name"`
}

type ApexabilityCheck struct {
	ID        int       `db:"int"`
	EntryType string    `db:"entry_type"`
	Time      time.Time `db:"time"`
	PlayerID  int       `db:"player_id"`
}

type LevelUpdateFetchResult struct {
	NewLevel    int       `db:"new_level"`
	Time        time.Time `db:"time"`
	DisplayName string    `db:"display_name"`
}

type RankUpdateFetchResult struct {
	NewRank     int       `db:"new_rank"`
	RankType    string    `db:"rank_type"`
	NewName     string    `db:"new_name"`
	Time        time.Time `db:"time"`
	DisplayName string    `db:"display_name"`
}

type DB struct {
	db *sqlx.DB
}

type RankType string

const (
	RankTypeTrio  RankType = "trio"
	RankTypeArena RankType = "arena"
)

func NewDB() (*DB, error) {
	db, err := sqlx.Connect("mysql", "nextpex:nextpex@/nextpex?parseTime=true")
	if err != nil {
		return nil, err
	}
	return &DB{db: db}, nil
}

func (db *DB) Init() {
	for _, schema := range schemas {
		db.db.MustExec(schema)
	}
}

func (db *DB) GetAllLevels() ([]LevelUpdateFetchResult, error) {
	updates := []LevelUpdateFetchResult{}
	err := db.db.Select(&updates, "SELECT l.new_level,l.time,p.display_name FROM LevelUpdate as l INNER JOIN Player as p ON l.player_id=p.id ORDER BY time DESC")
	if err != nil {
		return nil, err
	}
	return updates, nil
}

func (db *DB) GetAllRanks(rankType RankType) ([]RankUpdateFetchResult, error) {
	updates := []RankUpdateFetchResult{}
	err := db.db.Select(&updates, "SELECT r.new_rank,r.new_name,r.time,p.display_name,r.rank_type FROM RankUpdate as r INNER JOIN Player as p ON r.player_id=p.id WHERE r.rank_type=? ORDER BY r.time DESC", rankType)
	if err != nil {
		return nil, err
	}
	return updates, nil
}
