package main

import (
	"errors"
	"time"
)

func getUsernameFromInGameName(inGameName string) (string, bool) {
	var username string
	err := db.Get(&username, `select username from ingamename where ingamename=$1`, inGameName)
	if err != nil {
		return "", false
	}

	return username, true
}

func insertCheck(inGameName string, gameName string, isStart bool) error {
	// get username associated with in-game name
	username, ok := getUsernameFromInGameName(inGameName)
	if !ok {
		return nil
	}

	tx, err := db.Beginx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	if isStart {
		// if already exists, update startedat
		var result []struct {
			ID int `db:"id"`
		}
		err = tx.Select(&result, "select id from playingtime where username=$1 and endedat is null FOR UPDATE", username)
		if err != nil {
			return err
		}

		if len(result) == 0 {
			// entry does not exist, insert
			_, err := tx.Exec("INSERT INTO playingtime(username,gamename,startedat,endedat) VALUES($1,$2,$3,NULL)", username, gameName, time.Now())
			if err != nil {
				return err
			}
			if err := tx.Commit(); err != nil {
				return err
			}
		} else {
			// if an entry already exists, update the startedat field
			_, err := tx.Exec("UPDATE playingtime SET gamename=$2, startedat=$3 WHERE id=$1", result[0].ID, gameName, time.Now())
			if err != nil {
				return err
			}
			if err := tx.Commit(); err != nil {
				return err
			}
		}
	} else {
		tx, err := db.Beginx()
		if err != nil {
			return err
		}
		defer tx.Rollback()

		// retrieve start info from playingnow table
		type PlayingTimeWithID struct {
			ID       int    `db:"id"`
			GameName string `db:"gamename"`
		}
		var startInfo PlayingTimeWithID
		if err := tx.Get(&startInfo, `select id,gamename from playingtime where username=$1 AND endedat IS NULL FOR UPDATE`, username); err != nil {
			return err
		}

		// if game names do not match, reject the request
		if startInfo.GameName != gameName {
			return errors.New("game names do not match")
		}

		// insert into playingtime table
		_, err = tx.Exec("UPDATE playingtime SET endedat=$2 WHERE id=$1", startInfo.ID, time.Now())
		if err != nil {
			return err
		}

		if err := tx.Commit(); err != nil {
			return err
		}
	}

	return nil
}
