// Backend/script/seedDemoUsers.js
import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const url = process.env.DATABASE_URL ?? "file:/app/database/transcendence.db";
console.log("[SCRIPT] DATABASE_URL =", url);

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url }),
});

async function main() {
  console.log("[SEED] DATABASE_URL =", process.env.DATABASE_URL);

  const demoUsers = [
    { email: "santiago@demo.com", username: "santiago", password_hash: "demo_hash" },
    { email: "natalia@demo.com", username: "natalia", password_hash: "demo_hash" },
    { email: "abdulrehman@demo.com", username: "abdulrehman", password_hash: "demo_hash" },
    { email: "malik@demo.com", username: "malik", password_hash: "demo_hash" },
  ];

  await prisma.$transaction(async (tx) => {
    for (const u of demoUsers) {
      const user = await tx.user.upsert({
        where: { email: u.email },
        create: {
          email: u.email,
          username: u.username,
          password_hash: u.password_hash,
        },
        update: {
          // keep username/password in sync if you re-run seed
          username: u.username,
          password_hash: u.password_hash,
        },
        select: { id: true, username: true, email: true },
      });

      console.log(`[SEED] Upserted user: ${user.username} (ID: ${user.id}, email: ${user.email})`);
    }
  });

  console.log("[SEED] Demo users created/updated successfully!");
}

main()
  .catch((err) => {
    console.error("[SEED] Error:", err?.message ?? err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


// // Backend/script/seedDemoUsers.js
// const Database = require("better-sqlite3");
// const path = require("path");

// const dbPath = path.join(process.cwd(), "database", "transcendence.db");
// console.log("[SEED] Using database:", dbPath);

// const db = new Database(dbPath);

// try {
//   db.pragma("foreign_keys = ON");

//   const demoUsers = [
//     { id: 1, email: "santiago@demo.com", username: "santiago", password_hash: "demo_hash" },
//     { id: 2, email: "natalia@demo.com", username: "natalia", password_hash: "demo_hash" },
//     { id: 3, email: "abdulrehman@demo.com", username: "abdulrehman", password_hash: "demo_hash" },
//     { id: 4, email: "malik@demo.com", username: "malik", password_hash: "demo_hash" }
//   ];

//   const stmt = db.prepare(`
//     INSERT OR IGNORE INTO users (id, email, username, password_hash) 
//     VALUES (?, ?, ?, ?)
//   `);

//   db.transaction(() => {
//     for (const user of demoUsers) {
//       stmt.run(user.id, user.email, user.username, user.password_hash);
//       console.log(`[SEED] Created user: ${user.username} (ID: ${user.id})`);
//     }
//   })();

//   console.log("[SEED] Demo users created successfully!");
  
// } catch (err) {
//   console.error("[SEED] Error:", err.message);
//   process.exit(1);
// } finally {
//   db.close();
// }