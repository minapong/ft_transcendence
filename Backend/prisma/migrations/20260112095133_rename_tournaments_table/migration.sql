/*
  Warnings:

  - You are about to drop the `tournament` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "tournament";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "tournaments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "current_round" INTEGER NOT NULL DEFAULT 0,
    "state" TEXT NOT NULL DEFAULT 'waiting',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" DATETIME,
    "winner_id" INTEGER,
    "max_players" INTEGER NOT NULL DEFAULT 4,
    CONSTRAINT "tournaments_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tournament_match" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tournament_id" INTEGER NOT NULL,
    "match_id" INTEGER NOT NULL,
    "round_number" INTEGER NOT NULL DEFAULT 0,
    "match_number_in_round" INTEGER NOT NULL DEFAULT 0,
    "next_tournament_match_id" INTEGER,
    CONSTRAINT "tournament_match_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "tournament_match_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "match" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "tournament_match_next_tournament_match_id_fkey" FOREIGN KEY ("next_tournament_match_id") REFERENCES "tournament_match" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tournament_match" ("id", "match_id", "match_number_in_round", "next_tournament_match_id", "round_number", "tournament_id") SELECT "id", "match_id", "match_number_in_round", "next_tournament_match_id", "round_number", "tournament_id" FROM "tournament_match";
DROP TABLE "tournament_match";
ALTER TABLE "new_tournament_match" RENAME TO "tournament_match";
CREATE UNIQUE INDEX "tournament_match_tournament_id_match_id_key" ON "tournament_match"("tournament_id", "match_id");
CREATE TABLE "new_tournament_player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tournament_id" INTEGER NOT NULL,
    "user_id" INTEGER,
    "alias" TEXT,
    "joined_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tournament_player_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "tournament_player_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tournament_player" ("alias", "id", "joined_at", "tournament_id", "user_id") SELECT "alias", "id", "joined_at", "tournament_id", "user_id" FROM "tournament_player";
DROP TABLE "tournament_player";
ALTER TABLE "new_tournament_player" RENAME TO "tournament_player";
CREATE UNIQUE INDEX "tournament_player_tournament_id_user_id_key" ON "tournament_player"("tournament_id", "user_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
