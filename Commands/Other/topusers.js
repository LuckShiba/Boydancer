// Typedef
/**
 * @typedef {import('../../handlers/Client')} PH
 * @typedef {import("discord.js").CommandInteraction} CommandInteraction 
 */

const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "topusers",
    description: `See the top 5 Boydancers`,
    userPermissions: ["SEND_MESSAGES"],
    botPermissions: ["EMBED_LINKS"],
    category: "Information",
    type: "CHAT_INPUT",
    cooldown: 30,

    /** 
    * @param {PH} client
    * @param {CommandInteraction} interaction
    */
    run: async (client, interaction) => {

        let guildUsers = await client.usage.get(`${interaction.guildId}`)

        let amount = Object.keys(guildUsers).length
        let value = Object.values(guildUsers);

        let allUsers = [];
        for (let i = 0; i < amount; i++) {
            let user = value[i];
            allUsers.push({
                id: user.userId,
                name: user.username,
                used: user.all,
                successes: user.successful ? user.successful : 0,
            });
        }

        allUsers.sort((a, b) => b.used - a.used);
        const topUsers = allUsers.slice(0, 5);
        const messageAuthor = allUsers.find(user => user.id === interaction.user.id);

        const description = topUsers.map((user, index) => {
            if (interaction.user.id === user.id) {
                return `**\` ${index + 1}. \` ${user.name}: Used: ${user.used}, Successes: ${user.successes}**`;
            } else {
                return `\` ${index + 1}. \` ${user.name}: Used: ${user.used}, Successes: ${user.successes}`;
            }
        }).join('\n');

        const lb = new EmbedBuilder()
            .setTitle(`Top 5 boydancers!!`)
            .setColor('#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padEnd(6, '0'))
            .setDescription(description);
        if (messageAuthor && !topUsers.some(user => user.id === interaction.user.id)) {
            lb.setDescription(description + '\n' + `**\` ${allUsers.findIndex(user => user.id === interaction.user.id) + 1}. \` ${interaction.user.username} Used: ${messageAuthor.used}, Successes: ${messageAuthor.successes}**`);
        }
        interaction.followUp({
            embeds: [lb],
        });
    },
};
