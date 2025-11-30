import { prisma } from '../db/prisma';
import { MatchRepo } from '../repositories/match.repo';
import { StatsRepo } from '../repositories/stats.repo';

export const MatchService = {
  createMatchWithPlayers: async (players: { userId: number | null; score?: number | null; isWinner?: boolean }[]) => {
    return prisma.$transaction(async (tx) => {
      const match = await tx.match.create({ data: {} });
      for (const p of players) {
        await tx.matchPlayer.create({
          data: {
            match_id: match.id,
            user_id: p.userId ?? null,
            score: p.score ?? 0,
            is_winner: p.isWinner ?? false
          }
        });
      }
      return match;
    });
  },

  finalizeAndUpdateStats: async (matchId: number) => {
    return prisma.$transaction(async (tx) => {
      const players = await tx.matchPlayer.findMany({ where: { match_id: matchId } });
      const winner = players.find(p => p.is_winner);
      await tx.match.update({ where: { id: matchId }, data: { finished_at: new Date(), winner_id: winner?.user_id ?? null } });

      for (const p of players) {
        if (p.user_id == null) continue;   // skip AI / guest players

        await tx.statsUser.upsert({
          where: { user_id: p.user_id },
          update: {
            wins: { increment: p.is_winner ? 1 : 0 },
            losses: { increment: p.is_winner ? 0 : 1 },
            total_score: { increment: p.score },
            last_match_at: new Date()
          },
          create: {
            user_id: p.user_id,
            wins: p.is_winner ? 1 : 0,
            losses: p.is_winner ? 0 : 1,
            total_score: p.score,
            last_match_at: new Date()
          }
        });
      }
    });
  }
};
