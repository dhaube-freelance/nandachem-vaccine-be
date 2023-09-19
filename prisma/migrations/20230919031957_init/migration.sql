-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `street` VARCHAR(191) NULL,
    `role` ENUM('ADMIN', 'NORMAL') NOT NULL DEFAULT 'NORMAL',
    `verified` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Batch` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `number` VARCHAR(191) NOT NULL,
    `expiryDate` DATETIME(3) NOT NULL,
    `vaccineId` INTEGER NOT NULL,

    UNIQUE INDEX `Batch_number_key`(`number`),
    INDEX `Batch_vaccineId_idx`(`vaccineId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dose` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `minAge` INTEGER NOT NULL,
    `maxAge` INTEGER NOT NULL,
    `numberOfDose` INTEGER NOT NULL,
    `gapsInDays` VARCHAR(191) NOT NULL,
    `vaccineId` INTEGER NOT NULL,

    INDEX `Dose_vaccineId_idx`(`vaccineId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vaccine` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NULL,
    `manufacturer` VARCHAR(191) NULL,

    UNIQUE INDEX `Vaccine_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Patient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `number` VARCHAR(191) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHERS') NOT NULL DEFAULT 'MALE',
    `dob` DATETIME(3) NOT NULL,
    `street` VARCHAR(191) NULL,
    `vaccineId` INTEGER NULL,

    INDEX `Patient_vaccineId_idx`(`vaccineId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
