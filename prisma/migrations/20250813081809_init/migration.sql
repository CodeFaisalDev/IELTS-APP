/*
  Warnings:

  - You are about to drop the `ListeningAnswer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ListeningQuestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ListeningSection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserListeningAnswer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `totalSections` on the `ListeningExam` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ListeningAnswer";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ListeningQuestion";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ListeningSection";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserListeningAnswer";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Section" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "examId" INTEGER NOT NULL,
    CONSTRAINT "Section_examId_fkey" FOREIGN KEY ("examId") REFERENCES "ListeningExam" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT,
    "sectionId" INTEGER NOT NULL,
    CONSTRAINT "Question_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL,
    "questionId" INTEGER NOT NULL,
    CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ListeningExam" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "audioUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_ListeningExam" ("audioUrl", "id", "title") SELECT "audioUrl", "id", "title" FROM "ListeningExam";
DROP TABLE "ListeningExam";
ALTER TABLE "new_ListeningExam" RENAME TO "ListeningExam";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
