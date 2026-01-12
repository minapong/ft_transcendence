import { prisma } from '../db/prisma.js';

export const TournamentRepo = {
  create: (name?: string,  maxPlayers = 4) =>
    prisma.tournament.create({ data: { name, max_players: maxPlayers } }),

  findById: (id: number) =>
    prisma.tournament.findUnique({ where: { id } }),

  addPlayer: async (tournamentId: number, userId: number | null, alias?: string) => {
     const count = await prisma.tournamentPlayer.count({
      where: { tournament_id: tournamentId }
    });

    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      select: { max_players: true }
    });
    
    if (!tournament) {
      throw new Error('Tournament not found');
    }

    if (count >= tournament.max_players) {
      throw new Error('Tournament is full');
    }

    return prisma.tournamentPlayer.create({
      data: {
        tournament_id: tournamentId,
        user_id: userId,
        alias,
      },
    });
  },


  listPlayers: (tournamentId: number) =>
    prisma.tournamentPlayer.findMany({
      where: { tournament_id: tournamentId },
      include: { user: true }
    })
};
