/*
  Warnings:

  - You are about to drop the column `data` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `File` table. All the data in the column will be lost.
  - Added the required column `href` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `File` DROP COLUMN `data`,
    DROP COLUMN `type`,
    ADD COLUMN `href` VARCHAR(191) NOT NULL,
    ADD COLUMN `storageType` ENUM('YANDEX_DISK') NOT NULL DEFAULT 'YANDEX_DISK',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
