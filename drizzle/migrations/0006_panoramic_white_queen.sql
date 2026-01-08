CREATE TABLE `stadiums` (
	`id` char(36) NOT NULL DEFAULT (UUID),
	`name_ar` varchar(255) NOT NULL,
	`adress` varchar(255) NOT NULL,
	`googleMapUrl` varchar(500),
	`monthly_price` decimal(10,2),
	`price_per_session` decimal(10,2),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `stadiums_id` PRIMARY KEY(`id`),
	CONSTRAINT `stadiums_name_ar_unique` UNIQUE(`name_ar`)
);
--> statement-breakpoint
CREATE INDEX `monthly_price_index` ON `stadiums` (`monthly_price`);--> statement-breakpoint
CREATE INDEX `price_per_session` ON `stadiums` (`price_per_session`);