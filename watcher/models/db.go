package models

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"log"
	"time"
)

type UserData struct {
	Uid        string `db:"uid"`
	Platform   string `db:"platform"`
	Stats      UserDataDetail
	LastUpdate int `db:"last_update"`
}

type UserDataDetail struct {
	Level     int `db:"level"`
	TrioRank  int `db:"trio_rank"`
	ArenaRank int `db:"arena_rank"`
}

func Connect(e *Environments) *sql.DB {
	// Create db client
	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", e.MARIADB_USER, e.MARIADB_PASSWORD, e.MARIADB_HOST, e.MARIADB_PORT, e.MARIADB_DATABASE))
	if err != nil {
		log.Fatalf("db connect error: %v", err)
	}
	return db
}

func GetPlayerData(db *sql.DB, userID string) []UserData {
	var userData []UserData
	var rows *sql.Rows
	var err error
	if userID == "" {
		rows, err = db.Query(`SELECT uid, platform, level, trio_rank, arena_rank, last_update FROM user_data`)
	} else {
		rows, err = db.Query(`SELECT uid, platform, level, trio_rank, arena_rank, last_update FROM user_data WHERE uid =?`, userID)
	}

	if err != nil {
		panic(err)
	}

	defer rows.Close()
	for rows.Next() {
		var u UserData
		err := rows.Scan(&u.Uid, &u.Platform, &u.Stats.Level, &u.Stats.TrioRank, &u.Stats.ArenaRank, &u.LastUpdate)
		if err != nil {
			fmt.Println(err)
		}
		userData = append(userData, u)

	}

	return userData
}

func UpsertPlayerData(db *sql.DB, u UserData) {
	query := `REPLACE INTO user_data values (?, ?, ?, ?, ?, ?)`
	_, err := db.Exec(query, u.Uid, u.Platform, u.Stats.Level, u.Stats.TrioRank, u.Stats.ArenaRank, u.LastUpdate)
	if err != nil {
		log.Fatal(err)
		return
	}
}

func RegisterPlayer(db *sql.DB, userID, platform string) bool {
	query := `INSERT INTO user_data (uid, platform) values (?, ?)`
	_, err := db.Exec(query, userID, platform)
	if err != nil {
		fmt.Println(err)
		return false
	}
	return true
}

func DeletePlayer(db *sql.DB, userID string) bool {
	query := `DELETE FROM user_data where uid=?`
	_, err := db.Exec(query, userID)
	if err != nil {
		fmt.Println(err)
		return false
	}
	return true
}

func UpdatePlayerID(db *sql.DB, oldUserID, newUserID string) bool {
	query := `UPDATE user_data set uid=? WHERE uid=?`
	_, err := db.Exec(query, newUserID, oldUserID)
	if err != nil {
		fmt.Println(err)
		return false
	}
	return true
}

func UpdatePlayerLevel(db *sql.DB, userID string, level int) bool {
	query := `UPDATE user_data set level=? WHERE uid=?`
	_, err := db.Exec(query, level, userID)
	if err != nil {
		fmt.Println(err)
		return false
	}
	return true
}

func UpdatePlayerTrioRank(db *sql.DB, userID string, trioRank int) bool {
	query := `UPDATE user_data set trio_rank=? WHERE uid=?`
	_, err := db.Exec(query, trioRank, userID)
	if err != nil {
		fmt.Println(err)
		return false
	}
	return true
}

func UpdatePlayerArenaRank(db *sql.DB, userID string, arenaRank int) bool {
	query := `UPDATE user_data set arena_rank=? WHERE uid=?`
	_, err := db.Exec(query, arenaRank, userID)
	if err != nil {
		fmt.Println(err)
		return false
	}
	return true
}

func UpdatePlayerData(db *sql.DB, userID string, ud UserDataDetail) {
	timestamp := time.Now().Unix()
	query := `UPDATE user_data set level=?,trio_rank=?,arena_rank=?,last_update=? WHERE uid=?`
	_, err := db.Exec(query, ud.Level, ud.TrioRank, ud.ArenaRank, timestamp, userID)
	if err != nil {
		log.Fatal(err)
		return
	}
}
