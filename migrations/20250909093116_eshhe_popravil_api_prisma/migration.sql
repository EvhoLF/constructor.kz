/*
  Warnings:

  - You are about to drop the `FormulaDiagram` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NodeTemplate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NodeTemplateFormula` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FormulaDiagram";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "NodeTemplate";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "NodeTemplateFormula";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "DiagramFormula" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "formula" TEXT NOT NULL DEFAULT '',
    "nodes" TEXT,
    "edges" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "DiagramFormula_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "templateDiagram" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "nodes" TEXT,
    "edges" TEXT
);

-- CreateTable
CREATE TABLE "templateFormula" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "nodes" TEXT,
    "edges" TEXT
);
