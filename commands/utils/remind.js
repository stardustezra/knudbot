const { SlashCommandBuilder } = require("@discordjs/builders");
const { ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remindme")
    .setDescription("Set a reminder.")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("What do you want to be reminded about?")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("date")
        .setDescription("What date do you want to be reminded? (dd-mm-yyyy)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("When do you want to be reminded? (hh:mm)")
        .setRequired(true)
    ),
  async execute(interaction) {
    const dateArg = interaction.options.getString("date");
    const timeArg = interaction.options.getString("time");
    const message = interaction.options.getString("message");
    let formattedDate = dateArg.split("-");
    formattedDate =
      formattedDate[2] + "-" + formattedDate[1] + "-" + formattedDate[0];
    const dateTime = `${formattedDate}T${timeArg}`;

    const date = new Date(dateTime);
    if (isNaN(date.getTime())) {
      await interaction.reply("Invalid date or time.");
      return;
    }

    const currentTime = new Date();
    if (date <= currentTime) {
      await interaction.reply("Please provide a future date and time.");
      return;
    }
    console.log(date.getDate(), date.getMonth(), date.getFullYear());
    const reminderTime = date.getTime() - currentTime.getTime();

    await interaction.reply({
      content: `I will remind you about "${message}" on ${dateArg} at ${timeArg}.`,
      ephemeral: true,
    });
    setTimeout(async () => {
      const reminderMessage = `Reminder: @everyone "${message}"`;

      await interaction.channel
        .send({ content: reminderMessage })
        .catch(console.error);
    }, reminderTime);
  },
};
