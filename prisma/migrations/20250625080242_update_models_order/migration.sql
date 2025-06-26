/*
  Warnings:

  - Made the column `nameDeal` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Order` MODIFY `nameDeal` VARCHAR(191) NOT NULL,
    MODIFY `comments` VARCHAR(191) NULL;
