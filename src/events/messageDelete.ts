import { Message, EmbedBuilder } from "discord.js";
import { sendLog } from "../utils/logChannel";

export const name = "messageDelete";
export const once = false;

export async function execute(message: Message, client: any) {
  if (!message.guild) return;

  const authorTag = message.author?.tag || "Unknown User";
  const authorId = message.author?.id || "N/A";
  const channelName = message.channel?.toString() || "Unknown Channel";
  const content = message.content?.trim() || "[Embed / Attachment / Empty Message]";

  const embed = new EmbedBuilder()
    .setColor(0xff4747)
    .setTitle("🗑️ Message Deleted")
    .addFields(
      { name: "Author", value: `${authorTag} (<@${authorId}>)`, inline: true },
      { name: "Channel", value: `${channelName}`, inline: true },
      { name: "Content", value: content.length > 1024 ? content.slice(0, 1021) + "..." : content }
    )
    .setTimestamp();

  if (message.author?.displayAvatarURL())
    embed.setThumbnail(message.author.displayAvatarURL({ extension: "png", size: 1024 }));

  await sendLog(client, { embeds: [embed] });
}
