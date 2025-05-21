/*
  Warnings:

  - Added the required column `filterValue` to the `UserFilter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UserFilter` ADD COLUMN `filterValue` VARCHAR(191) NOT NULL;
