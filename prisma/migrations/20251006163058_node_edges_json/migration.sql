/*
  Warnings:

  - You are about to alter the column `nodes` on the `templatediagram` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to alter the column `edges` on the `templatediagram` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to alter the column `nodes` on the `templateformula` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to alter the column `edges` on the `templateformula` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `templatediagram` MODIFY `nodes` JSON NULL,
    MODIFY `edges` JSON NULL;

-- AlterTable
ALTER TABLE `templateformula` MODIFY `nodes` JSON NULL,
    MODIFY `edges` JSON NULL;
