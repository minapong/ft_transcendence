// script/migrate.js (ESM version)
import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const MIGRATION_SQL_PATH = path.join(new URL('.', import.meta.url).pathname, '..', 'migrations', '000_init.sql');
const DB_DIR = path.join(new URL('.', import.meta.url).pathname, '..', 'database');
const DB_PATH = path.join(DB_DIR, 'transcendence.db');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function run() {
  ensureDir(DB_DIR);

  const sql = fs.readFileSync(MIGRATION_SQL_PATH, 'utf8');

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

if (import.meta.url === process.argv[1] || import.meta.url === `file://${process.argv[1]}`) {
  run();
}
