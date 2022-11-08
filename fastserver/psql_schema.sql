CREATE TABLE IF NOT EXISTS "user"(username VARCHAR(64) PRIMARY KEY);
CREATE TABLE IF NOT EXISTS ingamename(
    ingamename VARCHAR(64) PRIMARY KEY,
    username VARCHAR(64) REFERENCES "user"(username) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS game(
    gamename VARCHAR(128) PRIMARY KEY,
    is_checked BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE IF NOT EXISTS levelupdate(
    id SERIAL PRIMARY KEY,
    username VARCHAR(64) NOT NULL REFERENCES "user"(username) ON DELETE CASCADE ON UPDATE CASCADE,
    oldlevel INTEGER,
    newlevel INTEGER NOT NULL,
    timeat TIMESTAMP NOT NULL
);
CREATE TABLE IF NOT EXISTS rankupdate(
    id SERIAL PRIMARY KEY,
    username VARCHAR(64) NOT NULL REFERENCES "user"(username) ON DELETE CASCADE ON UPDATE CASCADE,
    oldrank INTEGER,
    oldrankname VARCHAR(32),
    newrank INTEGER NOT NULL,
    newrankname VARCHAR(32) NOT NULL,
    ranktype VARCHAR(16) NOT NULL,
    timeat TIMESTAMP NOT NULL
);
CREATE TABLE IF NOT EXISTS playingtime(
    id SERIAL PRIMARY KEY,
    username VARCHAR(64) NOT NULL REFERENCES "user"(username) ON DELETE CASCADE ON UPDATE CASCADE,
    gamename VARCHAR(128) REFERENCES game(gamename) ON DELETE
    SET NULL ON UPDATE CASCADE,
        startedat TIMESTAMP NOT NULL,
        endedat TIMESTAMP NULL
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
    guildid INTEGER NOT NULL PRIMARY KEY,
    minecraft_channel INTEGER NULL
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
    userid INTEGER NOT NULL PRIMARY KEY,
    activity varchar(128) NOT NULL
);