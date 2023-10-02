/*
  Warnings:

  - Added the required column `userId` to the `PatientVaccine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `PatientVaccine` ADD COLUMN `userId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `PatientVaccine_userId_idx` ON `PatientVaccine`(`userId`);
