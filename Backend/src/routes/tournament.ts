import { FastifyInstance } from "fastify";
import { createTournament } from "../logic/tournamentManager";

export default async function tournamentRoutes(server: FastifyInstance) {
	server.post("/api/tournament/start", async (req, reply) => {
	const { players } = req.body as any;

	if (!players || !Array.isArray(players)) {
		reply.code(400).send({ error: "Invalid players array." });
		return;
	}

	const result = createTournament(players);
	reply.send(result);
	});
}