import { Message, EmbedBuilder, TextChannel } from "discord.js";
import { addXP } from "../utils/leveling";


export const name = "messageCreate";
export const once = false;

export async function execute(message: Message) {
  if (!message.guild || message.author.bot) return;

  // Add XP for messages (randomized between 10 and 20)
  const xpGain = Math.floor(Math.random() * 11) + 10;
  const { levelUp, level } = addXP(message.guild.id, message.author.id, xpGain);

  if (levelUp) {
    const embed = new EmbedBuilder()
      .setTitle("🎉 Level Up!")
      .setColor(0x00ff9d)
      .setDescription(`${message.author}, you’ve reached **Level ${level}!**`)
      .setThumbnail(message.author.displayAvatarURL())
      .setTimestamp();

    // Send message only if the channel is text-based
    if (message.channel && message.channel.isTextBased()) {
      await (message.channel as TextChannel).send({ embeds: [embed] });
    }
  }
}
