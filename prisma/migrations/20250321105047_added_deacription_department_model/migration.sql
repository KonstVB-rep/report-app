/*
  Warnings:

  - A unique constraint covering the columns `[description]` on the table `Department` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `Department` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Department` ADD COLUMN `description` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Department_description_key` ON `Department`(`description`);
