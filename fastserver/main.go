package main

import (
	"database/sql"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/tinaxd/nextpex/types"
	"google.golang.org/protobuf/proto"

	_ "github.com/lib/pq"
)

var (
	db *sqlx.DB
)

type LevelUpdate struct {
	ID       int           `db:"id"`
	UserID   int           `db:"user_id"`
	OldLevel sql.NullInt32 `db:"old_level"`
	NewLevel int           `db:"new_level"`
	TimeAt   time.Time     `db:"timeat"`
}

type RankUpdate struct {
	ID          int            `db:"id"`
	UserID      int            `db:"user_id"`
	OldRank     sql.NullInt32  `db:"old_rank"`
	OldRankName sql.NullString `db:"old_rank_name"`
	NewRank     int            `db:"new_rank"`
	NewRankName string         `db:"new_rank_name"`
	TimeAt      time.Time      `db:"timeat"`
}

type User struct {
	ID          int    `db:"id"`
	Username    string `db:"username"`
	DisplayName string `db:"display_name"`
}

type InGameName struct {
	UserID   int    `db:"user_id"`
	GameName string `db:"game_name"`
}

type PlayingTime struct {
	ID        int            `db:"id"`
	UserID    int            `db:"user_id"`
	GameName  sql.NullString `db:"game_name"`
	StartedAt time.Time      `db:"started_at"`
	EndedAt   time.Time      `db:"ended_at"`
}

type PendingPlay struct {
	UserID    int       `db:"user_id"`
	GameName  string    `db:"game_name"`
	StartedAt time.Time `db:"started_at"`
}

func makeTimePB(t time.Time) *types.Time {
	return &types.Time{
		Hour:   int32(t.Hour()),
		Minute: int32(t.Minute()),
		Second: int32(t.Second()),
		Date:   int32(t.Day()),
		Month:  int32(t.Month()),
		Year:   int32(t.Year()),
	}
}

func getAllLevels(c echo.Context) error {
	var levels []struct {
		Level    int       `db:"level"`
		Time     time.Time `db:"time"`
		Username string    `db:"username"`
	}
	err := db.Select(&levels, "SELECT t.new_level AS level,t.timeat AS time,u.username AS username FROM LevelUpdate t INNER JOIN User u ON t.user_id=u.id ORDER BY t.timeat DESC")
	if err != nil {
		return err
	}

	ress := make([]*types.LevelResponse, len(levels))
	for i, l := range levels {
		ress[i] = &types.LevelResponse{
			Level:    int32(l.Level),
			Time:     makeTimePB(l.Time),
			Username: l.Username,
		}
	}
	response := &types.AllLevelResponse{
		Levels: ress,
	}
	buf, err := proto.Marshal(response)
	if err != nil {
		return err
	}
	return c.JSON(200, buf)
}

func getAllRanks(c echo.Context) error {
	var ranks []struct {
		Rank     int       `db:"rank"`
		Time     time.Time `db:"time"`
		Username string    `db:"username"`
	}
	err := db.Select(&ranks, "SELECT t.new_rank AS rank,t.timeat AS time,u.username AS username FROM RankUpdate t INNER JOIN User u ON t.user_id=u.id ORDER BY t.timeat DESC")
	if err != nil {
		return err
	}

	ress := make([]*types.RankResponse, len(ranks))
	for i, r := range ranks {
		ress[i] = &types.RankResponse{
			Rank:     int32(r.Rank),
			Time:     makeTimePB(r.Time),
			Username: r.Username,
		}
	}
	response := &types.AllRankResponse{
		Ranks: ress,
	}
	buf, err := proto.Marshal(response)
	if err != nil {
		return err
	}
	return c.JSON(200, buf)
}

func main() {
	// Echo instance
	e := echo.New()

	// Initialize DB
	var err error
	db, err = sqlx.Connect("postgres", "user=nextpex password=nextpex dbname=nextpex sslmode=disable")
	if err != nil {
		panic(err)
	}

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Routes
	e.GET("/level/all", getAllLevels)

	// Start server
	e.Logger.Fatal(e.Start(":1323"))
}
