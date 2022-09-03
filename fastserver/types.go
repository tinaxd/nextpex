package main

import "database/sql"

type User struct {
	Username string `db:"username"`
}

type InGameName struct {
	Username   string `db:"username"`
	InGameName string `db:"ingamename"`
}

type Game struct {
	GameName string `db:"gamename"`
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
	TimeAt      int            `db:"timeat"`
}

type PlayingTime struct {
	Username  string `db:"username"`
	GameName  string `db:"gamename"`
	StartedAt int    `db:"startedat"`
	EndedAt   int    `db:"endedat"`
}

type PlayingNow struct {
	Username  string `db:"username"`
	GameName  string `db:"gamename"`
	StartedAt int    `db:"startedat"`
}
