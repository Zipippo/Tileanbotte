const { Client, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();

const token = process.env.DISCORD_BOT_TOKEN;

const commands = [
    new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll a d100 to get assigned a city')
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const cities = [
    { min: 1, max: 12, name: 'Luccini' },
    { min: 13, max: 25, name: 'Verezzo' },
    { min: 26, max: 38, name: 'Remas' },
    { min: 39, max: 51, name: 'Miragliano' },
    { min: 52, max: 64, name: 'Tobaro' },
    { min: 65, max: 77, name: 'Pavona' },
    { min: 78, max: 89, name: 'Trantio' },
    { min: 90, max: 100, name: 'Sartosa' }
];

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'roll') {
        const roll = Math.floor(Math.random() * 100) + 1;
        const city = cities.find(c => roll >= c.min && roll <= c.max).name;
        await interaction.reply(`You rolled a ${roll}! Your assigned city is ${city}.`);
    }
});

client.login(token);
