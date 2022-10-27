<?php

include __DIR__ . '/vendor/autoload.php';

require 'db.php';

use Discord\Discord;
use Discord\Parts\Channel\Message;
use Discord\Parts\User\Activity;
use Discord\Parts\WebSockets\PresenceUpdate;
use Discord\WebSockets\Event;
use Discord\WebSockets\Intents;

$discord_token = getenv("DISCORD_TOKEN");
if ($discord_token === false) {
    echo "DISCORD_TOKEN is not set" . PHP_EOL;
    exit(1);
}

$intents = Intents::getDefaultIntents() | Intents::GUILD_MEMBERS | Intents::GUILD_PRESENCES;

$discord = new Discord([
    'token' => $discord_token,
]);

/**
 * @param string|null $old_game
 * @param Activity[] $activities
 * @return string|null
 */
function is_game_start(string|null $old_game, array $activities) : string|null {
    if ($old_game !== null) {
        // already playing game
        return null;
    }

    foreach ($activities as $act) {
        if ($act->type === Activity::TYPE_PLAYING) {
            $game_name = $act->name;
            return $game_name;
        }
    }
    return null;
}

/**
 * @param string|null $old_game
 * @param Activity[] $activities
 * @return string|null
 */
function is_game_stop(string|null $old_game, array $activities) : string|null {
    if ($old_game === null) {
        // was not playing game
        return null;
    }

    foreach ($activities as $act) {
        if ($act->type === Activity::TYPE_PLAYING) {
            // still playing game
            return null;
        }
    }
    return $old_game;
}

/**
 * @return array{}
 */
function detect_game_event(PresenceUpdate $presence) : array{
    $presence->member
    $presence->activities
}

$discord->on('ready', function (Discord $discord) {
    echo "Bot is ready!", PHP_EOL;

    // listen for event
    $discord->on(Event::PRESENCE_UPDATE, function (PresenceUpdate $presence, Discord $discord) {
        $presence->activities
    });
});

$discord->run();
