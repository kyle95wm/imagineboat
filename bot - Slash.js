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
	/* if (content.startsWith("imagine pinging") || content.startsWith("$$ imagine pinging") || content.startsWith("$$imagine pinging")) {
        const userId = message.author.id
        const prefix = (content.startsWith("$$ imagine ") || content.startsWith("$$imagine ")) ? "$$ " : "";
        const response = `${prefix}I can't even imagine ${content.substring(content.indexOf("imagine") + 8)}, bro. 🏓 ${Date.now() - message.createdTimestamp}ms`;
        message.channel.send(response)
    } */
})


client.login(process.env.BOT_TOKEN)

