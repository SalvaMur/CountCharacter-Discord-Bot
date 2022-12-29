const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: 
        new SlashCommandBuilder()
            .setName('ping')
            .setDescription('Put desc here')
        ,
        async execute(interaction) {
            await interaction.reply('Pong!');
        },
}