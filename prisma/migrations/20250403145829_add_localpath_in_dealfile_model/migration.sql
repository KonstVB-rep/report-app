/*
  Warnings:

  - Added the required column `localPath` to the `DealFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `DealFile` ADD COLUMN `localPath` VARCHAR(191) NOT NULL;
