/*
  Warnings:

  - The values [IN_REVIEW] on the enum `Task_taskStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Task` MODIFY `taskStatus` ENUM('OPEN', 'IN_PROGRESS', 'DONE', 'CANCELED') NOT NULL;
