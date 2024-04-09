const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands"); // Path to command folders
const commandFolders = fs.readdirSync(foldersPath); // Read command folders

// Loop through each command folder
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder); // Specific command folder path
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js")); // Filter JS files

  // Loop through each command file
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

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
  .filter((file) => file.endsWith(".js"));

// Loop through each event file
for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);

  // Attach event listener based on 'once' property
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args)); // One-time event listener
  } else {
    client.on(event.name, (...args) => event.execute(...args)); // Persistent event listener
  }
}

client.login(token);
