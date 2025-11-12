import { GuildMember, EmbedBuilder, TextChannel } from "discord.js";

export const name = "guildMemberRemove";
export const once = false;

export async function execute(member: GuildMember) {
  try {
    const welcomeChannelId = process.env.WELCOME_CHANNEL_ID;
    if (!welcomeChannelId) {
      console.warn("⚠️ WELCOME_CHANNEL_ID not set in .env");
      return;
    }

    const channel = member.guild.channels.cache.get(welcomeChannelId);
    if (!channel || !(channel instanceof TextChannel)) {
      console.warn("⚠️ Invalid welcome channel or channel not found");
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("👋 Member Left")
      .setColor(0xed4245)
      .setThumbnail(member.user.displayAvatarURL({ extension: "png", size: 1024 }))
      .setDescription(`${member.user.tag} has left the server.`)
      .setFooter({ text: `Members Remaining: ${member.guild.memberCount}` })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  } catch (error) {
    console.error("❌ Error sending leave embed:", error);
  }
}
