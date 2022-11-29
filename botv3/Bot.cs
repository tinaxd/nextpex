using Discord;
using Discord.WebSocket;

public class Bot
{
    private DiscordSocketClient _client;
    private DB _db;

    private static readonly string SelfApexChan = "self-apexability";
    private static readonly string CheckChan = "apexability-check";

    public async Task MainAsync()
    {
        // When working with events that have Cacheable<IMessage, ulong> parameters,
        // you must enable the message cache in your config settings if you plan to
        // use the cached message entity. 
        var _config = new DiscordSocketConfig { MessageCacheSize = 100, GatewayIntents = GatewayIntents.GuildMessages | GatewayIntents.MessageContent | GatewayIntents.GuildMembers | GatewayIntents.GuildMessageReactions | GatewayIntents.GuildPresences };
        _client = new DiscordSocketClient(_config);

        var token = Environment.GetEnvironmentVariable("DISCORD_TOKEN");
        if (token == null)
        {
            Console.WriteLine("Please specify a token in the DISCORD_TOKEN environment variable.");
            Environment.Exit(1);
        }

        await _client.LoginAsync(TokenType.Bot, Environment.GetEnvironmentVariable("DISCORD_TOKEN"));
        await _client.StartAsync();

        _client.MessageUpdated += MessageUpdated;
        _client.Ready += OnReady;

        var logger = new LoggingService(_client, null);

        await Task.Delay(-1);
    }

    private async Task MessageUpdated(Cacheable<IMessage, ulong> before, SocketMessage after, ISocketMessageChannel channel)
    {
        // If the message was not in the cache, downloading it will result in getting a copy of `after`.
        var message = await before.GetOrDownloadAsync();
        Console.WriteLine($"{message} -> {after}");
    }

    private async Task OnReady()
    {
        Console.WriteLine("Bot is connected!");
        var guilds = _client.Guilds;
        foreach (var guild in guilds)
        {
            await SendSelfCheck(guild);
        }
    }

    private async Task SendSelfCheck(IGuild guild)
    {
        var chan = await FindTextChannel(guild, SelfApexChan);
        if (chan == null)
        {
            Console.WriteLine("Could not find channel " + SelfApexChan);
            return;
        }

        var msg = await chan.SendMessageAsync("ゲームを始めたらリアクションをつけてください");
        await AttachReactionsToMsg(guild, msg);
    }

    private async Task AttachReactionsToMsg(IGuild guild, IUserMessage msg)
    {
        var emojiNames = await _db.GetEmojiNames();

        List<IEmote> emojis = new List<IEmote>();
        foreach (var emojiName in emojiNames)
        {
            var emoji = await FindEmojiByName(guild, emojiName);
            if (emoji == null)
            {
                continue;
            }
            emojis.Add(emoji);
        }

        await msg.AddReactionsAsync(emojis);
    }

    private async Task<ITextChannel?> FindTextChannel(IGuild guild, string channelName)
    {
        var channels = await guild.GetTextChannelsAsync();
        foreach (var channel in channels)
        {
            if (channel.Name == channelName)
            {
                return channel;
            }
        }
        return null;
    }

    private async Task<IEmote?> FindEmojiByName(IGuild guild, string name)
    {
        var emojis = await guild.GetEmotesAsync();
        foreach (var emoji in emojis)
        {
            if (emoji.Name == name)
            {
                return emoji;
            }
        }
        return null;
    }
}