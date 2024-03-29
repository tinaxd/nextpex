package main

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	_ "github.com/lib/pq"
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
		Level    int       `db:"newlevel"`
		Time     time.Time `db:"timeat"`
		Username string    `db:"username"`
	}
	err := db.Select(&levels, `select username,newlevel,timeat from levelupdate order by timeat desc`)
	if err != nil {
		return err
	}

	levelMap := make(map[string][]LevelResponse)
	for _, l := range levels {
		levelMap[l.Username] = append(levelMap[l.Username], LevelResponse{
			Level:  l.Level,
			TimeAt: int(l.Time.Unix()),
		})
	}

	response := make(map[string]interface{})
	response["levels"] = levelMap

	return c.JSON(http.StatusOK, response)
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
		Rank     int       `db:"newrank"`
		RankName string    `db:"newrankname"`
		Time     time.Time `db:"timeat"`
		Username string    `db:"username"`
	}
	err := db.Select(&ranks, `select username,newrank,newrankname,timeat from rankupdate where ranktype=$1 order by timeat desc`, rankType)
	if err != nil {
		return err
	}

	rankMap := make(map[string][]RankResponse)
	for _, r := range ranks {
		rankMap[r.Username] = append(rankMap[r.Username], RankResponse{
			Rank:     r.Rank,
			RankName: r.RankName,
			TimeAt:   int(r.Time.Unix()),
		})
	}

	response := make(map[string]interface{})
	response["ranks"] = rankMap

	return c.JSON(http.StatusOK, response)
}

func getNowPlaying(c echo.Context) error {
	var nowPlaying []PlayingTimeWithoutEndedAt
	err := db.Select(&nowPlaying, `select username,gamename,cast(EXTRACT(epoch FROM startedat) as integer) AS startedat from playingtime where endedat IS NULL order by startedat desc`)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, nowPlaying)
}

func getLatestGameSessions(c echo.Context) error {
	var sessions []PlayingTimeWithEndedAt

	// limit
	limit := 20
	if l := c.QueryParam("limit"); l != "" {
		var err error
		limit, err = strconv.Atoi(l)
		if err != nil {
			return c.String(http.StatusBadRequest, "limit must be integer")
		}
	}

	err := db.Select(&sessions, "select username,gamename,cast(EXTRACT(epoch FROM startedat) as integer) AS startedat,cast(EXTRACT(epoch FROM endedat) AS INTEGER) AS endedat from playingtime where endedat IS NOT NULL order by endedat desc limit $1", limit)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, sessions)
}

func getMonthlyPlayingTime(c echo.Context) error {
	var monthlyChecks []MonthlyCheck
	err := db.Select(&monthlyChecks, `select username,gamename,EXTRACT(epoch FROM playtime) AS playtime,year,month from monthlycheck`)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, monthlyChecks)
}

func getUsernameFromInGameName(inGameName string) (string, bool) {
	var username string
	err := db.Get(&username, `select username from ingamename where ingamename=$1`, inGameName)
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
		tx, err := db.Beginx()
		if err != nil {
			return err
		}
		defer tx.Rollback()

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
			_, err := tx.Exec("INSERT INTO playingtime(username,gamename,startedat,endedat) VALUES($1,$2,$3,NULL)", username, req.GameName, time.Unix(int64(req.Time), 0))
			if err != nil {
				return err
			}
			if err := tx.Commit(); err != nil {
				return err
			}
		} else {
			// if an entry already exists, update the startedat field
			_, err := tx.Exec("UPDATE playingtime WHERE id=$1 SET gamename=$2, startedat=$3", result[0].ID, req.GameName, time.Unix(int64(req.Time), 0))
			if err != nil {
				return err
			}
			if err := tx.Commit(); err != nil {
				return err
			}
		}

		return c.NoContent(http.StatusOK)
	} else if req.Type == "stop" {
		tx, err := db.Beginx()
		if err != nil {
			return err
		}
		defer tx.Rollback()

		// retrieve start info from playingnow table
		type PlayingTimeWithID struct {
			ID int `db:"id"`
			PlayingTimeWithEndedAt
		}
		var startInfo PlayingTimeWithID
		if err := tx.Get(&startInfo, `select id,gamename from playingtime where username=$1 AND endedat IS NULL FOR UPDATE`, username); err != nil {
			c.Logger().Error(err)
			return c.String(http.StatusNotFound, "start entry not found")
		}

		// if game names do not match, reject the request
		if startInfo.GameName != req.GameName {
			return c.String(http.StatusBadRequest, "game name does not match with start info")
		}

		// insert into playingtime table
		_, err = tx.Exec("UPDATE playingtime WHERE id=$1 SET endedat=$2", startInfo.ID, time.Unix(int64(req.Time), 0))
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
	_, err := db.Exec(`insert into levelupdate (username,oldlevel,newlevel,timeat) values ($1,$2,$3,$4)`, username, req.OldLevel, req.NewLevel, time.Unix(int64(req.Time), 0))
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
	_, err := db.Exec(`insert into rankupdate (username,oldrank,oldrankname,newrank,newrankname,timeat,ranktype) values ($1,$2,$3,$4,$5,$6,$7)`, username, req.OldRank, req.OldRankName, req.NewRank, req.NewRankName, time.Unix(int64(req.Time), 0), req.RankType)
	if err != nil {
		return err
	}

	return c.NoContent(http.StatusOK)
}

func main() {
	// Echo instance
	e := echo.New()

	// Initialize DB
	dbUser := os.Getenv("DB_USER")
	if dbUser == "" {
		dbUser = "nextpex"
	}
	dbPass := os.Getenv("DB_PASS")
	if dbPass == "" {
		dbPass = "nextpex"
	}
	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		dbHost = "localhost"
	}
	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "nextpex"
	}
	var err error
	connStr := fmt.Sprintf("host=%s user=%s password=%s dbname=%s sslmode=disable", dbHost, dbUser, dbPass, dbName)
	db, err = sqlx.Connect("postgres", connStr)
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

	// e.POST("/check", insertCheck)
	e.POST("/level", insertLevelUpdate)
	e.POST("/rank", insertRankUpdate)

	// Start server
	e.Logger.Fatal(e.Start(":2500"))
}
