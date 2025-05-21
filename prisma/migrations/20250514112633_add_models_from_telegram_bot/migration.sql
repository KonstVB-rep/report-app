-- CreateTable
CREATE TABLE `TelegramBot` (
    `id` VARCHAR(191) NOT NULL,
    `botName` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TelegramBot_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserTelegramChat` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `botId` VARCHAR(191) NOT NULL,
    `chatId` BIGINT NOT NULL,
    `telegramUserId` BIGINT NOT NULL,
    `telegramUsername` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UserTelegramChat_botId_telegramUserId_key`(`botId`, `telegramUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserTelegramChat` ADD CONSTRAINT `UserTelegramChat_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserTelegramChat` ADD CONSTRAINT `UserTelegramChat_botId_fkey` FOREIGN KEY (`botId`) REFERENCES `TelegramBot`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
