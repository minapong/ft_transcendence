import { TournamentRepo } from '../repositories/tournament.repo.js';
import { MatchService } from '../services/match.services.js';
import { MatchRepo } from '../repositories/match.repo.js';
import { UserRepo } from '../repositories/user.repo.js';
export default async function apiRoutes(app) {
    app.get('/api/users/:id', async (req, reply) => {
        const u = await UserRepo.findById(Number(req.params.id));
        return reply.send(u);
    });
    app.post('/api/tournaments', async (req, reply) => {
        const { name } = req.body;
        const t = await TournamentRepo.create(name);
        return reply.code(201).send(t);
    });
    app.post('/api/tournaments/:id/players', async (req, reply) => {
        const tournamentId = Number(req.params.id);
        const { userId, alias } = req.body;
        const p = await TournamentRepo.addPlayer(tournamentId, userId ?? null, alias);
        return reply.code(201).send(p);
    });
    app.post('/api/matches', async (req, reply) => {
        // players: [{ userId, score, isWinner }]
        const { players } = req.body;
        const match = await MatchService.createMatchWithPlayers(players);
        return reply.code(201).send(match);
    });
    app.post('/api/matches/:id/finalize', async (req, reply) => {
        const matchId = Number(req.params.id);
        await MatchService.finalizeAndUpdateStats(matchId);
        return reply.send({ ok: true });
    });
    app.get('/api/matches/:id/players', async (req, reply) => {
        const matchId = Number(req.params.id);
        const players = await MatchRepo.getMatchPlayers(matchId);
        return reply.send(players);
    });
}
