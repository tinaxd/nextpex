package main

import (
	"apexstalker-go/models"
	"database/sql"
	"fmt"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"log"
	"net/http"
	"strconv"
	"time"
)

var envs models.Environments

func main() {
	// Load environment values
	envs = models.LoadEnv(false)
	models.Initialize()
	// Echo instance
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Routes
	e.GET("/", hello)
	e.GET("/watcher/all", getAllStats)
	e.GET("/watcher/:user", getSingleStats)
	e.GET("/register/:user/:platform", registerPlayer)
	e.GET("/delete/:user", deletePlayer)
	e.GET("/update/uid/:old/:new", updatePlayerID)
	e.GET("/update/data/:type/:user/:data", updatePlayerData)

	// Start server
	e.Logger.Fatal(e.Start(":1323"))
}

func hello(c echo.Context) error {
	return c.String(http.StatusOK, "Hello, World!")
}

func rankDiff(old int32, new int32) string {
	diff := new - old
	var sign string
	if diff < 0 {
		sign = "-"
		diff *= -1
	} else {
		sign = "+"
	}
	return fmt.Sprintf(" (%s%d) ", sign, diff)
}

func compare(old models.UserData, new models.ApexStats) (bool, *[]models.DiscordField, *models.UserDataDetail) {
	timestamp := time.Now().Unix()
	hasUpdate := false
	messageField := []models.DiscordField{}

	//messageField = append(messageField, models.DiscordField{Name: "テスト配信", Value: "Hello from Go"})

	level := int32(new.Data.Segments[0].Stats.Level.Value)
	trioRank := int32(new.Data.Segments[0].Stats.RankScore.Value)
	arenaRank := int32(new.Data.Segments[0].Stats.ArenaRankScore.Value)
	if timestamp > old.LastUpdate.Int64 && int32(new.Data.Segments[0].Stats.Level.Value) > old.Stats.Level.Int32 {
		hasUpdate = true
		messageField = append(messageField, models.DiscordField{Name: "レベル", Value: fmt.Sprint(old.Stats.Level.Int32) + "→" + fmt.Sprint(level) + rankDiff(old.Stats.Level.Int32, level) + ":laughing:", Inline: false})
		models.PostLevel(old.Uid, old.Stats.Level.Int32, level)
	}
	if timestamp > old.LastUpdate.Int64 && int32(new.Data.Segments[0].Stats.RankScore.Value) != old.Stats.TrioRank.Int32 {
		hasUpdate = true
		messageField = append(messageField, models.DiscordField{Name: "トリオRank", Value: models.GetTierBadge(&envs, old.Stats.TrioRank.Int32, "trio") + fmt.Sprint(old.Stats.TrioRank.Int32) + "→" + models.GetTierBadge(&envs, trioRank, "trio") + fmt.Sprint(trioRank) + rankDiff(old.Stats.TrioRank.Int32, trioRank), Inline: false})
		models.PostRank(old.Uid, "trio", old.Stats.TrioRank.Int32, trioRank)
	}
	if timestamp > old.LastUpdate.Int64 && int32(new.Data.Segments[0].Stats.ArenaRankScore.Value) != old.Stats.ArenaRank.Int32 {
		hasUpdate = true
		messageField = append(messageField, models.DiscordField{Name: "アリーナRank", Value: models.GetTierBadge(&envs, old.Stats.ArenaRank.Int32, "arena") + fmt.Sprint(old.Stats.ArenaRank.Int32) + "→" + models.GetTierBadge(&envs, arenaRank, "arena") + fmt.Sprint(arenaRank) + rankDiff(old.Stats.ArenaRank.Int32, arenaRank), Inline: false})
		models.PostRank(old.Uid, "arena", old.Stats.ArenaRank.Int32, arenaRank)
	}

	userDataDetail := models.UserDataDetail{Level: sql.NullInt32{Int32: level}, TrioRank: sql.NullInt32{Int32: trioRank}, ArenaRank: sql.NullInt32{Int32: arenaRank}}

	return hasUpdate, &messageField, &userDataDetail
}

func updateStats(db *sql.DB, userList []models.UserData) {
	for _, v := range userList {
		fmt.Printf("Old: %+v\n", v)

		// Create go routine
		apexStats := models.GetApexStats(envs.ApexApiEndpoint, envs.ApexApiKey, v.Platform, v.Uid)

		if apexStats == nil {
			log.Printf("error fetching: %s", v.Uid)
			continue
		}

		// Compare old with new stats data
		hasUpdate, messageField, userDataDetail := compare(v, *apexStats)
		fmt.Printf("New: %#v\n", *userDataDetail)
		// Save new stats
		models.UpdatePlayerData(db, v.Uid, *userDataDetail)

		// Send notification if there was an update in stats
		if hasUpdate {
			msgObj := new(models.DiscordWebhook)
			msgObj.UserName = "Apex Rank Watcher"
			msgObj.Embeds = []models.DiscordEmbed{
				{
					Title:  "\U0001F38A" + v.Uid + "の戦績変化\U0001F389",
					Color:  0x550000,
					Fields: *messageField,
				},
			}
			models.SendMessage(envs.DiscordEndpoint, msgObj)
		}
	}
}

func getAllStats(c echo.Context) error {
	// Create db connection client
	db := models.Connect(&envs)
	defer db.Close()

	// Load old stats list
	userList := models.GetPlayerData(db, "")
	updateStats(db, userList)

	return c.JSON(http.StatusOK, "ok")
}

func getSingleStats(c echo.Context) error {
	userID := c.Param("user")
	// Create db connection client
	db := models.Connect(&envs)
	defer db.Close()

	// Load old stats list
	userList := models.GetPlayerData(db, userID)
	updateStats(db, userList)

	return c.JSON(http.StatusOK, "ok")
}

func registerPlayer(c echo.Context) error {
	userID := c.Param("user")
	platform := c.Param("platform")
	// Create db connection client
	db := models.Connect(&envs)
	defer db.Close()

	success := models.RegisterPlayer(db, userID, platform)
	if success {
		return c.JSON(http.StatusOK, "registered")
	} else {
		return c.JSON(http.StatusInternalServerError, "failed to register")
	}
}

func deletePlayer(c echo.Context) error {
	userID := c.Param("user")
	// Create db connection client
	db := models.Connect(&envs)
	defer db.Close()

	success := models.DeletePlayer(db, userID)
	if success {
		return c.JSON(http.StatusOK, "deleted")
	} else {
		return c.JSON(http.StatusInternalServerError, "failed to delete")
	}
}

func updatePlayerID(c echo.Context) error {
	oldUserID := c.Param("old")
	newUserID := c.Param("new")
	// Create db connection client
	db := models.Connect(&envs)
	defer db.Close()

	success := models.UpdatePlayerID(db, oldUserID, newUserID)
	if success {
		return c.JSON(http.StatusOK, "updated")
	} else {
		return c.JSON(http.StatusInternalServerError, "failed to update")
	}
}

func updatePlayerData(c echo.Context) error {
	updateType := c.Param("type")
	userID := c.Param("user")
	data, _ := strconv.Atoi(c.Param("data"))
	// Create db connection client
	db := models.Connect(&envs)
	defer db.Close()

	var success bool
	var msg string
	switch updateType {
	case "level":
		success = models.UpdatePlayerLevel(db, userID, data)
		msg = "updated level"
	case "trio":
		success = models.UpdatePlayerTrioRank(db, userID, data)
		msg = "updated trio rank"
	case "arena":
		success = models.UpdatePlayerArenaRank(db, userID, data)
		msg = "updated arena rank"
	default:
		success = false
		msg = "Unimplemented update type"
	}

	if success {
		return c.JSON(http.StatusOK, msg)
	} else {
		return c.JSON(http.StatusInternalServerError, msg)
	}
}
