import { createTournament, recordMatchResult, advanceRound, getTournament } from "../logic/tournamentManager.js";
export async function registerTournamentRoutes(server) {
    // Start tournament
    server.post("/api/tournament/start", async (req, reply) => {
        const { players } = req.body;
        const result = createTournament(players);
        reply.send(result);
    });
    // Report match result
    server.post("/api/tournament/result", async (req, reply) => {
        const { tournamentId, matchIndex, winner } = req.body;
        const result = recordMatchResult(tournamentId, matchIndex, winner);
        reply.send(result);
    });
    // Advance to next round
    server.post("/api/tournament/next", async (req, reply) => {
        const { tournamentId } = req.body;
        const result = advanceRound(tournamentId);
        reply.send(result);
    });
    // Advance to next round
    server.post("/api/tournament/get", async (req, reply) => {
        const { tournamentId } = req.body;
        const result = getTournament(tournamentId);
        reply.send(result);
    });
}
