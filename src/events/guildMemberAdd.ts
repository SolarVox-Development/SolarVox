import { GuildMember } from "discord.js";
import { sendLog } from "../utils/logChannel";

export const name = "guildMemberAdd";
export const once = false;

export async function execute(member: GuildMember, client: any) {
  await sendLog(client, `[JOIN] ${member.user.tag} joined ${member.guild.name}`);
}
