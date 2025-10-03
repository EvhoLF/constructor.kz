/*
  Warnings:

  - You are about to drop the `templateDiagram` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `templateFormula` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "templateDiagram";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "templateFormula";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "TemplateDiagram" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "nodes" TEXT,
    "edges" TEXT
);

-- CreateTable
CREATE TABLE "TemplateFormula" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "nodes" TEXT,
    "edges" TEXT
);
