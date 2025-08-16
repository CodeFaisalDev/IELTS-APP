/*
  Warnings:

  - The primary key for the `ListeningTest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `content` on the `ListeningTest` table. All the data in the column will be lost.
  - You are about to drop the column `correctAnswers` on the `ListeningTest` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `ListeningTest` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `sections` to the `ListeningTest` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ListeningTest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "audioPath" TEXT NOT NULL,
    "sections" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ListeningTest" ("audioPath", "createdAt", "id", "slug", "title", "updatedAt") SELECT "audioPath", "createdAt", "id", "slug", "title", "updatedAt" FROM "ListeningTest";
DROP TABLE "ListeningTest";
ALTER TABLE "new_ListeningTest" RENAME TO "ListeningTest";
CREATE UNIQUE INDEX "ListeningTest_slug_key" ON "ListeningTest"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
