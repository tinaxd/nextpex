package main

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/labstack/echo/v4"
)

func main() {
	// init DB
	db, err := NewDB()
	if err != nil {
		panic(err)
	}
	db.Init()

	e := echo.New()
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})

	e.GET("/level", func(c echo.Context) error {
		updates, err := db.GetAllLevels()
		if err != nil {
			fmt.Println(err)
			return c.NoContent(http.StatusInternalServerError)
		}
		reply := make([]map[string]interface{}, 0)
		for _, update := range updates {
			entry := make(map[string]interface{})
			entry["level"] = update.NewLevel
			entry["time"] = update.Time
			entry["player"] = update.DisplayName
			reply = append(reply, entry)
		}
		return c.JSON(http.StatusOK, reply)
	})

	e.GET("/rank/:type", func(c echo.Context) error {
		rankType := c.Param("type")
		if rankType != "trio" && rankType != "arena" {
			return c.String(http.StatusBadRequest, "Type must be either trio or arena.")
		}
		updates, err := db.GetAllRanks(RankType(rankType))
		if err != nil {
			fmt.Println(err)
			return c.NoContent(http.StatusInternalServerError)
		}
		reply := make([]map[string]interface{}, 0)
		for _, update := range updates {
			entry := make(map[string]interface{})
			entry["rank"] = update.NewRank
			entry["rank_name"] = update.NewName
			entry["rank_type"] = update.RankType
			entry["time"] = update.Time
			entry["player"] = update.DisplayName
			reply = append(reply, entry)
		}
		return c.JSON(http.StatusOK, reply)
	})

	checkHelper := func(c echo.Context, entries *int) error {
		checks, err := db.GetChecks(entries)
		if err != nil {
			fmt.Println(err)
			return c.NoContent(http.StatusInternalServerError)
		}
		reply := make([]map[string]interface{}, 0)
		for _, check := range checks {
			entry := make(map[string]interface{})
			entry["entry_type"] = check.EntryType
			entry["time"] = check.Time
			entry["player"] = check.DisplayName
			reply = append(reply, entry)
		}
		return c.JSON(http.StatusOK, reply)
	}

	e.GET("/check/all", func(c echo.Context) error {
		return checkHelper(c, nil)
	})
	e.GET("/check/recent/:entries", func(c echo.Context) error {
		entStr := c.Param("entries")
		ent, err := strconv.ParseInt(entStr, 10, 32)
		if err != nil {
			return c.String(http.StatusBadRequest, "entries must be a number.")
		}
		if ent <= 0 {
			return c.String(http.StatusBadRequest, "entries must be a positive number")
		}
		entP := int(ent)
		return checkHelper(c, &entP)
	})

	compat := e.Group("/api/compat")
	compat.POST("/level/register", func(c echo.Context) error {
		var query struct {
			PlayerName string `json:"player_name"`
			Time       int64  `json:"timestamp"`
			OldLevel   int    `json:"old_rank"`
			NewLevel   int    `json:"new_rank"`
		}
		err := c.Bind(&query)
		if err != nil {
			return c.NoContent(http.StatusBadRequest)
		}
		timestamp := time.Unix(query.Time, 0)
		err = db.PostLevel(query.PlayerName, query.OldLevel, query.NewLevel, timestamp)
		if err != nil {
			return c.NoContent(http.StatusInternalServerError)
		}
		return c.NoContent(http.StatusOK)
	})
	compat.POST("/rank/register", func(c echo.Context) error {
		var query struct {
			PlayerName  string `json:"player_name"`
			Time        int64  `json:"timestamp"`
			OldRank     int    `json:"old_rank"`
			NewRank     int    `json:"new_rank"`
			OldRankName string `json:"old_rank_name"`
			NewRankName string `json:"new_rank_name"`
			RankType    string `json:"rank_type"`
		}
		err := c.Bind(&query)
		if err != nil {
			return c.NoContent(http.StatusBadRequest)
		}
		timestamp := time.Unix(query.Time, 0)
		err = db.PostRank(query.PlayerName, query.OldRank, query.OldRankName, query.NewRank, query.NewRankName, RankType(query.RankType), timestamp)
		if err != nil {
			return c.NoContent(http.StatusInternalServerError)
		}
		return c.NoContent(http.StatusOK)
	})

	e.Logger.Fatal(e.Start(":1323"))
}
