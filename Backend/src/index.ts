import Fastify from "fastify";
import cors from "@fastify/cors"; // ✅ import the CORS plugin

import { registerTournamentRoutes } from "./routes/tournament";
import { registerMatchmakingRoutes } from "./routes/matchmaking";

const server = Fastify({ logger: true });

// ✅ Enable CORS
async function start() {
	await server.register(cors, {
	  origin: ["http://localhost:5173"], // frontend address
	  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	  allowedHeaders: ["Content-Type", "Authorization"],
	});

server.get("/", async () => {
  return { message: "Hello from Backend!" };
});

registerTournamentRoutes(server);
registerMatchmakingRoutes(server);

server.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
  if (err) throw err;
  console.log(`Server listening at ${address}, hot reload is working!`);
});
}

start();
