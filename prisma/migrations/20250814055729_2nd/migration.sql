/*
  Warnings:

  - The primary key for the `ListeningTest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `answers` on the `ListeningTest` table. All the data in the column will be lost.
  - You are about to drop the column `sections` on the `ListeningTest` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_ListeningTest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "audioPath" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '[]',
    "correctAnswers" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

INSERT INTO "new_ListeningTest" ("audioPath", "createdAt", "id", "slug", "title", "updatedAt", "content", "correctAnswers")
SELECT "audioPath", "createdAt", "id", "slug", "title", "updatedAt", '[]', '[]' FROM "ListeningTest";

DROP TABLE "ListeningTest";

ALTER TABLE "new_ListeningTest" RENAME TO "ListeningTest";

CREATE UNIQUE INDEX "ListeningTest_slug_key" ON "ListeningTest"("slug");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
