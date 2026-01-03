// Backend/script/migrate.js
const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const dbPath = path.join(__dirname, "..", "database", "transcendence.db");
const migrationsDir = path.join(__dirname, "..", "migrations");

console.log("[MIGRATE] DB:", dbPath);
console.log("[MIGRATE] Migrations:", migrationsDir);

if (!fs.existsSync(migrationsDir)) {
  console.error("Migrations directory missing:", migrationsDir);
  process.exit(1);
}

const db = new Database(dbPath);

try {
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  db.transaction(() => {
    for (const file of files) {
      const full = path.join(migrationsDir, file);
      const sql = fs.readFileSync(full, "utf8");
      console.log("[MIGRATE] Applying:", file);
      db.exec(sql);
    }
  })();

  console.log("[MIGRATE] Done.");
} catch (err) {
  console.error("[MIGRATE] ERROR:", err);
  process.exit(1);
} finally {
  db.close();
}
