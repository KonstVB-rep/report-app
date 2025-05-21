/*
  Warnings:

  - The values [CONTRACT_ADVANCE_PAYMENT,DELIVERY_WORKS,SIGN_ACTS_PAYMENT] on the enum `Retail_dealStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Retail` MODIFY `dealStatus` ENUM('FIRST_CP_APPROVAL', 'APPROVAL', 'ACTUAL', 'REJECT', 'INVOICE_ISSUED', 'PROGRESS', 'PAID', 'CLOSED') NOT NULL;
