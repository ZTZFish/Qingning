/*
  Warnings:

  - You are about to drop the column `clubId` on the `announcement` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `announcement` DROP FOREIGN KEY `Announcement_clubId_fkey`;

-- DropIndex
DROP INDEX `Announcement_clubId_pinned_createdAt_idx` ON `announcement`;

-- AlterTable
ALTER TABLE `announcement` DROP COLUMN `clubId`;

-- CreateIndex
CREATE INDEX `Announcement_pinned_createdAt_idx` ON `Announcement`(`pinned` DESC, `createdAt` DESC);
