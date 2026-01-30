// src/repositories/stats.repo.ts
import { prisma } from '../db/prisma.js';
import type { Prisma } from '@prisma/client';

// ─────────────────────────────────────────────
// Type helpers (precise Prisma shapes)
// ─────────────────────────────────────────────
type MatchWithPlayers = Prisma.MatchGetPayload<{
  include: {
    players: {
      include: { user: { select: { id: true; username: true } } };
    };
  };
}>;

type PlayerEntryWithUser = Prisma.MatchPlayerGetPayload<{
  include: { user: { select: { id: true; username: true } } };
}>;

type LeaderboardEntry = {
  user: {
    id: number;
    username: string;
  };
  wins: number;
  losses: number;
  totalGames: number;
  total_score?: number;
  winRate: number;
  tournament_championships: number;
};

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


function formatMatchForFrontend(match: MatchWithPlayers) {
  const players = match.players || [];
  const p1 = players[0];
  const p2 = players[1];

  const winner = players.find((p: PlayerEntryWithUser) => p.is_winner);
  const loser = players.find((p: PlayerEntryWithUser) => !p.is_winner);

  return {
    id: match.id,
    finished_at: match.finished_at?.toISOString() || null,
    game_name: match.game_name,
    matchPlayers: players.map((p: PlayerEntryWithUser) => ({
      user: p.user ? { id: p.user.id, username: p.user.username } : null,
      score: p.score,
      is_winner: p.is_winner,
    })),
    // For easy frontend rendering
    p1_username: p1?.user?.username || "Unknown",
    p2_username: p2?.user?.username || "Unknown",
    winner_username: winner?.user?.username || null,
    score_p1: p1?.score ?? "?",
    score_p2: p2?.score ?? "?",
  };
}

// ─────────────────────────────────────────────
// Aggregated stats for a single user
// ─────────────────────────────────────────────
export async function getUserAggregatedStats(userId: number) {
  const stats = await prisma.statsUser.findUnique({
    where: { user_id: userId },
    select: {
      wins: true,
      losses: true,
      tournament_championships: true,
      last_match_at: true,
    },
  });

  // Return default zero stats for users who haven't played yet
  if (!stats) {
    return {
      wins: 0,
      losses: 0,
      tournamentWins: 0,
      lastMatchAt: null,
    };
  }

  return {
    wins: stats.wins,
    losses: stats.losses,
    tournamentWins: stats.tournament_championships,
    lastMatchAt: stats.last_match_at?.toISOString() || null,
  };
}

// ─────────────────────────────────────────────
// Global leaderboard
// ─────────────────────────────────────────────
export async function getLeaderboardData(limit: number = 50): Promise<LeaderboardEntry[]> {
  const raw = await prisma.statsUser.findMany({
    take: limit,
    orderBy: [
      { wins: 'desc' },
      { losses: 'asc' },
    ],
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  return raw.map((entry: any) => {
    const totalGames = entry.wins + entry.losses;
    const winRate = totalGames > 0
      ? Math.round((entry.wins / totalGames) * 100)
      : 0;

    return {
      user: {
        id: entry.user.id,
        username: entry.user.username,
      },
      wins: entry.wins,
      losses: entry.losses,
      totalGames,
      total_score: entry.total_score || 0,
      winRate,
      tournament_championships: entry.tournament_championships,
    };
  });
}

// ─────────────────────────────────────────────
// Recent global match history
// ─────────────────────────────────────────────
export async function getRecentMatchesGlobal(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;

  const matches = await prisma.match.findMany({
    skip,
    take: limit,
    where: { finished_at: { not: null } },
    orderBy: { finished_at: 'desc' },
    include: {
      players: {
        include: {
          user: { select: { id: true, username: true } },
        },
        orderBy: { id: 'asc' },
      },
    },
  });

  return matches.map(formatMatchForFrontend);
}

// ─────────────────────────────────────────────
// Recent matches for a specific user
// ─────────────────────────────────────────────
export async function getRecentMatchesForUser(
  userId: number,
  page: number = 1,
  limit: number = 10
) {
  const skip = (page - 1) * limit;

  const playerEntries = await prisma.matchPlayer.findMany({
    skip,
    take: limit,
    where: { user_id: userId },
    orderBy: { match: { finished_at: 'desc' } },
    include: {
      match: {
        include: {
          players: {
            include: { user: { select: { id: true, username: true } } },
            orderBy: { id: 'asc' },
          },
        },
      },
    },
  });

  return playerEntries.map((entry: any) => formatMatchForFrontend(entry.match));
}

// ─────────────────────────────────────────────
// Achievements (static + progress-based)
// ─────────────────────────────────────────────
export async function getUnlockedAchievements(userId: number) {
  const stats = await prisma.statsUser.findUnique({
    where: { user_id: userId },
    select: { wins: true, tournament_championships: true },
  }) || { wins: 0, tournament_championships: 0 };

  return [
    {
      id: 1,
      name: "First Victory",
      description: "Win your first game",
      unlocked: stats.wins >= 1,
      progress: `${stats.wins}/1`,
    },
    {
      id: 2,
      name: "Tournament Legend",
      description: "Win a tournament",
      unlocked: stats.tournament_championships >= 1,
      progress: `${stats.tournament_championships}/1`,
    },
    {
      id: 3,
      name: "Pro Gamer",
      description: "Reach 10 wins",
      unlocked: stats.wins >= 10,
      progress: `${stats.wins}/10`,
    },
  ];
}

export const StatsRepo = {
  updateUserGameStats,
  updateUserTournamentStats,
  getUserAggregatedStats,
  getLeaderboardData,
  getRecentMatchesGlobal,
  getRecentMatchesForUser,
  getUnlockedAchievements,
};