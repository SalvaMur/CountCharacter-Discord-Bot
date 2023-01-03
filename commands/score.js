const { SlashCommandBuilder } = require('discord.js');
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
            const guild = interaction.guildId;
            console.log(guild);

            var first, second, third;
            var fScore = 0; var sScore = 0; var tScore = 0;
            for (const user in recordsObj.guilds[guild].users) {
                const users = recordsObj.guilds[guild].users;

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
            else {
                first = recordsObj.guilds[guild].users[first].username;
            }

            if (second == null) {
                second = 'NOBODY';
            }
            else {
                second = recordsObj.guilds[guild].users[second].username;
            }

            if (third == null) {
                third = 'NOBODY';
            }
            else {
                third = recordsObj.guilds[guild].users[third].username;
            }

            await interaction.editReply(
                `:first_place: \'${first}\', Score: ${fScore}\n\n`
                +`:second_place: \'${second}\', Score: ${sScore}\n\n`
                +`:third_place: \'${third}\', Score: ${tScore}`
            );
        }
}