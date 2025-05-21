-- AlterTable
ALTER TABLE `Project` MODIFY `phone` VARCHAR(191) NULL,
    MODIFY `delta` DECIMAL(15, 2) NULL,
    MODIFY `additionalContact` VARCHAR(191) NULL,
    MODIFY `amountCP` DECIMAL(15, 2) NULL,
    MODIFY `amountPurchase` DECIMAL(15, 2) NULL,
    MODIFY `amountWork` DECIMAL(15, 2) NULL;

-- AlterTable
ALTER TABLE `Retail` MODIFY `additionalContact` VARCHAR(191) NULL,
    MODIFY `phone` VARCHAR(191) NULL,
    MODIFY `amountCP` DECIMAL(15, 2) NULL,
    MODIFY `delta` DECIMAL(15, 2) NULL;
