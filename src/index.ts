import { readdirSync } from "fs";
import path from "path";
import * as dotenv from "dotenv";
import { GatewayIntentBits, Partials } from "discord.js";
import { CustomClient } from "./structures/CustomClient";

dotenv.config();

// Initialize your custom client with proper intents and partials
const client = new CustomClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // allows reading message text
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Channel, Partials.Message],
});

// Helper: load commands recursively
async function loadCommands(dir: string) {
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await loadCommands(fullPath);
    } else if (/\.(ts|js)$/.test(entry.name)) {
      const commandModule = await import(fullPath);
      if (commandModule.data && commandModule.execute) {
        client.commands.set(commandModule.data.name, commandModule);
        console.log(`Loaded command: ${commandModule.data.name}`);
      }
    }
  }
}

// Helper: load events recursively
async function loadEvents(dir: string) {
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await loadEvents(fullPath);
    } else if (/\.(ts|js)$/.test(entry.name)) {
      const eventModule = await import(fullPath);
      if (!eventModule.name || typeof eventModule.execute !== "function") continue;

      const eventName = eventModule.name;

      if (eventModule.once) {
        client.once(eventName, (...args) => eventModule.execute(...args, client));
      } else {
        client.on(eventName, (...args) => eventModule.execute(...args, client));
      }

      console.log(`Loaded event: ${eventName}`);
    }
  }
}

// Main boot process
(async () => {
  try {
    await loadCommands(path.join(__dirname, "commands"));
    await loadEvents(path.join(__dirname, "events"));

    console.log("All commands and events loaded. Logging in...");
    await client.login(process.env.DISCORD_TOKEN);
  } catch (err) {
    console.error("Failed to start bot:", err);
  }
})();
