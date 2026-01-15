// src/logic/statsManager.ts
import {
  getUserAggregatedStats,
  getLeaderboardData,
  getRecentMatchesGlobal,
  getRecentMatchesForUser,
  getUnlockedAchievements,
} from "./statsRepo";

export async function getUserStats(userId: number) {
  const base = await getUserAggregatedStats(userId);
  if (!base) return null;

  const totalGames = base.wins + base.losses;
  const winRate = totalGames > 0 ? Math.round((base.wins / totalGames) * 100) : 0;

  return {
    ...base,
    winRate,
    totalGames,
  };
}

export async function getLeaderboard(limit: number = 50) {
  return getLeaderboardData(limit);
}

export async function getGlobalMatchHistory(page: number = 1, limit: number = 10) {
  return getRecentMatchesGlobal(page, limit);
}

export async function getUserMatchHistory(userId: number, page: number = 1, limit: number = 10) {
  return getRecentMatchesForUser(userId, page, limit);
}

export async function getUserAchievements(userId: number) {
  return getUnlockedAchievements(userId);
}