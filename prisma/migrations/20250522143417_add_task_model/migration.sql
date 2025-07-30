/*
  Warnings:

  - You are about to drop the column `еxecutorId` on the `Task` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[assignerId,executorId]` on the table `Task` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `executorId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Task` DROP FOREIGN KEY `Task_еxecutorId_fkey`;

-- DropIndex
DROP INDEX `Task_assignerId_еxecutorId_key` ON `Task`;

-- DropIndex
DROP INDEX `Task_еxecutorId_fkey` ON `Task`;

-- AlterTable
ALTER TABLE `Task` DROP COLUMN `еxecutorId`,
    ADD COLUMN `executorId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Task_assignerId_executorId_key` ON `Task`(`assignerId`, `executorId`);

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_executorId_fkey` FOREIGN KEY (`executorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
