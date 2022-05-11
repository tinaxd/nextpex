package models

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

type DiscordImg struct {
	URL string `json:"url"`
	H   int    `json:"height"`
	W   int    `json:"width"`
}
type DiscordAuthor struct {
	Name string `json:"name"`
	URL  string `json:"url"`
	Icon string `json:"icon_url"`
}
type DiscordField struct {
	Name   string `json:"name"`
	Value  string `json:"value"`
	Inline bool   `json:"inline"`
}
type DiscordEmbed struct {
	Title  string         `json:"title"`
	Desc   string         `json:"description"`
	URL    string         `json:"url"`
	Color  int            `json:"color"`
	Image  DiscordImg     `json:"image"`
	Thum   DiscordImg     `json:"thumbnail"`
	Author DiscordAuthor  `json:"author"`
	Fields []DiscordField `json:"fields"`
}

type DiscordWebhook struct {
	UserName  string         `json:"username"`
	AvatarURL string         `json:"avatar_url"`
	Content   string         `json:"content"`
	Embeds    []DiscordEmbed `json:"embeds"`
	TTS       bool           `json:"tts"`
}

func SendMessage(discord_endpoint string, msgObj *DiscordWebhook) {
	msgJson, err := json.Marshal(msgObj)
	if err != nil {
		fmt.Println("json err:", err)
		return
	}

	req, err := http.NewRequest("POST", discord_endpoint, bytes.NewBuffer(msgJson))
	if err != nil {
		fmt.Println("new request err:", err)
		return
	}
	req.Header.Set("Content-Type", "application/json")

	client := http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("client err:", err)
		return
	}
	if resp.StatusCode == 204 {
		fmt.Println("Success") // Success
	} else {
		fmt.Printf("%#v\n", resp) // Failure
	}
}
