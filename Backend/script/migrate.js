// script/migrate.js
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const MIGRATION_SQL_PATH = path.join(__dirname, '..', 'migrations', '000_init.sql');
const DB_DIR = path.join(__dirname, '..', 'database');
const DB_PATH = path.join(DB_DIR, 'transcendence.db');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function run() {
  ensureDir(DB_DIR);

  const sql = fs.readFileSync(MIGRATION_SQL_PATH, 'utf8');

  // open database (creates file if not exists)
  const db = new Database(DB_PATH);
  try {
    db.exec('PRAGMA foreign_keys = ON;');
    db.exec(sql);
    console.log('Migrations applied to', DB_PATH);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  } finally {
    db.close();
  }
}

if (require.main === module) run();

module.exports = run;

