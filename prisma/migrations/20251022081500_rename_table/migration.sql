/*
  Warnings:

  - You are about to drop the `DiagramFormula` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TemplateFormula` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `DiagramFormula` DROP FOREIGN KEY `Ontology_userId_fkey`;

-- DropTable
DROP TABLE `DiagramFormula`;

-- DropTable
DROP TABLE `TemplateFormula`;

-- CreateTable
CREATE TABLE `Ontology` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` TEXT NOT NULL,
    `formula` TEXT NOT NULL,
    `nodes` LONGTEXT NULL,
    `edges` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,

    INDEX `Ontology_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TemplateOntology` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` TEXT NOT NULL,
    `category` TEXT NOT NULL,
    `nodes` LONGTEXT NULL,
    `edges` LONGTEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Ontology` ADD CONSTRAINT `Ontology_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
