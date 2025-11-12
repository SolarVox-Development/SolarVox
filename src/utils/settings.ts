import fs from "fs";
import path from "path";

const filePath = path.join(__dirname, "../../data/settings.json");

export interface GuildSettings {
  antiLinkEnabled: boolean;
  blockInvites: boolean;
  blockLinks: boolean;
  blockMassPings: boolean;
  blockBadWords: boolean;

  ignoredRoles: string[];
  ignoredChannels: string[];
  ignoredUsers: string[];
}

const defaults: GuildSettings = {
  antiLinkEnabled: false,
  blockInvites: true,
  blockLinks: true,
  blockMassPings: false,
  blockBadWords: false,

  ignoredRoles: [],
  ignoredChannels: [],
  ignoredUsers: [],
};

function ensureFile() {
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "{}");
  }
}

export function getGuildSettings(guildId: string): GuildSettings {
  ensureFile();
  const raw = fs.readFileSync(filePath, "utf8") || "{}";
  const all = JSON.parse(raw);

  return {
    ...defaults,
    ...(all[guildId] || {}),
  };
}

export function setGuildSettings(guildId: string, newData: Partial<GuildSettings>) {
  ensureFile();
  const raw = fs.readFileSync(filePath, "utf8") || "{}";
  const all = JSON.parse(raw);

  all[guildId] = {
    ...defaults,
    ...(all[guildId] || {}),
    ...newData,
  };

  fs.writeFileSync(filePath, JSON.stringify(all, null, 2));
}
