-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_funnels" (
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
INSERT INTO "new_funnels" ("blockHeight", "blockWidth", "blocks", "createdAt", "id", "layoutMode", "styleMode", "textAlign", "title", "toggles", "updatedAt", "userId") SELECT "blockHeight", "blockWidth", "blocks", "createdAt", "id", "layoutMode", "styleMode", "textAlign", "title", "toggles", "updatedAt", "userId" FROM "funnels";
DROP TABLE "funnels";
ALTER TABLE "new_funnels" RENAME TO "funnels";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
