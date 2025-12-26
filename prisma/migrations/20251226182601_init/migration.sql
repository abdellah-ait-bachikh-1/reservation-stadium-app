-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `fullNameFr` VARCHAR(191) NOT NULL,
    `fullNameAr` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `approved` BOOLEAN NOT NULL DEFAULT false,
    `role` ENUM('ADMIN', 'CLUB') NOT NULL DEFAULT 'CLUB',
    `phoneNumber` VARCHAR(191) NOT NULL,
    `emailVerifiedAt` DATETIME(3) NULL,
    `verificationToken` VARCHAR(191) NULL,
    `preferredLocale` ENUM('EN', 'FR', 'AR') NOT NULL DEFAULT 'AR',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_verificationToken_key`(`verificationToken`),
    INDEX `users_email_idx`(`email`),
    INDEX `users_role_idx`(`role`),
    INDEX `users_approved_idx`(`approved`),
    INDEX `users_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
    INDEX `clubs_userId_idx`(`userId`),
    INDEX `clubs_sportId_idx`(`sportId`),
    INDEX `clubs_nameFr_idx`(`nameFr`),
    INDEX `clubs_nameAr_idx`(`nameAr`),
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

    INDEX `sports_nameFr_idx`(`nameFr`),
    INDEX `sports_nameAr_idx`(`nameAr`),
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

    INDEX `stadiums_nameFr_idx`(`nameFr`),
    INDEX `stadiums_nameAr_idx`(`nameAr`),
    INDEX `stadiums_monthlyPrice_idx`(`monthlyPrice`),
    INDEX `stadiums_pricePerSession_idx`(`pricePerSession`),
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

    INDEX `stadium_images_stadiumId_idx`(`stadiumId`),
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

    INDEX `reservations_startDateTime_idx`(`startDateTime`),
    INDEX `reservations_endDateTime_idx`(`endDateTime`),
    INDEX `reservations_status_idx`(`status`),
    INDEX `reservations_userId_idx`(`userId`),
    INDEX `reservations_stadiumId_idx`(`stadiumId`),
    INDEX `reservations_monthlyPaymentId_idx`(`monthlyPaymentId`),
    INDEX `reservations_reservationSeriesId_idx`(`reservationSeriesId`),
    INDEX `reservations_createdAt_idx`(`createdAt`),
    INDEX `reservations_isPaid_idx`(`isPaid`),
    INDEX `reservations_startDateTime_stadiumId_idx`(`startDateTime`, `stadiumId`),
    INDEX `reservations_status_startDateTime_idx`(`status`, `startDateTime`),
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

    INDEX `reservation_series_userId_idx`(`userId`),
    INDEX `reservation_series_stadiumId_idx`(`stadiumId`),
    INDEX `reservation_series_dayOfWeek_idx`(`dayOfWeek`),
    INDEX `reservation_series_billingType_idx`(`billingType`),
    INDEX `reservation_series_createdAt_idx`(`createdAt`),
    INDEX `reservation_series_recurrenceEndDate_idx`(`recurrenceEndDate`),
    INDEX `reservation_series_startTime_endTime_idx`(`startTime`, `endTime`),
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

    INDEX `monthly_payments_userId_idx`(`userId`),
    INDEX `monthly_payments_reservationSeriesId_idx`(`reservationSeriesId`),
    INDEX `monthly_payments_status_idx`(`status`),
    INDEX `monthly_payments_month_year_idx`(`month`, `year`),
    INDEX `monthly_payments_paymentDate_idx`(`paymentDate`),
    INDEX `monthly_payments_createdAt_idx`(`createdAt`),
    UNIQUE INDEX `monthly_payments_month_year_reservationSeriesId_key`(`month`, `year`, `reservationSeriesId`),
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

    INDEX `cash_payment_records_userId_idx`(`userId`),
    INDEX `cash_payment_records_reservationId_idx`(`reservationId`),
    INDEX `cash_payment_records_monthlyPaymentId_idx`(`monthlyPaymentId`),
    INDEX `cash_payment_records_paymentDate_idx`(`paymentDate`),
    INDEX `cash_payment_records_createdAt_idx`(`createdAt`),
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
    INDEX `monthly_subscriptions_userId_idx`(`userId`),
    INDEX `monthly_subscriptions_reservationSeriesId_idx`(`reservationSeriesId`),
    INDEX `monthly_subscriptions_status_idx`(`status`),
    INDEX `monthly_subscriptions_startDate_idx`(`startDate`),
    INDEX `monthly_subscriptions_endDate_idx`(`endDate`),
    INDEX `monthly_subscriptions_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('ACCOUNT_CREATED', 'ACCOUNT_APPROVED', 'ACCOUNT_REJECTED', 'PROFILE_UPDATED', 'PASSWORD_CHANGED', 'RESERVATION_REQUESTED', 'RESERVATION_APPROVED', 'RESERVATION_DECLINED', 'RESERVATION_CANCELLED', 'RESERVATION_REMINDER', 'PAYMENT_RECEIVED', 'PAYMENT_OVERDUE', 'PAYMENT_FAILED', 'PAYMENT_REFUNDED', 'MONTHLY_SUBSCRIPTION_PAYMENT', 'SYSTEM_MAINTENANCE', 'SYSTEM_UPDATE', 'NEW_FEATURE', 'ANNOUNCEMENT', 'CLUB_REGISTRATION_SUBMITTED', 'CLUB_REGISTRATION_APPROVED', 'CLUB_REGISTRATION_REJECTED', 'EMAIL_SENT', 'EMAIL_VERIFIED', 'WELCOME_EMAIL', 'NEW_USER_REGISTERED', 'NEW_RESERVATION_REQUEST', 'PAYMENT_REQUIRES_ATTENTION') NOT NULL,
    `titleEn` VARCHAR(191) NOT NULL,
    `titleFr` VARCHAR(191) NOT NULL,
    `titleAr` VARCHAR(191) NOT NULL,
    `messageEn` VARCHAR(191) NOT NULL,
    `messageFr` VARCHAR(191) NOT NULL,
    `messageAr` VARCHAR(191) NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `userId` VARCHAR(191) NOT NULL,
    `actorUserId` VARCHAR(191) NULL,
    `metadata` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `notifications_actorUserId_idx`(`actorUserId`),
    INDEX `notifications_userId_isRead_idx`(`userId`, `isRead`),
    INDEX `notifications_createdAt_idx`(`createdAt`),
    INDEX `notifications_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_actorUserId_fkey` FOREIGN KEY (`actorUserId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
