import { REST } from "discord.js";
import { Routes } from "discord-api-types/v9";
import { BOTTOKEN, GUILDTOKEN, CLIENTTOKEN } from "./env";
import fs from "fs";
import path from "path";
import { SlashCommand } from "./types";

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
    const command = require(filePath);

    // Check for required properties and push command data to the commands array
    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "9" }).setToken(BOTTOKEN);

// Deploy commands
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = (await rest.put(
      Routes.applicationGuildCommands(CLIENTTOKEN, GUILDTOKEN),
      { body: commands }
    )) as any[];

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
})();
