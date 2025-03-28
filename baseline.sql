-- AlterTable
ALTER TABLE `Project` DROP COLUMN `amountCo`,
    DROP COLUMN `equipment_type`,
    DROP COLUMN `lastDateConnection`,
    DROP COLUMN `project_status`,
    ADD COLUMN `additionalContact` VARCHAR(191) NOT NULL,
    ADD COLUMN `amountCP` DECIMAL(15, 2) NOT NULL,
    ADD COLUMN `amountPurchase` DECIMAL(15, 2) NOT NULL,
    ADD COLUMN `amountWork` DECIMAL(15, 2) NOT NULL,
    ADD COLUMN `nameDeal` VARCHAR(191) NOT NULL,
    ADD COLUMN `dealStatus` ENUM('INVOICE_ISSUED', 'ACTUAL', 'REJECT', 'PAID', 'APPROVAL', 'FIRST_CP_APPROVAL', 'CONTRACT_ADVANCE_PAYMENT', 'PROGRESS', 'DELIVERY_WORKS', 'SIGN_ACTS_PAYMENT', 'CLOSED') NOT NULL,
    MODIFY `direction` ENUM('PARKING', 'GLK', 'SKD', 'KATOK', 'MUSEUM', 'SPORT', 'FOK_BASIN', 'BPS', 'PPS', 'PARK_ATTRACTION', 'STADIUM_ARENA') NOT NULL,
    MODIFY `deliveryType` ENUM('COMPLEX', 'WHOLESALE', 'EQUIPMENT_SUUPLY', 'WORK_SERVICES', 'RENT', 'SOFTWARE_DELIVERY', 'OTHER') NOT NULL,
    MODIFY `delta` DECIMAL(15, 2) NOT NULL;

-- CreateTable
CREATE TABLE `Retail` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `nameDeal` VARCHAR(191) NOT NULL,
    `dateRequest` DATETIME(3) NOT NULL,
    `nameObject` VARCHAR(191) NOT NULL,
    `direction` ENUM('PARKING_EQUIPMENT', 'SCUD', 'IDS_CONSUMABLES', 'OTHER') NOT NULL,
    `deliveryType` ENUM('COMPLEX', 'WHOLESALE', 'SUPPLY', 'WORK') NOT NULL,
    `contact` VARCHAR(191) NOT NULL,
    `additionalContact` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `amountCP` DECIMAL(15, 2) NOT NULL,
    `delta` DECIMAL(15, 2) NOT NULL,
    `dealStatus` ENUM('FIRST_CP_APPROVAL', 'APPROVAL', 'ACTUAL', 'REJECT', 'INVOICE_ISSUED', 'PROGRESS', 'PAID', 'CLOSED') NOT NULL,
    `comments` VARCHAR(191) NOT NULL,
    `plannedDateConnection` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `File` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `data` LONGBLOB NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NULL,
    `retailId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Retail` ADD CONSTRAINT `Retail_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_retailId_fkey` FOREIGN KEY (`retailId`) REFERENCES `Retail`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

