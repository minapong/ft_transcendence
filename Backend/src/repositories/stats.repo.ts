import { prisma } from '../db/prisma.js';

export async function updateUserGameStats(
  userId: number,
  isWinner: boolean
): Promise<void> {
  await prisma.statsUser.upsert({
    where: { user_id: userId },
    update: {
      [isWinner ? "wins" : "losses"]: { increment: 1 },
      last_match_at: new Date(),
    },
    create: {
      user_id: userId,
      [isWinner ? "wins" : "losses"]: 1,
      last_match_at: new Date(),
    },
  });
}

// Called ONLY when a tournament finishes (champion is crowned)
export async function updateUserTournamentStats(winnerId: number): Promise<void> {
  await prisma.statsUser.upsert({
    where: { user_id: winnerId },
    update: {
      tournament_championships: { increment: 1 },
    },
    create: {
      user_id: winnerId,
      tournament_championships: 1,
    },
  });
}

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
