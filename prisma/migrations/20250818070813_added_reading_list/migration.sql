-- CreateTable
CREATE TABLE "ReadingTest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "section1" TEXT,
    "section2" TEXT,
    "section3" TEXT,
    "answers" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ReadingTest_slug_key" ON "ReadingTest"("slug");
