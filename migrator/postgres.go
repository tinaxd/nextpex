package main

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"

	_ "github.com/lib/pq"
)

type User struct {
	Username string `db:"username"`
}

type InGameName struct {
	Username   string `db:"username"`
	InGameName string `db:"ingamename"`
}

type Game struct {
	GameName  string `db:"gamename"`
	IsChecked bool   `db:"is_checked"`
}

type LevelUpdate struct {
	Username string        `db:"username"`
	OldLevel sql.NullInt32 `db:"oldlevel"`
	NewLevel int           `db:"newlevel"`
	TimeAt   int           `db:"timeat"`
}

type RankUpdate struct {
	Username    string         `db:"username"`
	OldRank     sql.NullInt32  `db:"oldrank"`
	NewRank     int            `db:"newrank"`
	OldRankName sql.NullString `db:"oldrankname"`
	NewRankName string         `db:"newrankname"`
	RankType    string         `db:"ranktype"`
	TimeAt      int            `db:"timeat"`
}

type PlayingTime struct {
	Username  string `db:"username" json:"username"`
	GameName  string `db:"gamename" json:"gamename"`
	StartedAt int    `db:"startedat" json:"started_at"`
	EndedAt   int    `db:"endedat" json:"ended_at"`
}

type PlayingNow struct {
	Username  string `db:"username" json:"username"`
	GameName  string `db:"gamename" json:"gamename"`
	StartedAt int    `db:"startedat" json:"started_at"`
}

type MonthlyCheck struct {
	Username string `db:"username" json:"username"`
	GameName string `db:"gamename" json:"gamename"`
	Month    int    `db:"month" json:"month"`
	Year     int    `db:"year" json:"year"`
	Playtime int    `db:"playtime" json:"playtime"` // in seconds
}

type postDocResult struct {
	ID string `json:"id"`
}

func main() {
	// this Pings the database trying to connect
	// use sqlx.Open() for sql.Open() semantics
	db, err := sqlx.Connect("sqlite3", "../data/db.sqlite3")
	if err != nil {
		log.Fatalln(err)
	}

	ps, err := sqlx.Connect("postgres", "host=localhost port=5432 user=nextpex password=nextpex dbname=nextpex sslmode=disable")

	if err != nil {
		panic(err)
	}

	tx := ps.MustBegin()

	defer tx.Rollback()

	var users []User
	err = db.Select(&users, "SELECT username FROM user")
	if err != nil {
		panic(err)
	}

	for _, user := range users {
		fmt.Printf("user: %s\n", user.Username)
		_, err := tx.Exec("INSERT INTO \"user\"(username) VALUES($1)", user.Username)
		if err != nil {
			panic(err)
		}
	}

	var inGameNames []InGameName
	err = db.Select(&inGameNames, "SELECT * FROM ingamename")
	if err != nil {
		panic(err)
	}

	for _, inGameName := range inGameNames {
		fmt.Printf("inGameName: %s -> %s\n", inGameName.InGameName, inGameName.Username)
		_, err := tx.Exec("INSERT INTO ingamename(username, ingamename) VALUES($1, $2)", inGameName.Username, inGameName.InGameName)
		if err != nil {
			panic(err)
		}
	}

	var games []Game
	err = db.Select(&games, "SELECT * FROM game")
	if err != nil {
		panic(err)
	}

	for _, game := range games {
		fmt.Printf("game: %s\n", game.GameName)
		_, err := tx.Exec("INSERT INTO game(gamename,is_checked) VALUES($1,TRUE)", game.GameName)
		if err != nil {
			panic(err)
		}
	}

	var levelUpdates []LevelUpdate
	err = db.Select(&levelUpdates, "SELECT * FROM levelupdate")
	if err != nil {
		panic(err)
	}

	for _, lu := range levelUpdates {
		fmt.Printf("LU %s %d\n", lu.Username, lu.NewLevel)
		// doc := make(map[string]interface{})
		// doc["type"] = "apex_level_update"
		// // doc["game"] = gameMap["Apex Legends"]
		// doc["user"] = userMap[lu.Username]
		// if lu.OldLevel.Valid {
		// 	doc["old_value"] = lu.OldLevel.Int32
		// }
		// doc["new_value"] = lu.NewLevel
		// doc["time"] = convTime(int64(lu.TimeAt))
		// postDoc(doc)
		_, err := tx.Exec("INSERT INTO levelupdate(username, oldlevel, newlevel, timeat) VALUES($1, $2, $3, to_timestamp($4))", lu.Username, lu.OldLevel, lu.NewLevel, lu.TimeAt)
		if err != nil {
			panic(err)
		}
	}

	var rankUpdates []RankUpdate
	err = db.Select(&rankUpdates, "SELECT * FROM rankupdate")
	if err != nil {
		panic(err)
	}

	for _, ru := range rankUpdates {
		fmt.Printf("LU %s %s %d\n", ru.Username, ru.RankType, ru.NewRank)
		// doc := make(map[string]interface{})
		// doc["type"] = "apex_rank_update"
		// doc["user"] = userMap[ru.Username]
		// if ru.OldRank.Valid {
		// 	doc["old_value"] = ru.OldRank.Int32
		// }
		// if ru.OldRankName.Valid {
		// 	doc["old_value_name"] = ru.OldRankName.String
		// }
		// doc["new_value"] = ru.NewRank
		// doc["new_value_name"] = ru.NewRankName
		// doc["rank_type"] = ru.RankType
		// doc["time"] = convTime(int64(ru.TimeAt))
		// postDoc(doc)
		_, err := tx.Exec("INSERT INTO rankupdate(username, oldrank, oldrankname, newrank, newrankname, ranktype, timeat) VALUES($1, $2, $3, $4, $5, $6, to_timestamp($7))", ru.Username, ru.OldRank, ru.OldRankName, ru.NewRank, ru.NewRankName, ru.RankType, ru.TimeAt)
		if err != nil {
			panic(err)
		}
	}

	var playingTime []PlayingTime
	err = db.Select(&playingTime, "SELECT * FROM playingtime")
	if err != nil {
		panic(err)
	}

	for _, pt := range playingTime {
		fmt.Printf("PlayingTime: %s %s %v\n", pt.Username, pt.GameName, pt.StartedAt)
		// doc := make(map[string]interface{})
		// doc["type"] = "play_history"
		// doc["user"] = userMap[pt.Username]
		// doc["game"] = gameMap[pt.GameName]
		// doc["started_at"] = convTime(int64(pt.StartedAt))
		// doc["ended_at"] = convTime(int64(pt.EndedAt))
		// postDoc(doc)
		_, err := tx.Exec("INSERT INTO playingtime(username, gamename, startedat, endedat) VALUES($1, $2, to_timestamp($3), to_timestamp($4))", pt.Username, pt.GameName, pt.StartedAt, pt.EndedAt)
		if err != nil {
			panic(err)
		}
	}

	err = tx.Commit()
	if err != nil {
		panic(err)
	}
}
