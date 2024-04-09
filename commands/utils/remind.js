const { SlashCommandBuilder } = require("@discordjs/builders"); // Importing SlashCommandBuilder from discordjs builders

module.exports = {
  // Slash command data
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
  // Execute function for the reminder command
  async execute(interaction) {
    const dateArg = interaction.options.getString("date");
    const timeArg = interaction.options.getString("time");
    const message = interaction.options.getString("message");

    // Formatting date to YYYY-MM-DD format
    let formattedDate = dateArg.split("-");
    formattedDate =
      formattedDate[2] + "-" + formattedDate[1] + "-" + formattedDate[0];
    const dateTime = `${formattedDate}T${timeArg}`;

    const date = new Date(dateTime); // Creating a Date object
    // Checking if date is valid
    if (isNaN(date.getTime())) {
      await interaction.reply("Invalid date or time.");
      return;
    }

    const currentTime = new Date(); // Getting current time
    // Checking if provided date is in the future
    if (date <= currentTime) {
      await interaction.reply("Please provide a future date and time.");
      return;
    }

    // Calculating time difference between reminder time and current time
    const reminderTime = date.getTime() - currentTime.getTime();

    // Sending an initial response to user about the reminder
    await interaction.reply({
      content: `I will remind you about "${message}" on ${dateArg} at ${timeArg}.`,
      ephemeral: true, // Only visible to the user who initiated the command
    });

    // Setting a timeout to send reminder message at the specified time
    setTimeout(async () => {
      const reminderMessage = `Reminder: @everyone ${message}`; // Constructing reminder message

      // Sending reminder message to the channel
      await interaction.channel
        .send({ content: reminderMessage })
        .catch(console.error);
    }, reminderTime); // Timeout duration
  },
};
