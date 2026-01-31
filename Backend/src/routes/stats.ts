import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  getUserStats,
  getLeaderboard,
  getGlobalMatchHistory,
  getUserMatchHistory,
  getUserAchievements,
} from "../logic/statsManager.js";
import { requireAuth } from "../plugins/auth.guard.js";

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
  // Public: Global Leaderboard
  // ─────────────────────────────────────────────
  server.get("/api/stats/leaderboard", async (req: FastifyRequest<{ Querystring: LeaderboardQuery }>, reply: FastifyReply) => {
    try {
      const limit = Number(req.query.limit) || 50;
      const data = await getLeaderboard(limit);
      reply.send({ success: true, data } as SuccessResponse<typeof data>);
    } catch (err: any) {
      reply.status(500).send({ error: err.message || "Failed to fetch leaderboard" });
    }
  });

  // ─────────────────────────────────────────────
  // Public: Global Match History
  // ─────────────────────────────────────────────
  server.get("/api/stats/history/global", async (req: FastifyRequest<{ Querystring: HistoryQuery }>, reply: FastifyReply) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const data = await getGlobalMatchHistory(page, limit);
      reply.send({ success: true, data } as SuccessResponse<typeof data>);
    } catch (err: any) {
      reply.status(500).send({ error: err.message || "Failed to fetch global history" });
    }
  });

  server.get("/api/stats/user/:id", { preHandler: requireAuth }, async (req: any, reply) => {
    const userId = Number(req.params.id);
    if (isNaN(userId)) return reply.code(400).send({ error: "Invalid user ID" });

    const data = await getUserStats(userId);
    if (!data) return reply.code(404).send({ error: "User not found or no stats available" });

    reply.send({ success: true, data });
  });

  server.get("/api/stats/history/user/:id", { preHandler: requireAuth }, async (req: any, reply) => {
    const userId = Number(req.params.id);
    if (isNaN(userId)) return reply.code(400).send({ error: "Invalid user ID" });

    const page = Number(req.query?.page) || 1;
    const limit = Number(req.query?.limit) || 10;

    const data = await getUserMatchHistory(userId, page, limit);
    reply.send({ success: true, data });
  });

  server.get("/api/stats/achievements/:id", { preHandler: requireAuth }, async (req: any, reply) => {
    const userId = Number(req.params.id);
    if (isNaN(userId)) return reply.code(400).send({ error: "Invalid user ID" });

    const data = await getUserAchievements(userId);
    reply.send({ success: true, data });
  });
}