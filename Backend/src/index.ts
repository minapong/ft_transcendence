import Fastify from "fastify";
import cors from "@fastify/cors"; // ✅ import the CORS plugin
import jwt from "@fastify/jwt";

import { prisma } from "./db/prisma.js";               // ✅ Prisma client
import apiRoutes from "./routes/api.routes.js";        // ✅ New unified API routes

import { registerTournamentRoutes } from "./routes/tournament.js";
import { registerMatchmakingRoutes } from "./routes/matchmaking.js";
import { registerLoginRoutes } from "./routes/login.js";
import { registerAuthRoutes } from "./routes/auth.routes.js";
import { registerProfileRoutes } from "./routes/profile.js";


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

await server.register(jwt, {
  secret: process.env.JWT_SECRET!,
});

// server.get("/api/users/:id", async (req, reply) => {
//   return { ok: true, id: (req.params as any).id };
// });

registerTournamentRoutes(server);
registerMatchmakingRoutes(server);
registerLoginRoutes(server);
registerAuthRoutes(server);
registerProfileRoutes(server);


//Register Prisma-based API routes
server.register(apiRoutes, { prefix: "/api" });
// registerStatsRoutes(server);

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
