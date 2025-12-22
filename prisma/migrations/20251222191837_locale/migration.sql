/*
  Warnings:

  - You are about to drop the column `message` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `notifications` table. All the data in the column will be lost.
  - Added the required column `messageAr` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `messageFr` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titleAr` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titleFr` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `notifications_isRead_idx` ON `notifications`;

-- AlterTable
ALTER TABLE `notifications` DROP COLUMN `message`,
    DROP COLUMN `title`,
    ADD COLUMN `actorUserId` VARCHAR(191) NULL,
    ADD COLUMN `messageAr` VARCHAR(191) NOT NULL,
    ADD COLUMN `messageFr` VARCHAR(191) NOT NULL,
    ADD COLUMN `titleAr` VARCHAR(191) NOT NULL,
    ADD COLUMN `titleFr` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `notifications_actorUserId_idx` ON `notifications`(`actorUserId`);

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_actorUserId_fkey` FOREIGN KEY (`actorUserId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
