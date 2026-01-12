import { prisma } from '../db/prisma.js';
export const TournamentRepo = {
    create: (name, maxPlayers = 4) => prisma.tournament.create({ data: { name, maxPlayers: maxPlayers } }),
    findById: (id) => prisma.tournament.findUnique({ where: { id } }),
    // addPlayer: (tournamentId, userId, alias) => prisma.tournamentPlayer.create({
    //     data: { tournament_id: tournamentId, user_id: userId, alias }
    // }),
     addPlayer: async (tournamentId, userId, alias) => {
    const count = await prisma.tournamentPlayer.count({
      where: { tournament_id: tournamentId }
    });

    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      select: { max_players: true }
    });

    if (count >= tournament.max_players) {
      throw new Error('Tournament is full');
    }

    return prisma.tournamentPlayer.create({
      data: {
        tournament_id: tournamentId,
        user_id: userId,
        alias
      }
    });
  },
  
    listPlayers: (tournamentId) => prisma.tournamentPlayer.findMany({
        where: { tournament_id: tournamentId },
        include: { user: true }
    })
};
