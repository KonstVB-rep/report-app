/*
  Warnings:

  - You are about to drop the column `status` on the `UserFilter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `UserFilter` DROP COLUMN `status`,
    ADD COLUMN `filterStatus` BOOLEAN NOT NULL DEFAULT false;
