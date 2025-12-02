import { prisma } from '../db/prisma.ts';

export const StatsRepo = {
  getByUserId: (userId: number) =>
    prisma.statsUser.findUnique({ where: { user_id: userId } }),

  upsertAfterMatch: async (userId: number, { winsDelta = 0, lossesDelta = 0, scoreDelta = 0, lastMatchAt = new Date() } = {}) =>
    prisma.statsUser.upsert({
      where: { user_id: userId },
      update: {
        wins: { increment: winsDelta },
        losses: { increment: lossesDelta },
        total_score: { increment: scoreDelta },
        last_match_at: lastMatchAt
      },
      create: {
        user_id: userId,
        wins: winsDelta,
        losses: lossesDelta,
        total_score: scoreDelta,
        last_match_at: lastMatchAt
      }
    })
};
