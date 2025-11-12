import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

const LEVEL_FILE = path.join(__dirname, "../../data/levels.json");

// Ensure folder exists
mkdirSync(path.dirname(LEVEL_FILE), { recursive: true });

interface UserLevelData {
  xp: number;
  level: number;
}

interface GuildLevelData {
  [userId: string]: UserLevelData;
}

interface AllGuildsLevelData {
  [guildId: string]: GuildLevelData;
}

function loadData(): AllGuildsLevelData {
  if (!existsSync(LEVEL_FILE)) return {};
  const data = JSON.parse(readFileSync(LEVEL_FILE, "utf8"));
  return data;
}

function saveData(data: AllGuildsLevelData) {
  writeFileSync(LEVEL_FILE, JSON.stringify(data, null, 2));
}

// Get a user's level data
export function getUserLevel(guildId: string, userId: string): UserLevelData {
  const data = loadData();
  if (!data[guildId]) data[guildId] = {};
  if (!data[guildId][userId]) data[guildId][userId] = { xp: 0, level: 1 };
  return data[guildId][userId];
}

// Add XP to a user and handle level-ups
export function addXP(
  guildId: string,
  userId: string,
  amount: number
): { levelUp: boolean; level: number; xp: number; xpToNext: number } {
  const data = loadData();
  if (!data[guildId]) data[guildId] = {};
  if (!data[guildId][userId]) data[guildId][userId] = { xp: 0, level: 1 };

  const user = data[guildId][userId];
  user.xp += amount;

  let levelUp = false;

  // Level formula: 5 * (level^2) + 50 * level + 100
  let nextLevelXP = 5 * (user.level ** 2) + 50 * user.level + 100;

  while (user.xp >= nextLevelXP) {
    user.xp -= nextLevelXP; // carryover XP
    user.level++;
    nextLevelXP = 5 * (user.level ** 2) + 50 * user.level + 100;
    levelUp = true;
  }

  saveData(data);

  return { levelUp, level: user.level, xp: user.xp, xpToNext: nextLevelXP - user.xp };
}

// Helper to get another user's level
export function getUserXP(guildId: string, userId: string) {
  const user = getUserLevel(guildId, userId);
  const nextLevelXP = 5 * (user.level ** 2) + 50 * user.level + 100;
  return { level: user.level, xp: user.xp, xpToNext: nextLevelXP - user.xp };
}
