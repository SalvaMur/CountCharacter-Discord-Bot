const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const fs = require('node:fs');

module.exports = {
    data: 
        new SlashCommandBuilder()
            .setName('score')
            .setDescription('Returns user rankings based on number of characters typed.')
        ,
        async execute(interaction) {
            await interaction.deferReply();
            
            const recordsObj = JSON.parse(fs.readFileSync('./records.json').toString());
            var first, second, third;
            var fScore = 0; var sScore = 0; var tScore = 0;
            for (const user in recordsObj.users) {
                const users = recordsObj.users;

                if (first == null || users[user].numOfTotalCharacters > users[first].numOfTotalCharacters) {
                    first = user;
                    fScore = users[user].numOfTotalCharacters;
                }
                else if (second == null || users[user].numOfTotalCharacters > users[second].numOfTotalCharacters) {
                    second = user;
                    sScore = users[user].numOfTotalCharacters;
                }
                else if (third == null || users[user].numOfTotalCharacters > users[third].numOfTotalCharacters) {
                    third = user;
                    tScore = users[user].numOfTotalCharacters;
                }
            }

            if (first == null) {
                first = 'NOBODY';
            }
            if (second == null) {
                second = 'NOBODY';
            }
            if (third == null) {
                third = 'NOBODY';
            }

            await interaction.editReply(
                `:first_place: \'${first}\', Score: ${fScore}\n\n`
                +`:second_place: \'${second}\', Score: ${sScore}\n\n`
                +`:third_place: \'${third}\', Score: ${tScore}`
            );
        }
}