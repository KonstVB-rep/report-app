-- DropForeignKey
ALTER TABLE `Project` DROP FOREIGN KEY `Project_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `Retail` DROP FOREIGN KEY `Retail_orderId_fkey`;

-- DropIndex
DROP INDEX `Order_id_fkey` ON `Order`;

-- AlterTable
ALTER TABLE `Order` MODIFY `nameDeal` VARCHAR(191) NULL;
