package models

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type level struct {
	PlayerName string `json:"player_name"`
	Timestamp  int64  `json:"timestamp"`
	OldLevel   int    `json:"old_rank"`
	NewLevel   int    `json:"new_rank"`
}

type rank struct {
	PlayerName  string `json:"player_name"`
	Timestamp   int64  `json:"timestamp"`
	OldRank     int    `json:"old_rank"`
	OldRankName string `json:"old_rank_name"`
	NewRank     int    `json:"new_rank"`
	NewRankName string `json:"new_rank_name"`
	RankType    string `json:"rank_type"`
}

func PostLevel(e *Environments, userID string, oldLevel, newLevel int) {
	timestamp := time.Now().Unix()
	jsonData, _ := json.Marshal(level{
		PlayerName: userID,
		Timestamp:  timestamp,
		OldLevel:   oldLevel,
		NewLevel:   newLevel,
	})
	res, err := http.Post(e.TINAX_API_ENDPOINT+"/api/compat/level/register", "application/json", bytes.NewBuffer(jsonData))
	defer res.Body.Close()

	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println("posted level:", userID)
	}
}

func PostRank(e *Environments, userID, rankType string, oldRank, newRank int) {
	timestamp := time.Now().Unix()
	jsonData, _ := json.Marshal(rank{
		PlayerName:  userID,
		Timestamp:   timestamp,
		OldRank:     oldRank,
		OldRankName: GetRankName(oldRank, rankType),
		NewRank:     newRank,
		NewRankName: GetRankName(newRank, rankType),
		RankType:    rankType,
	})
	res, err := http.Post(e.TINAX_API_ENDPOINT+"/api/compat/rank/register", "application/json", bytes.NewBuffer(jsonData))
	defer res.Body.Close()

	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println("posted rank:", userID)
	}
}
