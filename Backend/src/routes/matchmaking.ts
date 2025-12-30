import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  joinQueue,
  getActiveMatches,
  getQueue,
  finishMatch,
  startMatch,
  getActiveMatchForUser,
} from "../logic/matchmakingManager";

// Define the body types for the requests
export interface JoinQueueBody {
  userId: number; // User's ID
  username: string; // Username of the player
}

export interface StartMatchBody {
  matchId: string; // ID of the match to start
}

export interface FinishMatchBody {
  matchId: string; // ID of the match to finish
  winnerId: number; // ID of the winner
}

export async function registerMatchmakingRoutes(server: FastifyInstance) {

  // Route: join queue
  server.post(
    "/api/matchmaking/join",
    async (
      req: FastifyRequest<{ Body: JoinQueueBody }>, 
      reply: FastifyReply
    ) => {
      const { userId, username } = req.body;
      reply.send(joinQueue({ id: userId, name: username }));
    }
  );

  // Route: get active match for user
  server.get(
    "/api/matchmaking/active/:userId",
    async (
      req: FastifyRequest<{ Params: { userId: string } }>,
      reply: FastifyReply
    ) => {
      const userId = Number(req.params.userId);
      reply.send(getActiveMatchForUser(userId));
    }
  );

  // Route: start match
  server.post(
    "/api/matchmaking/start",
    async (
      req: FastifyRequest<{ Body: StartMatchBody }>,
      reply: FastifyReply
    ) => {
      const { matchId } = req.body;
      reply.send(startMatch(matchId));
    }
  );

  // Route: finish match
  server.post(
    "/api/matchmaking/finish",
    async (
      req: FastifyRequest<{ Body: FinishMatchBody }>, 
      reply: FastifyReply
    ) => {
      const { matchId, winnerId } = req.body;
      reply.send(finishMatch(matchId, winnerId));
    }
  );

  // Route: get matchmaking queue (no body, no params)
  server.get("/api/matchmaking/queue", async (_req: FastifyRequest, reply: FastifyReply) => {
    reply.send(getQueue());
  });

  // Route: get all active matches (no body, no params)
  server.get("/api/matchmaking/all", async (_req: FastifyRequest, reply: FastifyReply) => {
    reply.send(getActiveMatches());
  });
}
