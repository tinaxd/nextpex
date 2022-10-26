import discord
import sys
import os
import logging

logging.basicConfig(level=logging.DEBUG)

intents = discord.Intents.default()
intents.presences = True
intents.members = True

token = os.getenv("DISCORD_TOKEN")
if not token:
    logging.warn("DISCORD_TOKEN is not set")
    sys.exit(1)

client = discord.Client(intents=intents)

@client.event
