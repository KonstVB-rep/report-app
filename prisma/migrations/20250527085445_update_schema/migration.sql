-- DropIndex
DROP INDEX `Task_assignerId_executorId_key` ON `Task`;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_assignerId_fkey` FOREIGN KEY (`assignerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
