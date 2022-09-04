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
	rankType := c.Param("ranktype")

	if rankType != "trio" && rankType != "arena" {
		return c.String(http.StatusBadRequest, "ranktype must be 'trio' or 'arena'")
	}

	var ranks []struct {
		Rank     int    `db:"newrank"`
		RankName string `db:"newrankname"`
		Time     int    `db:"timeat"`
		Username string `db:"username"`
	}
	err := db.Select(&ranks, `select username,newrank,newrankname,timeat from rankupdate where ranktype=? order by timeat desc`, rankType)
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
	err := db.Select(&nowPlaying, `select username,gamename,startedat from playingnow order by startedat desc`)
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

	err := db.Select(&sessions, "select username,gamename,startedat,endedat from playingtime order by endedat desc limit ?", limit)
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

func getUsernameFromInGameName(inGameName string) (string, bool) {
	var username string
	err := db.Get(&username, `select username from ingamename where ingamename=?`, inGameName)
	if err != nil {
		return "", false
	}

	return username, true
}

type insertRequest struct {
	InGameName string `json:"in_game_name"`
	Type       string `json:"type"`
	Time       int    `json:"time"`
	GameName   string `json:"game_name"`
}

func insertCheck(c echo.Context) error {
	var req insertRequest
	if err := c.Bind(&req); err != nil {
		return err
	}

	// get username associated with in-game name
	username, ok := getUsernameFromInGameName(req.InGameName)
	if !ok {
		return c.String(http.StatusNotFound, "in-game name not found")
	}

	if req.Type == "start" {
		// insert into playingnow table
		// if an entry already exists, update the startedat field
		_, err := db.Exec(`insert into playingnow (username,gamename,startedat) values (?,?,?) ON CONFLICT(username) DO UPDATE SET gamename=?, startedat=?`, username, req.GameName, req.Time, req.GameName, req.Time)
		if err != nil {
			return err
		}

		return c.NoContent(http.StatusOK)
	} else if req.Type == "stop" {
		tx, err := db.Beginx()
		if err != nil {
			return err
		}
		defer tx.Rollback()

		// retrieve start info from playingnow table
		var startInfo PlayingNow
		if err := tx.Get(&startInfo, `select * from playingnow where username=?`, username); err != nil {
			c.Logger().Error(err)
			return c.String(http.StatusNotFound, "start entry not found")
		}

		// if game names do not match, reject the request
		if startInfo.GameName != req.GameName {
			return c.String(http.StatusBadRequest, "game name does not match with start info")
		}

		// delete from playingnow table
		if _, err := tx.Exec(`delete from playingnow where username=?`, username); err != nil {
			return err
		}

		// insert into playingtime table
		_, err = tx.Exec(`insert into playingtime (username,gamename,startedat,endedat) values (?,?,?,?)`, username, req.GameName, startInfo.StartedAt, req.Time)
		if err != nil {
			return err
		}

		if err := tx.Commit(); err != nil {
			return err
		}

		return c.NoContent(http.StatusOK)
	}

	return c.String(http.StatusBadRequest, "type must be 'start' or 'stop'")
}

type insertLevelRequest struct {
	InGameName string `json:"in_game_name"`
	OldLevel   int    `json:"old_level"`
	NewLevel   int    `json:"new_level"`
	Time       int    `json:"time"`
}

func insertLevelUpdate(c echo.Context) error {
	// bind insertLevelRequest
	var req insertLevelRequest
	if err := c.Bind(&req); err != nil {
		return err
	}

	// get username associated with in-game name
	username, ok := getUsernameFromInGameName(req.InGameName)
	if !ok {
		return c.String(http.StatusNotFound, "in-game name not found")
	}

	// insert into levelupdate table
	_, err := db.Exec(`insert into levelupdate (username,oldlevel,newlevel,timeat) values (?,?,?,?)`, username, req.OldLevel, req.NewLevel, req.Time)
	if err != nil {
		return err
	}

	return c.NoContent(http.StatusOK)
}

type insertRankRequest struct {
	InGameName  string `json:"in_game_name"`
	OldRank     int    `json:"old_rank"`
	OldRankName string `json:"old_rank_name"`
	NewRank     int    `json:"new_rank"`
	NewRankName string `json:"new_rank_name"`
	Time        int    `json:"time"`
	RankType    string `json:"rank_type"`
}

func insertRankUpdate(c echo.Context) error {
	// bind insertRankRequest
	var req insertRankRequest
	if err := c.Bind(&req); err != nil {
		return err
	}

	// get username associated with in-game name
	username, ok := getUsernameFromInGameName(req.InGameName)
	if !ok {
		return c.String(http.StatusNotFound, "in-game name not found")
	}

	// insert into rankupdate table
	_, err := db.Exec(`insert into rankupdate (username,oldrank,oldrankname,newrank,newrankname,timeat,ranktype) values (?,?,?,?,?,?,?)`, username, req.OldRank, req.OldRankName, req.NewRank, req.NewRankName, req.Time, req.RankType)
	if err != nil {
		return err
	}

	return c.NoContent(http.StatusOK)
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

	// CORS settings
	e.Use(middleware.CORS())

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Routes
	e.GET("/level/all", getAllLevels)
	e.GET("/rank/:ranktype/all", getAllRanks)
	e.GET("/check/now", getNowPlaying)
	e.GET("/check/history", getLatestGameSessions)
	e.GET("/check/monthly", getMonthlyPlayingTime)

	e.POST("/check", insertCheck)
	e.POST("/level", insertLevelUpdate)
	e.POST("/rank", insertRankUpdate)

	// Start server
	e.Logger.Fatal(e.Start(":2500"))
}
