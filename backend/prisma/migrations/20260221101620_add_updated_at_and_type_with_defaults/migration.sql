/*
  Warnings:

  - Added the required column `updatedAt` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Announcement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `VerificationCode` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `activity` DROP FOREIGN KEY `Activity_clubId_fkey`;

-- DropForeignKey
ALTER TABLE `announcement` DROP FOREIGN KEY `Announcement_clubId_fkey`;

-- DropForeignKey
ALTER TABLE `useractivity` DROP FOREIGN KEY `UserActivity_activityId_fkey`;

-- DropForeignKey
ALTER TABLE `useractivity` DROP FOREIGN KEY `UserActivity_userId_fkey`;

-- DropIndex
DROP INDEX `VerificationCode_email_key` ON `verificationcode`;

-- AlterTable
ALTER TABLE `activity` ADD COLUMN `coverImage` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `status` ENUM('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'ONGOING', 'FINISHED', 'CANCELED') NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE `announcement` ADD COLUMN `authorId` INTEGER NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `club` ADD COLUMN `coverImage` VARCHAR(191) NULL,
    ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `type` ENUM('ACADEMIC', 'SPORTS', 'ARTS', 'VOLUNTEER', 'TECH', 'ENTERTAINMENT', 'OTHER') NOT NULL DEFAULT 'OTHER';

-- AlterTable
ALTER TABLE `user` ADD COLUMN `avatar` VARCHAR(191) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `updatedAt` DATETIME(3);

-- AlterTable
ALTER TABLE `useractivity` MODIFY `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'ATTENDED', 'CANCELED') NOT NULL DEFAULT 'PENDING',
    MODIFY `notes` VARCHAR(500) NULL;

-- AlterTable
-- VerificationCode 表：给 type 加默认值
ALTER TABLE `verificationcode` ADD COLUMN `type` VARCHAR(191) NOT NULL DEFAULT 'unknown';

-- CreateTable
CREATE TABLE `ClubMembership` (
    `userId` INTEGER NOT NULL,
    `clubId` INTEGER NOT NULL,
    `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'LEFT') NOT NULL DEFAULT 'PENDING',
    `roleInClub` VARCHAR(191) NULL DEFAULT 'MEMBER',
    `notes` VARCHAR(300) NULL,

    INDEX `ClubMembership_clubId_status_idx`(`clubId`, `status`),
    INDEX `ClubMembership_userId_idx`(`userId`),
    PRIMARY KEY (`userId`, `clubId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Activity_clubId_status_date_idx` ON `Activity`(`clubId`, `status`, `date`);

-- CreateIndex
CREATE INDEX `Announcement_clubId_pinned_createdAt_idx` ON `Announcement`(`clubId`, `pinned` DESC, `createdAt` DESC);

-- CreateIndex
CREATE INDEX `Club_status_idx` ON `Club`(`status`);

-- CreateIndex
CREATE INDEX `UserActivity_activityId_status_idx` ON `UserActivity`(`activityId`, `status`);

-- CreateIndex
CREATE INDEX `VerificationCode_email_expiresAt_idx` ON `VerificationCode`(`email`, `expiresAt` DESC);

-- AddForeignKey
ALTER TABLE `ClubMembership` ADD CONSTRAINT `ClubMembership_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClubMembership` ADD CONSTRAINT `ClubMembership_clubId_fkey` FOREIGN KEY (`clubId`) REFERENCES `Club`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Activity` ADD CONSTRAINT `Activity_clubId_fkey` FOREIGN KEY (`clubId`) REFERENCES `Club`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserActivity` ADD CONSTRAINT `UserActivity_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserActivity` ADD CONSTRAINT `UserActivity_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `Activity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Announcement` ADD CONSTRAINT `Announcement_clubId_fkey` FOREIGN KEY (`clubId`) REFERENCES `Club`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Announcement` ADD CONSTRAINT `Announcement_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `club` RENAME INDEX `Club_leaderId_fkey` TO `Club_leaderId_idx`;
