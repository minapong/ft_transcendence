import { prisma } from '../db/prisma.js';
export const TournamentRepo = {
    create: (name) => prisma.tournament.create({ data: { name } }),
    findById: (id) => prisma.tournament.findUnique({ where: { id } }),
    addPlayer: (tournamentId, userId, alias) => prisma.tournamentPlayer.create({
        data: { tournament_id: tournamentId, user_id: userId, alias }
    }),
    listPlayers: (tournamentId) => prisma.tournamentPlayer.findMany({
        where: { tournament_id: tournamentId },
        include: { user: true }
    })
};
