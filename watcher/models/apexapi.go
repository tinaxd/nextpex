// This file was generated from JSON Schema using quicktype, do not modify it directly.
// To parse and unparse this JSON data, add this code to your project and do:
//
//    apexAPI, err := UnmarshalApexAPI(bytes)
//    bytes, err = apexAPI.Marshal()

package models

import "encoding/json"

func UnmarshalApexAPI(data []byte) (ApexStats, error) {
	var r ApexStats
	err := json.Unmarshal(data, &r)
	return r, err
}

func (r *ApexStats) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

type ApexStats struct {
	Data Data `json:"data"`
}

type Data struct {
	PlatformInfo      PlatformInfo       `json:"platformInfo"`
	UserInfo          UserInfo           `json:"userInfo"`
	Metadata          DataMetadata       `json:"metadata"`
	Segments          []Segment          `json:"segments"`
	AvailableSegments []AvailableSegment `json:"availableSegments"`
	ExpiryDate        string             `json:"expiryDate"`
}

type AvailableSegment struct {
	Type       Type          `json:"type"`
	Attributes MetadataClass `json:"attributes"`
	Metadata   MetadataClass `json:"metadata"`
}

type MetadataClass struct {
}

type DataMetadata struct {
	CurrentSeason     int64    `json:"currentSeason"`
	ActiveLegend      string   `json:"activeLegend"`
	ActiveLegendName  string   `json:"activeLegendName"`
	ActiveLegendStats []string `json:"activeLegendStats"`
}

type PlatformInfo struct {
	PlatformSlug           string      `json:"platformSlug"`
	PlatformUserID         string      `json:"platformUserId"`
	PlatformUserHandle     string      `json:"platformUserHandle"`
	PlatformUserIdentifier string      `json:"platformUserIdentifier"`
	AvatarURL              string      `json:"avatarUrl"`
	AdditionalParameters   interface{} `json:"additionalParameters"`
}

type Segment struct {
	Type       Type              `json:"type"`
	Attributes SegmentAttributes `json:"attributes"`
	Metadata   SegmentMetadata   `json:"metadata"`
	ExpiryDate string            `json:"expiryDate"`
	Stats      Stats             `json:"stats"`
}

type SegmentAttributes struct {
	ID *string `json:"id,omitempty"`
}

type SegmentMetadata struct {
	Name             string  `json:"name"`
	ImageURL         *string `json:"imageUrl,omitempty"`
	TallImageURL     *string `json:"tallImageUrl,omitempty"`
	BgImageURL       *string `json:"bgImageUrl,omitempty"`
	PortraitImageURL *string `json:"portraitImageUrl,omitempty"`
	LegendColor      *string `json:"legendColor,omitempty"`
	IsActive         *bool   `json:"isActive,omitempty"`
}

type Stats struct {
	Level                     *ArenaSeason9Damage `json:"level,omitempty"`
	Kills                     *ArenaSeason9Damage `json:"kills,omitempty"`
	Damage                    *ArenaSeason9Damage `json:"damage,omitempty"`
	Headshots                 *ArenaSeason9Damage `json:"headshots,omitempty"`
	Revives                   *ArenaSeason9Damage `json:"revives,omitempty"`
	TimesPlacedtop3           *ArenaSeason9Damage `json:"timesPlacedtop3,omitempty"`
	NeutralAirdropsLooted     *ArenaSeason9Damage `json:"neutralAirdropsLooted,omitempty"`
	PistolKills               *ArenaSeason9Damage `json:"pistolKills,omitempty"`
	RankScore                 *RankScore          `json:"rankScore,omitempty"`
	ArenaRankScore            *RankScore          `json:"arenaRankScore,omitempty"`
	Season8WINS               *ArenaSeason9Damage `json:"season8Wins,omitempty"`
	Season8Kills              *ArenaSeason9Damage `json:"season8Kills,omitempty"`
	Season9WINS               *ArenaSeason9Damage `json:"season9Wins,omitempty"`
	Season9Kills              *ArenaSeason9Damage `json:"season9Kills,omitempty"`
	Season10WINS              *ArenaSeason9Damage `json:"season10Wins,omitempty"`
	ArenaSeason9Kills         *ArenaSeason9Damage `json:"arenaSeason9Kills,omitempty"`
	ArenaSeason9WINS          *ArenaSeason9Damage `json:"arenaSeason9Wins,omitempty"`
	ArenaSeason9Damage        *ArenaSeason9Damage `json:"arenaSeason9Damage,omitempty"`
	ArenaWinStreak            *ArenaSeason9Damage `json:"arenaWinStreak,omitempty"`
	DroppodItemsForSquadmates *ArenaSeason9Damage `json:"droppodItemsForSquadmates,omitempty"`
	DocDroneHealing           *ArenaSeason9Damage `json:"docDroneHealing,omitempty"`
	PassiveHealthRegenerated  *ArenaSeason9Damage `json:"passiveHealthRegenerated,omitempty"`
	NoxGasDamageDealt         *ArenaSeason9Damage `json:"noxGasDamageDealt,omitempty"`
	GasTrapTimesActivated     *ArenaSeason9Damage `json:"gasTrapTimesActivated,omitempty"`
	BombardmentKills          *ArenaSeason9Damage `json:"bombardmentKills,omitempty"`
	GunShieldDamageBlocked    *ArenaSeason9Damage `json:"gunShieldDamageBlocked,omitempty"`
	TacticalBulletsAmped      *ArenaSeason9Damage `json:"tacticalBulletsAmped,omitempty"`
	TacticalDamageBlocked     *ArenaSeason9Damage `json:"tacticalDamageBlocked,omitempty"`
	UltimateLootTakenByAllies *ArenaSeason9Damage `json:"ultimateLootTakenByAllies,omitempty"`
}

type RankScore struct {
	Rank            interface{}            `json:"rank"`
	Percentile      float64                `json:"percentile"`
	DisplayName     string                 `json:"displayName"`
	DisplayCategory DisplayCategory        `json:"displayCategory"`
	Category        interface{}            `json:"category"`
	Metadata        ArenaRankScoreMetadata `json:"metadata"`
	Value           float64                `json:"value"`
	DisplayValue    string                 `json:"displayValue"`
	DisplayType     DisplayType            `json:"displayType"`
}

type ArenaRankScoreMetadata struct {
	IconURL  string `json:"iconUrl"`
	RankName string `json:"rankName"`
}

type ArenaSeason9Damage struct {
	Rank            *int64          `json:"rank"`
	Percentile      *float64        `json:"percentile"`
	DisplayName     string          `json:"displayName"`
	DisplayCategory DisplayCategory `json:"displayCategory"`
	Category        interface{}     `json:"category"`
	Metadata        MetadataClass   `json:"metadata"`
	Value           float64         `json:"value"`
	DisplayValue    string          `json:"displayValue"`
	DisplayType     DisplayType     `json:"displayType"`
}

type UserInfo struct {
	UserID          interface{}   `json:"userId"`
	IsPremium       bool          `json:"isPremium"`
	IsVerified      bool          `json:"isVerified"`
	IsInfluencer    bool          `json:"isInfluencer"`
	IsPartner       bool          `json:"isPartner"`
	CountryCode     interface{}   `json:"countryCode"`
	CustomAvatarURL interface{}   `json:"customAvatarUrl"`
	CustomHeroURL   interface{}   `json:"customHeroUrl"`
	SocialAccounts  []interface{} `json:"socialAccounts"`
	Pageviews       int64         `json:"pageviews"`
	IsSuspicious    interface{}   `json:"isSuspicious"`
}

type Type string

const (
	Legend   Type = "legend"
	Overview Type = "overview"
)

type DisplayCategory string

const (
	Combat  DisplayCategory = "Combat"
	Game    DisplayCategory = "Game"
	Weapons DisplayCategory = "Weapons"
)

type DisplayType string

const (
	Unspecified DisplayType = "Unspecified"
)
