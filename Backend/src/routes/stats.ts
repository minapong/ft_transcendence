import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  getUserStats,
  getLeaderboard,
  getGlobalMatchHistory,
  getUserMatchHistory,
  getUserAchievements,
} from "../logic/statsManager";

// ─────────────────────────────────────────────
// Request parameter types
// ─────────────────────────────────────────────
type LeaderboardQuery = { limit?: string };
type HistoryQuery = { page?: string; limit?: string };
type UserParam = { Params: { id: string } };

// ─────────────────────────────────────────────
// Standardized 
// ─────────────────────────────────────────────
type SuccessResponse<T> = { success: true; data: T };
type ErrorResponse = { error: string };

export async function registerStatsRoutes(server: FastifyInstance) {

  // ─────────────────────────────────────────────
  // Global Leaderboard
  // ─────────────────────────────────────────────
  server.get(
    "/api/stats/leaderboard",
    async (
      req: FastifyRequest<{ Querystring: LeaderboardQuery }>,
      reply: FastifyReply
    ): Promise<void> => {
      try {
        const limit = Number(req.query.limit) || 50;
        const data = await getLeaderboard(limit);

        const response: SuccessResponse<typeof data> = { success: true, data };
        reply.send(response);
      } catch (err: any) {
        const errorResponse: ErrorResponse = { error: err.message || "Failed to fetch leaderboard" };
        reply.status(500).send(errorResponse);
      }
    }
  );

  // ─────────────────────────────────────────────
  // Global Match History (dashboard)
  // ─────────────────────────────────────────────
  server.get(
    "/api/stats/history/global",
    async (
      req: FastifyRequest<{ Querystring: HistoryQuery }>,
      reply: FastifyReply
    ): Promise<void> => {
      try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const data = await getGlobalMatchHistory(page, limit);

        reply.send({ success: true, data } as SuccessResponse<typeof data>);
      } catch (err: any) {
        reply.status(500).send({ error: err.message || "Failed to fetch global history" });
      }
    }
  );

  // ─────────────────────────────────────────────
  // User Personal Stats (profile)
  // ─────────────────────────────────────────────
  server.get(
    "/api/stats/user/:id",
    async (
      req: FastifyRequest<UserParam>,
      reply: FastifyReply
    ): Promise<void> => {
      try {
        const userId = Number(req.params.id);
        if (isNaN(userId)) {
          return reply.status(400).send({ error: "Invalid user ID" });
        }

        const data = await getUserStats(userId);
        if (!data) {
          return reply.status(404).send({ error: "User not found or no stats available" });
        }

        reply.send({ success: true, data } as SuccessResponse<typeof data>);
      } catch (err: any) {
        reply.status(500).send({ error: err.message || "Failed to fetch user stats" });
      }
    }
  );

  // ─────────────────────────────────────────────
  // User Match History (profile)
  // ─────────────────────────────────────────────
  server.get(
    "/api/stats/history/user/:id",
    async (
      req: FastifyRequest<UserParam & { Querystring: HistoryQuery }>,
      reply: FastifyReply
    ): Promise<void> => {
      try {
        const userId = Number(req.params.id);
        if (isNaN(userId)) {
          return reply.status(400).send({ error: "Invalid user ID" });
        }

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const data = await getUserMatchHistory(userId, page, limit);
        reply.send({ success: true, data } as SuccessResponse<typeof data>);
      } catch (err: any) {
        reply.status(500).send({ error: err.message || "Failed to fetch user history" });
      }
    }
  );

  // ─────────────────────────────────────────────
  // User Achievements (profile)
  // ─────────────────────────────────────────────
  server.get(
    "/api/stats/achievements/:id",
    async (
      req: FastifyRequest<UserParam>,
      reply: FastifyReply
    ): Promise<void> => {
      try {
        const userId = Number(req.params.id);
        if (isNaN(userId)) {
          return reply.status(400).send({ error: "Invalid user ID" });
        }

        const data = await getUserAchievements(userId);
        reply.send({ success: true, data } as SuccessResponse<typeof data>);
      } catch (err: any) {
        reply.status(500).send({ error: err.message || "Failed to fetch achievements" });
      }
    }
  );
}