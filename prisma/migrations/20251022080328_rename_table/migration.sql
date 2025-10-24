-- DropForeignKey
ALTER TABLE `DiagramFormula` DROP FOREIGN KEY `DiagramFormula_userId_fkey`;

-- AddForeignKey
ALTER TABLE `DiagramFormula` ADD CONSTRAINT `Ontology_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `DiagramFormula` RENAME INDEX `DiagramFormula_userId_fkey` TO `Ontology_userId_fkey`;
