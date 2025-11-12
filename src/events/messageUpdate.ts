import { Message, EmbedBuilder } from "discord.js";
import { sendLog } from "../utils/logChannel";

export const name = "messageUpdate";
export const once = false;

export async function execute(oldMsg: Message, newMsg: Message, client: any) {
  if (!oldMsg.guild || oldMsg.author?.bot) return;
  if (oldMsg.content === newMsg.content) return;

  const authorTag = oldMsg.author?.tag || "Unknown User";
  const authorId = oldMsg.author?.id || "N/A";
  const channelName = newMsg.channel?.toString() || "Unknown Channel";

  const before = oldMsg.content?.trim() || "[No Content]";
  const after = newMsg.content?.trim() || "[No Content]";

  const embed = new EmbedBuilder()
    .setColor(0xf5a623)
    .setTitle("✏️ Message Edited")
    .addFields(
      { name: "Author", value: `${authorTag} (<@${authorId}>)`, inline: true },
      { name: "Channel", value: `${channelName}`, inline: true },
      {
        name: "Before",
        value: before.length > 1024 ? before.slice(0, 1021) + "..." : before,
      },
      {
        name: "After",
        value: after.length > 1024 ? after.slice(0, 1021) + "..." : after,
      }
    )
    .setTimestamp();

  if (oldMsg.author?.displayAvatarURL())
    embed.setThumbnail(oldMsg.author.displayAvatarURL({ extension: "png", size: 1024 }));

  await sendLog(client, { embeds: [embed] });
}
