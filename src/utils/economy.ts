import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

const ECON_FILE = path.join(__dirname, "../../data/economy.json");

// Ensure folder exists
mkdirSync(path.dirname(ECON_FILE), { recursive: true });

interface UserEconomyData {
  balance: number;
  lastDaily: number; // timestamp
}

interface GuildEconomyData {
  [userId: string]: UserEconomyData;
}

interface AllGuildsEconomyData {
  [guildId: string]: GuildEconomyData;
}

function loadData(): AllGuildsEconomyData {
  if (!existsSync(ECON_FILE)) return {};
  return JSON.parse(readFileSync(ECON_FILE, "utf8"));
}

function saveData(data: AllGuildsEconomyData) {
  writeFileSync(ECON_FILE, JSON.stringify(data, null, 2));
}

// Starting balance for new users
const START_BALANCE = 1000;

// Get or initialize user data
export function getUserData(guildId: string, userId: string): UserEconomyData {
  const data = loadData();
  if (!data[guildId]) data[guildId] = {};
  if (!data[guildId][userId]) data[guildId][userId] = { balance: START_BALANCE, lastDaily: 0 };
  return data[guildId][userId];
}

// Add balance
export function addBalance(guildId: string, userId: string, amount: number) {
  const data = loadData();
  if (!data[guildId]) data[guildId] = {};
  if (!data[guildId][userId]) data[guildId][userId] = { balance: START_BALANCE, lastDaily: 0 };

  data[guildId][userId].balance += amount;
  saveData(data);
  return data[guildId][userId].balance;
}

// Set balance
export function setBalance(guildId: string, userId: string, amount: number) {
  const data = loadData();
  if (!data[guildId]) data[guildId] = {};
  data[guildId][userId] = { balance: amount, lastDaily: 0 };
  saveData(data);
  return data[guildId][userId].balance;
}

// Pay another user
export function payUser(guildId: string, fromId: string, toId: string, amount: number) {
  const data = loadData();
  if (!data[guildId]) data[guildId] = {};
  if (!data[guildId][fromId]) data[guildId][fromId] = { balance: START_BALANCE, lastDaily: 0 };
  if (!data[guildId][toId]) data[guildId][toId] = { balance: START_BALANCE, lastDaily: 0 };

  if (data[guildId][fromId].balance < amount) return false;

  data[guildId][fromId].balance -= amount;
  data[guildId][toId].balance += amount;
  saveData(data);
  return true;
}

// Daily reward
export function dailyReward(guildId: string, userId: string, amount: number) {
  const data = loadData();
  if (!data[guildId]) data[guildId] = {};
  if (!data[guildId][userId]) data[guildId][userId] = { balance: START_BALANCE, lastDaily: 0 };

  const now = Date.now();
  const last = data[guildId][userId].lastDaily || 0;

  if (now - last < 24 * 60 * 60 * 1000) return null; // 24h cooldown

  data[guildId][userId].balance += amount;
  data[guildId][userId].lastDaily = now;
  saveData(data);
  return data[guildId][userId].balance;
}
