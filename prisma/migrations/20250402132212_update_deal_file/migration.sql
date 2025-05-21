/*
  Warnings:

  - You are about to drop the column `projectId` on the `DealFile` table. All the data in the column will be lost.
  - You are about to drop the column `retailId` on the `DealFile` table. All the data in the column will be lost.
  - Added the required column `dealId` to the `DealFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dealType` to the `DealFile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `DealFile` DROP FOREIGN KEY `DealFile_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `DealFile` DROP FOREIGN KEY `DealFile_retailId_fkey`;

-- DropIndex
DROP INDEX `File_projectId_fkey` ON `DealFile`;

-- DropIndex
DROP INDEX `File_retailId_fkey` ON `DealFile`;

-- AlterTable
ALTER TABLE `DealFile` DROP COLUMN `projectId`,
    DROP COLUMN `retailId`,
    ADD COLUMN `dealId` VARCHAR(191) NOT NULL,
    ADD COLUMN `dealType` ENUM('PROJECT', 'RETAIL') NOT NULL;

-- CreateIndex
CREATE INDEX `DealFile_dealId_idx` ON `DealFile`(`dealId`);
