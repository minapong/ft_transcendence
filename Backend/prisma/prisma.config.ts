import type { Config } from "@prisma/client";

// SQLite file path (same as before)
const databaseUrl = process.env.DATABASE_URL || "file:./data/transcendence.db";

const config: Config = {
  sources: [
    {
      name: "db",
      provider: "sqlite",
      connectionString: databaseUrl,
    },
  ],
};

export default config;
