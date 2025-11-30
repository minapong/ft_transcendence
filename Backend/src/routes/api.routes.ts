import { FastifyInstance } from 'fastify';
import { TournamentRepo } from '../repositories/tournament.repo';
import { MatchService } from '../services/match.services';
import { MatchRepo } from '../repositories/match.repo';
import { UserRepo } from '../repositories/user.repo';

export default async function apiRoutes(app: FastifyInstance) {
  app.get('/api/users/:id', async (req: any, reply) => {
    const u = await UserRepo.findById(Number(req.params.id));
    return reply.send(u);
  });

  app.post('/api/tournaments', async (req: any, reply) => {
    const { name } = req.body;
    const t = await TournamentRepo.create(name);
    return reply.code(201).send(t);
  });

  app.post('/api/tournaments/:id/players', async (req: any, reply) => {
    const tournamentId = Number(req.params.id);
    const { userId, alias } = req.body;
    const p = await TournamentRepo.addPlayer(tournamentId, userId ?? null, alias);
    return reply.code(201).send(p);
  });

  app.post('/api/matches', async (req: any, reply) => {
    // players: [{ userId, score, isWinner }]
    const { players } = req.body;
    const match = await MatchService.createMatchWithPlayers(players);
    return reply.code(201).send(match);
  });

  app.post('/api/matches/:id/finalize', async (req: any, reply) => {
    const matchId = Number(req.params.id);
    await MatchService.finalizeAndUpdateStats(matchId);
    return reply.send({ ok: true });
  });

  app.get('/api/matches/:id/players', async (req: any, reply) => {
    const matchId = Number(req.params.id);
    const players = await MatchRepo.getMatchPlayers(matchId);
    return reply.send(players);
  });
}
