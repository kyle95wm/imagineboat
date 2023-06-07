const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('learn about ImagineBoat'),
	async execute(interaction) {
		return interaction.reply('Hi im ImagineBoat. I reply to any message that has Imagine at the start (but not alone)\nIm whitelisted on the jt-99 network so all the connected servers can see my responces\nLearn about jt-99 with </about:947886250650640396> ');
	},
}