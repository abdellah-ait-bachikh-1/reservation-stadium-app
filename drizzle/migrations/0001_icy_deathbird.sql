ALTER TABLE `cash_payment_records` DROP INDEX `cash_payment_records_reservation_id_unique`;--> statement-breakpoint
ALTER TABLE `cash_payment_records` DROP INDEX `cash_payment_records_monthly_payment_id_unique`;--> statement-breakpoint
ALTER TABLE `cash_payment_records` DROP FOREIGN KEY `cash_payment_records_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `clubs` DROP FOREIGN KEY `clubs_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `clubs` DROP FOREIGN KEY `clubs_sport_id_sports_id_fk`;
--> statement-breakpoint
ALTER TABLE `monthly_payments` DROP FOREIGN KEY `monthly_payments_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `monthly_payments` DROP FOREIGN KEY `monthly_payments_reservation_series_id_reservation_series_id_fk`;
--> statement-breakpoint
ALTER TABLE `monthly_subscriptions` DROP FOREIGN KEY `monthly_subscriptions_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `monthly_subscriptions` DROP FOREIGN KEY `monthly_subscriptions_reservation_series_id_reservation_series_id_fk`;
--> statement-breakpoint
ALTER TABLE `notifications` DROP FOREIGN KEY `notifications_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `notifications` DROP FOREIGN KEY `notifications_actor_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `reservation_series` DROP FOREIGN KEY `reservation_series_stadium_id_stadiums_id_fk`;
--> statement-breakpoint
ALTER TABLE `reservation_series` DROP FOREIGN KEY `reservation_series_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `reservations` DROP FOREIGN KEY `reservations_stadium_id_stadiums_id_fk`;
--> statement-breakpoint
ALTER TABLE `reservations` DROP FOREIGN KEY `reservations_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `stadium_images` DROP FOREIGN KEY `stadium_images_stadium_id_stadiums_id_fk`;
--> statement-breakpoint
ALTER TABLE `stadium_sports` DROP FOREIGN KEY `stadium_sports_stadium_id_stadiums_id_fk`;
--> statement-breakpoint
ALTER TABLE `stadium_sports` DROP FOREIGN KEY `stadium_sports_sport_id_sports_id_fk`;
--> statement-breakpoint
ALTER TABLE `cash_payment_records` ADD CONSTRAINT `fk_cash_payments_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cash_payment_records` ADD CONSTRAINT `fk_cash_payments_reservation` FOREIGN KEY (`reservation_id`) REFERENCES `reservations`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cash_payment_records` ADD CONSTRAINT `fk_cash_payments_monthly` FOREIGN KEY (`monthly_payment_id`) REFERENCES `monthly_payments`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `clubs` ADD CONSTRAINT `fk_clubs_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `clubs` ADD CONSTRAINT `fk_clubs_sport` FOREIGN KEY (`sport_id`) REFERENCES `sports`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `monthly_payments` ADD CONSTRAINT `fk_monthly_payments_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `monthly_payments` ADD CONSTRAINT `fk_monthly_payments_series` FOREIGN KEY (`reservation_series_id`) REFERENCES `reservation_series`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `monthly_subscriptions` ADD CONSTRAINT `fk_subscriptions_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `monthly_subscriptions` ADD CONSTRAINT `fk_subscriptions_series` FOREIGN KEY (`reservation_series_id`) REFERENCES `reservation_series`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `fk_notifications_actor` FOREIGN KEY (`actor_user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reservation_series` ADD CONSTRAINT `fk_reservation_series_stadium` FOREIGN KEY (`stadium_id`) REFERENCES `stadiums`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reservation_series` ADD CONSTRAINT `fk_reservation_series_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reservations` ADD CONSTRAINT `fk_reservations_stadium` FOREIGN KEY (`stadium_id`) REFERENCES `stadiums`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reservations` ADD CONSTRAINT `fk_reservations_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stadium_images` ADD CONSTRAINT `fk_stadium_images_stadium` FOREIGN KEY (`stadium_id`) REFERENCES `stadiums`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stadium_sports` ADD CONSTRAINT `fk_stadium_sports_stadium` FOREIGN KEY (`stadium_id`) REFERENCES `stadiums`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stadium_sports` ADD CONSTRAINT `fk_stadium_sports_sport` FOREIGN KEY (`sport_id`) REFERENCES `sports`(`id`) ON DELETE cascade ON UPDATE no action;