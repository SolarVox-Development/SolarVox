import { GuildMember } from "discord.js";
import { sendLog } from "../utils/logChannel";

export const name = "guildMemberUpdate";
export const once = false;

export async function execute(oldMember: GuildMember, newMember: GuildMember, client: any) {
  if (!oldMember.guild) return;

  // Nickname change
  if (oldMember.nickname !== newMember.nickname) {
    await sendLog(
      client,
      `[NICKNAME] ${newMember.user.tag} changed nickname: ${oldMember.nickname || oldMember.user.username} → ${newMember.nickname || newMember.user.username}`
    );
  }

  // Role changes
  const addedRoles = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id));
  const removedRoles = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id));

  if (addedRoles.size > 0) {
    await sendLog(
      client,
      `[ROLE ADD] ${newMember.user.tag} was given roles: ${addedRoles.map(r => r.name).join(", ")}`
    );
  }

  if (removedRoles.size > 0) {
    await sendLog(
      client,
      `[ROLE REMOVE] ${newMember.user.tag} had roles removed: ${removedRoles.map(r => r.name).join(", ")}`
    );
  }
}
