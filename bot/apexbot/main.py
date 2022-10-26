from optparse import Option
import discord  # type: ignore
import os
import sys
from typing import Dict, cast, Optional, Tuple, Union
import logging
from datetime import datetime
import datetime as dt
import requests
import json
from . import db
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

logging.basicConfig(level=logging.DEBUG)

try:
    TOKEN = os.environ["DISCORD_TOKEN"]
except KeyError:
    print("Please set DISCORD_TOKEN")
    sys.exit(1)
if not TOKEN:
    print("Please set DISCORD_TOKEN")
    sys.exit(1)

try:
    WEB_API = os.environ["WEB_API"]
except KeyError:
    print("Please set WEB_API")
    sys.exit(1)
if not WEB_API:
    print("Please set WEB_API")
    sys.exit(1)

engine = create_engine("sqlite:///data/db.sqlite3", echo=True, future=True)
db.create_tables(engine)

intents = discord.Intents.default()
intents.members = True
intents.presences = True
intents.reactions = True
client = discord.Client(intents=intents)


def _find_channel(
    guild: discord.Guild, chan_name: str
) -> Optional[discord.TextChannel]:
    for chan in guild.channels:
        if not isinstance(chan, discord.TextChannel):
            continue
        if chan.name == chan_name:
            return chan
    logging.info(f"could not find #{chan_name} in {guild.name}")
    return None


NOTIFYCHAN = "apexability-check"


def _find_role(guild: discord.Guild, rolename: str) -> Optional[discord.Role]:
    roles = guild.roles
    for role in roles:
        if role.name == rolename:
            return role
    return None


async def _change_role(member: discord.Member, rolename: str, on: bool) -> None:
    role = _find_role(member.guild, rolename)
    if not role:
        return
    if on:
        await member.add_roles(role)
    else:
        await member.remove_roles(role)


def _oneapex_apexability(
    name: str, is_start: bool, game_name: str, time: datetime
) -> None:
    result = requests.post(
        WEB_API + "/check",
        json={
            "in_game_name": name,
            "type": "start" if is_start else "stop",
            # in unix time
            "time": int(time.timestamp()),
            "game_name": game_name,
        },
    )
    if result.status_code != 200:
        logging.warning(f"api returned non 200 status code!: {result.content!s}")


async def _send_game_notification(
    member: discord.Member, game: str, is_start: bool
) -> None:
    guild = member.guild
    chan = _find_channel(guild, NOTIFYCHAN)
    if chan:
        if is_start:
            tail = "を始めました！"
        else:
            tail = "をやめました！"
        content = f"{member.display_name} が {game} {tail}"
        await chan.send(content=content)

        with Session(engine) as sess:
            gamerole = sess.get(db.GameRole, game)
            if gamerole:
                await _change_role(member, gamerole.rolename, is_start)

        _oneapex_apexability(
            member.display_name,
            is_start,
            game,
            datetime.now(tz=dt.timezone(dt.timedelta())),
        )


ActType = Union[discord.BaseActivity, discord.Spotify]


def is_watched_game(gamename: str) -> bool:
    with Session(engine) as sess:
        checked = sess.get(db.CheckedGame, gamename)
        return checked is not None


SELFAPEXCHAN = "self-apexability"

# mapping from GuildId to the id of the message for whose reaction ApexBot should watch for Apexability detection.
watched_msg: Dict[int, int] = {}


async def send_apexability_msg(guild: discord.Guild) -> None:
    chan = _find_channel(guild, SELFAPEXCHAN)
    if not chan:
        return
    content = "Apex Legends を始めたら :apex: リアクションをつけてください。やめたらリアクションを外してください。過去のメッセージにリアクションをつけても反応しません。Discord のステータスメッセージを公開している人はリアクションをつける必要はありません。"
    # find :apex: emoji
    apex_emoji = None
    for emoji in guild.emojis:
        if emoji.name == "apex":
            apex_emoji = emoji
            break
    else:
        # :apex: emoji not found
        logging.info(f":apex: emoji not found in {guild.name}")
        return
    msg = await chan.send(content=content)
    watched_msg[guild.id] = msg.id
    await msg.add_reaction(apex_emoji)


def apex_started(oldActs: Tuple[ActType], newActs: Tuple[ActType]) -> Optional[str]:
    # APEX はプレイしていなかったことを確認
    for act in oldActs:
        if isinstance(act, discord.Spotify):
            continue
        if act.type == discord.ActivityType.playing and is_watched_game(act.name):
            return None

    # 今 APEX をプレイしていることを確認
    for act in newActs:
        if isinstance(act, discord.Spotify):
            continue
        if act.type == discord.ActivityType.playing and is_watched_game(act.name):
            return act.name
    return None


def apex_stopped(oldActs: Tuple[ActType], newActs: Tuple[ActType]) -> Optional[str]:
    # game をプレイしていたことを確認
    gamed = False
    game_name: str = ""
    for act in oldActs:
        if isinstance(act, discord.Spotify):
            continue
        if act.type == discord.ActivityType.playing and is_watched_game(act.name):
            gamed = True
            game_name = act.name
            break
    if not gamed:
        return None

    # 今 APEX をプレイしていないことを確認
    for act in newActs:
        if isinstance(act, discord.Spotify):
            continue
        if act.type == discord.ActivityType.playing and is_watched_game(act.name):
            return None
    return game_name


@client.event
async def on_presence_update(before: discord.Member, after: discord.Member) -> None:
    logging.debug(f"member update ${str(before)} ${after}")

    started = apex_started(before.activities, after.activities)
    stopped = apex_stopped(before.activities, after.activities)
    if started is None and stopped is None:
        logging.debug("not related to apex")
        return

    game_name: str = ""
    if started:
        game_name = started
    else:
        game_name = cast(str, stopped)

    is_start = started is not None
    await _send_game_notification(after, game_name, is_start)


@client.event
async def on_ready():
    for guild in client.guilds:
        await send_apexability_msg(guild)


async def reaction_handler(payload: discord.RawReactionActionEvent):
    guild_id = payload.guild_id
    msg_id = payload.message_id
    if guild_id not in watched_msg:
        # unknown guild
        return
    if msg_id != watched_msg[guild_id]:
        # unknown message
        return

    guild: Optional[discord.Guild] = client.get_guild(guild_id)
    if not guild:
        return
    member: Optional[discord.Member] = guild.get_member(payload.user_id)
    if not member:
        return
    if client.user and member.id == client.user.id:
        # member is APEXBOT itself
        return

    APEXGAME = "Apex Legends"
    if payload.event_type == "REACTION_ADD":
        await _send_game_notification(member, APEXGAME, True)
    elif payload.event_type == "REACTION_REMOVE":
        await _send_game_notification(member, APEXGAME, False)


@client.event
async def on_raw_reaction_add(payload):
    await reaction_handler(payload)


@client.event
async def on_raw_reaction_remove(payload):
    await reaction_handler(payload)


client.run(TOKEN)
