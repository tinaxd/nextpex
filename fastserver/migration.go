package main

import (
	"fmt"

	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
)

type WebPlayer struct {
	ID      int    `db:"id"`
	Display string `db:"display_name"`
}

type WebGame struct {
	ID   int    `db:"id"`
	Name string `db:"name"`
}

type WebInGameName struct {
	ID         int    `db:"id"`
	InGameName string `db:"in_game_name"`
	PlayerID   int    `db:"player_id"`
}

type WebLevelUpdate struct {
	ID       int `db:"id"`
	OldLevel int `db:"old_level"`
	NewLevel int `db:"new_level"`
	PlayerID int `db:"player_id"`
	Time     int `db:"time"`
}

type WebRankUpdate struct {
	ID          int    `db:"id"`
	OldRank     int    `db:"old_rank"`
	NewRank     int    `db:"new_rank"`
	OldRankName string `db:"old_rank_name"`
	NewRankName string `db:"new_rank_name"`
	PlayerID    int    `db:"player_id"`
	Time        int    `db:"time"`
}

type WebApexabilityCheck struct {
	ID           int    `db:"id"`
	EntryType    string `db:"entry_type"`
	Time         int    `db:"time"`
	PlayerID     int    `db:"player_id"`
	PlayedGameID int    `db:"played_game_id"`
}

func main() {
	db := sqlx.MustOpen("sqlite3", "./db_old.sqlite3")

	// Get all players
	var players []WebPlayer
	db.Select(&players, "SELECT * FROM web_player")

	// Get all games
	var games []WebGame
	db.Select(&games, "SELECT * FROM web_game")

	// Get all in-game names
	var inGameNames []WebInGameName
	db.Select(&inGameNames, "SELECT * FROM in_game_name")

	// show all players
	playerMap := make(map[int]string)
	for _, player := range players {
		fmt.Println(player)
		playerMap[player.ID] = player.Display
	}

	// show all games
	gameMap := make(map[int]string)
	for _, game := range games {
		fmt.Println(game)
		gameMap[game.ID] = game.Name
	}

	// all levels
	var levels []WebLevelUpdate
	db.Select(&levels, "select id,old_level,new_level,player_id,strftime('%s', time) as time from web_levelupdate;")
	for _, level := range levels {
		fmt.Println(level)
	}

	// all ranks
	var ranks []WebRankUpdate
	db.Select(&ranks, "select id,old_rank,new_rank,old_rank_name,new_rank_name,player_id,strftime('%s', time) as time from web_rankupdate order by time asc;")
	for _, rank := range ranks {
		fmt.Println(rank)
	}

	// all apexability checks
	var apexabilityChecks []WebApexabilityCheck
	db.Select(&apexabilityChecks, "select id,entry_type,strftime('%s', time) as time,player_id,played_game_id from web_apexabilitycheck;")
	for _, apexabilityCheck := range apexabilityChecks {
		fmt.Println(apexabilityCheck)
	}

	dbOut := sqlx.MustOpen("sqlite3", "./db.sqlite3")

	// begin transaction
	tx, err := dbOut.Beginx()
	defer tx.Rollback()
	if err != nil {
		panic(err)
	}

	// add players
	for _, player := range players {
		_, err = tx.Exec("insert into user (username) values (?)", player.Display)
		if err != nil {
			panic(err)
		}
	}

	// add ingamename
	for _, inGameName := range inGameNames {
		username := playerMap[inGameName.PlayerID]
		_, err = tx.Exec("insert into ingamename (username,ingamename) values (?, ?)", username, inGameName.InGameName)
		if err != nil {
			panic(err)
		}
	}

	// add games
	for _, game := range games {
		_, err = tx.Exec("insert into game (gamename) values (?)", game.Name)
		if err != nil {
			panic(err)
		}
	}

	// add levels
	for _, level := range levels {
		username := playerMap[level.PlayerID]
		_, err = tx.Exec("insert into levelupdate (username,oldlevel,newlevel,timeat) values (?,?, ?, ?)", username, level.OldLevel, level.NewLevel, level.Time)
		if err != nil {
			panic(err)
		}
	}

	// add ranks
	for _, rank := range ranks {
		username := playerMap[rank.PlayerID]
		_, err = tx.Exec("insert into rankupdate (username,oldrank,newrank,oldrankname,newrankname,timeat) values (?, ?, ?, ?, ?, ?)", username, rank.OldRank, rank.NewRank, rank.OldRankName, rank.NewRankName, rank.Time)
		if err != nil {
			panic(err)
		}
	}

	// add apexability checks
	type playingInfo struct {
		Username  string
		GameName  string
		StartedAt int
	}
	playingMap := make(map[string]playingInfo)
	histories := make([]PlayingTime, 0)
	for _, apexabilityCheck := range apexabilityChecks {
		username := playerMap[apexabilityCheck.PlayerID]
		gameName := gameMap[apexabilityCheck.PlayedGameID]
		if apexabilityCheck.EntryType == "start" {
			playingMap[username] = playingInfo{
				Username:  username,
				GameName:  gameName,
				StartedAt: apexabilityCheck.Time,
			}
		} else if apexabilityCheck.EntryType == "stop" {
			playingInfo, ok := playingMap[username]
			if !ok {
				continue
			}
			histories = append(histories, PlayingTime{
				Username:  username,
				GameName:  gameName,
				StartedAt: playingInfo.StartedAt,
				EndedAt:   apexabilityCheck.Time,
			})
			delete(playingMap, username)
		}
	}

	for _, history := range histories {
		_, err = tx.Exec("insert into playingtime (username,gamename,startedat,endedat) values (?, ?, ?, ?)", history.Username, history.GameName, history.StartedAt, history.EndedAt)
		if err != nil {
			panic(err)
		}
	}

	if err := tx.Commit(); err != nil {
		panic(err)
	}

	fmt.Println("committed")
}
