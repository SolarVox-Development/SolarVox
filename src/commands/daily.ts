import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { dailyReward, getUserData } from "../utils/economy";

export const data = new SlashCommandBuilder()
  .setName("daily")
  .setDescription("Claim your daily reward");

export async function execute(interaction: any) {
  const rewardAmount = 500;
  const newBalance = dailyReward(interaction.guild.id, interaction.user.id, rewardAmount);

  if (newBalance === null) {
    const userData = getUserData(interaction.guild.id, interaction.user.id);
    const next = 24 * 60 * 60 * 1000 - (Date.now() - userData.lastDaily);
    const hours = Math.floor(next / 1000 / 60 / 60);
    const minutes = Math.floor((next / 1000 / 60) % 60);

    return await interaction.reply({
      content: `❌ You already claimed your daily reward! Come back in ${hours}h ${minutes}m.`,
      ephemeral: false,
    });
  }

  await interaction.reply({
    content: `✅ You claimed **${rewardAmount} coins**! Your new balance is **${newBalance} coins**.`,
    ephemeral: false,
  });
}
