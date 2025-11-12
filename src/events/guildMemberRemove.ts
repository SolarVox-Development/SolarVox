import { GuildMember } from "discord.js";
import { sendLog } from "../utils/logChannel";

export const name = "guildMemberRemove";
export const once = false;

export async function execute(member: GuildMember, client: any) {
  await sendLog(client, `[LEAVE] ${member.user.tag} left ${member.guild.name}`);
}
