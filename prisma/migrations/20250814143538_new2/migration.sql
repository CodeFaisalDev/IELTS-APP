/*
  Warnings:

  - The primary key for the `ListeningTest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `audioPath` on the `ListeningTest` table. All the data in the column will be lost.
  - You are about to drop the column `sections` on the `ListeningTest` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ListeningTest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "audioUrl" TEXT,
    "content" TEXT,
    "answers" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ListeningTest" ("answers", "createdAt", "id", "slug", "title", "updatedAt") SELECT "answers", "createdAt", "id", "slug", "title", "updatedAt" FROM "ListeningTest";
DROP TABLE "ListeningTest";
ALTER TABLE "new_ListeningTest" RENAME TO "ListeningTest";
CREATE UNIQUE INDEX "ListeningTest_slug_key" ON "ListeningTest"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
