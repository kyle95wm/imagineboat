require('dotenv').config()
const { Client, GatewayIntentBits, Collection, ActivityType } = require("discord.js")

const client = new Client({
    allowedMentions: { parse: [] },
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
    client.user.setActivity('people imagine', { type: ActivityType.Watching });
})

client.on("messageCreate", (message) => {
    if(message.author.id === client.user.id) return
    const content = message.content.toLowerCase()
    console.log(content)
    if (content.startsWith("imagine ") || content.startsWith("$$ imagine ") || content.startsWith("$$imagine ")) {
        const userId = message.author.id
        const prefix = (content.startsWith("$$ imagine ") || content.startsWith("$$imagine ")) ? "$$ " : "";
        const response = `${prefix}I can't even imagine ${content.substring(content.indexOf("imagine") + 8)}, bro.`;
        message.channel.send(response)
    }
})


client.login(process.env.BOT_TOKEN)

