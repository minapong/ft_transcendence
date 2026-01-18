import { FastifyInstance } from 'fastify';
import { TournamentRepo } from '../repositories/tournament.repo.js';
import { MatchService } from '../services/match.services.js';
import { MatchRepo } from '../repositories/match.repo.js';
import { UserRepo } from '../repositories/user.repo.js';

export default async function apiRoutes(app: FastifyInstance) {
 app.get("/users/:id", async (req: any, reply) => {
    const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return reply.code(400).send({ error: "Invalid user id" });
  }

  const u = await UserRepo.findById(id);
  if (!u) return reply.code(404).send({ error: "User not found" });
  return reply.send(u);
});

  app.post('/tournaments', async (req: any, reply) => {
    const { name } = req.body;
    const t = await TournamentRepo.create(name);
    return reply.code(201).send(t);
  });

  app.post('/tournaments/:id/players', async (req: any, reply) => {
    const tournamentId = Number(req.params.id);
    const { userId, alias } = req.body;
    const p = await TournamentRepo.addPlayer(tournamentId, userId ?? null, alias);
    return reply.code(201).send(p);
  });

  app.post('/matches', async (req: any, reply) => {
    // players: [{ userId, score, isWinner }]
    const { players } = req.body;
    const match = await MatchService.createMatchWithPlayers(players);
    return reply.code(201).send(match);
  });

  app.post('/matches/:id/finalize', async (req: any, reply) => {
    const matchId = Number(req.params.id);
    await MatchService.finalizeAndUpdateStats(matchId);
    return reply.send({ ok: true });
  });

  app.get('/matches/:id/players', async (req: any, reply) => {
    const matchId = Number(req.params.id);
    const players = await MatchRepo.getMatchPlayers(matchId);
    return reply.send(players);
  });
}
