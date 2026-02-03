CREATE TABLE `cash_payment_records` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`amount` decimal(10,2) NOT NULL,
	`payment_date` timestamp NOT NULL DEFAULT (now()),
	`receipt_number` varchar(255) NOT NULL,
	`notes` text,
	`monthly_payment_id` char(36),
	`single_session_payment_id` char(36),
	`user_id` char(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cash_payment_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clubs` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`name` varchar(255) NOT NULL,
	`shortcut_name` varchar(20),
	`address` varchar(255),
	`monthly_fee` decimal(10,2),
	`payment_due_day` smallint unsigned,
	`user_id` char(36) NOT NULL,
	`sport_id` char(36),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `clubs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `monthly_payments` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`month` smallint unsigned NOT NULL,
	`year` smallint unsigned NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`status` enum('PENDING','PAID','OVERDUE','PARTIALLY_PAID') NOT NULL DEFAULT 'PENDING',
	`payment_date` timestamp,
	`receipt_number` varchar(255),
	`user_id` char(36) NOT NULL,
	`reservation_series_id` char(36) NOT NULL,
	`payment_method` enum('CASH','BANK_TRANSFER','CREDIT_CARD') DEFAULT 'CASH',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `monthly_payments_id` PRIMARY KEY(`id`),
	CONSTRAINT `month_year_series_unique` UNIQUE(`month`,`year`,`reservation_series_id`)
);
--> statement-breakpoint
CREATE TABLE `monthly_subscriptions` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`user_id` char(36) NOT NULL,
	`reservation_series_id` char(36) NOT NULL,
	`start_date` timestamp NOT NULL DEFAULT (now()),
	`end_date` timestamp,
	`monthly_amount` decimal(10,2) NOT NULL,
	`status` enum('ACTIVE','CANCELLED','EXPIRED','SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
	`auto_renew` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `monthly_subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `monthly_subscriptions_reservation_series_id_unique` UNIQUE(`reservation_series_id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`type` varchar(50) NOT NULL,
	`model` enum('USER','RESERVATION','PAYMENT','SUBSCRIPTION','SYSTEM') NOT NULL,
	`reference_id` char(36) NOT NULL,
	`title_en` varchar(255) NOT NULL,
	`title_fr` varchar(255) NOT NULL,
	`title_ar` varchar(255) NOT NULL,
	`message_en` text NOT NULL,
	`message_fr` text NOT NULL,
	`message_ar` text NOT NULL,
	`link` varchar(255),
	`is_read` boolean NOT NULL DEFAULT false,
	`user_id` char(36) NOT NULL,
	`actor_user_id` char(36),
	`metadata` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `password_reset_tokens` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`token` varchar(255) NOT NULL,
	`user_id` char(36) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`used_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `password_reset_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `password_reset_tokens_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `reservation_series` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`start_time` timestamp NOT NULL,
	`end_time` timestamp NOT NULL,
	`day_of_week` smallint unsigned NOT NULL,
	`recurrence_end_date` timestamp,
	`is_fixed` boolean NOT NULL DEFAULT true,
	`billing_type` enum('PER_SESSION','MONTHLY_SUBSCRIPTION') NOT NULL,
	`monthly_price` decimal(10,2),
	`price_per_session` decimal(10,2),
	`stadium_id` char(36) NOT NULL,
	`user_id` char(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reservation_series_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reservations` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`start_date_time` timestamp NOT NULL,
	`end_date_time` timestamp NOT NULL,
	`status` enum('PENDING','APPROVED','DECLINED','CANCELLED','PAID','UNPAID') NOT NULL DEFAULT 'PENDING',
	`session_price` decimal(10,2) NOT NULL,
	`is_paid` boolean NOT NULL DEFAULT false,
	`payment_type` enum('SINGLE_SESSION','MONTHLY_SUBSCRIPTION') NOT NULL,
	`stadium_id` char(36) NOT NULL,
	`user_id` char(36) NOT NULL,
	`monthly_payment_id` char(36),
	`reservation_series_id` char(36),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `reservations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `single_session_payments` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`reservation_id` char(36) NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`status` enum('PENDING','PAID','OVERDUE','PARTIALLY_PAID') NOT NULL DEFAULT 'PENDING',
	`payment_date` timestamp,
	`receipt_number` varchar(255),
	`user_id` char(36) NOT NULL,
	`payment_method` enum('CASH','BANK_TRANSFER','CREDIT_CARD') DEFAULT 'CASH',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `single_session_payments_id` PRIMARY KEY(`id`),
	CONSTRAINT `single_session_payments_reservation_id_unique` UNIQUE(`reservation_id`)
);
--> statement-breakpoint
CREATE TABLE `sports` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`name_ar` varchar(255) NOT NULL,
	`name_fr` varchar(255) NOT NULL,
	`icon` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `sports_id` PRIMARY KEY(`id`),
	CONSTRAINT `sports_name_ar_unique` UNIQUE(`name_ar`),
	CONSTRAINT `sports_name_fr_unique` UNIQUE(`name_fr`)
);
--> statement-breakpoint
CREATE TABLE `stadium_images` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`index` smallint DEFAULT 0,
	`image_uri` varchar(500) NOT NULL,
	`stadium_id` char(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `stadium_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stadium_sports` (
	`stadium_id` char(36) NOT NULL,
	`sport_id` char(36) NOT NULL,
	CONSTRAINT `stadium_sports_stadium_id_sport_id_pk` PRIMARY KEY(`stadium_id`,`sport_id`)
);
--> statement-breakpoint
CREATE TABLE `stadiums` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`name` varchar(255) NOT NULL,
	`address` varchar(255) NOT NULL,
	`google_map_url` varchar(500),
	`monthly_price` decimal(10,2),
	`price_per_session` decimal(10,2),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `stadiums_id` PRIMARY KEY(`id`),
	CONSTRAINT `stadiums_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`role` enum('ADMIN','CLUB') NOT NULL DEFAULT 'CLUB',
	`phone_number` varchar(50) NOT NULL,
	`is_approved` boolean DEFAULT false,
	`preferred_locale` enum('EN','FR','AR') NOT NULL DEFAULT 'FR',
	`email_verified_at` timestamp,
	`verification_token` varchar(255),
	`verification_token_expires_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `cash_payment_records` ADD CONSTRAINT `fk_cash_payments_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cash_payment_records` ADD CONSTRAINT `fk_cash_payments_monthly` FOREIGN KEY (`monthly_payment_id`) REFERENCES `monthly_payments`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cash_payment_records` ADD CONSTRAINT `fk_cash_payments_single_session` FOREIGN KEY (`single_session_payment_id`) REFERENCES `single_session_payments`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `clubs` ADD CONSTRAINT `fk_clubs_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `clubs` ADD CONSTRAINT `fk_clubs_sport` FOREIGN KEY (`sport_id`) REFERENCES `sports`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `monthly_payments` ADD CONSTRAINT `fk_monthly_payments_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `monthly_payments` ADD CONSTRAINT `fk_monthly_payments_series` FOREIGN KEY (`reservation_series_id`) REFERENCES `reservation_series`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `monthly_subscriptions` ADD CONSTRAINT `fk_subscriptions_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `monthly_subscriptions` ADD CONSTRAINT `fk_subscriptions_series` FOREIGN KEY (`reservation_series_id`) REFERENCES `reservation_series`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `fk_notifications_actor` FOREIGN KEY (`actor_user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `password_reset_tokens` ADD CONSTRAINT `fk_password_reset_tokens_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reservation_series` ADD CONSTRAINT `fk_reservation_series_stadium` FOREIGN KEY (`stadium_id`) REFERENCES `stadiums`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reservation_series` ADD CONSTRAINT `fk_reservation_series_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reservations` ADD CONSTRAINT `fk_reservations_stadium` FOREIGN KEY (`stadium_id`) REFERENCES `stadiums`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reservations` ADD CONSTRAINT `fk_reservations_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `single_session_payments` ADD CONSTRAINT `fk_single_session_payments_reservation` FOREIGN KEY (`reservation_id`) REFERENCES `reservations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `single_session_payments` ADD CONSTRAINT `fk_single_session_payments_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stadium_images` ADD CONSTRAINT `fk_stadium_images_stadium` FOREIGN KEY (`stadium_id`) REFERENCES `stadiums`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stadium_sports` ADD CONSTRAINT `fk_stadium_sports_stadium` FOREIGN KEY (`stadium_id`) REFERENCES `stadiums`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stadium_sports` ADD CONSTRAINT `fk_stadium_sports_sport` FOREIGN KEY (`sport_id`) REFERENCES `sports`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `monthly_payment_id_index` ON `cash_payment_records` (`monthly_payment_id`);--> statement-breakpoint
CREATE INDEX `single_session_payment_id_index` ON `cash_payment_records` (`single_session_payment_id`);--> statement-breakpoint
CREATE INDEX `user_id_index` ON `cash_payment_records` (`user_id`);--> statement-breakpoint
CREATE INDEX `user_id_index` ON `clubs` (`user_id`);--> statement-breakpoint
CREATE INDEX `sport_id_index` ON `clubs` (`sport_id`);--> statement-breakpoint
CREATE INDEX `name_index` ON `clubs` (`name`);--> statement-breakpoint
CREATE INDEX `user_id_sport_id_index` ON `clubs` (`user_id`,`sport_id`);--> statement-breakpoint
CREATE INDEX `user_id_index` ON `monthly_payments` (`user_id`);--> statement-breakpoint
CREATE INDEX `status_index` ON `monthly_payments` (`status`);--> statement-breakpoint
CREATE INDEX `month_year_index` ON `monthly_payments` (`month`,`year`);--> statement-breakpoint
CREATE INDEX `payment_date_index` ON `monthly_payments` (`payment_date`);--> statement-breakpoint
CREATE INDEX `created_at_index` ON `monthly_payments` (`created_at`);--> statement-breakpoint
CREATE INDEX `user_id_index` ON `monthly_subscriptions` (`user_id`);--> statement-breakpoint
CREATE INDEX `status_index` ON `monthly_subscriptions` (`status`);--> statement-breakpoint
CREATE INDEX `start_date_index` ON `monthly_subscriptions` (`start_date`);--> statement-breakpoint
CREATE INDEX `end_date_index` ON `monthly_subscriptions` (`end_date`);--> statement-breakpoint
CREATE INDEX `created_at_index` ON `monthly_subscriptions` (`created_at`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `notifications` (`user_id`);--> statement-breakpoint
CREATE INDEX `model_idx` ON `notifications` (`model`);--> statement-breakpoint
CREATE INDEX `reference_id_idx` ON `notifications` (`reference_id`);--> statement-breakpoint
CREATE INDEX `is_read_idx` ON `notifications` (`is_read`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `notifications` (`created_at`);--> statement-breakpoint
CREATE INDEX `type_idx` ON `notifications` (`type`);--> statement-breakpoint
CREATE INDEX `actor_user_id_idx` ON `notifications` (`actor_user_id`);--> statement-breakpoint
CREATE INDEX `token_idx` ON `password_reset_tokens` (`token`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `password_reset_tokens` (`user_id`);--> statement-breakpoint
CREATE INDEX `expires_at_idx` ON `password_reset_tokens` (`expires_at`);--> statement-breakpoint
CREATE INDEX `used_at_idx` ON `password_reset_tokens` (`used_at`);--> statement-breakpoint
CREATE INDEX `user_id_index` ON `reservation_series` (`user_id`);--> statement-breakpoint
CREATE INDEX `stadium_id_index` ON `reservation_series` (`stadium_id`);--> statement-breakpoint
CREATE INDEX `day_of_week_index` ON `reservation_series` (`day_of_week`);--> statement-breakpoint
CREATE INDEX `billing_type_index` ON `reservation_series` (`billing_type`);--> statement-breakpoint
CREATE INDEX `created_at_index` ON `reservation_series` (`created_at`);--> statement-breakpoint
CREATE INDEX `recurrence_end_date_index` ON `reservation_series` (`recurrence_end_date`);--> statement-breakpoint
CREATE INDEX `start_time_end_time_index` ON `reservation_series` (`start_time`,`end_time`);--> statement-breakpoint
CREATE INDEX `start_date_time_index` ON `reservations` (`start_date_time`);--> statement-breakpoint
CREATE INDEX `end_date_time_index` ON `reservations` (`end_date_time`);--> statement-breakpoint
CREATE INDEX `status_index` ON `reservations` (`status`);--> statement-breakpoint
CREATE INDEX `user_id_index` ON `reservations` (`user_id`);--> statement-breakpoint
CREATE INDEX `stadium_id_index` ON `reservations` (`stadium_id`);--> statement-breakpoint
CREATE INDEX `monthly_payment_id_index` ON `reservations` (`monthly_payment_id`);--> statement-breakpoint
CREATE INDEX `reservation_series_id_index` ON `reservations` (`reservation_series_id`);--> statement-breakpoint
CREATE INDEX `created_at_index` ON `reservations` (`created_at`);--> statement-breakpoint
CREATE INDEX `is_paid_index` ON `reservations` (`is_paid`);--> statement-breakpoint
CREATE INDEX `start_date_time_stadium_id_index` ON `reservations` (`start_date_time`,`stadium_id`);--> statement-breakpoint
CREATE INDEX `status_start_date_time_index` ON `reservations` (`status`,`start_date_time`);--> statement-breakpoint
CREATE INDEX `reservation_id_index` ON `single_session_payments` (`reservation_id`);--> statement-breakpoint
CREATE INDEX `user_id_index` ON `single_session_payments` (`user_id`);--> statement-breakpoint
CREATE INDEX `status_index` ON `single_session_payments` (`status`);--> statement-breakpoint
CREATE INDEX `payment_date_index` ON `single_session_payments` (`payment_date`);--> statement-breakpoint
CREATE INDEX `stadium_id_index` ON `stadium_images` (`stadium_id`);--> statement-breakpoint
CREATE INDEX `monthly_price_index` ON `stadiums` (`monthly_price`);--> statement-breakpoint
CREATE INDEX `price_per_session` ON `stadiums` (`price_per_session`);--> statement-breakpoint
CREATE INDEX `deleted_at_index` ON `stadiums` (`deleted_at`);--> statement-breakpoint
CREATE INDEX `address_index` ON `stadiums` (`address`);--> statement-breakpoint
CREATE INDEX `role_index` ON `users` (`role`);--> statement-breakpoint
CREATE INDEX `deleted_at_index` ON `users` (`deleted_at`);