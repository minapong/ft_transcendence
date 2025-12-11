
import { defineConfig } from '@prisma/config';

 const databaseUrl = process.env.DATABASE_URL || "file:./data/transcendence.db";

export default defineConfig({
  datasource: {
    // equivalent of old url
    db: {
      provider: "sqlite",
      url: databaseUrl,
    }
  },
});



// // SQLite file path (same as before)
// const databaseUrl = process.env.DATABASE_URL || "file:./data/transcendence.db";

// const config: Config = {
//   sources: [
//     {
//       name: "db",
//       provider: "sqlite",
//       connectionString: databaseUrl,
//     },
//   ],
// };

// export default config;
