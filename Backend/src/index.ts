import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";

import websocket from "@fastify/websocket";
import fastifyStatic from "@fastify/static";
import multipart from "@fastify/multipart";
import path from "path";

import { registerPresenceWs} from "./routes/presence.ws.js";
import { registerPresenceRoutes } from "./routes/presence.js";


import { prisma } from "./db/prisma.js";    

import { registerTournamentRoutes } from "./routes/tournament.js";
import { registerMatchmakingRoutes } from "./routes/matchmaking.js";
import { registerLoginRoutes } from "./routes/login.js";
import { registerAuthRoutes } from "./routes/auth.routes.js";
import { registerProfileRoutes } from "./routes/profile.js";
import { registerMeRoutes } from "./routes/me.js";
import { registerStatsRoutes } from "./routes/stats.js";
import { registerFriendRoutes } from "./routes/friends.js";
import { registerAvatarRoutes } from "./routes/avatar.routes.js";
import { registerProfileSettingsRoutes } from "./routes/settings.routes.js";



const server = Fastify({ logger: true });

// Force "console-clean" API: convert any Fastify error (parser/auth/etc) into HTTP 200 JSON
server.setErrorHandler((err, _req, reply) => {
  const code = (err as any)?.statusCode || (err as any)?.status || 500;
  const ecode = (err as any)?.code ? String((err as any).code) : "";
  const msg = String((err as any)?.message ?? "");

  // Body/parser errors (invalid JSON, invalid content-length, too large, etc.)
  const isBodyProblem =
    code === 400 ||
    ecode.startsWith("FST_ERR_CTP_") ||
    msg.includes("Bad control character") ||
    msg.includes("Unexpected token") ||
    msg.includes("Request body size") ||
    msg.includes("Content-Length");

  if (isBodyProblem) {
    return reply.code(200).send({ ok: false, error: "Invalid request body" });
  }

  // Unauthorized / forbidden / not found etc -> still 200
  if (code === 401 || code === 403) {
    return reply.code(200).send({ ok: false, error: "Unauthorized" });
  }

  // Default: never leak internal details, never 500/4xx
  return reply.code(200).send({ ok: false, error: "Server error" });
});


//  Enable CORS
async function start() {
	await server.register(cors, {
	  origin: ["http://localhost:5173"], // frontend address
	  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	  allowedHeaders: ["Content-Type", "Authorization"],
	});

    server.get("/", async () => {
      return { message: "Hello from Backend!" };
    });

    await server.register(jwt, {
      secret: process.env.JWT_SECRET!,
    });

    await server.register(websocket); 

    server.register(fastifyStatic, {
      root: path.join(process.cwd(), "assets"),
      prefix: "/static/",
    });

    await server.register(multipart, {
      limits: { fileSize: 2 * 1024 * 1024 },
    });

    registerPresenceWs(server);
    registerPresenceRoutes(server);

    registerTournamentRoutes(server);
    registerMatchmakingRoutes(server);
    registerLoginRoutes(server);
    registerAuthRoutes(server);
    registerProfileRoutes(server);
    registerMeRoutes(server);
    registerStatsRoutes(server);
    registerFriendRoutes(server);
    registerAvatarRoutes(server);
    registerProfileSettingsRoutes(server);

    server.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
      if (err){ process.exit(1); throw err; }
    });
}


// shutdown Prisma on exit
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

start();
