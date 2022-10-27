<?php
try {
    $dbh = new PDO('sqlite:db.sqlite3');
} catch (Exception $e) {
    echo $e . PHP_EOL;
    die();
}

function set_user_activity(int $user_id, ?string $game_name)
{
    global $dbh;
    $stmt = $dbh->prepare("INSERT INTO discord_activity(userid,gamename) VALUES(:userid,:gamename)");
    $stmt->bindParam(":userid", $user_id);
    $stmt->bindParam(":gamename", $game_name);
    $stmt->execute();
}

function get_user_activity(int $user_id): ?string
{
    global $dbh;
    $stmt = $dbh->prepare("SELECT gamename FROM discord_activity WHERE userid=:userid");
    $stmt->bindParam(":userid", $user_id);
    $stmt->execute();

    $row = $stmt->fetch();
    if ($row === false) {
        return null;
    }
    return $row["gamename"];
}
