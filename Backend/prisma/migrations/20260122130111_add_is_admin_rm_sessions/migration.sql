/*
  Warnings:

  - You are about to drop the `user_session` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "user_session_token_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "user_session";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "avatarId" INTEGER,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "avatar" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_users" ("avatarId", "created_at", "email", "id", "password_hash", "updated_at", "username") SELECT "avatarId", "created_at", "email", "id", "password_hash", "updated_at", "username" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
CREATE UNIQUE INDEX "users_avatarId_key" ON "users"("avatarId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
