import { prisma } from '../db/prisma.js';

export const TournamentRepo = {
  create: (name?: string) =>
    prisma.tournament.create({ data: { name } }),

  findById: (id: number) =>
    prisma.tournament.findUnique({ where: { id } }),

  addPlayer: (tournamentId: number, userId: number | null, alias?: string) =>
    prisma.tournamentPlayer.create({
      data: { tournament_id: tournamentId, user_id: userId, alias }
    }),

  listPlayers: (tournamentId: number) =>
    prisma.tournamentPlayer.findMany({
      where: { tournament_id: tournamentId },
      include: { user: true }
    })
};
