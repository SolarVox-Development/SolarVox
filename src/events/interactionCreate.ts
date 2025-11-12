import {
  Interaction,
  ButtonInteraction,
  StringSelectMenuInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} from "discord.js";
import { getGuildSettings, setGuildSettings } from "../utils/settings";

export const name = "interactionCreate";
export const once = false;

export async function execute(interaction: Interaction, client: any) {
  // ----------------------------
  // Slash Command Handling
  // ----------------------------
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction);
      console.log(`[DEBUG] Slash command executed: ${interaction.commandName}`);
    } catch (err) {
      console.error(err);
      if (interaction.replied || interaction.deferred)
        await interaction.followUp({ content: "❌ Error executing command.", ephemeral: true });
      else
        await interaction.reply({ content: "❌ Error executing command.", ephemeral: true });
    }
  }

  // ----------------------------
  // Button Handling
  // ----------------------------
  else if (interaction.isButton()) {
    const choices = ["rock", "paper", "scissors"];
    if (choices.includes(interaction.customId)) {
      // RPS Logic
      const botChoice = choices[Math.floor(Math.random() * 3)];
      const userChoice = interaction.customId;

      let result = "";
      if (botChoice === userChoice) result = "It's a tie!";
      else if (
        (userChoice === "rock" && botChoice === "scissors") ||
        (userChoice === "paper" && botChoice === "rock") ||
        (userChoice === "scissors" && botChoice === "paper")
      )
        result = "You win! 🎉";
      else result = "You lose! 😢";

      await interaction.update({
        content: `You chose **${userChoice}**, I chose **${botChoice}**.\n${result}`,
        components: [],
      });
      return;
    }

    // ----------------------------
    // Anti-link Panel Button Handling
    // ----------------------------
    const settings = getGuildSettings(interaction.guild!.id);
    switch (interaction.customId) {
      case "anti_toggle":
        settings.antiLinkEnabled = !settings.antiLinkEnabled;
        setGuildSettings(interaction.guild!.id, settings);
        await interaction.update({
          embeds: [buildPanelEmbed(settings)],
          components: buildPanelButtons(settings),
        });
        break;

      case "toggle_links":
        settings.blockLinks = !settings.blockLinks;
        setGuildSettings(interaction.guild!.id, settings);
        await interaction.update({
          embeds: [buildPanelEmbed(settings)],
          components: buildPanelButtons(settings),
        });
        break;

      case "toggle_invites":
        settings.blockInvites = !settings.blockInvites;
        setGuildSettings(interaction.guild!.id, settings);
        await interaction.update({
          embeds: [buildPanelEmbed(settings)],
          components: buildPanelButtons(settings),
        });
        break;

      case "toggle_pings":
        settings.blockMassPings = !settings.blockMassPings;
        setGuildSettings(interaction.guild!.id, settings);
        await interaction.update({
          embeds: [buildPanelEmbed(settings)],
          components: buildPanelButtons(settings),
        });
        break;

      case "toggle_badwords":
        settings.blockBadWords = !settings.blockBadWords;
        setGuildSettings(interaction.guild!.id, settings);
        await interaction.update({
          embeds: [buildPanelEmbed(settings)],
          components: buildPanelButtons(settings),
        });
        break;

      case "ignored_roles":
      case "ignored_channels":
      case "ignored_users":
        await handleSelectPrompt(interaction);
        break;
    }
  }

  // ----------------------------
  // Select Menu Handling
  // ----------------------------
  else if (interaction.isStringSelectMenu()) {
    const settings = getGuildSettings(interaction.guild!.id);

    switch (interaction.customId) {
      case "select_ignored_roles":
        settings.ignoredRoles = interaction.values;
        setGuildSettings(interaction.guild!.id, settings);
        await interaction.update({ content: "✅ Updated ignored roles.", components: [], embeds: [] });
        break;

      case "select_ignored_channels":
        settings.ignoredChannels = interaction.values;
        setGuildSettings(interaction.guild!.id, settings);
        await interaction.update({ content: "✅ Updated ignored channels.", components: [], embeds: [] });
        break;

      case "select_ignored_users":
        settings.ignoredUsers = interaction.values;
        setGuildSettings(interaction.guild!.id, settings);
        await interaction.update({ content: "✅ Updated ignored users.", components: [], embeds: [] });
        break;
    }
  }
}

// ----------------------------
// Helpers
// ----------------------------
function buildPanelEmbed(settings: any) {
  return new EmbedBuilder()
    .setTitle("🔧 Anti-Link & Moderation Panel")
    .setColor(0x2b2d31)
    .addFields(
      { name: "Anti-Link Enabled", value: settings.antiLinkEnabled ? "✅ On" : "❌ Off", inline: true },
      { name: "Block Links", value: settings.blockLinks ? "✅ On" : "❌ Off", inline: true },
      { name: "Block Invites", value: settings.blockInvites ? "✅ On" : "❌ Off", inline: true },
      { name: "Mass Ping Filter", value: settings.blockMassPings ? "✅ On" : "❌ Off", inline: true },
      { name: "Bad Word Filter", value: settings.blockBadWords ? "✅ On" : "❌ Off", inline: true },
      { name: "Ignored Roles", value: settings.ignoredRoles.length ? settings.ignoredRoles.map((r: string) => `<@&${r}>`).join(", ") : "None" },
      { name: "Ignored Channels", value: settings.ignoredChannels.length ? settings.ignoredChannels.map((c: string) => `<#${c}>`).join(", ") : "None" },
      { name: "Ignored Users", value: settings.ignoredUsers.length ? settings.ignoredUsers.map((u: string) => `<@${u}>`).join(", ") : "None" }
    );
}

function buildPanelButtons(settings: any) {
  const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("anti_toggle")
      .setLabel(settings.antiLinkEnabled ? "Disable Anti-Link" : "Enable Anti-Link")
      .setStyle(settings.antiLinkEnabled ? ButtonStyle.Danger : ButtonStyle.Success),
    new ButtonBuilder().setCustomId("toggle_links").setLabel("Block Links").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("toggle_invites").setLabel("Block Invites").setStyle(ButtonStyle.Primary)
  );

  const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId("toggle_pings").setLabel("Mass Ping Filter").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("toggle_badwords").setLabel("Bad Word Filter").setStyle(ButtonStyle.Secondary)
  );

  const row3 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId("ignored_roles").setLabel("Ignored Roles").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("ignored_channels").setLabel("Ignored Channels").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("ignored_users").setLabel("Ignored Users").setStyle(ButtonStyle.Primary)
  );

  return [row1, row2, row3];
}

async function handleSelectPrompt(interaction: ButtonInteraction) {
  const guild = interaction.guild!;
  let selectMenu: StringSelectMenuBuilder;

  switch (interaction.customId) {
    case "ignored_roles":
      selectMenu = new StringSelectMenuBuilder()
        .setCustomId("select_ignored_roles")
        .setPlaceholder("Select roles to ignore")
        .setMinValues(0)
        .setMaxValues(guild.roles.cache.size)
        .addOptions(guild.roles.cache.map(r => ({ label: r.name, value: r.id })));
      break;

    case "ignored_channels":
      selectMenu = new StringSelectMenuBuilder()
        .setCustomId("select_ignored_channels")
        .setPlaceholder("Select channels to ignore")
        .setMinValues(0)
        .setMaxValues(guild.channels.cache.size)
        .addOptions(guild.channels.cache.map(c => ({ label: c.name, value: c.id })));
      break;

    case "ignored_users":
      selectMenu = new StringSelectMenuBuilder()
        .setCustomId("select_ignored_users")
        .setPlaceholder("Select users to ignore")
        .setMinValues(0)
        .setMaxValues(guild.members.cache.size)
        .addOptions(guild.members.cache.map(m => ({ label: m.user.username, value: m.id })));
      break;
  }

  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu!);

  await interaction.reply({ content: "Select items:", ephemeral: true, components: [row] });
}
