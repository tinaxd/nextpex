package main

import (
	"database/sql"
	"fmt"
	"os"
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

const indexLevelUpdate = `create index if not exists levelupdate_time on LevelUpdate(
	time desc
	);`

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

const indexRankUpdate = `create index if not exists rankupdate_time on RankUpdate(
	time desc
	);`

const schemaApexabilityCheck = `create table if not exists ApexabilityCheck(
	id INTEGER AUTO_INCREMENT PRIMARY KEY,
	entry_type VARCHAR(5) NOT NULL,
	time TIMESTAMP NOT NULL,
	player_id INTEGER NOT NULL,
	foreign key apexability_check_player(player_id) references Player(id)
);
`

const indexApexabilityCheck = `create index if not exists apexabilitycheck_time on ApexabilityCheck(
	time desc
	);`

var schemas = []string{
	schemaPlayer,
	schemaInGameName,
	schemaLevelUpdate,
	schemaRankUpdate,
	schemaApexabilityCheck,
	indexLevelUpdate,
	indexRankUpdate,
	indexApexabilityCheck,
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

type ApexabilityCheckFetchResult struct {
	EntryType   string    `db:"entry_type"`
	Time        time.Time `db:"time"`
	DisplayName string    `db:"display_name"`
}

type DB struct {
	db *sqlx.DB
}

type RankType string
type CheckType string

const (
	RankTypeTrio   RankType  = "trio"
	RankTypeArena  RankType  = "arena"
	CheckTypeStart CheckType = "start"
	CheckTypeStop  CheckType = "stop"
)

var (
	DB_USER string
	DB_PASS string
	DB_ADDR string
	DB_NAME string
)

func init() {
	DB_USER = os.Getenv("DB_USER")
	DB_PASS = os.Getenv("DB_PASS")
	DB_ADDR = os.Getenv("DB_ADDR")
	DB_NAME = os.Getenv("DB_NAME")
	notSet := false
	if DB_USER == "" {
		fmt.Println("DB_USER not set")
		notSet = true
	}
	if DB_PASS == "" {
		fmt.Println("DB_PASS not set")
		notSet = true
	}
	if DB_ADDR == "" {
		fmt.Println("DB_ADDR not set")
		notSet = true
	}
	if DB_NAME == "" {
		fmt.Println("DB_NAME not set")
		notSet = true
	}
	if notSet {
		os.Exit(2)
	}
}

func NewDB() (*DB, error) {
	conn := fmt.Sprintf("%v:%v@tcp(%v)/%v?parseTime=true", DB_USER, DB_PASS, DB_ADDR, DB_NAME)
	fmt.Printf("connection: %v\n", conn)
	db, err := sqlx.Open("mysql", conn)
	if err != nil {
		fmt.Println(err)
		fmt.Println("Open: could not connect to db, retry in 5 seconds")
		time.Sleep(5 * time.Second)
		return NewDB()
	}
	if err = db.Ping(); err != nil {
		fmt.Println(err)
		fmt.Println("Ping: could not connect to db, retry in 5 seconds")
		time.Sleep(5 * time.Second)
		return NewDB()
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

func (db *DB) GetChecks(entries *int) ([]ApexabilityCheckFetchResult, error) {
	checks := []ApexabilityCheckFetchResult{}
	var err error
	if entries != nil {
		err = db.db.Select(&checks, "select c.entry_type,c.time,p.display_name from ApexabilityCheck as c inner join Player as p on c.player_id=p.id order by c.time desc limit ?", entries)
	} else {
		err = db.db.Select(&checks, "select c.entry_type,c.time,p.display_name from ApexabilityCheck as c inner join Player as p on c.player_id=p.id order by c.time desc")
	}
	if err != nil {
		return nil, err
	}
	return checks, nil
}

func (db *DB) GetPlayerIDByInGameName(inGameName string) (int, error) {
	var id int
	err := db.db.Get(&id, "select p.id from Player as p inner join InGameName as i on p.id=i.player_id WHERE i.in_game_name=?", inGameName)
	if err != nil {
		return 0, err
	}
	return id, nil
}

func (db *DB) PostLevel(inGameName string, oldLevel int, newLevel int, time time.Time) error {
	playerId, err := db.GetPlayerIDByInGameName(inGameName)
	if err != nil {
		return err
	}

	_, err = db.db.Exec("insert into LevelUpdate(old_level,new_level,time,player_id) VALUES(?,?,?,?)", oldLevel, newLevel, time, playerId)
	return err
}

func (db *DB) PostRank(inGameName string, oldRank int, oldRankName string, newRank int, newRankName string, rankType RankType, time time.Time) error {
	playerId, err := db.GetPlayerIDByInGameName(inGameName)
	if err != nil {
		return err
	}

	_, err = db.db.Exec("insert into RankUpdate(player_id,old_rank,old_name,new_rank,new_name,rank_type,time) VALUES(?,?,?,?,?,?,?)", playerId, oldRank, oldRankName, newRank, newRankName, string(rankType), time)
	return err
}

func (db *DB) PostCheck(inGameName string, checkType CheckType, time time.Time) error {
	playerId, err := db.GetPlayerIDByInGameName(inGameName)
	if err != nil {
		return err
	}
	_, err = db.db.Exec("insert into ApexabilityCheck(entry_type,time,player_id) VALUES (?,?,?)", checkType, time, playerId)
	return err
}
