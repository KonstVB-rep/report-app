/*
  Warnings:

  - A unique constraint covering the columns `[retailId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[projectId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderId]` on the table `Retail` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `DealFile` DROP FOREIGN KEY `DealFile_userId_fkey`;

-- DropForeignKey
ALTER TABLE `ProjectManager` DROP FOREIGN KEY `ProjectManager_dealId_fkey`;

-- DropForeignKey
ALTER TABLE `ProjectManager` DROP FOREIGN KEY `ProjectManager_userId_fkey`;

-- DropForeignKey
ALTER TABLE `RetailManager` DROP FOREIGN KEY `RetailManager_dealId_fkey`;

-- DropForeignKey
ALTER TABLE `RetailManager` DROP FOREIGN KEY `RetailManager_userId_fkey`;

-- DropIndex
DROP INDEX `ProjectManager_userId_fkey` ON `ProjectManager`;

-- DropIndex
DROP INDEX `RetailManager_userId_fkey` ON `RetailManager`;

-- AlterTable
ALTER TABLE `Order` ADD COLUMN `projectId` VARCHAR(191) NULL,
    ADD COLUMN `retailId` VARCHAR(191) NULL,
    MODIFY `orderStatus` ENUM('SUBMITTED_TO_WORK', 'AT_WORK', 'CLOSED') NOT NULL DEFAULT 'SUBMITTED_TO_WORK';

-- AlterTable
ALTER TABLE `Project` ADD COLUMN `orderId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Retail` ADD COLUMN `orderId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Order_retailId_key` ON `Order`(`retailId`);

-- CreateIndex
CREATE UNIQUE INDEX `Order_projectId_key` ON `Order`(`projectId`);

-- CreateIndex
CREATE UNIQUE INDEX `Project_orderId_key` ON `Project`(`orderId`);

-- CreateIndex
CREATE UNIQUE INDEX `Retail_orderId_key` ON `Retail`(`orderId`);

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Retail` ADD CONSTRAINT `Retail_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DealFile` ADD CONSTRAINT `DealFile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectManager` ADD CONSTRAINT `ProjectManager_dealId_fkey` FOREIGN KEY (`dealId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectManager` ADD CONSTRAINT `ProjectManager_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RetailManager` ADD CONSTRAINT `RetailManager_dealId_fkey` FOREIGN KEY (`dealId`) REFERENCES `Retail`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RetailManager` ADD CONSTRAINT `RetailManager_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
