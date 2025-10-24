import { FastifyInstance } from "fastify";
import { createTournament } from "../logic/tournamentManager";

export async function registerTournamentRoutes(server: FastifyInstance) {
  server.post("/api/tournament/start", async (req, reply) => {
    const { players } = req.body as any;
    const result = createTournament(players);
    reply.send(result);
  });
}