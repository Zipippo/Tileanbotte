const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
require('dotenv').config();

const token = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

const commands = [
    new SlashCommandBuilder()
        .setName('vendetta')
        .setDescription('Tira un d100 per assegnarti una città')
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        console.log('Inizio aggiornamento dei comandi (/) dell\'applicazione.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands }
        );

        console.log('Comandi (/) dell\'applicazione aggiornati con successo.');
    } catch (error) {
        console.error(error);
    }
})();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

const citta = [
    { min: 1, max: 12, nome: 'Luccini' },
    { min: 13, max: 25, nome: 'Verezzo' },
    { min: 26, max: 38, nome: 'Remas' },
    { min: 39, max: 51, nome: 'Miragliano' },
    { min: 52, max: 64, nome: 'Tobaro' },
    { min: 65, max: 77, nome: 'Pavona' },
    { min: 78, max: 89, nome: 'Trantio' },
    { min: 90, max: 100, nome: 'Sartosa' }
];

client.once('ready', () => {
    console.log(`Connesso come ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        if (interaction.commandName === 'vendetta') {
            let tabella = 'Tabella delle Città:\n';
            citta.forEach(c => {
                tabella += `${c.min}-${c.max}: ${c.nome}\n`;
            });

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('lancia_dado')
                        .setLabel('Lancia il dado')
                        .setStyle(ButtonStyle.Primary),
                );

            await interaction.reply({ content: tabella, components: [row] });
        }
    } else if (interaction.isButton()) {
        if (interaction.customId === 'lancia_dado') {
            const tiro = Math.floor(Math.random() * 100) + 1;
            const cittaAssegnata = citta.find(c => tiro >= c.min && tiro <= c.max).nome;
            await interaction.update(`Hai tirato un ${tiro}! La tua città assegnata è ${cittaAssegnata}.`);
        }
    }
});

client.login(token);
