import { Client, TextChannel, NewsChannel, ThreadChannel } from "discord.js";

export async function sendLog(client: Client, content: string) {
  try {
    const logChannel = await client.channels.fetch(process.env.LOG_CHANNEL_ID!);
    if (!logChannel?.isTextBased()) return;

    const textChannel = logChannel as TextChannel | NewsChannel | ThreadChannel;
    await textChannel.send({ content });
  } catch (err) {
    console.error("Failed to send log:", err);
  }
}
