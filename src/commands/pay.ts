import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { payUser, getUserData } from "../utils/economy";

export const data = new SlashCommandBuilder()
  .setName("pay")
  .setDescription("Pay another user")
  .addUserOption(option => option.setName("user").setDescription("Recipient").setRequired(true))
  .addIntegerOption(option => option.setName("amount").setDescription("Amount to pay").setRequired(true));

export async function execute(interaction: any) {
  const target = interaction.options.getUser("user");
  const amount = interaction.options.getInteger("amount");

  if (target.id === interaction.user.id) return interaction.reply({ content: "❌ You can't pay yourself!", ephemeral: true });
  if (amount <= 0) return interaction.reply({ content: "❌ Amount must be positive!", ephemeral: true });

  const success = payUser(interaction.guild.id, interaction.user.id, target.id, amount);

  if (!success) return interaction.reply({ content: "❌ You don't have enough coins!", ephemeral: true });

  await interaction.reply({
    content: `✅ You paid **${amount} coins** to ${target}!`,
    ephemeral: false,
  });
}
