/*
  Warnings:

  - Renamed column `StudentId` to `studentId` on the `User` table.
  - A unique constraint covering the columns `[studentId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
*/
-- 先删除旧的唯一索引（注意字段名是大写的 StudentId）
DROP INDEX `User_StudentId_key` ON `user`;

-- 核心修改：重命名字段（保留数据，而非删除再新增）
ALTER TABLE `user` 
CHANGE COLUMN `StudentId` `studentId` INTEGER NOT NULL;

-- 创建新的唯一索引（字段名是小写的 studentId）
CREATE UNIQUE INDEX `User_studentId_key` ON `User`(`studentId`);