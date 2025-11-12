import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("coinflip")
  .setDescription("Flips a coin!");

export async function execute(interaction: any) {
  const outcome = Math.random() < 0.5 ? "Heads" : "Tails";
  await interaction.reply(`🪙 The coin landed on **${outcome}**!`);
}
