-- CreateTable
CREATE TABLE `Task` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `taskStatus` ENUM('OPEN', 'IN_PROGRESS', 'DONE', 'CANCELED') NOT NULL,
    `taskPriority` ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL,
    `assignerId` VARCHAR(191) NOT NULL,
    `еxecutorId` VARCHAR(191) NOT NULL,
    `dueDate` DATETIME(3) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Task_assignerId_еxecutorId_key`(`assignerId`, `еxecutorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_еxecutorId_fkey` FOREIGN KEY (`еxecutorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
