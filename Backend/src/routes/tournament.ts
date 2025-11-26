import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
    createTournament,
    registerUserToTournament,
    startTournament,
    recordMatchResult,
    advanceRound,
    TournamentDTO,
    MatchDTO
} from "../logic/tournamentManager";

// Request body types
type StartTournamentBody = { name: string; maxPlayers: number; tournamentId?: number };
type RegisterUserBody = { tournamentId: number; userId: number };
type ReportResultBody = { matchId: number; winnerId: number };
type AdvanceRoundBody = { tournamentId: number };
type GetTournamentBody = { tournamentId: number };

export async function registerTournamentRoutes(server: FastifyInstance) {

    server.post("/api/tournament/create", async (
        req: FastifyRequest<{ Body: StartTournamentBody }>,
        reply: FastifyReply
    ) => {
        const { name } = req.body;
        try {
            const tournament = createTournament(name);
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
            const playerId = registerUserToTournament(tournamentId, userId);
            reply.send({ success: true, playerId });
        } catch (err: any) {
            reply.status(400).send({ error: err.message });
        }
    });

    server.post("/api/tournament/start", async (
        req: FastifyRequest<{ Body: StartTournamentBody }>,
        reply: FastifyReply
    ) => {
        const { tournamentId, maxPlayers } = req.body;
        if (!tournamentId) return reply.status(400).send({ error: "tournamentId is required" });

        try {
            const tournamentOrNull = startTournament(tournamentId, maxPlayers);
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
            const matchRaw = recordMatchResult(matchId, winnerId);

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
            const tournamentOrNull = advanceRound(tournamentId);
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
            const tournamentOrNull = startTournament(tournamentId, 0); 
            if (!tournamentOrNull) return reply.status(404).send({ error: "Tournament not found" });

            reply.send({ success: true, tournament: tournamentOrNull });
        } catch (err: any) {
            reply.status(400).send({ error: err.message });
        }
    });
}