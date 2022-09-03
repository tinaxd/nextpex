CREATE TABLE IF NOT EXISTS user(
    username TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS ingamename(
    username TEXT PRIMARY KEY REFERENCES user(username) ON DELETE CASCADE,
    ingamename TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS game(
    gamename TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS levelupdate(
    username TEXT NOT NULL REFERENCES user(username) ON DELETE CASCADE,
    oldlevel INTEGER,
    newlevel INTEGER NOT NULL,
    timeat INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS rankupdate(
    username TEXT NOT NULL REFERENCES user(username) ON DELETE CASCADE,
    oldrank INTEGER,
    oldrankname TEXT,
    newrank INTEGER NOT NULL,
    newrankname TEXT NOT NULL,
    timeat INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS playingtime(
    username TEXT NOT NULL REFERENCES user(username) ON DELETE CASCADE,
    gamename TEXT REFERENCES game(gamename) ON DELETE SET NULL,
    startedat INTEGER NOT NULL,
    endedat INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS playingnow(
    username TEXT NOT NULL PRIMARY KEY REFERENCES user(username) ON DELETE CASCADE,
    gamename TEXT NOT NULL REFERENCES game(gamename) ON DELETE CASCADE,
    startedat INTEGER NOT NULL
);
