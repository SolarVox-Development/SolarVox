import { EmbedBuilder, CommandInteraction } from "discord.js";

export function embedReply(
  interaction: CommandInteraction,
  title: string,
  description: string
) {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(0x2b2d31);

  return interaction.reply({ embeds: [embed] });
}
