package main

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
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

func convTime(unixtime int64) primitive.Timestamp {
	return primitive.Timestamp{T: uint32(unixtime)}
}

func main() {
	// this Pings the database trying to connect
	// use sqlx.Open() for sql.Open() semantics
	db, err := sqlx.Connect("sqlite3", "../../data/db.sqlite3")
	if err != nil {
		log.Fatalln(err)
	}

	mg, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		panic(err)
	}

	defer func() {
		if err := mg.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()

	nextpex := mg.Database("nextpex")

	var users []User
	err = db.Select(&users, "SELECT username FROM user")
	if err != nil {
		panic(err)
	}

	userMap := make(map[string]primitive.ObjectID)
	userCol := nextpex.Collection("users")
	for _, user := range users {
		fmt.Printf("user: %s\n", user.Username)
		i, err := userCol.InsertOne(context.TODO(), bson.D{
			{Key: "username", Value: user.Username},
		})
		if err != nil {
			panic(err)
		}
		userMap[user.Username] = i.InsertedID.(primitive.ObjectID)
	}

	var inGameNames []InGameName
	err = db.Select(&inGameNames, "SELECT * FROM ingamename")
	if err != nil {
		panic(err)
	}

	inGameNameCol := nextpex.Collection("in_game_names")
	for _, inGameName := range inGameNames {
		fmt.Printf("inGameName: %s -> %s\n", inGameName.InGameName, inGameName.Username)
		inGameNameCol.InsertOne(context.TODO(), bson.D{
			{Key: "user", Value: userMap[inGameName.Username]},
			{Key: "in_game_name", Value: inGameName.InGameName},
		})
	}

	var games []Game
	err = db.Select(&games, "SELECT * FROM game")
	if err != nil {
		panic(err)
	}

	gameMap := make(map[string]primitive.ObjectID)
	gameCol := nextpex.Collection("games")
	for _, game := range games {
		fmt.Printf("game: %s\n", game.GameName)
		i, err := gameCol.InsertOne(context.TODO(), bson.D{
			{"name", game.GameName},
			{"checked", true},
		})
		if err != nil {
			panic(err)
		}
		gameMap[game.GameName] = i.InsertedID.(primitive.ObjectID)
	}

	var levelUpdates []LevelUpdate
	err = db.Select(&levelUpdates, "SELECT * FROM levelupdate")
	if err != nil {
		panic(err)
	}

	luDocs := make([]interface{}, 0)
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
		luDocs = append(luDocs, bson.D{
			{"user", userMap[lu.Username]},
			{"old_level", lu.OldLevel.Int32},
			{"new_level", lu.NewLevel},
			{"time", convTime(int64(lu.TimeAt))},
		})
	}
	nextpex.Collection("level_updates").InsertMany(context.TODO(), luDocs)

	var rankUpdates []RankUpdate
	err = db.Select(&rankUpdates, "SELECT * FROM rankupdate")
	if err != nil {
		panic(err)
	}

	ruDocs := make([]interface{}, 0)
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
		ruDocs = append(ruDocs, bson.D{
			{"user", userMap[ru.Username]},
			{"old_rank", ru.OldRank},
			{"old_rank_name", ru.OldRankName},
			{"new_rank", ru.NewRank},
			{"new_rank_name", ru.NewRankName},
			{"time", convTime(int64(ru.TimeAt))},
			{"rank_type", ru.RankType},
		})
	}
	nextpex.Collection("rank_updates").InsertMany(context.TODO(), ruDocs)

	var playingTime []PlayingTime
	err = db.Select(&playingTime, "SELECT * FROM playingtime")
	if err != nil {
		panic(err)
	}

	playDocs := make([]interface{}, 0)
	for _, pt := range playingTime {
		fmt.Printf("PlayingTime: %s %s %v\n", pt.Username, pt.GameName, pt.StartedAt)
		// doc := make(map[string]interface{})
		// doc["type"] = "play_history"
		// doc["user"] = userMap[pt.Username]
		// doc["game"] = gameMap[pt.GameName]
		// doc["started_at"] = convTime(int64(pt.StartedAt))
		// doc["ended_at"] = convTime(int64(pt.EndedAt))
		// postDoc(doc)
		playDocs = append(playDocs, bson.D{
			{"user", userMap[pt.Username]},
			{"game", gameMap[pt.GameName]},
			{"started_at", convTime(int64(pt.StartedAt))},
			{"ended_at", convTime(int64(pt.EndedAt))},
		})
	}
	nextpex.Collection("play_history").InsertMany(context.TODO(), playDocs)
}
