-- CreateTable
CREATE TABLE "MatchmakingQueue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "game_name" TEXT NOT NULL,
    "joined_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MatchmakingQueue_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ActiveMatch" (
    "match_id" TEXT NOT NULL PRIMARY KEY,
    "game_name" TEXT NOT NULL,
    "p1_id" INTEGER NOT NULL,
    "p2_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'matched',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "started_at" DATETIME,
    "timeout_ts" DATETIME,
    CONSTRAINT "ActiveMatch_p1_id_fkey" FOREIGN KEY ("p1_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ActiveMatch_p2_id_fkey" FOREIGN KEY ("p2_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Match" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" DATETIME,
    "winner_id" INTEGER,
    "ai_difficulty" TEXT,
    "is_ai_game" BOOLEAN NOT NULL DEFAULT false,
    "game_name" TEXT NOT NULL DEFAULT 'pong',
    CONSTRAINT "Match_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Match" ("ai_difficulty", "created_at", "finished_at", "id", "is_ai_game", "winner_id") SELECT "ai_difficulty", "created_at", "finished_at", "id", "is_ai_game", "winner_id" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
CREATE TABLE "new_Tournament" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "current_round" INTEGER NOT NULL DEFAULT 0,
    "state" TEXT NOT NULL DEFAULT 'waiting',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" DATETIME,
    "winner_id" INTEGER,
    "max_players" INTEGER NOT NULL DEFAULT 4,
    CONSTRAINT "Tournament_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Tournament" ("created_at", "current_round", "finished_at", "id", "name", "state", "winner_id") SELECT "created_at", "current_round", "finished_at", "id", "name", "state", "winner_id" FROM "Tournament";
DROP TABLE "Tournament";
ALTER TABLE "new_Tournament" RENAME TO "Tournament";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "MatchmakingQueue_user_id_game_name_key" ON "MatchmakingQueue"("user_id", "game_name");

-- CreateIndex
CREATE INDEX "ActiveMatch_p1_id_p2_id_idx" ON "ActiveMatch"("p1_id", "p2_id");
