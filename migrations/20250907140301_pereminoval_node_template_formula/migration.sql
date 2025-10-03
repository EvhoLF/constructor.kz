/*
  Warnings:

  - You are about to drop the `NodeTemplateDiagram` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "NodeTemplateDiagram";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "NodeTemplateFormula" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "nodes" TEXT,
    "edges" TEXT
);
