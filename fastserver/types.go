package main

import (
	"database/sql"
	"time"
)

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
	TimeAt   time.Time     `db:"timeat"`
}

type RankUpdate struct {
	Username    string         `db:"username"`
	OldRank     sql.NullInt32  `db:"oldrank"`
	NewRank     int            `db:"newrank"`
	OldRankName sql.NullString `db:"oldrankname"`
	NewRankName string         `db:"newrankname"`
	RankType    string         `db:"ranktype"`
	TimeAt      time.Time      `db:"timeat"`
}

type PlayingTimeWithoutEndedAt struct {
	Username  string `db:"username" json:"username"`
	GameName  string `db:"gamename" json:"gamename"`
	StartedAt int64  `db:"startedat" json:"started_at"`
}

type PlayingTimeWithEndedAt struct {
	Username  string `db:"username" json:"username"`
	GameName  string `db:"gamename" json:"gamename"`
	StartedAt int64  `db:"startedat" json:"started_at"`
	EndedAt   int64  `db:"endedat" json:"ended_at"`
}

type MonthlyCheck struct {
	Username string  `db:"username" json:"username"`
	GameName string  `db:"gamename" json:"gamename"`
	Month    int     `db:"month" json:"month"`
	Year     int     `db:"year" json:"year"`
	Playtime float64 `db:"playtime" json:"playtime"` // in seconds
}
