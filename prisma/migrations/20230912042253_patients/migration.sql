/*
  Warnings:

  - You are about to drop the column `number` on the `Vaccine` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Vaccine` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `doses` to the `Vaccine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Vaccine` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Vaccine_number_key` ON `Vaccine`;

-- AlterTable
ALTER TABLE `Vaccine` DROP COLUMN `number`,
    ADD COLUMN `doses` INTEGER NOT NULL,
    ADD COLUMN `gapsInDays` VARCHAR(191) NULL,
    ADD COLUMN `manufacturer` VARCHAR(191) NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `type` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Patient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHERS') NOT NULL DEFAULT 'MALE',
    `state` VARCHAR(191) NULL,
    `street` VARCHAR(191) NULL,
    `batchId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Vaccine_name_key` ON `Vaccine`(`name`);
