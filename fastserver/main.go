package main

import (
	"net/http"
	"strconv"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	_ "github.com/mattn/go-sqlite3"
)

var (
	db *sqlx.DB
)

type LevelResponse struct {
	Level  int `json:"level"`
	TimeAt int `json:"time"`
}

type AllLevelResponse struct {
	Levels map[string][]LevelResponse `json:"levels"`
}

func getAllLevels(c echo.Context) error {
	var levels []struct {
		Level    int    `db:"newlevel"`
		Time     int    `db:"timeat"`
		Username string `db:"username"`
	}
	err := db.Select(&levels, `select username,newlevel,timeat from levelupdate order by timeat desc`)
	if err != nil {
		return err
	}

	levelMap := make(map[string][]LevelResponse)
	for _, l := range levels {
		levelMap[l.Username] = append(levelMap[l.Username], LevelResponse{
			Level:  l.Level,
			TimeAt: int(l.Time),
		})
	}

	return c.JSON(http.StatusOK, levelMap)
}

type RankResponse struct {
	Rank     int    `json:"rank"`
	RankName string `json:"rank_name"`
	TimeAt   int    `json:"time"`
}

type AllRankResponse struct {
	Ranks map[string][]RankResponse `json:"ranks"`
}

func getAllRanks(c echo.Context) error {
	var ranks []struct {
		Rank     int    `db:"newrank"`
		RankName string `db:"newrankname"`
		Time     int    `db:"timeat"`
		Username string `db:"username"`
	}
	err := db.Select(&ranks, `select username,newrank,newrankname,timeat from rankupdate order by timeat desc`)
	if err != nil {
		return err
	}

	rankMap := make(map[string][]RankResponse)
	for _, r := range ranks {
		rankMap[r.Username] = append(rankMap[r.Username], RankResponse{
			Rank:     r.Rank,
			RankName: r.RankName,
			TimeAt:   r.Time,
		})
	}

	return c.JSON(http.StatusOK, rankMap)
}

func getNowPlaying(c echo.Context) error {
	var nowPlaying []PlayingNow
	err := db.Select(&nowPlaying, `select username,gamename,startedat from playingnow`)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, nowPlaying)
}

func getLatestGameSessions(c echo.Context) error {
	var sessions []PlayingTime

	// limit
	limit := 20
	if l := c.QueryParam("limit"); l != "" {
		var err error
		limit, err = strconv.Atoi(l)
		if err != nil {
			return c.String(http.StatusBadRequest, "limit must be integer")
		}
	}

	err := db.Select(&sessions, "select username,gamename,startedat,endedat from playingtime order by endedat limit ?", limit)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, sessions)
}

func getMonthlyPlayingTime(c echo.Context) error {
	var monthlyChecks []MonthlyCheck
	err := db.Select(&monthlyChecks, `select * from monthlycheck`)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, monthlyChecks)
}

func main() {
	// Echo instance
	e := echo.New()

	// Initialize DB
	var err error
	db, err = sqlx.Connect("sqlite3", "./db.sqlite3")
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
	e.GET("/check/history", getLatestGameSessions)
	e.GET("/check/monthly", getMonthlyPlayingTime)

	// Start server
	e.Logger.Fatal(e.Start(":1323"))
}
