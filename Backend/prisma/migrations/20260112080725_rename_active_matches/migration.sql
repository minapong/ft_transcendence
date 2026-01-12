/*
  Warnings:

  - You are about to drop the `ActiveMatch` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ActiveMatch";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ActiveMatches" (
    "match_id" TEXT NOT NULL PRIMARY KEY,
    "game_name" TEXT NOT NULL,
    "p1_id" INTEGER NOT NULL,
    "p2_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'matched',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "started_at" DATETIME,
    "timeout_ts" DATETIME,
    CONSTRAINT "ActiveMatches_p1_id_fkey" FOREIGN KEY ("p1_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ActiveMatches_p2_id_fkey" FOREIGN KEY ("p2_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ActiveMatches_p1_id_p2_id_idx" ON "ActiveMatches"("p1_id", "p2_id");
