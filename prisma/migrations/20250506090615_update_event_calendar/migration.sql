/*
  Warnings:

  - Made the column `end` on table `EventCalendar` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `EventCalendar` MODIFY `end` DATETIME(3) NOT NULL;
