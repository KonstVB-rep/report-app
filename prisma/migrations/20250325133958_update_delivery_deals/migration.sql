/*
  Warnings:

  - The values [WHOLESALE] on the enum `Project_deliveryType` will be removed. If these variants are still used in the database, this will fail.
  - The values [COMPLEX,WHOLESALE] on the enum `Retail_deliveryType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Project` MODIFY `deliveryType` ENUM('COMPLEX', 'EQUIPMENT_SUPPLY', 'WORK_SERVICES', 'RENT', 'SOFTWARE_DELIVERY', 'OTHER') NULL;

-- AlterTable
ALTER TABLE `Retail` MODIFY `deliveryType` ENUM('EXPENDABLE_MATERIALS', 'SUPPLY', 'WORK') NULL;
