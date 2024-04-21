import fs from "fs";
import path from "path";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import { BOTTOKEN } from "./env";

// Define a new interface that extends Client and adds the commands property
interface CustomClient extends Client {
  commands: Collection<string, any>;
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] }) as CustomClient;
client.commands = new Collection<string, any>(); // Explicitly type the commands property


const foldersPath = path.join(__dirname, "commands"); // Path to command folders
const commandFolders = fs.readdirSync(foldersPath); // Read command folders

// Loop through each command folder
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder); // Specific command folder path
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts")); // Filter TS files

  // Loop through each command file
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath); // No type annotation needed for require

    // Check for required properties and add command to collection
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".ts")); // Filter TS files

// Loop through each event file
for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath) as { name: string; once?: boolean; execute: Function };

  // Attach event listener based on 'once' property
  if (event.once) {
    client.once(event.name, (...args: any[]) => event.execute(...args)); // One-time event listener
  } else {
    client.on(event.name, (...args: any[]) => event.execute(...args)); // Persistent event listener
  }
}

client.login(BOTTOKEN);
