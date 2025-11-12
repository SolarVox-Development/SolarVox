import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { getUserData } from "../utils/economy";

export const data = new SlashCommandBuilder()
  .setName("balance")
  .setDescription("Check your balance or another user's balance")
  .addUserOption(option => option.setName("user").setDescription("User to check").setRequired(false));

export async function execute(interaction: any) {
  const target = interaction.options.getUser("user") || interaction.user;
  const data = getUserData(interaction.guild.id, target.id);

  const embed = new EmbedBuilder()
    .setTitle(`${target.username}'s Balance`)
    .setDescription(`💰 Balance: **${data.balance} coins**`)
    .setColor(0x00ff9d)
    .setThumbnail(target.displayAvatarURL());

  await interaction.reply({ embeds: [embed], ephemeral: false });
}
