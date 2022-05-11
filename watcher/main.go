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

func rankDiff(old int, new int) string {
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

	level := int(new.Data.Segments[0].Stats.Level.Value)
	trioRank := int(new.Data.Segments[0].Stats.RankScore.Value)
	arenaRank := int(new.Data.Segments[0].Stats.ArenaRankScore.Value)
	if timestamp > int64(old.LastUpdate) && int(new.Data.Segments[0].Stats.Level.Value) > old.Stats.Level {
		hasUpdate = true
		messageField = append(messageField, models.DiscordField{Name: "レベル", Value: fmt.Sprint(old.Stats.Level) + "→" + fmt.Sprint(level) + rankDiff(old.Stats.Level, level) + ":laughing:", Inline: false})
		models.PostLevel(&envs, old.Uid, old.Stats.Level, level)
	}
	if timestamp > int64(old.LastUpdate) && int(new.Data.Segments[0].Stats.RankScore.Value) != old.Stats.TrioRank {
		hasUpdate = true
		messageField = append(messageField, models.DiscordField{Name: "トリオRank", Value: models.GetTierBadge(&envs, old.Stats.TrioRank, "trio") + fmt.Sprint(old.Stats.TrioRank) + "→" + models.GetTierBadge(&envs, trioRank, "trio") + fmt.Sprint(trioRank) + rankDiff(old.Stats.TrioRank, trioRank), Inline: false})
		models.PostRank(&envs, old.Uid, "trio", old.Stats.TrioRank, trioRank)
	}
	if timestamp > int64(old.LastUpdate) && int(new.Data.Segments[0].Stats.ArenaRankScore.Value) != old.Stats.ArenaRank {
		hasUpdate = true
		messageField = append(messageField, models.DiscordField{Name: "アリーナRank", Value: models.GetTierBadge(&envs, old.Stats.ArenaRank, "arena") + fmt.Sprint(old.Stats.ArenaRank) + "→" + models.GetTierBadge(&envs, arenaRank, "arena") + fmt.Sprint(arenaRank) + rankDiff(old.Stats.ArenaRank, arenaRank), Inline: false})
		models.PostRank(&envs, old.Uid, "arena", old.Stats.ArenaRank, arenaRank)
	}

	userDataDetail := models.UserDataDetail{Level: level, TrioRank: trioRank, ArenaRank: arenaRank}

	return hasUpdate, &messageField, &userDataDetail
}

func updateStats(db *sql.DB, userList []models.UserData) {
	for _, v := range userList {
		fmt.Printf("Old: %+v\n", v)

		// Create go routine
		apexStats := models.GetApexStats(envs.APEX_API_ENDPOINT, envs.APEX_API_KEY, v.Platform, v.Uid)

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
			msgObj.UserName = "Go BOT"
			msgObj.AvatarURL = "https://pbs.twimg.com/profile_images/1108370004590772224/hEX1gucp_400x400.jpg"
			msgObj.Embeds = []models.DiscordEmbed{
				{
					Title:  "\U0001F38A" + v.Uid + "の戦績変化\U0001F389",
					Color:  0x550000,
					Fields: *messageField,
				},
			}
			models.SendMessage(envs.DISCORD_ENDPOINT, msgObj)
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
