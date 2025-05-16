/*
  Warnings:

  - A unique constraint covering the columns `[chatName]` on the table `UserTelegramChat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chatName` to the `UserTelegramChat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UserTelegramChat` ADD COLUMN `chatName` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `UserTelegramChat_chatName_key` ON `UserTelegramChat`(`chatName`);
