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
      // console.log(`Server listening at ${address}, hot reload is working!`);
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
