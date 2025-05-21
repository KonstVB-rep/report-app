/*
  Warnings:

  - You are about to drop the column `filterStatus` on the `UserFilter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `UserFilter` DROP COLUMN `filterStatus`,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `filterValue` TEXT NOT NULL;
