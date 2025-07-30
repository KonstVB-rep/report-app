-- CreateTable
CREATE TABLE `Contract` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` ENUM('PROJECT', 'RETAIL') NOT NULL DEFAULT 'PROJECT',
    `dateRequest` DATETIME(3) NOT NULL,
    `nameDeal` VARCHAR(191) NOT NULL,
    `nameObject` VARCHAR(191) NOT NULL,
    `direction` ENUM('PARKING', 'GLK', 'SKD', 'KATOK', 'MUSEUM', 'SPORT', 'FOK_BASIN', 'BPS', 'PPS', 'PARK_ATTRACTION', 'STADIUM_ARENA') NOT NULL,
    `deliveryType` ENUM('COMPLEX', 'EQUIPMENT_SUPPLY', 'WORK_SERVICES', 'RENT', 'SOFTWARE_DELIVERY', 'OTHER') NULL,
    `contact` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `amountCP` DECIMAL(15, 2) NULL,
    `amountPurchase` DECIMAL(15, 2) NULL,
    `amountWork` DECIMAL(15, 2) NULL,
    `delta` DECIMAL(15, 2) NULL,
    `comments` VARCHAR(191) NOT NULL,
    `dealStatus` ENUM('CONTRACT_ADVANCE_PAYMENT', 'PROGRESS', 'DELIVERY_WORKS', 'SIGN_ACTS_PAYMENT', 'CLOSED') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Contract_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ContractContacts` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ContractContacts_AB_unique`(`A`, `B`),
    INDEX `_ContractContacts_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Contract` ADD CONSTRAINT `Contract_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ContractContacts` ADD CONSTRAINT `_ContractContacts_A_fkey` FOREIGN KEY (`A`) REFERENCES `AdditionalContact`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ContractContacts` ADD CONSTRAINT `_ContractContacts_B_fkey` FOREIGN KEY (`B`) REFERENCES `Contract`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
