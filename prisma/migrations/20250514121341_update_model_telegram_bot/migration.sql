/*
  Warnings:

  - A unique constraint covering the columns `[botName]` on the table `TelegramBot` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `TelegramBot_botName_key` ON `TelegramBot`(`botName`);
