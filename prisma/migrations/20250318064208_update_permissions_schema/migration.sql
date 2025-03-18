/*
  Warnings:

  - You are about to drop the column `permission` on the `UserPermission` table. All the data in the column will be lost.
  - Added the required column `permissionId` to the `UserPermission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UserPermission` DROP COLUMN `permission`,
    ADD COLUMN `permissionId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Permission` (
    `id` VARCHAR(191) NOT NULL,
    `name` ENUM('VIEW_USER_REPORT', 'VIEW_UNION_REPORT', 'DOWNLOAD_REPORTS', 'USER_MANAGEMENT') NOT NULL,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `Permission_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `UserPermission_permissionId_fkey` ON `UserPermission`(`permissionId`);

-- AddForeignKey
ALTER TABLE `UserPermission` ADD CONSTRAINT `UserPermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
