import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  EmbedBuilder,
} from "discord.js";
import { getGuildSettings } from "../utils/settings";

export const data = new SlashCommandBuilder()
  .setName("admin_panel")
  .setDescription("Open the Admin Panel configuration panel")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

export async function execute(interaction: any) {
  const settings = getGuildSettings(interaction.guild.id);

  const embed = new EmbedBuilder()
    .setTitle("🔧 Admin Panel")
    .setColor(0x2b2d31)
    .addFields(
      { name: "Anti-Link Enabled", value: settings.antiLinkEnabled ? "✅ On" : "❌ Off", inline: true },
      { name: "Block Links", value: settings.blockLinks ? "✅ On" : "❌ Off", inline: true },
      { name: "Block Invites", value: settings.blockInvites ? "✅ On" : "❌ Off", inline: true },
      { name: "Mass Ping Filter", value: settings.blockMassPings ? "✅ On" : "❌ Off", inline: true },
      { name: "Bad Word Filter", value: settings.blockBadWords ? "✅ On" : "❌ Off", inline: true },
      {
        name: "Ignored Roles",
        value: settings.ignoredRoles.length ? settings.ignoredRoles.map(r => `<@&${r}>`).join(", ") : "None",
      },
      {
        name: "Ignored Channels",
        value: settings.ignoredChannels.length ? settings.ignoredChannels.map(c => `<#${c}>`).join(", ") : "None",
      },
      {
        name: "Ignored Users",
        value: settings.ignoredUsers.length ? settings.ignoredUsers.map(u => `<@${u}>`).join(", ") : "None",
      },
    );

  const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("anti_toggle")
      .setLabel(settings.antiLinkEnabled ? "Disable Anti-Link" : "Enable Anti-Link")
      .setStyle(settings.antiLinkEnabled ? ButtonStyle.Danger : ButtonStyle.Success),
    new ButtonBuilder().setCustomId("toggle_links").setLabel("Block Links").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("toggle_invites").setLabel("Block Invites").setStyle(ButtonStyle.Primary),
  );

  const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId("toggle_pings").setLabel("Mass Ping Filter").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("toggle_badwords").setLabel("Bad Word Filter").setStyle(ButtonStyle.Secondary),
  );

  const row3 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId("ignored_roles").setLabel("Ignored Roles").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("ignored_channels").setLabel("Ignored Channels").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("ignored_users").setLabel("Ignored Users").setStyle(ButtonStyle.Primary),
  );

  
  await interaction.reply({
    embeds: [embed],
    components: [row1, row2, row3],
    ephemeral: true,
  });
}
