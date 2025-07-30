/*
  Warnings:

  - You are about to drop the column `order` on the `Task` table. All the data in the column will be lost.
  - Added the required column `orderTask` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Task_order_taskStatus_idx` ON `Task`;

-- AlterTable
ALTER TABLE `Task` DROP COLUMN `order`,
    ADD COLUMN `orderTask` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Task_orderTask_taskStatus_idx` ON `Task`(`orderTask`, `taskStatus`);
