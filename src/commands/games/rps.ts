import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("rps")
  .setDescription("Play Rock Paper Scissors");

export async function execute(interaction: any) {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId("rock").setLabel("🪨 Rock").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("paper").setLabel("📄 Paper").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("scissors").setLabel("✂️ Scissors").setStyle(ButtonStyle.Primary)
  );

  await interaction.reply({ content: "Choose your move:", components: [row] });
}
