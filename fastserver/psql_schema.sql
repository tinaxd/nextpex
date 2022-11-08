CREATE TABLE IF NOT EXISTS "user"(username VARCHAR(64) PRIMARY KEY);
CREATE TABLE IF NOT EXISTS ingamename(
    ingamename VARCHAR(64) PRIMARY KEY,
    username VARCHAR(64) REFERENCES "user"(username) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS game(
    gamename VARCHAR(128) PRIMARY KEY,
    is_checked BOOLEAN NOT NULL DEFAULT TRUE,
    emoji_name VARCHAR(32) NULL DEFAULT NULL
);
CREATE TABLE IF NOT EXISTS levelupdate(
    id SERIAL PRIMARY KEY,
    username VARCHAR(64) NOT NULL REFERENCES "user"(username) ON DELETE CASCADE ON UPDATE CASCADE,
    oldlevel INTEGER,
    newlevel INTEGER NOT NULL,
    timeat TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE TABLE IF NOT EXISTS rankupdate(
    id SERIAL PRIMARY KEY,
    username VARCHAR(64) NOT NULL REFERENCES "user"(username) ON DELETE CASCADE ON UPDATE CASCADE,
    oldrank INTEGER,
    oldrankname VARCHAR(32),
    newrank INTEGER NOT NULL,
    newrankname VARCHAR(32) NOT NULL,
    ranktype VARCHAR(16) NOT NULL,
    timeat TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE TABLE IF NOT EXISTS playingtime(
    id SERIAL PRIMARY KEY,
    username VARCHAR(64) NOT NULL REFERENCES "user"(username) ON DELETE CASCADE ON UPDATE CASCADE,
    gamename VARCHAR(128) REFERENCES game(gamename) ON DELETE
    SET NULL ON UPDATE CASCADE,
        startedat TIMESTAMP WITH TIME ZONE NOT NULL,
        endedat TIMESTAMP WITH TIME ZONE NULL
);
CREATE VIEW monthlycheck AS
select username,
    gamename,
    SUM(endedat - startedat) as playtime,
    extract (
        month
        from startedat
    ) as month,
    extract (
        year
        from startedat
    ) as year
from playingtime
where endedat is not null
group by username,
    gamename,
    month,
    year;
create table if not exists minecraft_players (playername varchar(64) NOT NULL primary key);
CREATE TABLE IF NOT EXISTS bot_guild (
    guild_id VARCHAR(64) NOT NULL PRIMARY KEY,
    self_check_msg_id VARCHAR(64) NULL DEFAULT NULL
);
CREATE TABLE IF NOT EXISTS user_data (
    uid TEXT PRIMARY KEY,
    platform TEXT,
    level INTEGER,
    trio_rank INTEGER,
    arena_rank INTEGER,
    last_update INTEGER
);
CREATE TABLE IF NOT EXISTS bot_activity (
    user_id VARCHAR(64) NOT NULL PRIMARY KEY,
    activity varchar(128) NOT NULL
);
