CREATE TABLE IF NOT EXISTS User(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(64) NOT NULL,
    UNIQUE (username)
);

CREATE TABLE IF NOT EXISTS InGameName(
    user_id INTEGER NOT NULL REFERENCES User(id) ON DELETE CASCADE,
    game_name VARCHAR(64) NOT NULL
);

CREATE TABLE IF NOT EXISTS Game(
    name VARCHAR(100) NOT NULL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS LevelUpdate(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER NOT NULL REFERENCES User(id) ON DELETE CASCADE,
    old_level INTEGER,
    new_level INTEGER NOT NULL,
    timeat DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS RankUpdate(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER NOT NULL REFERENCES User(id) ON DELETE CASCADE,
    old_rank INTEGER,
    old_rank_name VARCHAR(20),
    new_rank INTEGER NOT NULL,
    new_rank_name VARCHAR(20) NOT NULL,
    timeat DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS PlayingTime(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER NOT NULL REFERENCES User(id) ON DELETE CASCADE,
    game_name VARCHAR(64) REFERENCES Game(name) ON DELETE SET NULL,
    started_at DATETIME NOT NULL,
    ended_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS PendingPlay(
    user_id INTEGER NOT NULL REFERENCES User(id) ON DELETE CASCADE,
    game_name VARCHAR(64) NOT NULL REFERENCES Game(name) ON DELETE CASCADE,
    started_at DATETIME NOT NULL,
    UNIQUE (user_id)
);

CREATE  OR REPLACE VIEW MonthlyCheck AS
SELECT u.username, s.year, s.month, s.game_name,s.play_time
FROM
(SELECT 
    pt.user_id,
    pt.game_name,
    SUM(pt.ended_at - pt.started_at) AS play_time,
    MONTH(pt.started_at) AS month,
    YEAR(pt.started_at) AS year
FROM
    PlayingTime pt
GROUP BY
	pt.user_id, month, year, pt.game_name
) AS s
INNER JOIN User u ON s.user_id=u.id;
