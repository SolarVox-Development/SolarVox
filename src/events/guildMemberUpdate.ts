import { GuildMember, EmbedBuilder } from "discord.js";
import { sendLog } from "../utils/logChannel";

export const name = "guildMemberUpdate";
export const once = false;

export async function execute(oldMember: GuildMember, newMember: GuildMember, client: any) {
  if (!oldMember.guild) return;

  const user = newMember.user;
  const baseEmbed = new EmbedBuilder()
    .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ extension: "png", size: 1024 }) })
    .setThumbnail(user.displayAvatarURL({ extension: "png", size: 1024 }))
    .setTimestamp();

  // Nickname change
  if (oldMember.nickname !== newMember.nickname) {
    const embed = baseEmbed
      .setColor(0x3498db)
      .setTitle("✏️ Nickname Updated")
      .addFields(
        { name: "Before", value: oldMember.nickname || oldMember.user.username, inline: true },
        { name: "After", value: newMember.nickname || newMember.user.username, inline: true },
        { name: "User ID", value: user.id, inline: false }
      );

    await sendLog(client, { embeds: [embed] });
  }

  // Role changes
  const addedRoles = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id));
  const removedRoles = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id));

  if (addedRoles.size > 0) {
    const embed = baseEmbed
      .setColor(0x2ecc71)
      .setTitle("✅ Roles Added")
      .addFields(
        { name: "User", value: `${user.tag} (<@${user.id}>)`, inline: false },
        { name: "Added Roles", value: addedRoles.map(r => `<@&${r.id}>`).join(", "), inline: false }
      );

    await sendLog(client, { embeds: [embed] });
  }

  if (removedRoles.size > 0) {
    const embed = baseEmbed
      .setColor(0xe74c3c)
      .setTitle("❌ Roles Removed")
      .addFields(
        { name: "User", value: `${user.tag} (<@${user.id}>)`, inline: false },
        { name: "Removed Roles", value: removedRoles.map(r => `<@&${r.id}>`).join(", "), inline: false }
      );

    await sendLog(client, { embeds: [embed] });
  }
}
