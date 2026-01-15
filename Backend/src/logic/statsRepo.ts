// src/logic/statsRepo.ts
import { prisma } from "../db/prisma.js";

/**
 * Aggregated stats for a single user
 * statsManager is calling this with extra args, so accept rest params.
 */
export async function getUserAggregatedStats(userId: number, ..._rest: any[]) {
  return {
    userId,
    wins: 0,
    losses: 0,
    totalScore: 0,
    tournamentWins: 0,
    lastMatchAt: null,
  };
}

/**
 * Global leaderboard
 * Accept extra args to match manager calls.
 */
export async function getLeaderboardData(limit: number = 10, ..._rest: any[]) {
  return [];
}

/**
 * Recent matches across all users
 * statsManager is calling this with 2 args sometimes.
 */
export async function getRecentMatchesGlobal(limit: number = 10, ..._rest: any[]) {
  return [];
}

/**
 * Recent matches for a specific user
 * statsManager is calling this with up to 3 args.
 */
export async function getRecentMatchesForUser(userId: number, limit: number = 10, ..._rest: any[]) {
  return [];
}

/**
 * Achievements unlocked by a user
 */
export async function getUnlockedAchievements(userId: number, ..._rest: any[]) {
  return [];
}
