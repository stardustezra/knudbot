import { SlashCommandBuilder } from "@discordjs/builders";
import { SlashCommand } from "../../types";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
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
    )
    .setName("remindme")
    .setDescription("Set a reminder."),
  async execute(interaction) {
    const dateArg = interaction.options.getString("date") || ""; // this is a hack, error handling should be added in case of null
    const timeArg = interaction.options.getString("time");
    const message = interaction.options.getString("message");

    // Formatting date to YYYY-MM-DD format
    const splitDate = dateArg.split("-");
    let formattedDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
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
      interaction.channel &&
        (await interaction.channel
          .send({ content: reminderMessage })
          .catch(console.error));
    }, reminderTime); // Timeout duration
  },
};

export default command;
