/*
  Warnings:

  - You are about to alter the column `content` on the `ListeningTest` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `correctAnswers` on the `ListeningTest` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ListeningTest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "audioPath" TEXT NOT NULL,
    "content" JSONB NOT NULL DEFAULT [],
    "correctAnswers" JSONB NOT NULL DEFAULT [],
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ListeningTest" ("audioPath", "content", "correctAnswers", "createdAt", "id", "slug", "title", "updatedAt") SELECT "audioPath", "content", "correctAnswers", "createdAt", "id", "slug", "title", "updatedAt" FROM "ListeningTest";
DROP TABLE "ListeningTest";
ALTER TABLE "new_ListeningTest" RENAME TO "ListeningTest";
CREATE UNIQUE INDEX "ListeningTest_slug_key" ON "ListeningTest"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
