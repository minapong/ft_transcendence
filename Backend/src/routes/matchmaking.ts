import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  joinQueue,
  getActiveMatches,
  getActiveMatchForUser,
  startMatch,
  finishMatch,
  isQueued,
} from "../logic/matchmakingManager";

// ─────────────────────────────────────────────
// Request body types
// ─────────────────────────────────────────────
export interface JoinQueueBody {
  userId: number;
  username: string;
}

export interface StartMatchBody {
  matchId: string;
}

export interface FinishMatchBody {
  matchId: string;
  winnerId: number;
}

// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────
export async function registerMatchmakingRoutes(server: FastifyInstance) {

  // Join queue
  server.post(
    "/api/matchmaking/join",
    async (req: FastifyRequest<{ Body: JoinQueueBody }>, reply: FastifyReply) => {
      const { userId, username } = req.body;
      try {
        const result = joinQueue({ id: userId, name: username });
        reply.send(result);
      } catch (err: any) {
        console.error("Error joining queue:", err);
        reply.status(400).send({ error: err.message });
      }
    }
  );

  // Start match
  server.post(
    "/api/matchmaking/start",
    async (req: FastifyRequest<{ Body: StartMatchBody }>, reply: FastifyReply) => {
      try {
        const { matchId } = req.body;
        if (!matchId) return reply.status(400).send({ error: "matchId is required" });

        const match = startMatch(matchId);
        if (!match) return reply.status(404).send({ error: "Match not found" });

        reply.send(match);
      } catch (err: any) {
        console.error("Error starting match:", err);
        reply.status(400).send({ error: err.message });
      }
    }
  );

  // Finish match
  server.post(
    "/api/matchmaking/finish",
    async (req: FastifyRequest<{ Body: FinishMatchBody }>, reply: FastifyReply) => {
      try {
        const { matchId, winnerId } = req.body;
        if (!matchId || winnerId === undefined) {
          return reply.status(400).send({ error: "matchId and winnerId are required" });
        }

        const result = finishMatch(matchId, winnerId);
        reply.send(result);
      } catch (err: any) {
        console.error("Error finishing match:", err);
        reply.status(400).send({ error: err.message });
      }
    }
  );

  //State checking for a userid
  server.get(
    "/api/matchmaking/state/:userId",
     async (req: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) => {
      try {
        const userId = Number(req.params.userId);

        const match = getActiveMatchForUser(userId);
        if (match) {
          return reply.send({ state: "active", match });
        }

        if (isQueued(userId)) {
          return reply.send({ state: "queued" });
        }

        return reply.send({ state: "idle" });

      } catch (err: any) {
        console.error("Error getting matchmaking state:", err);
        reply.status(500).send({ error: "Internal server error" });
      }
    }
  );


  // Get all active matches (debug/admin)
  server.get("/api/matchmaking/all", async (_req, reply) => {
    try {
      const matches = getActiveMatches();
      reply.send(matches);
    } catch (err: any) {
      console.error("Error getting all active matches:", err);
      reply.status(400).send({ error: err.message });
    }
  });
}