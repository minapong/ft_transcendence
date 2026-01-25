import { requireAuth } from "../plugins/auth.guard.js";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
    createTournament,
    registerUserToTournament,
    startTournament,
    recordMatchResult,
    advanceRound,
	getTournament,
	getActiveTournament,
} from "../logic/tournamentManager.js";

import { 
	MatchDTO, 
} from "../types/tournament.js";

// Request body types
type StartTournamentBody = { name: string; max_players: number; tournamentId?: number };
type RegisterUserBody = { tournamentId: number};
type ReportResultBody = { matchId: number; winnerId: number, scoreP1: number, scoreP2: number };
type AdvanceRoundBody = { tournamentId: number };
type GetTournamentBody = { tournamentId: number };

export async function registerTournamentRoutes(server: FastifyInstance) {

    server.post<{ Body: StartTournamentBody }>(
        "/api/tournament/create", 
         { preHandler: requireAuth }, 
         async (req, reply) => {
        const { name, max_players } = req.body;
        try {
            const tournament = await createTournament(name, max_players);
            return reply.send({ success: true, tournament });
        } catch (err: any) {
            return reply.code(400).send({ error: err.message });
        }
    });

    server.post<{ Body: RegisterUserBody }>(
        "/api/tournament/register", 
         { preHandler: requireAuth }, 
         async (req,reply) => {
        const { tournamentId } = req.body;
        const { userId } = req.user as any;
        try {
            const playerId = await registerUserToTournament(tournamentId, userId);
            return reply.send({ success: true, playerId });
        } catch (err: any) {
            return reply.code(400).send({ error: err.message });
        }
    });

    server.post<{ Body: StartTournamentBody }>(
        "/api/tournament/start",
         { preHandler: requireAuth },
          async (req,reply) => {
        const { tournamentId} = req.body;
        if (!tournamentId) return reply.status(400).send({ error: "tournamentId is required" });

        try {
            const tournamentOrNull = await startTournament(tournamentId);
            if (!tournamentOrNull) return reply.status(400).send({ error: "Unable to start tournament" });

            return reply.send({ success: true, tournament: tournamentOrNull });
        } catch (err: any) {
            return reply.code(400).send({ error: err.message });
        }
    });

    server.post<{ Body: ReportResultBody }>(
        "/api/tournament/result", 
         { preHandler: requireAuth },
          async (req, reply ) => {
        const { matchId, winnerId, scoreP1, scoreP2 } = req.body;
        try {
            const matchRaw = await recordMatchResult(matchId, winnerId, scoreP1, scoreP2);

            // Ensure status is properly typed
            const match: MatchDTO = {
                ...matchRaw,
                status: matchRaw.status === "finished" ? "finished" : "pending"
            };

            return reply.send({ success: true, match });
        } catch (err: any) {
            return reply.code(400).send({ error: err.message });
        }
    });

    server.post<{ Body: AdvanceRoundBody }>(
        "/api/tournament/next", 
         { preHandler: requireAuth },
          async (req, reply) => {
        const { tournamentId } = req.body;
        try {
            const tournamentOrNull = await advanceRound(tournamentId);
            if (!tournamentOrNull) return reply.status(400).send({ error: "Unable to advance round" });

            return reply.send({ success: true, tournament: tournamentOrNull });
        } catch (err: any) {
            return reply.code(400).send({ error: err.message });
        }
    });

    server.post<{ Body: GetTournamentBody }>(
        "/api/tournament/get",  
        { preHandler: requireAuth }, 
        async (req,reply) => {
        const { tournamentId } = req.body;
        try {
            const tournamentOrNull = await getTournament(tournamentId); 
            if (!tournamentOrNull) {
				return reply.status(404).send({ error: "Tournament not found" });
			}
            return reply.send({ success: true, tournament: tournamentOrNull });
        } catch (err: any) {
            return reply.code(400).send({ error: err.message });
        }
    });

	server.get(
        "/api/tournament/active",
         { preHandler: requireAuth }, 
         async (_req, reply) => {
		try {
            const activeTournament = await getActiveTournament();

            // Always 200, even if null
            return reply.send({ 
                success: true, 
                tournament: activeTournament || null 
            });
		} catch (err: any) {
		  return reply.code(500).send({ error: err.message });
		}
	  });
}