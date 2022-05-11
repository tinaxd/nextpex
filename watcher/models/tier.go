package models

const (
	TrioBronze    = 1200
	TrioSilver    = 2800
	TrioGold      = 4800
	TrioPlatinum  = 7200
	TrioDiamond   = 10000
	ArenaBronze   = 1600
	ArenaSilver   = 3200
	ArenaGold     = 4800
	ArenaPlatinum = 6400
	ArenaDiamond  = 8000
)

func getUpperLimit(tier, types string) int {
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
	return limit
}

func GetRankName(rank int, types string) string {
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

func GetTierBadge(env *Environments, rank int, types string) string {
	var badge string
	switch {
	case rank < getUpperLimit("bronze", types):
		badge = env.BRONZE_BADGE
	case rank < getUpperLimit("silver", types):
		badge = env.SILVER_BADGE
	case rank < getUpperLimit("gold", types):
		badge = env.GOLD_BADGE
	case rank < getUpperLimit("platinum", types):
		badge = env.PLATINUM_BADGE
	default:
		badge = env.DIAMOND_BADGE
	}

	return badge
}
