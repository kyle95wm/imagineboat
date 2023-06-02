const client = new Client({
    intents: [
        // Intents specify what the bot listens to from
        // You can find more information about intents here:
        // https://discordjs.guide/popular-topics/intents.html
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

const cooldowns = new Collection()
const cooldownTime = 3000 // 3 seconds cooldown

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on("messageCreate", (message) => {
    if(message.author.id === client.user.id) return // Ignore messages from other bots but work with jt99

    const content = message.content.toLowerCase()
    console.log(content)

    if (content.startsWith("imagine ") || content.startsWith("$$ imagine ") || content.startsWith("$$imagine ")) {
        const userId = message.author.id

        if (!cooldowns.has(userId)) {
            // If the user is not on cooldown, proceed
            cooldowns.set(userId, Date.now())

            const prefix = (content.startsWith("$$ imagine ") || content.startsWith("$$imagine ")) ? "$$ " : "";
            const response = `${prefix}I can't even imagine ${content.substring(content.indexOf("imagine") + 8)}, bro.`;

            //const response = `I can't even imagine ${content.substring(content.indexOf("imagine") + 8)}, bro.`
            message.channel.send(response)

            setTimeout(() => {
                // Remove the user from cooldown after the specified cooldownTime
                cooldowns.delete(userId)
            }, cooldownTime)
        } else {
            // User is on cooldown
            message.channel.send("Hold on, bro. I need some time to recover!")
        }
    }
})

// Replace 'YOUR_TOKEN' with your Discord bot token
client.login("YOUR_TOKEN")
