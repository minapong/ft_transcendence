import { prisma } from '../db/prisma.js';

export const MatchRepo = {
  createEmptyMatch: () =>
    prisma.match.create({ data: {} }),

  addPlayerToMatch: (matchId: number, userId: number | null, score = 0, isWinner = false) =>
    prisma.matchPlayer.create({
      data: { match_id: matchId, user_id: userId ?? null, score, is_winner: isWinner }
    }),

  finalizeMatch: (matchId: number, winnerUserId: number | null) =>
    prisma.match.update({ where: { id: matchId }, data: { finished_at: new Date(), winner_id: winnerUserId } }),

  getMatchPlayers: (matchId: number) =>
    prisma.matchPlayer.findMany({ where: { match_id: matchId } })
};
