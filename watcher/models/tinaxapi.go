package models

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type level struct {
	PlayerName string `json:"in_game_name"`
	Timestamp  int64  `json:"time"`
	OldLevel   int32  `json:"old_level"`
	NewLevel   int32  `json:"new_level"`
}

type rank struct {
	PlayerName  string `json:"in_game_name"`
	Timestamp   int64  `json:"time"`
	OldRank     int32  `json:"old_rank"`
	OldRankName string `json:"old_rank_name"`
	NewRank     int32  `json:"new_rank"`
	NewRankName string `json:"new_rank_name"`
	RankType    string `json:"rank_type"`
}

func PostLevel(e *Environments, userID string, oldLevel, newLevel int32) {
	timestamp := time.Now().Unix()
	jsonData, _ := json.Marshal(level{
		PlayerName: userID,
		Timestamp:  timestamp,
		OldLevel:   oldLevel,
		NewLevel:   newLevel,
	})
	res, err := http.Post(e.TINAX_API_ENDPOINT+"/level", "application/json", bytes.NewBuffer(jsonData))
	defer res.Body.Close()

	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println("posted level:", userID)
	}
}

func PostRank(e *Environments, userID, rankType string, oldRank, newRank int32) {
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
	fmt.Println(e.TINAX_API_ENDPOINT + "/rank")
	res, err := http.Post(e.TINAX_API_ENDPOINT+"/rank", "application/json", bytes.NewBuffer(jsonData))
	defer res.Body.Close()

	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println("posted rank:", userID)
	}
}
