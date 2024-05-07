import { REST } from "discord.js";
import { Routes } from "discord-api-types/v9";
import fs from "fs";
import path from "path";
import { SlashCommand } from "./types";

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

// Define an array to store commands data
const commands: SlashCommand[] = [];

// Grab all the command folders from the commands directory
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

// Iterate through each command folder
for (const folder of commandFolders) {
  // Grab all the command files from the commands directory
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js")); // Filter JS files

  // Iterate through each command file
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath).default;

    // Check for required properties and push command data to the commands array
    if ("command" in command && "execute" in command) {
      commands.push(command.command.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "9" }).setToken(
  process.env.DISCORD_BOT_TOKEN || ""
);

// Deploy commands
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = (await rest.put(
      Routes.applicationGuildCommands(
        process.env.DISCORD_CLIENT_ID || "",
        process.env.DISCORD_GUILD_ID || ""
      ),
      { body: commands }
    )) as any[];

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
})();
