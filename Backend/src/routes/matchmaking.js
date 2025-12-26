import { joinQueue, getActiveMatches, getQueue } from "../logic/matchmakingManager.js";
export async function registerMatchmakingRoutes(server) {
    // Join matchmaking queue
    server.post("/api/matchmaking/join", async (req, reply) => {
        const { id, name } = req.body;
        if (!id || !name) {
            return reply.code(400).send({ error: "Missing player info" });
        }
        const result = joinQueue({ id, name });
        reply.send(result);
    });
    // Get active matches
    server.get("/api/matchmaking/active", async (_req, reply) => {
        reply.send(getActiveMatches());
    });
    // Get queue
    server.get("/api/matchmaking/queue", async (_req, reply) => {
        reply.send(getQueue());
    });
}
