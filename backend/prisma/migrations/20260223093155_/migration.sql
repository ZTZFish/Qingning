/*
  Warnings:

  - A unique constraint covering the columns `[StudentId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `StudentId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `StudentId` INTEGER NOT NULL,
    ADD COLUMN `realName` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `sex` ENUM('UNKNOWN', 'MALE', 'FEMALE') NOT NULL DEFAULT 'UNKNOWN';

-- CreateIndex
CREATE UNIQUE INDEX `User_StudentId_key` ON `User`(`StudentId`);
