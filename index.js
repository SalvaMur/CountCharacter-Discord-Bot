const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection, Events } = 
    require('discord.js')
;
const { token } = require('./config.json');

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

    await command.execute(interaction); // Execute command
    console.log(interaction); // Log command
});

// Record guilds the bot joins to sort user messages by guild
client.on('guildCreate', (guild) => {
    // Parse records.json into recordsObj
    const recordsObj = JSON.parse(fs.readFileSync('./records.json').toString());

    if (!(guild.id in recordsObj.guilds)) {
        var entry = {
            guildName: guild.name,
            users: {}
        }

        recordsObj.guilds[guild.id] = entry;
        fs.writeFileSync('./records.json', JSON.stringify(recordsObj, null, 4));
    }
});

// Record messages to records.json
client.on('messageCreate', (message) => {
    if (message.author.bot) {
        return;
    }

    // Parse records.json into recordsObj
    const recordsObj = JSON.parse(fs.readFileSync('./records.json').toString());
    
    // Get name of guild where message was posted in
    const guild = message.guild.id;

    // Create user's entry
    const user = message.author.id;
    var entry = {
        username: '',
        messages: [],
        numOfTotalMessages: 0,
        numOfTotalCharacters: 0
    }

    // Create entry to be inserted
    if (!(user in recordsObj.guilds[guild].users)) { // First message recorded for user in guild
        console.log(`[NOTE] User \'${user}\' not in records, inserting new entry`);

        entry.username = message.author.username;
        entry.messages.push(message.content);
        entry.numOfTotalMessages = 1;
        entry.numOfTotalCharacters = message.content.trim().replace(/\s+/g, '').length;

        console.log(JSON.stringify(entry, null, 4));
    }
    else { // User already in records.json
        console.log(`[NOTE] User \'${user}\' exists in records, updating information`);

        entry = recordsObj.guilds[guild].users[user];
        entry.messages.push(message.content);
        entry.numOfTotalMessages++;
        entry.numOfTotalCharacters += message.content.trim().replace(/\s+/g, '').length;

        console.log(JSON.stringify(entry, null, 4));
    }

    recordsObj.guilds[guild].users[user] = entry; // Create or Update users entry
    fs.writeFileSync('./records.json', JSON.stringify(recordsObj, null, 4));
});

client.login(token) // Bot logs in