require('dotenv').config()
const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection, ActivityType, Events } = require("discord.js")

const client = new Client({
    allowedMentions: { parse: [] },
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
    client.user.setActivity('people imagine', { type: ActivityType.Watching });
})
 
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});
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

