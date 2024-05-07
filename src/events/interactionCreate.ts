import { Interaction } from "discord.js";
import { BotEvent, SlashCommand } from "../types";

const event: BotEvent = {
  name: "interactionCreate",
  async execute(interaction: Interaction) {
    // Check if the interaction is a chat input command
    if (!interaction.isCommand()) return;

    // Retrieve the command associated with the interaction
    const commandName = interaction.commandName;

    const command: SlashCommand | undefined =
      interaction.client.commands.get(commandName);

    if (!command) {
      console.error(`No command matching ${commandName} was found.`);
      return;
    }

    try {
      // Execute the command associated with the interaction
      await command.execute(interaction as any);
    } catch (error) {
      console.error(error);

      // Respond to the interaction with an error message
      const errorMessage = "There was an error while executing this command!";
      if (interaction.replied || interaction.deferred) {
        // If already replied or deferred, use follow-up
        await interaction.followUp({
          content: errorMessage,
          ephemeral: true,
        });
      } else {
        // If not yet replied or deferred, use initial reply
        await interaction.reply({
          content: errorMessage,
          ephemeral: true,
        });
      }
    }
  },
};

export default event;
