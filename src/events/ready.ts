import { Client } from "discord.js";
import { BotEvent } from "../types";

const event: BotEvent = {
  name: "ready",
  once: true,
  execute(client: Client) {
    console.log(`Ready! Logged in as ${client.user?.tag}`);
  },
};

export default event;
