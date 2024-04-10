const { Events } = require("discord.js");

module.exports = {
  // Event name indicating interaction creation
  name: Events.InteractionCreate,

  // Execution function for the interaction event
  async execute(interaction) {
    // Check if the interaction is a chat input command
    if (!interaction.isChatInputCommand()) return;

    // Retrieve the command associated with the interaction
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      // Execute the command associated with the interaction
      await command.execute(interaction);
    } catch (error) {
      console.error(error);

      // Respond to the interaction with an error message
      if (interaction.replied || interaction.deferred) {
        // If already replied or deferred, use follow-up
        await interaction.followUp({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      } else {
        // If not yet replied or deferred, use initial reply
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
  },
};
