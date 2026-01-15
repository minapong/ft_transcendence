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
type RegisterUserBody = { tournamentId: number; userId: number };
type ReportResultBody = { matchId: number; winnerId: number };
type AdvanceRoundBody = { tournamentId: number };
type GetTournamentBody = { tournamentId: number };

export async function registerTournamentRoutes(server: FastifyInstance) {

    server.post("/api/tournament/create", async (
        req: FastifyRequest<{ Body: StartTournamentBody }>,
        reply: FastifyReply
    ) => {
        const { name, max_players } = req.body;
        try {
            const tournament = await createTournament(name, max_players);
            reply.send({ success: true, tournament });
        } catch (err: any) {
            reply.status(400).send({ error: err.message });
        }
    });

    server.post("/api/tournament/register", async (
        req: FastifyRequest<{ Body: RegisterUserBody }>,
        reply: FastifyReply
    ) => {
        const { tournamentId, userId } = req.body;
        try {
            const playerId = await registerUserToTournament(tournamentId, userId);
            reply.send({ success: true, playerId });
        } catch (err: any) {
            reply.status(400).send({ error: err.message });
        }
    });

    server.post("/api/tournament/start", async (
        req: FastifyRequest<{ Body: StartTournamentBody }>,
        reply: FastifyReply
    ) => {
        const { tournamentId} = req.body;
        if (!tournamentId) return reply.status(400).send({ error: "tournamentId is required" });

        try {
            const tournamentOrNull = await startTournament(tournamentId);
            if (!tournamentOrNull) return reply.status(400).send({ error: "Unable to start tournament" });

            reply.send({ success: true, tournament: tournamentOrNull });
        } catch (err: any) {
            reply.status(400).send({ error: err.message });
        }
    });

    server.post("/api/tournament/result", async (
        req: FastifyRequest<{ Body: ReportResultBody }>,
        reply: FastifyReply
    ) => {
        const { matchId, winnerId } = req.body;
        try {
            const matchRaw = await recordMatchResult(matchId, winnerId);

            // Ensure status is properly typed
            const match: MatchDTO = {
                ...matchRaw,
                status: matchRaw.status === "finished" ? "finished" : "pending"
            };

            reply.send({ success: true, match });
        } catch (err: any) {
            reply.status(400).send({ error: err.message });
        }
    });

    server.post("/api/tournament/next", async (
        req: FastifyRequest<{ Body: AdvanceRoundBody }>,
        reply: FastifyReply
    ) => {
        const { tournamentId } = req.body;
        try {
            const tournamentOrNull = await advanceRound(tournamentId);
            if (!tournamentOrNull) return reply.status(400).send({ error: "Unable to advance round" });

            reply.send({ success: true, tournament: tournamentOrNull });
        } catch (err: any) {
            reply.status(400).send({ error: err.message });
        }
    });

    server.post("/api/tournament/get", async (
        req: FastifyRequest<{ Body: GetTournamentBody }>,
        reply: FastifyReply
    ) => {
        const { tournamentId } = req.body;
        try {
            const tournamentOrNull = await getTournament(tournamentId); 
            if (!tournamentOrNull) {
				return reply.status(404).send({ error: "Tournament not found" });
			}
            reply.send({ success: true, tournament: tournamentOrNull });
        } catch (err: any) {
            reply.status(400).send({ error: err.message });
        }
    });

	server.get("/api/tournament/active", async (_req: FastifyRequest, reply: FastifyReply) => {
		try {
		  const activeTournament = await getActiveTournament();
		  if (!activeTournament) {
			return reply.status(404).send({ error: "No active tournament" });
		  }
		  reply.send({ success: true, tournament: activeTournament });
		} catch (err: any) {
		  reply.status(400).send({ error: err.message });
		}
	  });
}