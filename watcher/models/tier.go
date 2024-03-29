package models

const (
	TrioBronze    = 3000
	TrioSilver    = 5400
	TrioGold      = 8200
	TrioPlatinum  = 11400
	TrioDiamond   = 15000
	ArenaBronze   = 1600
	ArenaSilver   = 3200
	ArenaGold     = 4800
	ArenaPlatinum = 6400
	ArenaDiamond  = 8000
)

func getUpperLimit(tier, types string) int32 {
	limit := 0
	switch tier {
	case "bronze":
		if types == "trio" {
			limit = TrioBronze
		} else {
			limit = ArenaBronze
		}
	case "silver":
		if types == "trio" {
			limit = TrioSilver
		} else {
			limit = ArenaSilver
		}
	case "gold":
		if types == "trio" {
			limit = TrioGold
		} else {
			limit = ArenaGold
		}
	case "platinum":
		if types == "trio" {
			limit = TrioPlatinum
		} else {
			limit = ArenaPlatinum
		}
	case "diamond":
		if types == "trio" {
			limit = TrioDiamond
		} else {
			limit = ArenaDiamond
		}
	}
	return int32(limit)
}

func GetRankName(rank int32, types string) string {
	var rankName string
	switch {
	case rank < getUpperLimit("bronze", types):
		rankName = "bronze"
	case rank < getUpperLimit("silver", types):
		rankName = "silver"
	case rank < getUpperLimit("gold", types):
		rankName = "gold"
	case rank < getUpperLimit("platinum", types):
		rankName = "platinum"
	default:
		rankName = "diamond"
	}

	return rankName
}

func GetTierBadge(env *Environments, rank int32, types string) string {
	var badge string
	switch {
	case rank < getUpperLimit("bronze", types):
		badge = env.BronzeBadge
	case rank < getUpperLimit("silver", types):
		badge = env.SilverBadge
	case rank < getUpperLimit("gold", types):
		badge = env.GoldBadge
	case rank < getUpperLimit("platinum", types):
		badge = env.PlatinumBadge
	default:
		badge = env.DiamondBadge
	}

	return badge
}
