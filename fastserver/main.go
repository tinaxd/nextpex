package main

import (
	"database/sql"
	"net/http"
	"strconv"
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

func sendProto(c echo.Context, msg proto.Message) error {
	buf, err := proto.Marshal(msg)
	if err != nil {
		return err
	}
	return c.Blob(http.StatusOK, "application/octet-stream", buf)
}

func getAllLevels(c echo.Context) error {
	var levels []struct {
		Level    int       `db:"level"`
		Time     time.Time `db:"time"`
		Username string    `db:"username"`
	}
	err := db.Select(&levels, `SELECT t.new_level AS level,t.timeat AS time,u.username AS username FROM LevelUpdate t INNER JOIN User u ON t.user_id=u.id ORDER BY t.timeat DESC`)
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
	return sendProto(c, response)
}

func getAllRanks(c echo.Context) error {
	var ranks []struct {
		Rank     int       `db:"rank"`
		Time     time.Time `db:"time"`
		Username string    `db:"username"`
	}
	err := db.Select(&ranks, `SELECT t.new_rank AS rank,t.timeat AS time,u.username AS username FROM RankUpdate t INNER JOIN User u ON t.user_id=u.id ORDER BY t.timeat DESC`)
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
	return sendProto(c, response)
}

func getNowPlaying(c echo.Context) error {
	var nowPlaying []struct {
		PendingPlay
		Username string `db:"username"`
	}
	err := db.Select(&nowPlaying, `SELECT p.user_id,p.game_name,p.started_at,u.id FROM PendingPlay p INNER JOIN User u ON p.user_id=u.id`)
	if err != nil {
		return err
	}

	ress := make([]*types.NowPlayingResponse, len(nowPlaying))
	for i, np := range nowPlaying {
		ress[i] = &types.NowPlayingResponse{
			Game:      np.GameName,
			StartedAt: makeTimePB(np.StartedAt),
			Username:  np.Username,
		}
	}
	response := &types.AllNowPlayingResponse{
		NowPlayings: ress,
	}
	return sendProto(c, response)
}

func getLatestGameSessions(c echo.Context) error {
	type DBType struct {
		PlayingTime
		Username string `db:"username"`
	}
	var sessions []DBType

	// limit
	limit := 20
	if l := c.QueryParam("limit"); l != "" {
		var err error
		limit, err = strconv.Atoi(l)
		if err != nil {
			return c.String(http.StatusBadRequest, "limit must be integer")
		}
	}

	err := db.Select(&sessions, "SELECT pt.game_name,pt.started_at,pt.ended_at,u.username FROM PlayingTime pt INNER JOIN User u WHERE pt.user_id=u.id ORDER BY pt.ended_at DESC LIMIT ?", limit)
	if err != nil {
		return err
	}

	ress := make([]*types.GameSession, len(sessions))
	for i, s := range sessions {
		ress[i] = &types.GameSession{
			Game:      s.GameName.String,
			StartedAt: makeTimePB(s.StartedAt),
			EndedAt:   makeTimePB(s.EndedAt),
			Username:  s.Username,
		}
	}

	response := &types.LatestGameSessionResponse{
		GameSessions: ress,
	}
	return sendProto(c, response)
}

func getMonthlyPlayingTime(c echo.Context) error {

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
	e.GET("/rank/all", getAllRanks)
	e.GET("/check/now", getNowPlaying)

	// Start server
	e.Logger.Fatal(e.Start(":1323"))
}
