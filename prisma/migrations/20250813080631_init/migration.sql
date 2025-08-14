-- CreateTable
CREATE TABLE "ListeningExam" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "totalSections" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "ListeningSection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "examId" INTEGER NOT NULL,
    "sectionNum" INTEGER NOT NULL,
    "pdfUrl" TEXT NOT NULL,
    CONSTRAINT "ListeningSection_examId_fkey" FOREIGN KEY ("examId") REFERENCES "ListeningExam" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ListeningQuestion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sectionId" INTEGER NOT NULL,
    "questionNo" INTEGER NOT NULL,
    CONSTRAINT "ListeningQuestion_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "ListeningSection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ListeningAnswer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "questionId" INTEGER NOT NULL,
    "answerText" TEXT NOT NULL,
    CONSTRAINT "ListeningAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "ListeningQuestion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UserListeningAnswer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "userAnswer" TEXT NOT NULL,
    CONSTRAINT "UserListeningAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserListeningAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "ListeningQuestion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
