-- migrations/000_init.sql
PRAGMA foreign_keys = ON;

-- users
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_id INTEGER,
  created_at DATETIME DEFAULT (datetime('now')),
  updated_at DATETIME DEFAULT (datetime('now')),
  FOREIGN KEY (avatar_id) REFERENCES avatars(id) ON DELETE SET NULL
);

-- avatars
CREATE TABLE IF NOT EXISTS avatars (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  uploaded_at DATETIME DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_avatars_user_id ON avatars(user_id);

-- user_sessions
CREATE TABLE IF NOT EXISTS user_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT (datetime('now')),
  expires_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);

-- friends (junction table)
CREATE TABLE IF NOT EXISTS friends (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  friend_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'blocked'
  created_at DATETIME DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, friend_id)
);

CREATE INDEX IF NOT EXISTS idx_friends_user ON friends(user_id);
CREATE INDEX IF NOT EXISTS idx_friends_friend ON friends(friend_id);

-- matchmaking queue (ephemeral state)
CREATE TABLE IF NOT EXISTS matchmaking_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  game_name TEXT NOT NULL, -- 'connect4'
  joined_at DATETIME DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, game_name)
);

CREATE INDEX IF NOT EXISTS idx_matchmaking_queue_game_time
ON matchmaking_queue(game_name, joined_at);

-- active matches table (persistent for matchmaking)
CREATE TABLE IF NOT EXISTS active_matches (
  match_id TEXT PRIMARY KEY,
  game_name TEXT NOT NULL,
  p1_id INTEGER NOT NULL,
  p2_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'matched', -- matched, started, finished, abandoned
  created_at DATETIME DEFAULT (datetime('now')),
  started_at DATETIME,
  timeout_ts DATETIME,
  FOREIGN KEY (p1_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (p2_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_active_matches_user
ON active_matches(p1_id, p2_id);

-- matches
CREATE TABLE IF NOT EXISTS matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at DATETIME DEFAULT (datetime('now')),
  finished_at DATETIME,
  winner_id INTEGER,
  ai_difficulty TEXT DEFAULT NULL, -- 'easy', 'medium', 'hard' or NULL
  is_ai_game INTEGER DEFAULT 0,     -- 0 = false, 1 = true
  game_name TEXT NOT NULL DEFAULT 'pong', -- 'pong', 'connect4'
  FOREIGN KEY (winner_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_matches_winner ON matches(winner_id);

-- match_players
CREATE TABLE IF NOT EXISTS match_players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  match_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  score INTEGER DEFAULT 0,
  is_winner INTEGER DEFAULT 0, -- 0/1
  FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_match_players_match ON match_players(match_id);
CREATE INDEX IF NOT EXISTS idx_match_players_user ON match_players(user_id);

-- stats_user (aggregated stats for dashboard)
CREATE TABLE IF NOT EXISTS stats_user (
  user_id INTEGER PRIMARY KEY,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  last_match_at DATETIME,
  tournament_championships INTEGER DEFAULT 0,
  friends_count INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- tournaments (main table)
CREATE TABLE IF NOT EXISTS tournaments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  current_round INTEGER DEFAULT 0,
  state TEXT DEFAULT 'waiting', -- waiting, active, finished
  created_at DATETIME DEFAULT (datetime('now')),
  finished_at DATETIME,
  winner_id INTEGER,
  max_players INTEGER DEFAULT 4,
  FOREIGN KEY (winner_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_tournaments_state ON tournaments(state);

-- tournament_players (players registered in a tournament; stores tournament-scoped alias)
CREATE TABLE IF NOT EXISTS tournament_players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tournament_id INTEGER NOT NULL,
  user_id INTEGER,
  alias TEXT, -- alias for this tournament; can be null for guest
  joined_at DATETIME DEFAULT (datetime('now')),
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE(tournament_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_tournament_players_tourn ON tournament_players(tournament_id);

-- tournament_matches linking table: which matches belong to which tournament and ordering/round info
CREATE TABLE IF NOT EXISTS tournament_matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tournament_id INTEGER NOT NULL,
  match_id INTEGER NOT NULL,
  round_number INTEGER DEFAULT 0,
  match_number_in_round INTEGER DEFAULT 0,
  next_tournament_match_id INTEGER, -- points to tournament_matches.id (where winner goes)
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
  FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
  FOREIGN KEY (next_tournament_match_id) REFERENCES tournament_matches(id) ON DELETE SET NULL,
  UNIQUE(tournament_id, match_id)
);

CREATE INDEX IF NOT EXISTS idx_tournament_matches_tourn ON tournament_matches(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_matches_round ON tournament_matches(tournament_id, round_number, match_number_in_round);
