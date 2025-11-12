import { GuildMember, EmbedBuilder, TextChannel } from "discord.js";

export const name = "guildMemberAdd";
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
      .setTitle("🎉 Welcome to the Server!")
      .setColor(0x57f287)
      .setThumbnail(member.user.displayAvatarURL({ extension: "png", size: 1024 }))
      .setDescription(
        `Hey <@${member.id}>! Welcome to **${member.guild.name}** — we’re glad you’re here!\nMake sure to read the rules and have fun! 🎈`
      )
      .setFooter({ text: `You’re member #${member.guild.memberCount}` })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  } catch (error) {
    console.error("❌ Error sending welcome embed:", error);
  }
}
