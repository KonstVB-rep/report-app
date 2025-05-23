/*
  Warnings:

  - A unique constraint covering the columns `[botId,userId]` on the table `UserTelegramChat` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `UserTelegramChat` DROP FOREIGN KEY `UserTelegramChat_botId_fkey`;

-- DropIndex
DROP INDEX `UserTelegramChat_botId_telegramUserId_key` ON `UserTelegramChat`;

-- CreateIndex
CREATE UNIQUE INDEX `UserTelegramChat_botId_userId_key` ON `UserTelegramChat`(`botId`, `userId`);

-- AddForeignKey
ALTER TABLE `UserTelegramChat` ADD CONSTRAINT `UserTelegramChat_botId_fkey` FOREIGN KEY (`botId`) REFERENCES `TelegramBot`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
