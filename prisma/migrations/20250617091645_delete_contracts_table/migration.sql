/*
  Warnings:

  - You are about to drop the `Contract` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ContractContacts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Contract` DROP FOREIGN KEY `Contract_userId_fkey`;

-- DropForeignKey
ALTER TABLE `_ContractContacts` DROP FOREIGN KEY `_ContractContacts_A_fkey`;

-- DropForeignKey
ALTER TABLE `_ContractContacts` DROP FOREIGN KEY `_ContractContacts_B_fkey`;

-- DropTable
DROP TABLE `Contract`;

-- DropTable
DROP TABLE `_ContractContacts`;
