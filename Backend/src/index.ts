import Fastify from "fastify";
import cors from "@fastify/cors"; // ✅ import the CORS plugin

import { prisma } from "./db/index.ts";               // ✅ Prisma client
import apiRoutes from "./routes/api.routes.ts";        // ✅ New unified API routes

import { registerTournamentRoutes } from "./routes/tournament.ts";
import { registerMatchmakingRoutes } from "./routes/matchmaking.ts";

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

//Register Prisma-based API routes
server.register(apiRoutes, { prefix: "/api" });

server.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
	if (err){ process.exit(1); throw err; }
  console.log(`Server listening at ${address}, hot reload is working!`);
});
}

// Gracefully shutdown Prisma on exit
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

start();
