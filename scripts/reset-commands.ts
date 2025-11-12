import { REST, Routes } from "discord.js";
import * as dotenv from "dotenv";

dotenv.config();

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    console.log("Clearing all global commands...");
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID!),
      { body: [] } // removes all global commands
    );

    console.log("Clearing all guild commands...");
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!),
      { body: [] } // removes all guild commands
    );

    console.log("All old commands deleted!");
  } catch (error) {
    console.error(error);
  }
})();
