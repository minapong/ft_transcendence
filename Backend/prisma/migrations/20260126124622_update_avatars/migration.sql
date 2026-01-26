-- DropIndex
DROP INDEX "users_avatarId_key";

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_avatar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER,
    "file_path" TEXT NOT NULL,
    "uploaded_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "avatar_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_avatar" ("file_path", "id", "uploaded_at", "user_id") SELECT "file_path", "id", "uploaded_at", "user_id" FROM "avatar";
DROP TABLE "avatar";
ALTER TABLE "new_avatar" RENAME TO "avatar";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
