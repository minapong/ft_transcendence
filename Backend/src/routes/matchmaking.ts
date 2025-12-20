import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { joinQueue, getActiveMatches, getQueue, Player, finishMatch } from "../logic/matchmakingManager";

interface JoinQueueBody {
	id: string;
	name: string;
}

interface FinishMatchBody {
	matchId: string;
	winnerId: number;
}

export async function registerMatchmakingRoutes(server: FastifyInstance) {
	server.post("/api/matchmaking/join", async (req: FastifyRequest<{ Body: JoinQueueBody }>, reply: FastifyReply) => {
		const { id, name } = req.body;
		if (!id || !name) return reply.code(400).send({ error: "Missing player info" });

		const result = joinQueue({ id, name } as Player);
		reply.send(result);
	});

	server.get("/api/matchmaking/active", async (_req, reply) => reply.send(getActiveMatches()));
	server.get("/api/matchmaking/queue", async (_req, reply) => reply.send(getQueue()));

	server.post("/api/matchmaking/finish", async (req: FastifyRequest<{ Body: FinishMatchBody }>, reply: FastifyReply) => {
		const { matchId, winnerId } = req.body;

		if (!matchId || !winnerId) {
			return reply.code(400).send({ error: "Missing matchId or winnerId" });
		}

		try {
			const result = finishMatch(matchId, winnerId);
			reply.send(result);
		} catch (err: any) {
			reply.code(400).send({ error: err.message });
		}
	});
	
}