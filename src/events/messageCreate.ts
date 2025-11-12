import {
  Message,
  TextChannel,
  NewsChannel,
  ThreadChannel,
  EmbedBuilder,
} from "discord.js";
import { getGuildSettings } from "../utils/settings";
import { sendLog } from "../utils/logChannel";
import { addXP } from "../utils/leveling";

export const name = "messageCreate";
export const once = false;

export async function execute(message: Message, client: any) {
  if (!message.guild || message.author.bot) return;

  const settings = getGuildSettings(message.guild.id);

    // ------------------- Leveling System -------------------
  try {
    const xpGain = Math.floor(Math.random() * 11) + 10; // 10–20 XP per message
    const { levelUp, level } = addXP(message.guild.id, message.author.id, xpGain);

    if (levelUp) {
      const embed = new EmbedBuilder()
        .setTitle("🎉 Level Up!")
        .setColor(0x00ff9d)
        .setDescription(`${message.author}, you’ve reached **Level ${level}!**`)
        .setThumbnail(message.author.displayAvatarURL())
        .setTimestamp();

      // Only send if the channel is text-based
      if (
        message.channel instanceof TextChannel ||
        message.channel instanceof NewsChannel ||
        message.channel instanceof ThreadChannel
      ) {
        await message.channel.send({ embeds: [embed] }).catch(() => {});
      }
    }
  } catch (err) {
    console.error("Leveling system error:", err);
  }


  // -------------- 🚫 Anti-Link & Filters --------------
  if (!settings.antiLinkEnabled) return;

  // Ignore roles
  if (message.member?.roles.cache.some(r => settings.ignoredRoles.includes(r.id))) return;

  // Ignore users
  if (settings.ignoredUsers.includes(message.author.id)) return;

  // Ignore channels
  if (settings.ignoredChannels.includes(message.channel.id)) return;

  const content = message.content.toLowerCase();

  // Block invites
  if (settings.blockInvites && /(discord\.gg|discord\.com\/invite)/i.test(content)) {
    await handleDelete(message, client, "invite");
    return;
  }

  // Block links
  if (settings.blockLinks && /(https?:\/\/|www\.)/i.test(content)) {
    await handleDelete(message, client, "link");
    return;
  }

  // Mass ping filter
  if (settings.blockMassPings && content.includes("@everyone")) {
    await handleDelete(message, client, "mass ping");
    return;
  }

  // Bad word filter
  const badWords = ["fuck", "shit", "bitch"];
  if (settings.blockBadWords && badWords.some(w => content.includes(w))) {
    await handleDelete(message, client, "bad words");
    return;
  }
}

// Shared deletion logic
async function handleDelete(message: Message, client: any, type: string) {
  try {
    await message.delete();

    if (
      message.channel instanceof TextChannel ||
      message.channel instanceof NewsChannel ||
      message.channel instanceof ThreadChannel
    ) {
      await message.channel.send({
        content: `${message.author}, your message was removed for **${type}** 🚫`,
        allowedMentions: { users: [] },
      });
    }

    await sendLog(client, `🚫 **Deleted ${type}** from **${message.author.tag}**:\n${message.content}`);
  } catch (err) {
    await sendLog(client, `⚠️ Error deleting message from ${message.author.tag}: ${err}`);
  }
}
