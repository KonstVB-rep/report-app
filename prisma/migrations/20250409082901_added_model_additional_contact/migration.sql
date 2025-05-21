/*
  Warnings:

  - You are about to drop the column `additionalContact` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `additionalContact` on the `Retail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Project` DROP COLUMN `additionalContact`;

-- AlterTable
ALTER TABLE `Retail` DROP COLUMN `additionalContact`;

-- CreateTable
CREATE TABLE `AdditionalContact` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL DEFAULT 'Нет данных',
    `email` VARCHAR(191) NOT NULL DEFAULT 'Нет данных',
    `position` VARCHAR(191) NOT NULL DEFAULT 'Нет данных',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProjectContacts` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ProjectContacts_AB_unique`(`A`, `B`),
    INDEX `_ProjectContacts_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_RetailContacts` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_RetailContacts_AB_unique`(`A`, `B`),
    INDEX `_RetailContacts_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ProjectContacts` ADD CONSTRAINT `_ProjectContacts_A_fkey` FOREIGN KEY (`A`) REFERENCES `AdditionalContact`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProjectContacts` ADD CONSTRAINT `_ProjectContacts_B_fkey` FOREIGN KEY (`B`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RetailContacts` ADD CONSTRAINT `_RetailContacts_A_fkey` FOREIGN KEY (`A`) REFERENCES `AdditionalContact`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RetailContacts` ADD CONSTRAINT `_RetailContacts_B_fkey` FOREIGN KEY (`B`) REFERENCES `Retail`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
