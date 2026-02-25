/*
  Warnings:

  - You are about to drop the column `procedure` on the `club` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `club` DROP COLUMN `procedure`,
    ADD COLUMN `materials` VARCHAR(191) NULL;
