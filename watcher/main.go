package main

import (
	"apexstalker-go/models"
	"fmt"
	"log"
	"time"
)

var envs models.Environments

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
	}
	if timestamp > int64(old.LastUpdate) && int(new.Data.Segments[0].Stats.RankScore.Value) != old.Stats.TrioRank {
		hasUpdate = true
		messageField = append(messageField, models.DiscordField{Name: "トリオRank", Value: models.GetTrioTierBadge(&envs, old.Stats.TrioRank) + fmt.Sprint(old.Stats.TrioRank) + "→" + models.GetTrioTierBadge(&envs, trioRank) + fmt.Sprint(trioRank) + rankDiff(old.Stats.TrioRank, trioRank), Inline: false})
	}
	if timestamp > int64(old.LastUpdate) && int(new.Data.Segments[0].Stats.ArenaRankScore.Value) != old.Stats.ArenaRank {
		hasUpdate = true
		messageField = append(messageField, models.DiscordField{Name: "アリーナRank", Value: models.GetArenaTierBadge(&envs, old.Stats.ArenaRank) + fmt.Sprint(old.Stats.ArenaRank) + "→" + models.GetArenaTierBadge(&envs, arenaRank) + fmt.Sprint(arenaRank) + rankDiff(old.Stats.ArenaRank, arenaRank), Inline: false})
	}

	userDataDetail := models.UserDataDetail{Level: level, TrioRank: trioRank, ArenaRank: arenaRank}

	return hasUpdate, &messageField, &userDataDetail
}

func main() {
	// Load environment values
	envs = models.LoadEnv(true)

	// Create db connection client
	db := models.Connect(&envs)
	defer db.Close()

	// Load old stats list
	userList := models.GetPlayerData(db)

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
