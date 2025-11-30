// Backend/script/seedDemoUsers.js
const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(process.cwd(), "database", "transcendence.db");
console.log("[SEED] Using database:", dbPath);

const db = new Database(dbPath);

try {
  db.pragma("foreign_keys = ON");

  const demoUsers = [
    { id: 5, email: "santiago@demo.com", username: "santiago", password_hash: "demo_hash" },
    { id: 6, email: "natalia@demo.com", username: "natalia", password_hash: "demo_hash" },
    { id: 7, email: "abdulrehman@demo.com", username: "abdulrehman", password_hash: "demo_hash" },
    { id: 8, email: "malik@demo.com", username: "malik", password_hash: "demo_hash" }
  ];

  const stmt = db.prepare(`
    INSERT OR IGNORE INTO users (id, email, username, password_hash) 
    VALUES (?, ?, ?, ?)
  `);

  db.transaction(() => {
    for (const user of demoUsers) {
      stmt.run(user.id, user.email, user.username, user.password_hash);
      console.log(`[SEED] Created user: ${user.username} (ID: ${user.id})`);
    }
  })();

  console.log("[SEED] Demo users created successfully!");
  
} catch (err) {
  console.error("[SEED] Error:", err.message);
  process.exit(1);
} finally {
  db.close();
}