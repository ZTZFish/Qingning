/*
  Warnings:

  - You are about to drop the column `materials` on the `club` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `club` DROP COLUMN `materials`,
    ADD COLUMN `material` VARCHAR(191) NULL;
