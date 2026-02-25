/*
  Warnings:

  - You are about to drop the column `material` on the `club` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `club` DROP COLUMN `material`,
    ADD COLUMN `materials` VARCHAR(191) NULL;
