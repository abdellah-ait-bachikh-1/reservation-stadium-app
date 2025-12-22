/*
  Warnings:

  - A unique constraint covering the columns `[month,year,reservationSeriesId]` on the table `monthly_payments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX `cash_payment_records_reservationId_idx` ON `cash_payment_records`(`reservationId`);

-- CreateIndex
CREATE INDEX `cash_payment_records_monthlyPaymentId_idx` ON `cash_payment_records`(`monthlyPaymentId`);

-- CreateIndex
CREATE INDEX `cash_payment_records_paymentDate_idx` ON `cash_payment_records`(`paymentDate`);

-- CreateIndex
CREATE INDEX `cash_payment_records_createdAt_idx` ON `cash_payment_records`(`createdAt`);

-- CreateIndex
CREATE INDEX `clubs_userId_idx` ON `clubs`(`userId`);

-- CreateIndex
CREATE INDEX `clubs_nameFr_idx` ON `clubs`(`nameFr`);

-- CreateIndex
CREATE INDEX `clubs_nameAr_idx` ON `clubs`(`nameAr`);

-- CreateIndex
CREATE INDEX `monthly_payments_status_idx` ON `monthly_payments`(`status`);

-- CreateIndex
CREATE INDEX `monthly_payments_month_year_idx` ON `monthly_payments`(`month`, `year`);

-- CreateIndex
CREATE INDEX `monthly_payments_paymentDate_idx` ON `monthly_payments`(`paymentDate`);

-- CreateIndex
CREATE INDEX `monthly_payments_createdAt_idx` ON `monthly_payments`(`createdAt`);

-- CreateIndex
CREATE UNIQUE INDEX `monthly_payments_month_year_reservationSeriesId_key` ON `monthly_payments`(`month`, `year`, `reservationSeriesId`);

-- CreateIndex
CREATE INDEX `monthly_subscriptions_reservationSeriesId_idx` ON `monthly_subscriptions`(`reservationSeriesId`);

-- CreateIndex
CREATE INDEX `monthly_subscriptions_status_idx` ON `monthly_subscriptions`(`status`);

-- CreateIndex
CREATE INDEX `monthly_subscriptions_startDate_idx` ON `monthly_subscriptions`(`startDate`);

-- CreateIndex
CREATE INDEX `monthly_subscriptions_endDate_idx` ON `monthly_subscriptions`(`endDate`);

-- CreateIndex
CREATE INDEX `monthly_subscriptions_createdAt_idx` ON `monthly_subscriptions`(`createdAt`);

-- CreateIndex
CREATE INDEX `reservation_series_dayOfWeek_idx` ON `reservation_series`(`dayOfWeek`);

-- CreateIndex
CREATE INDEX `reservation_series_billingType_idx` ON `reservation_series`(`billingType`);

-- CreateIndex
CREATE INDEX `reservation_series_createdAt_idx` ON `reservation_series`(`createdAt`);

-- CreateIndex
CREATE INDEX `reservation_series_recurrenceEndDate_idx` ON `reservation_series`(`recurrenceEndDate`);

-- CreateIndex
CREATE INDEX `reservation_series_startTime_endTime_idx` ON `reservation_series`(`startTime`, `endTime`);

-- CreateIndex
CREATE INDEX `reservations_startDateTime_idx` ON `reservations`(`startDateTime`);

-- CreateIndex
CREATE INDEX `reservations_endDateTime_idx` ON `reservations`(`endDateTime`);

-- CreateIndex
CREATE INDEX `reservations_status_idx` ON `reservations`(`status`);

-- CreateIndex
CREATE INDEX `reservations_createdAt_idx` ON `reservations`(`createdAt`);

-- CreateIndex
CREATE INDEX `reservations_isPaid_idx` ON `reservations`(`isPaid`);

-- CreateIndex
CREATE INDEX `reservations_startDateTime_stadiumId_idx` ON `reservations`(`startDateTime`, `stadiumId`);

-- CreateIndex
CREATE INDEX `reservations_status_startDateTime_idx` ON `reservations`(`status`, `startDateTime`);

-- CreateIndex
CREATE INDEX `sports_nameFr_idx` ON `sports`(`nameFr`);

-- CreateIndex
CREATE INDEX `sports_nameAr_idx` ON `sports`(`nameAr`);

-- CreateIndex
CREATE INDEX `stadiums_nameFr_idx` ON `stadiums`(`nameFr`);

-- CreateIndex
CREATE INDEX `stadiums_nameAr_idx` ON `stadiums`(`nameAr`);

-- CreateIndex
CREATE INDEX `stadiums_monthlyPrice_idx` ON `stadiums`(`monthlyPrice`);

-- CreateIndex
CREATE INDEX `stadiums_pricePerSession_idx` ON `stadiums`(`pricePerSession`);

-- CreateIndex
CREATE INDEX `users_email_idx` ON `users`(`email`);

-- CreateIndex
CREATE INDEX `users_role_idx` ON `users`(`role`);

-- CreateIndex
CREATE INDEX `users_approved_idx` ON `users`(`approved`);

-- CreateIndex
CREATE INDEX `users_createdAt_idx` ON `users`(`createdAt`);

-- RenameIndex
ALTER TABLE `cash_payment_records` RENAME INDEX `cash_payment_records_userId_fkey` TO `cash_payment_records_userId_idx`;

-- RenameIndex
ALTER TABLE `clubs` RENAME INDEX `clubs_sportId_fkey` TO `clubs_sportId_idx`;

-- RenameIndex
ALTER TABLE `monthly_payments` RENAME INDEX `monthly_payments_reservationSeriesId_fkey` TO `monthly_payments_reservationSeriesId_idx`;

-- RenameIndex
ALTER TABLE `monthly_payments` RENAME INDEX `monthly_payments_userId_fkey` TO `monthly_payments_userId_idx`;

-- RenameIndex
ALTER TABLE `monthly_subscriptions` RENAME INDEX `monthly_subscriptions_userId_fkey` TO `monthly_subscriptions_userId_idx`;

-- RenameIndex
ALTER TABLE `reservation_series` RENAME INDEX `reservation_series_stadiumId_fkey` TO `reservation_series_stadiumId_idx`;

-- RenameIndex
ALTER TABLE `reservation_series` RENAME INDEX `reservation_series_userId_fkey` TO `reservation_series_userId_idx`;

-- RenameIndex
ALTER TABLE `reservations` RENAME INDEX `reservations_monthlyPaymentId_fkey` TO `reservations_monthlyPaymentId_idx`;

-- RenameIndex
ALTER TABLE `reservations` RENAME INDEX `reservations_reservationSeriesId_fkey` TO `reservations_reservationSeriesId_idx`;

-- RenameIndex
ALTER TABLE `reservations` RENAME INDEX `reservations_stadiumId_fkey` TO `reservations_stadiumId_idx`;

-- RenameIndex
ALTER TABLE `reservations` RENAME INDEX `reservations_userId_fkey` TO `reservations_userId_idx`;

-- RenameIndex
ALTER TABLE `stadium_images` RENAME INDEX `stadium_images_stadiumId_fkey` TO `stadium_images_stadiumId_idx`;
