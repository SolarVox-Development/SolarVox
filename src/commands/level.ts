import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { getUserXP } from "../utils/leveling"; // Your function to get XP/level

export const data = new SlashCommandBuilder()
  .setName("level")
  .setDescription("Check your level or another user's level")
  .addUserOption(option =>
    option
      .setName("user")
      .setDescription("The user to check the level of")
      .setRequired(false)
  );

export async function execute(interaction: any) {
  // Determine the target user (default to the command user)
  const target = interaction.options.getUser("user") || interaction.user;

  // Get the XP/level data from your leveling system
  const { level, xp } = getUserXP(interaction.guild.id, target.id);

  const embed = new EmbedBuilder()
    .setTitle(`📊 Level Info for ${target.tag}`)
    .setColor(0x00ff9d)
    .setThumbnail(target.displayAvatarURL())
    .addFields(
      { name: "Level", value: `${level}`, inline: true },
      { name: "XP", value: `${xp}`, inline: true }
    )
    .setTimestamp();

  await interaction.reply({ embeds: [embed], ephemeral: false });
}
