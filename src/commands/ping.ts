import { SlashCommandBuilder } from "discord.js";
import { embedReply } from "../utils/embedReply";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with pong!");

export async function execute(interaction: any) {
  embedReply(interaction, "🏓 Pong!", "The bot is online and responding!");
}
