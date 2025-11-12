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

  // ------------------- 🎯 Leveling System -------------------
  try {
    const xpGain = Math.floor(Math.random() * 11) + 10; // 10–20 XP per message
    const { levelUp, level } = addXP(message.guild.id, message.author.id, xpGain);

    if (levelUp) {
      const levelEmbed = new EmbedBuilder()
        .setTitle("🎉 Level Up!")
        .setColor(0x00ff9d)
        .setDescription(`${message.author}, you’ve reached **Level ${level}!**`)
        .setThumbnail(message.author.displayAvatarURL())
        .setTimestamp();

      if (
        message.channel instanceof TextChannel ||
        message.channel instanceof NewsChannel ||
        message.channel instanceof ThreadChannel
      ) {
        await message.channel.send({ embeds: [levelEmbed] }).catch(() => {});
      }
    }
  } catch (err) {
    console.error("Leveling system error:", err);
  }

  // ------------------- 🚫 Anti-Link & Filters -------------------
  if (!settings.antiLinkEnabled) return;

  // Ignore roles, users, and channels
  if (message.member?.roles.cache.some(r => settings.ignoredRoles.includes(r.id))) return;
  if (settings.ignoredUsers.includes(message.author.id)) return;
  if (settings.ignoredChannels.includes(message.channel.id)) return;

  const content = message.content.toLowerCase();

  // Block invites
  if (settings.blockInvites && /(discord\.gg|discord\.com\/invite)/i.test(content)) {
    await handleDelete(message, client, "Server Invite");
    return;
  }

  // Block links
  if (settings.blockLinks && /(https?:\/\/|www\.)/i.test(content)) {
    await handleDelete(message, client, "Link");
    return;
  }

  // Mass ping filter
  if (settings.blockMassPings && content.includes("@everyone")) {
    await handleDelete(message, client, "Mass Ping");
    return;
  }

  // Bad word filter
  const badWords = ["fuck", "shit", "bitch"];
  if (settings.blockBadWords && badWords.some(w => content.includes(w))) {
    await handleDelete(message, client, "Inappropriate Language");
    return;
  }
}

// Shared deletion logic
async function handleDelete(message: Message, client: any, type: string) {
  try {
    await message.delete().catch(() => {});

    // Create an embed for the warning message in the same channel
    const warnEmbed = new EmbedBuilder()
      .setColor(0xff4747)
      .setTitle("🚫 Message Removed")
      .setDescription(`${message.author}, your message was removed for **${type}**.`)
      .addFields({ name: "Message Content", value: message.content.slice(0, 1024) || "*(No content)*" })
      .setFooter({ text: `User ID: ${message.author.id}` })
      .setTimestamp();

    if (
      message.channel instanceof TextChannel ||
      message.channel instanceof NewsChannel ||
      message.channel instanceof ThreadChannel
    ) {
      await message.channel.send({ embeds: [warnEmbed] }).catch(() => {});
    }

    // Create a separate embed for logs
    const logEmbed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("🧹 Filter Triggered")
      .addFields(
        { name: "User", value: `${message.author.tag} (<@${message.author.id}>)`, inline: true },
        { name: "Type", value: type, inline: true },
        { name: "Channel", value: `<#${message.channel.id}>`, inline: true },
        { name: "Message", value: message.content.slice(0, 1024) || "*(No content)*" },
      )
      .setThumbnail(message.author.displayAvatarURL({ extension: "png", size: 1024 }))
      .setTimestamp();

    await sendLog(client, { embeds: [logEmbed] });
  } catch (err) {
    const errorEmbed = new EmbedBuilder()
      .setColor(0xffa500)
      .setTitle("⚠️ Error Deleting Message")
      .setDescription(`An error occurred while deleting a message from **${message.author.tag}**.`)
      .addFields({ name: "Error", value: `${err}` })
      .setTimestamp();

    await sendLog(client, { embeds: [errorEmbed] });
  }
}
