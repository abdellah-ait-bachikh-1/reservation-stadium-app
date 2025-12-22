/*
  Warnings:

  - A unique constraint covering the columns `[verificationToken]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `verificationToken` VARCHAR(191) NULL,
    MODIFY `role` ENUM('ADMIN', 'CLUB') NOT NULL DEFAULT 'CLUB',
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `deletedAt` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `clubs` (
    `id` VARCHAR(191) NOT NULL,
    `nameAr` VARCHAR(191) NOT NULL,
    `nameFr` VARCHAR(191) NOT NULL,
    `addressFr` VARCHAR(191) NOT NULL,
    `addressAr` VARCHAR(191) NOT NULL,
    `monthlyFee` DECIMAL(10, 2) NOT NULL DEFAULT 100,
    `paymentDueDay` INTEGER NOT NULL DEFAULT 5,
    `userId` VARCHAR(191) NOT NULL,
    `sportId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `clubs_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sports` (
    `id` VARCHAR(191) NOT NULL,
    `nameAr` VARCHAR(191) NOT NULL,
    `nameFr` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stadiums` (
    `id` VARCHAR(191) NOT NULL,
    `nameAr` VARCHAR(191) NOT NULL,
    `nameFr` VARCHAR(191) NOT NULL,
    `addressFr` VARCHAR(191) NOT NULL,
    `addressAr` VARCHAR(191) NOT NULL,
    `googleMapsUrl` VARCHAR(191) NOT NULL,
    `monthlyPrice` DECIMAL(10, 2) NOT NULL,
    `pricePerSession` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stadium_sports` (
    `stadiumId` VARCHAR(191) NOT NULL,
    `sportId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`stadiumId`, `sportId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stadium_images` (
    `id` VARCHAR(191) NOT NULL,
    `imageUri` VARCHAR(191) NOT NULL,
    `stadiumId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reservations` (
    `id` VARCHAR(191) NOT NULL,
    `startDateTime` DATETIME(3) NOT NULL,
    `endDateTime` DATETIME(3) NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'DECLINED', 'CANCELLED', 'PAID', 'UNPAID') NOT NULL DEFAULT 'PENDING',
    `sessionPrice` DECIMAL(10, 2) NOT NULL,
    `isPaid` BOOLEAN NOT NULL DEFAULT false,
    `paymentType` ENUM('SINGLE_SESSION', 'MONTHLY_SUBSCRIPTION') NOT NULL,
    `stadiumId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `monthlyPaymentId` VARCHAR(191) NULL,
    `reservationSeriesId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reservation_series` (
    `id` VARCHAR(191) NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `dayOfWeek` INTEGER NOT NULL,
    `recurrenceEndDate` DATETIME(3) NULL,
    `isFixed` BOOLEAN NOT NULL DEFAULT true,
    `billingType` ENUM('PER_SESSION', 'MONTHLY_SUBSCRIPTION') NOT NULL,
    `monthlyPrice` DECIMAL(10, 2) NULL,
    `pricePerSession` DECIMAL(10, 2) NULL,
    `stadiumId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `monthly_payments` (
    `id` VARCHAR(191) NOT NULL,
    `month` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('PENDING', 'PAID', 'OVERDUE', 'PARTIALLY_PAID') NOT NULL DEFAULT 'PENDING',
    `paymentDate` DATETIME(3) NULL,
    `receiptNumber` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `reservationSeriesId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cash_payment_records` (
    `id` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `paymentDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `receiptNumber` VARCHAR(191) NOT NULL,
    `notes` VARCHAR(191) NULL,
    `reservationId` VARCHAR(191) NULL,
    `monthlyPaymentId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `cash_payment_records_reservationId_key`(`reservationId`),
    UNIQUE INDEX `cash_payment_records_monthlyPaymentId_key`(`monthlyPaymentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `monthly_subscriptions` (
    `id` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endDate` DATETIME(3) NULL,
    `monthlyAmount` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('ACTIVE', 'CANCELLED', 'EXPIRED', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    `autoRenew` BOOLEAN NOT NULL DEFAULT true,
    `userId` VARCHAR(191) NOT NULL,
    `reservationSeriesId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `monthly_subscriptions_reservationSeriesId_key`(`reservationSeriesId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `users_verificationToken_key` ON `users`(`verificationToken`);

-- AddForeignKey
ALTER TABLE `clubs` ADD CONSTRAINT `clubs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `clubs` ADD CONSTRAINT `clubs_sportId_fkey` FOREIGN KEY (`sportId`) REFERENCES `sports`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stadium_sports` ADD CONSTRAINT `stadium_sports_stadiumId_fkey` FOREIGN KEY (`stadiumId`) REFERENCES `stadiums`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stadium_sports` ADD CONSTRAINT `stadium_sports_sportId_fkey` FOREIGN KEY (`sportId`) REFERENCES `sports`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stadium_images` ADD CONSTRAINT `stadium_images_stadiumId_fkey` FOREIGN KEY (`stadiumId`) REFERENCES `stadiums`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reservations` ADD CONSTRAINT `reservations_stadiumId_fkey` FOREIGN KEY (`stadiumId`) REFERENCES `stadiums`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reservations` ADD CONSTRAINT `reservations_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reservations` ADD CONSTRAINT `reservations_monthlyPaymentId_fkey` FOREIGN KEY (`monthlyPaymentId`) REFERENCES `monthly_payments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reservations` ADD CONSTRAINT `reservations_reservationSeriesId_fkey` FOREIGN KEY (`reservationSeriesId`) REFERENCES `reservation_series`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reservation_series` ADD CONSTRAINT `reservation_series_stadiumId_fkey` FOREIGN KEY (`stadiumId`) REFERENCES `stadiums`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reservation_series` ADD CONSTRAINT `reservation_series_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `monthly_payments` ADD CONSTRAINT `monthly_payments_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `monthly_payments` ADD CONSTRAINT `monthly_payments_reservationSeriesId_fkey` FOREIGN KEY (`reservationSeriesId`) REFERENCES `reservation_series`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cash_payment_records` ADD CONSTRAINT `cash_payment_records_reservationId_fkey` FOREIGN KEY (`reservationId`) REFERENCES `reservations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cash_payment_records` ADD CONSTRAINT `cash_payment_records_monthlyPaymentId_fkey` FOREIGN KEY (`monthlyPaymentId`) REFERENCES `monthly_payments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cash_payment_records` ADD CONSTRAINT `cash_payment_records_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `monthly_subscriptions` ADD CONSTRAINT `monthly_subscriptions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `monthly_subscriptions` ADD CONSTRAINT `monthly_subscriptions_reservationSeriesId_fkey` FOREIGN KEY (`reservationSeriesId`) REFERENCES `reservation_series`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
