package main

import (
	"fmt"
	"net/http"

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

	e.Logger.Fatal(e.Start(":1323"))
}
