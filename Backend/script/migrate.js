// script/migrate.js
import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIGRATION_SQL_PATH = path.join(__dirname, '..', 'migrations', '000_init.sql');
const DB_DIR = path.join(__dirname, '..', 'database');
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

// ESM equivalent of “run if executed directly”
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  run();
}
