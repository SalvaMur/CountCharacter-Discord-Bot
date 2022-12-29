const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection, Events } = 
    require('discord.js')
;
const { token } = require('./config.json');
require('./commands/ping');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles =  
    fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
;

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    }
    else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// Bot login recognition
client.on('ready', () => {
    console.log(`${client.user.tag} has logged in.`);
});

// Slash command execution and handling
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) {
        return;
    }

    const command = 
        interaction.client.commands.get(interaction.commandName)
    ;

    await command.execute(interaction);

    console.log(interaction);
});

// Record messages to records.json
client.on('messageCreate', (message) => {
    if (message.author.bot) {
        return;
    }

    
});

client.login(token) // Bot logs in