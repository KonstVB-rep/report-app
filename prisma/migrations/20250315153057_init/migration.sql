-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `user_password` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `departmentId` INTEGER NOT NULL,
    `role` ENUM('DIRECTOR', 'EMPLOYEE', 'ADMIN') NOT NULL,
    `lastlogin` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_phone_key`(`phone`),
    INDEX `User_departmentId_idx`(`departmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Department` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` ENUM('SALES', 'TECHNICAL') NOT NULL,
    `directorId` VARCHAR(191) NULL,

    UNIQUE INDEX `Department_name_key`(`name`),
    UNIQUE INDEX `Department_directorId_key`(`directorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` ENUM('PROJECT', 'RETAIL') NOT NULL DEFAULT 'PROJECT',
    `dateRequest` DATETIME(3) NOT NULL,
    `nameObject` VARCHAR(191) NOT NULL,
    `nameDeal` VARCHAR(191) NOT NULL,
    `direction` ENUM('PARKING', 'GLK', 'SKD', 'KATOK', 'MUSEUM', 'SPORT', 'FOK_BASIN', 'BPS', 'PPS', 'PARK_ATTRACTION', 'STADIUM_ARENA') NOT NULL,
    `deliveryType` ENUM('COMPLEX', 'WHOLESALE', 'EQUIPMENT_SUPPLY', 'WORK_SERVICES', 'RENT', 'SOFTWARE_DELIVERY', 'OTHER') NOT NULL,
    `contact` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `delta` DECIMAL(15, 2) NOT NULL,
    `comments` VARCHAR(191) NOT NULL,
    `plannedDateConnection` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `additionalContact` VARCHAR(191) NOT NULL,
    `amountCP` DECIMAL(15, 2) NOT NULL,
    `amountPurchase` DECIMAL(15, 2) NOT NULL,
    `amountWork` DECIMAL(15, 2) NOT NULL,
    `projectStatus` ENUM('INVOICE_ISSUED', 'ACTUAL', 'REJECT', 'PAID', 'APPROVAL', 'FIRST_CP_APPROVAL', 'CONTRACT_ADVANCE_PAYMENT', 'PROGRESS', 'DELIVERY_WORKS', 'SIGN_ACTS_PAYMENT', 'CLOSED') NOT NULL,

    INDEX `Project_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Retail` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` ENUM('PROJECT', 'RETAIL') NOT NULL DEFAULT 'RETAIL',
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
    `projectStatus` ENUM('FIRST_CP_APPROVAL', 'APPROVAL', 'ACTUAL', 'REJECT', 'INVOICE_ISSUED', 'PROGRESS', 'PAID', 'CLOSED') NOT NULL,
    `comments` VARCHAR(191) NOT NULL,
    `plannedDateConnection` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Retail_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserLogin` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `loginAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `UserLogin_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserPermission` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `permission` ENUM('VIEW_REPORTS', 'EDIT_PROJECTS', 'DELETE_PROJECTS', 'DOWNLOAD_REPORTS', 'CREATE_USER', 'DELETE_USER', 'EDIT_USER') NOT NULL,

    INDEX `UserPermission_userId_fkey`(`userId`),
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

    INDEX `File_projectId_fkey`(`projectId`),
    INDEX `File_retailId_fkey`(`retailId`),
    INDEX `File_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Department` ADD CONSTRAINT `Department_directorId_fkey` FOREIGN KEY (`directorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Retail` ADD CONSTRAINT `Retail_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserLogin` ADD CONSTRAINT `UserLogin_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPermission` ADD CONSTRAINT `UserPermission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_retailId_fkey` FOREIGN KEY (`retailId`) REFERENCES `Retail`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
