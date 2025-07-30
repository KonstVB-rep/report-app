-- AlterTable
ALTER TABLE `DealFile` MODIFY `dealType` ENUM('PROJECT', 'RETAIL', 'ORDER') NOT NULL;

-- AlterTable
ALTER TABLE `Project` MODIFY `type` ENUM('PROJECT', 'RETAIL', 'ORDER') NOT NULL DEFAULT 'PROJECT';

-- AlterTable
ALTER TABLE `Retail` MODIFY `type` ENUM('PROJECT', 'RETAIL', 'ORDER') NOT NULL DEFAULT 'RETAIL';

-- CreateTable
CREATE TABLE `Order` (
    `id` VARCHAR(191) NOT NULL,
    `dateRequest` DATETIME(3) NOT NULL,
    `nameDeal` VARCHAR(191) NOT NULL,
    `contact` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `manager` VARCHAR(191) NOT NULL,
    `comments` VARCHAR(191) NOT NULL,
    `resource` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Order_id_fkey`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
