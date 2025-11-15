# 🗄️ ft_transcendence – Database

## 🧭 Overview
This folder contains the **SQLite database** for ft_transcendence.  
It manages all persistent data including users, tournaments, matches, stats, and game history.  
The database is containerized and mounted as a Docker volume for data persistence across deployments.

---

## 📁 Structure

```bash
database/
├── transcendence.db        # SQLite database file (auto-created on first run)
├── migrations/             # Schema version history
│   ├── migration_lock.toml # Prisma lock file
│   └── TIMESTAMP_init/
│       └── migration.sql   # Initial schema
└── Readme.md               # This file
```

---

## 🔧 Database Setup

### Initialization
The database is **automatically created** when the backend starts:

```bash
# Development
docker compose -f Docker/docker-compose.dev.yml up

# Production
docker compose -f Docker/docker-compose.prod.yml up
```

### Schema Management
Using **Prisma ORM** for schema versioning and migrations:

```bash
# Generate Prisma client
npm run prisma:generate

# Apply migrations
npm run migrate

# View database in studio (development)
npm run prisma:studio
```

---

## 📊 Core Tables

### Users
Stores player profiles and authentication data.

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tournaments
Tracks tournament brackets, rounds, and progression.

```sql
CREATE TABLE tournaments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending | in_progress | completed
  round INTEGER DEFAULT 1,
  created_by INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### Tournament Players
Associates players with specific tournaments.

```sql
CREATE TABLE tournament_players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tournament_id INTEGER NOT NULL,
  user_id INTEGER,
  alias TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Matches
Records individual match results.

```sql
CREATE TABLE matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tournament_id INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', -- pending | in_progress | finished
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id)
);
```

### Match Players
Stores player scores and winner flag for each match.

```sql
CREATE TABLE match_players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  match_id INTEGER NOT NULL,
  user_id INTEGER,
  alias TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  is_winner BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (match_id) REFERENCES matches(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Player Stats
Aggregate statistics for ranking and leaderboards.

```sql
CREATE TABLE player_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL,
  total_matches INTEGER DEFAULT 0,
  total_wins INTEGER DEFAULT 0,
  total_losses INTEGER DEFAULT 0,
  win_rate REAL DEFAULT 0.0,
  total_points INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🔌 Connection

### Environment Variables
Configure database location in [Backend/.env](../.env):

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="file:./database/transcendence.db"
```

### Prisma Client
The backend uses Prisma to query the database:

```ts
// src/db/prisma.ts
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// Usage
const user = await prisma.users.findUnique({
  where: { id: 1 }
});
```

---

## 🔐 Security

- **SQLite with better-sqlite3**: Fast, embedded, file-based database
- **Prisma ORM**: Type-safe queries, SQL injection prevention
- **Environment variables**: Database path secured via `.env`
- **Docker volume mount**: Data persists across container restarts
- **Foreign keys**: Enforced referential integrity

---

## 📈 Scalability Notes

### Current (SQLite)
✅ Single file database  
✅ Good for development & testing  
✅ Supports local tournaments  
✅ Fast for <= 10K records  

### Future (PostgreSQL/MySQL)
For production scaling:
```env
DATABASE_URL="postgresql://user:password@host:5432/transcendence"
```
Prisma schema remains unchanged — just update the connection string.

---

## 🔄 Backup & Recovery

### Manual Backup
```bash
cp Backend/database/transcendence.db Backend/database/transcendence.db.backup
```

### Docker Volume Backup
```bash
docker run --rm -v transcendence_db:/data -v $(pwd):/backup \
  alpine tar czf /backup/db-backup.tar.gz -C /data .
```

### Restore
```bash
docker run --rm -v transcendence_db:/data -v $(pwd):/backup \
  alpine tar xzf /backup/db-backup.tar.gz -C /data
```

---

## 🛠️ Development Tips

### View Data Live
```bash
npm run prisma:studio
```
Opens **Prisma Studio** at `http://localhost:5555` for GUI data browsing.

### Reset Database (Dev Only)
```bash
# Delete and recreate
rm Backend/database/transcendence.db
npm run migrate
```

### Query Database Directly
```bash
sqlite3 Backend/database/transcendence.db
sqlite> SELECT * FROM users;
sqlite> .tables
sqlite> .quit
```

---

## 👤 Maintainer
**Natalia** – Database setup, Docker volumes, and data persistence configuration.

---

## 📋 Migration Checklist
- [x] SQLite setup with better-sqlite3
- [x] Prisma schema definition
- [x] Initial migration (users, tournaments, matches)
- [ ] Add blockchain transaction logging (future)
- [ ] Add chat message history (future)
- [ ] Add match replay data (future)

---

*The database layer ensures ft_transcendence maintains game state, player statistics, and tournament history reliably across all deployments and team members.*
