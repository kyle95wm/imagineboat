require('dotenv').config()
const { Client, GatewayIntentBits, Collection, ActivityType, MessageMentions } = require("discord.js")

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

client.on("messageCreate", async (message) => {
    if(message.author.id === client.user.id) return
    const content = message.content
    const lowercaseContent = content.toLowerCase()
    console.log(lowercaseContent)
    if (lowercaseContent.startsWith("imagine ") || lowercaseContent.startsWith("$$ imagine ") || lowercaseContent.startsWith("$$imagine ")) {
        const userId = message.author.id
        const prefix = (lowercaseContent.startsWith("$$ imagine ") || lowercaseContent.startsWith("$$imagine ")) ? "$$ " : "";
        let responseContent = lowercaseContent.substring(lowercaseContent.indexOf("imagine") + 8);
        if (responseContent.endsWith('.')) {
            responseContent = responseContent.slice(0, -1);
        }
        const response = `${prefix}I can't even imagine ${responseContent}, bro.`;
        message.channel.send(response)
    } else if (message.mentions.has(client.user) && message.author.id === process.env.OWNER) {
        const command = content.split(" ")[1];
        if (command.toLowerCase() === 'eval' && content.split(" ").length > 2) {
            try {
                const evalCommand = content.split(" ").slice(2).join(" ");
                let result = await eval(evalCommand);
                if (typeof result !== "string") result = require("util").inspect(result);
                message.channel.send(result);
            } catch (error) {
                message.channel.send(`\`ERROR\` \`\`\`xl\n${error}\n\`\`\``);
            }
        }
    }
})

client.login(process.env.BOT_TOKEN)
