import { FastifyInstance } from "fastify";
import {
  createTournament,
  recordMatchResult,
  advanceRound,
} from "../logic/tournamentManager";

export async function registerTournamentRoutes(server: FastifyInstance) {
  // Start tournament
  server.post("/api/tournament/start", async (req, reply) => {
    const { players } = req.body as any;
    const result = createTournament(players);
    reply.send(result);
  });

  // Report match result
  server.post("/api/tournament/result", async (req, reply) => {
    const { tournamentId, matchIndex, winner } = req.body as any;
    const result = recordMatchResult(tournamentId, matchIndex, winner);
    reply.send(result);
  });

  // Advance to next round
  server.post("/api/tournament/next", async (req, reply) => {
    const { tournamentId } = req.body as any;
    const result = advanceRound(tournamentId);
    reply.send(result);
  });
}