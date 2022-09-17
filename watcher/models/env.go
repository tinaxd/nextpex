package models

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Environments struct {
	ApexApiEndpoint string
	ApexApiKey      string
	DiscordEndpoint string
	BronzeBadge     string
	SilverBadge     string
	GoldBadge       string
	PlatinumBadge   string
	DiamondBadge    string
}

func LoadEnv(debug bool) Environments {
	var err error
	// LOADS .env file
	if debug {
		err = godotenv.Load(".env_local")
	}

	if err != nil {
		fmt.Println("Err: Loading .env failed.")
	}

	env := new(Environments)

	// Load environment values
	env.ApexApiEndpoint = os.Getenv("API_ENDPOINT")
	env.ApexApiKey = os.Getenv("API_KEY")
	env.DiscordEndpoint = os.Getenv("DISCORD_ENDPOINT")
	env.BronzeBadge = os.Getenv("BRONZE_BADGE")
	env.SilverBadge = os.Getenv("SILVER_BADGE")
	env.GoldBadge = os.Getenv("GOLD_BADGE")
	env.PlatinumBadge = os.Getenv("PLATINUM_BADGE")
	env.DiamondBadge = os.Getenv("DIAMOND_BADGE")

	return *env
}
