-- AlterTable
ALTER TABLE `users` ADD COLUMN `preferredLocale` ENUM('EN', 'FR', 'AR') NOT NULL DEFAULT 'AR';
