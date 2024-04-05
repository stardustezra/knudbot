const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remindme")
    .setDescription("Set a reminder.")
    .addStringOption((option) =>
      option
        .setName("reminder")
        .setDescription("What do you want to be reminded of?")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("datetime")
        .setDescription(
          "When do you want to be reminded? (e.g., DD-MM-YYYY HH:MM)"
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    const reminder = interaction.options.getString("reminder");
    const datetimeString = interaction.options.getString("datetime");

    const dateTimeParts = datetimeString.split(" ");
    if (dateTimeParts.length !== 2) {
      await interaction.reply(
        "Invalid date and time format. Please use 'DD-MM-YYYY HH:MM'."
      );
      return;
    }

    const [dateString, timeString] = dateTimeParts;
    const [day, month, year] = dateString.split("-").map(Number);
    const [hour, minute] = timeString.split(":").map(Number);

    const date = new Date(year, month - 1, day, hour, minute);
    if (isNaN(date.getTime())) {
      await interaction.reply("Invalid date or time.");
      return;
    }

    const currentTime = new Date();
    if (date <= currentTime) {
      await interaction.reply("Please provide a future date and time.");
      return;
    }

    const reminderTime = date.getTime() - currentTime.getTime();

    await interaction.reply({
      content: `I will remind you about "${reminder}" on ${dateString} at ${timeString}.`,
      ephemeral: true,
    });

    setTimeout(async () => {
      const reminderMessage = `Reminder: "${reminder}"`;
      const reminderButton = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("reminder_button")
          .setLabel("Dismiss")
          .setStyle("DANGER")
      );

      await interaction.user
        .send({ content: reminderMessage, components: [reminderButton] })
        .catch(console.error);
    }, reminderTime);
  },
};
