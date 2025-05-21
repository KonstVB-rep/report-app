/*
  Warnings:

  - You are about to drop the column `resource` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Project` ADD COLUMN `resource` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Retail` ADD COLUMN `resource` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `resource`;
