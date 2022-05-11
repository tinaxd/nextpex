package models

func GetTrioTierBadge(env *Environments, rank int) string {
	var badge string
	switch {
	case rank < 1200:
		badge = env.BRONZE_BADGE
	case rank < 2800:
		badge = env.SILVER_BADGE
	case rank < 4800:
		badge = env.GOLD_BADGE
	case rank < 7200:
		badge = env.PLATINUM_BADGE
	default:
		badge = env.DIAMOND_BADGE
	}

	return badge
}

func GetArenaTierBadge(env *Environments, rank int) string {
	var badge string
	switch {
	case rank < 1600:
		badge = env.BRONZE_BADGE
	case rank < 3200:
		badge = env.SILVER_BADGE
	case rank < 4800:
		badge = env.GOLD_BADGE
	case rank < 6400:
		badge = env.PLATINUM_BADGE
	default:
		badge = env.DIAMOND_BADGE
	}

	return badge
}
