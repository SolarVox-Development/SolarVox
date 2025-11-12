import { Message } from "discord.js";
import { sendLog } from "../utils/logChannel";

export const name = "messageUpdate";
export const once = false;

export async function execute(oldMsg: Message, newMsg: Message, client: any) {
  if (!oldMsg.guild || oldMsg.author?.bot) return;
  if (oldMsg.content === newMsg.content) return;

  await sendLog(
    client,
    `✏️ **Message Edited** in **${oldMsg.guild.name}** by **${oldMsg.author.tag}**:\n**Before:** ${oldMsg.content}\n**After:** ${newMsg.content}`
  );
}
