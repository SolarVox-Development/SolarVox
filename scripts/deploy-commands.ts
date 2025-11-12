import { REST, Routes } from "discord.js";
import * as dotenv from "dotenv";
import { readdirSync, statSync } from "fs";
import path from "path";

dotenv.config();

const commands: any[] = [];

// Recursive function to get all command files
function getCommandFiles(dir: string): string[] {
  let files: string[] = [];
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      files = files.concat(getCommandFiles(fullPath)); // recurse into subfolder
    } else if (entry.endsWith(".ts") || entry.endsWith(".js")) {
      files.push(fullPath);
    }
  }

  return files;
}

const commandsPath = path.join(__dirname, "../src/commands");
const commandFiles = getCommandFiles(commandsPath);

// Load all commands
for (const file of commandFiles) {
  const command = require(file);
  if (command.data) commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    console.log("Clearing and refreshing all slash commands...");

    // Overwrite all guild commands
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!),
      { body: commands }
    );

    console.log("All commands deployed successfully!");
  } catch (error) {
    console.error(error);
  }
})();
