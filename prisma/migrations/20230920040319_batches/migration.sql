/*
  Warnings:

  - You are about to drop the column `vaccineId` on the `Patient` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Patient_vaccineId_idx` ON `Patient`;

-- AlterTable
ALTER TABLE `Patient` DROP COLUMN `vaccineId`,
    ADD COLUMN `batchId` INTEGER NULL;

-- CreateIndex
CREATE INDEX `Patient_batchId_idx` ON `Patient`(`batchId`);
