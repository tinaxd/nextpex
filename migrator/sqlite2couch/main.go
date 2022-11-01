package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
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

func postDoc(doc interface{}) string {
	url := "http://admin:admin@localhost:5984/nextpex"

	bs, err := json.Marshal(doc)
	if err != nil {
		panic(err)
	}
	req, _ := http.NewRequest("POST", url, bytes.NewReader(bs))

	req.Header.Add("Content-Type", "application/json")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		panic(err)
	}

	var result postDocResult
	if err := json.Unmarshal(body, &result); err != nil {
		panic(err)
	}

	return result.ID

	// fmt.Println(res)
	// fmt.Println(string(body))
}

func convTime(unixtime int64) []int {
	t := time.Unix(unixtime, 0)
	return []int{
		t.Year(), int(t.Month()), t.Day(), t.Hour(), t.Minute(), t.Second(),
	}
}

func main() {
	// this Pings the database trying to connect
	// use sqlx.Open() for sql.Open() semantics
	db, err := sqlx.Connect("sqlite3", "../../data/db.sqlite3")
	if err != nil {
		log.Fatalln(err)
	}

	var users []User
	err = db.Select(&users, "SELECT username FROM user")
	if err != nil {
		panic(err)
	}

	userMap := make(map[string]string)
	for _, user := range users {
		fmt.Printf("user: %s\n", user.Username)
		doc := make(map[string]string)
		doc["type"] = "user"
		doc["username"] = user.Username
		id := postDoc(doc)
		userMap[user.Username] = id
	}

	var inGameNames []InGameName
	err = db.Select(&inGameNames, "SELECT * FROM ingamename")
	if err != nil {
		panic(err)
	}

	for _, inGameName := range inGameNames {
		fmt.Printf("inGameName: %s -> %s\n", inGameName.InGameName, inGameName.Username)
		doc := make(map[string]string)
		doc["type"] = "in_game_name"
		doc["user_id"] = userMap[inGameName.Username]
		doc["in_game_name"] = inGameName.InGameName
		postDoc(doc)
	}

	var games []Game
	err = db.Select(&games, "SELECT * FROM game")
	if err != nil {
		panic(err)
	}

	gameMap := make(map[string]string)
	for _, game := range games {
		fmt.Printf("game: %s\n", game.GameName)
		doc := make(map[string]interface{})
		doc["type"] = "game"
		doc["name"] = game.GameName
		doc["checked"] = true
		id := postDoc(doc)
		gameMap[game.GameName] = id
	}

	var levelUpdates []LevelUpdate
	err = db.Select(&levelUpdates, "SELECT * FROM levelupdate")
	if err != nil {
		panic(err)
	}

	for _, lu := range levelUpdates {
		fmt.Printf("LU %s %d\n", lu.Username, lu.NewLevel)
		doc := make(map[string]interface{})
		doc["type"] = "apex_level_update"
		// doc["game"] = gameMap["Apex Legends"]
		doc["user"] = userMap[lu.Username]
		if lu.OldLevel.Valid {
			doc["old_value"] = lu.OldLevel.Int32
		}
		doc["new_value"] = lu.NewLevel
		doc["time"] = convTime(int64(lu.TimeAt))
		postDoc(doc)
	}

	var rankUpdates []RankUpdate
	err = db.Select(&rankUpdates, "SELECT * FROM rankupdate")
	if err != nil {
		panic(err)
	}

	for _, ru := range rankUpdates {
		fmt.Printf("LU %s %s %d\n", ru.Username, ru.RankType, ru.NewRank)
		doc := make(map[string]interface{})
		doc["type"] = "apex_rank_update"
		doc["user"] = userMap[ru.Username]
		if ru.OldRank.Valid {
			doc["old_value"] = ru.OldRank.Int32
		}
		if ru.OldRankName.Valid {
			doc["old_value_name"] = ru.OldRankName.String
		}
		doc["new_value"] = ru.NewRank
		doc["new_value_name"] = ru.NewRankName
		doc["rank_type"] = ru.RankType
		doc["time"] = convTime(int64(ru.TimeAt))
		postDoc(doc)
	}

	var playingTime []PlayingTime
	err = db.Select(&playingTime, "SELECT * FROM playingtime")
	if err != nil {
		panic(err)
	}

	for _, pt := range playingTime {
		fmt.Printf("PlayingTime: %s %s %v\n", pt.Username, pt.GameName, pt.StartedAt)
		doc := make(map[string]interface{})
		doc["type"] = "play_history"
		doc["user"] = userMap[pt.Username]
		doc["game"] = gameMap[pt.GameName]
		doc["started_at"] = convTime(int64(pt.StartedAt))
		doc["ended_at"] = convTime(int64(pt.EndedAt))
		postDoc(doc)
	}
}
