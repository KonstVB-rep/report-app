/*
  Warnings:

  - The primary key for the `ProjectManager` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `orderId` on the `ProjectManager` table. All the data in the column will be lost.
  - The primary key for the `RetailManager` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `orderId` on the `RetailManager` table. All the data in the column will be lost.
  - Added the required column `dealId` to the `ProjectManager` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dealId` to the `RetailManager` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ProjectManager` DROP FOREIGN KEY `ProjectManager_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `RetailManager` DROP FOREIGN KEY `RetailManager_orderId_fkey`;

-- AlterTable
ALTER TABLE `ProjectManager` DROP PRIMARY KEY,
    DROP COLUMN `orderId`,
    ADD COLUMN `dealId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`dealId`, `userId`);

-- AlterTable
ALTER TABLE `RetailManager` DROP PRIMARY KEY,
    DROP COLUMN `orderId`,
    ADD COLUMN `dealId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`dealId`, `userId`);

-- AddForeignKey
ALTER TABLE `ProjectManager` ADD CONSTRAINT `ProjectManager_dealId_fkey` FOREIGN KEY (`dealId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RetailManager` ADD CONSTRAINT `RetailManager_dealId_fkey` FOREIGN KEY (`dealId`) REFERENCES `Retail`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
