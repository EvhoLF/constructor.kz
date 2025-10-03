-- CreateTable
CREATE TABLE "funnels" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "blocks" TEXT,
    "layoutMode" TEXT NOT NULL DEFAULT 'bottomBig',
    "styleMode" TEXT NOT NULL DEFAULT 'filled',
    "textAlign" TEXT NOT NULL DEFAULT 'left',
    "toggles" TEXT,
    "blockWidth" INTEGER NOT NULL DEFAULT 100,
    "blockHeight" INTEGER NOT NULL DEFAULT 70,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "funnels_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
