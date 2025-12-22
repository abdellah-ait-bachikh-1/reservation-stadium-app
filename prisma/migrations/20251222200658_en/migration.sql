/*
  Warnings:

  - Added the required column `messageEn` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titleEn` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `notifications` ADD COLUMN `messageEn` VARCHAR(191) NOT NULL,
    ADD COLUMN `titleEn` VARCHAR(191) NOT NULL;
