import { Message } from "discord.js";
import { sendLog } from "../utils/logChannel";

export const name = "messageDelete";
export const once = false;

export async function execute(message: Message, client: any) {
  if (!message.guild || !message.author) return;

  await sendLog(
    client,
    `🗑️ **Message Deleted** in **${message.guild.name}** by **${message.author.tag}**:\n${message.content || "[Embed/Attachment]"}`
  );
}
