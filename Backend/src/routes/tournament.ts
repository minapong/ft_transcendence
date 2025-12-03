import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
	createTournament,
	recordMatchResult,
	advanceRound,
	Tournament,
	Match,
	getTournament
} from "../logic/tournamentManager.js";

// Define types for each route body
type StartTournamentBody = {
	players: string[];
};

type ReportResultBody = {
	tournamentId: number;
	matchIndex: number;
	winner: string;
};

type AdvanceRoundBody = {
	tournamentId: number;
};

export async function registerTournamentRoutes(server: FastifyInstance) {
  // Start tournament
  server.post(
    "/api/tournament/start",
    async (
      req: FastifyRequest<{ Body: StartTournamentBody }>,
      reply: FastifyReply
    ) => {
      const { players } = req.body;
      const result: Tournament | { error: string } = createTournament(players);
      reply.send(result);
    }
  );

  // Report match result
  server.post(
    "/api/tournament/result",
    async (
      req: FastifyRequest<{ Body: ReportResultBody }>,
      reply: FastifyReply
    ) => {
      const { tournamentId, matchIndex, winner } = req.body;
      const result: { success: true; match: Match } | { error: string } | {message: string}=
        recordMatchResult(tournamentId, matchIndex, winner);
      reply.send(result);
    }
  );

  // Advance to next round
  server.post(
    "/api/tournament/next",
    async (
      req: FastifyRequest<{ Body: AdvanceRoundBody }>,
      reply: FastifyReply
    ) => {
      const { tournamentId } = req.body;
      const result: Tournament | { error: string } | {message: string} = advanceRound(tournamentId);
      reply.send(result);
    }
  );

    // Advance to next round
	server.post(
		"/api/tournament/get",
		async (
		  req: FastifyRequest<{ Body: AdvanceRoundBody }>,
		  reply: FastifyReply
		) => {
		  const { tournamentId } = req.body;
		  const result: Tournament | { error: string } = getTournament(tournamentId);
		  reply.send(result);
		}
	  );
}
