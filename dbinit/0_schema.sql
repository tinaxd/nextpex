CREATE TABLE IF NOT EXISTS "user"(username VARCHAR(64) PRIMARY KEY);
CREATE TABLE IF NOT EXISTS ingamename(
    ingamename VARCHAR(64) PRIMARY KEY,
    username VARCHAR(64) REFERENCES "user"(username) ON DELETE CASCADE
);
CREATE TABLE game (
    gamename varchar(128) NOT NULL,
    is_checked bool NOT NULL DEFAULT true,
    CONSTRAINT game_pkey PRIMARY KEY (gamename)
);
CREATE TABLE IF NOT EXISTS levelupdate(
    username VARCHAR(64) NOT NULL REFERENCES "user"(username) ON DELETE CASCADE,
    oldlevel INTEGER,
    newlevel INTEGER NOT NULL,
    timeat TIMESTAMP NOT NULL
);
CREATE TABLE IF NOT EXISTS rankupdate(
    username VARCHAR(64) NOT NULL REFERENCES "user"(username) ON DELETE CASCADE,
    oldrank INTEGER,
    oldrankname VARCHAR(32),
    newrank INTEGER NOT NULL,
    newrankname VARCHAR(32) NOT NULL,
    ranktype VARCHAR(16) NOT NULL,
    timeat TIMESTAMP NOT NULL
);
CREATE TABLE IF NOT EXISTS playingtime(
    username VARCHAR(64) NOT NULL REFERENCES "user"(username) ON DELETE CASCADE,
    gamename VARCHAR(128) REFERENCES game(gamename) ON DELETE
    SET NULL,
        startedat TIMESTAMP NOT NULL,
        endedat TIMESTAMP NOT NULL
);
CREATE TABLE IF NOT EXISTS playingnow(
    username VARCHAR(64) NOT NULL PRIMARY KEY REFERENCES "user"(username) ON DELETE CASCADE,
    gamename VARCHAR(128) NOT NULL REFERENCES game(gamename) ON DELETE CASCADE,
    startedat TIMESTAMP NOT NULL
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
group by username,
    gamename,
    month,
    year;
create table if not exists minecraft_players (playername VARCHAR(64) primary key);
CREATE TABLE bot_guild (
    guildid int8 NOT NULL,
    minecraft_channel int8 NULL,
    CONSTRAINT bot_guild_pkey PRIMARY KEY (guildid)
);
CREATE TABLE user_data (
    uid TEXT PRIMARY KEY,
    platform TEXT,
    level INTEGER,
    trio_rank INTEGER,
    arena_rank INTEGER,
    last_update INTEGER
);