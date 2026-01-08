CREATE TABLE `clubs` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`name` varchar(255) NOT NULL,
	`adress` varchar(255),
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
ALTER TABLE `clubs` ADD CONSTRAINT `clubs_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `clubs` ADD CONSTRAINT `clubs_sport_id_sports_id_fk` FOREIGN KEY (`sport_id`) REFERENCES `sports`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `user_id_index` ON `clubs` (`user_id`);--> statement-breakpoint
CREATE INDEX `sport_id_index` ON `clubs` (`sport_id`);--> statement-breakpoint
CREATE INDEX `name_index` ON `clubs` (`name`);--> statement-breakpoint
CREATE INDEX `user_id_sport_id_index` ON `clubs` (`user_id`,`sport_id`);--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_actor_user_id_users_id_fk` FOREIGN KEY (`actor_user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;