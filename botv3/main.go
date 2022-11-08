package main

import (
	"errors"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/bwmarrin/discordgo"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

// Variables used for command line parameters
var (
	Token string

	db *sqlx.DB
)

const (
	SelfApexChan = "self-apexability"
	CheckChan    = "apexability-check"
)

func init() {
	Token = os.Getenv("DISCORD_TOKEN")
	if Token == "" {
		fmt.Println("DISCORD_TOKEN not provided")
		os.Exit(1)
	}
}

func main() {

	// Create a new Discord session using the provided bot token.
	dg, err := discordgo.New("Bot " + Token)
	if err != nil {
		fmt.Println("error creating Discord session,", err)
		return
	}

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
	connStr := fmt.Sprintf("host=%s user=%s password=%s dbname=%s sslmode=disable", dbHost, dbUser, dbPass, dbName)
	db, err = sqlx.Connect("postgres", connStr)
	if err != nil {
		panic(err)
	}

	// Register the messageCreate func as a callback for MessageCreate events.
	dg.AddHandler(ready)
	dg.AddHandler(presenceUpdate)
	dg.AddHandler(reactionAdd)
	dg.AddHandler(reactionRemove)

	// In this example, we only care about receiving message events.
	dg.Identify.Intents = discordgo.IntentGuildMessages | discordgo.IntentDirectMessages | discordgo.IntentMessageContent | discordgo.IntentGuildMembers | discordgo.IntentGuildMessageReactions | discordgo.IntentGuildPresences

	// Open a websocket connection to Discord and begin listening.
	err = dg.Open()
	if err != nil {
		fmt.Println("error opening connection,", err)
		return
	}

	// Wait here until CTRL-C or other term signal is received.
	fmt.Println("Bot is now running.  Press CTRL-C to exit.")
	sc := make(chan os.Signal, 1)
	signal.Notify(sc, syscall.SIGINT, syscall.SIGTERM, os.Interrupt)
	<-sc

	// Cleanly close down the Discord session.
	dg.Close()
}

// This function will be called (due to AddHandler above) every time a new
// message is created on any channel that the authenticated bot has access to.
func presenceUpdate(s *discordgo.Session, p *discordgo.PresenceUpdate) {
	prevGame, err := getLastGameOfUser(p.User)
	if err != nil {
		log.Printf("presence update err: %v", err)
		return
	}
	newGame := extractGameFromActivities(p.Presence.Activities)

	member, err := s.GuildMember(p.GuildID, p.User.ID)
	if err != nil {
		log.Printf("guild member err: %v", err)
	}

	username := member.Nick
	if username == "" {
		username = member.User.Username
	}

	log.Printf("prevGame: %v, newGame: %v, username: %v", prevGame, newGame, username)
	if prevGame == "" && newGame != "" {
		log.Printf("game start: %v %v", username, newGame)
		// start
		checked, err := isCheckedGame(newGame)
		if err != nil {
			log.Printf("presence update err: %v", err)
			return
		}
		if !checked {
			log.Printf("game %s is not checked", newGame)
			return
		}

		if _, err := db.Exec("INSERT INTO bot_activity (user_id, activity) VALUES ($1, $2) ON CONFLICT(user_id) DO UPDATE SET activity=$3", p.User.ID, newGame, newGame); err != nil {
			log.Printf("presence update err: %v", err)
			return
		}

		if err := sendApexabilityCheckByUser(s, p.GuildID, p.User, newGame, true); err != nil {
			log.Printf("presence update err: %v", err)
			return
		}
		if err := insertCheck(username, newGame, true); err != nil {
			log.Printf("presence update err: %v", err)
			return
		}
	} else if prevGame != "" && newGame == "" {
		log.Printf("game stop: %v %v", username, newGame)
		// stop
		checked, err := isCheckedGame(prevGame)
		if err != nil {
			log.Printf("presence update err: %v", err)
			return
		}
		if !checked {
			log.Printf("game %s is not checked", newGame)
			return
		}

		if _, err := db.Exec("DELETE FROM bot_activity WHERE user_id=$1", p.User.ID); err != nil {
			log.Printf("presence update err: %v", err)
			return
		}

		if err := sendApexabilityCheckByUser(s, p.GuildID, p.User, prevGame, false); err != nil {
			log.Printf("presence update err: %v", err)
			return
		}
		if err := insertCheck(username, prevGame, false); err != nil {
			log.Printf("presence update err: %v", err)
			return
		}
	} else if prevGame != "" && newGame != "" && prevGame != newGame {
		log.Printf("game replace: %v %v", username, newGame)
		checked, err := isCheckedGame(newGame)
		if err != nil {
			log.Printf("presence update err: %v", err)
			return
		}
		if !checked {
			log.Printf("game %s is not checked", newGame)
			return
		}

		if _, err := db.Exec("INSERT INTO bot_activity (user_id, activity) VALUES ($1, $2) ON CONFLICT(user_id) DO UPDATE SET activity=$3", p.User.ID, newGame, newGame); err != nil {
			log.Printf("presence update err: %v", err)
			return
		}
	} else {
		log.Printf("game ??: %v %v", username, newGame)
		return
	}
}

func extractGameFromActivities(activities []*discordgo.Activity) string {
	for _, activity := range activities {
		if activity.Type == discordgo.ActivityTypeGame {
			return activity.Name
		}
	}
	return ""
}

func getLastGameOfUser(user *discordgo.User) (string, error) {
	var games []string
	if err := db.Select(&games, "SELECT activity FROM bot_activity WHERE user_id=$1", user.ID); err != nil {
		return "", err
	}

	if len(games) == 0 {
		return "", nil
	}
	return games[0], nil
}

func isCheckedGame(gameName string) (bool, error) {
	var count int
	if err := db.Get(&count, "SELECT COUNT(*) FROM game WHERE gamename=$1 AND is_checked=true", gameName); err != nil {
		return false, err
	}
	return count > 0, nil
}

func ready(s *discordgo.Session, r *discordgo.Ready) {
	// self apexability
	guilds := r.Guilds
	for _, guild := range guilds {
		if err := sendSelfApexability(s, guild); err != nil {
			fmt.Printf("send self-apexability error: %v", err)
		}
	}
}

func reactionRemove(s *discordgo.Session, r *discordgo.MessageReactionRemove) {
	handleReactionUpdate(s, r.MessageReaction, nil, false)
}

func reactionAdd(s *discordgo.Session, r *discordgo.MessageReactionAdd) {
	handleReactionUpdate(s, r.MessageReaction, r.Member, true)
}

func handleReactionUpdate(s *discordgo.Session, r *discordgo.MessageReaction, member *discordgo.Member, isAdd bool) {
	if r.UserID == s.State.User.ID {
		return
	}

	msgId := r.MessageID

	var count int
	if err := db.Get(&count, "SELECT COUNT(*) FROM bot_guild WHERE self_check_msg_id=$1", msgId); err != nil {
		log.Printf("reactionAdd error: %v", err)
		return
	}

	if count == 0 {
		return
	}

	emojiName := r.Emoji.Name
	gameName, err := getGameNameFromEmojiName(emojiName)
	if err != nil {
		log.Printf("reactionAdd error: %v", err)
		return
	}
	if gameName == "" {
		return
	}

	if member == nil {
		m, err := s.GuildMember(r.GuildID, r.UserID)
		if err != nil {
			log.Printf("reactionAdd error: %v", err)
			return
		}
		member = m
	}

	if err := sendApexabilityCheck(s, r.GuildID, member, gameName, isAdd); err != nil {
		log.Printf("reactionAdd error: %v", err)
		return
	}

	if err := insertCheck(member.User.Username, gameName, isAdd); err != nil {
		log.Printf("reactionAdd update err: %v", err)
		return
	}
}

func buildMessageText(member *discordgo.Member, gameName string, isStart bool) string {
	var tail string
	if isStart {
		tail = "を始めました！"
	} else {
		tail = "をやめました！"
	}
	name := member.Nick
	if name == "" {
		name = member.User.Username
	}
	return fmt.Sprintf("%s が %s %s", name, gameName, tail)
}

func sendApexabilityCheckByUser(s *discordgo.Session, guildID string, user *discordgo.User, gameName string, isStart bool) error {
	checkChan, err := findTextChannel(s, guildID, CheckChan)
	if err != nil {
		return err
	}

	if checkChan == nil {
		return errors.New("apexability-check channel not found")
	}

	member, err := s.GuildMember(guildID, user.ID)
	if err != nil {
		return err
	}

	content := buildMessageText(member, gameName, isStart)
	_, err = s.ChannelMessageSend(checkChan.ID, content)
	return err
}

func sendApexabilityCheck(s *discordgo.Session, guildID string, member *discordgo.Member, gameName string, isStart bool) error {
	checkChan, err := findTextChannel(s, guildID, CheckChan)
	if err != nil {
		return err
	}

	if checkChan == nil {
		return errors.New("apexability-check channel not found")
	}

	content := buildMessageText(member, gameName, isStart)
	_, err = s.ChannelMessageSend(checkChan.ID, content)
	return err
}

func sendSelfApexability(s *discordgo.Session, guild *discordgo.Guild) error {
	selfApexChan, err := findTextChannel(s, guild.ID, SelfApexChan)
	if err != nil {
		return err
	}

	if selfApexChan == nil {
		return errors.New("self-apexability channel not found")
	}

	msg, err := s.ChannelMessageSend(selfApexChan.ID, "ゲームを始めたらリアクションをつけてください")
	if err != nil {
		return err
	}

	if err := attachGameReactionsToMsg(s, guild, msg); err != nil {
		return err
	}

	if _, err := db.Exec("INSERT INTO bot_guild(guild_id,self_check_msg_id) VALUES($1,$2) ON CONFLICT(guild_id) DO UPDATE SET self_check_msg_id=$3", guild.ID, msg.ID, msg.ID); err != nil {
		return err
	}

	return nil
}

func getEmojiNames() ([]string, error) {
	var emojiNames []string
	if err := db.Select(&emojiNames, "select emoji_name from game where emoji_name is not null;"); err != nil {
		return nil, err
	}
	return emojiNames, nil
}

func getGameNameFromEmojiName(emojiName string) (string, error) {
	var gameName []string
	if err := db.Select(&gameName, "select gamename from game where emoji_name=$1;", emojiName); err != nil {
		return "", err
	}

	if len(gameName) == 0 {
		return "", nil
	}
	return gameName[0], nil
}

func attachGameReactionsToMsg(s *discordgo.Session, guild *discordgo.Guild, msg *discordgo.Message) error {
	emojiNamesToAttach, err := getEmojiNames()
	if err != nil {
		return err
	}

	emojiToAttach := []*discordgo.Emoji{}
	for _, emojiName := range emojiNamesToAttach {
		emoji, err := findEmoji(s, guild, emojiName)
		if err != nil {
			return err
		}
		if emoji == nil {
			continue
		}
		emojiToAttach = append(emojiToAttach, emoji)
	}

	for _, emoji := range emojiToAttach {
		err := s.MessageReactionAdd(msg.ChannelID, msg.ID, emoji.APIName())
		if err != nil {
			return err
		}
	}

	return nil
}

func findTextChannel(s *discordgo.Session, guildID string, channelName string) (*discordgo.Channel, error) {
	channels, err := s.GuildChannels(guildID)
	if err != nil {
		return nil, err
	}
	for _, channel := range channels {
		if channel.Name == channelName && channel.Type == discordgo.ChannelTypeGuildText {
			return channel, nil
		}
	}
	return nil, nil
}

func findEmoji(s *discordgo.Session, guild *discordgo.Guild, emojiName string) (*discordgo.Emoji, error) {
	emojis, err := s.GuildEmojis(guild.ID)
	if err != nil {
		return nil, err
	}

	for _, emoji := range emojis {
		if emoji.Name == emojiName {
			return emoji, nil
		}
	}

	return nil, nil
}
