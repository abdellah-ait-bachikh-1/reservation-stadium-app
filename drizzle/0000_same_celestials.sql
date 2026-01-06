CREATE TABLE `users` (
	`id` char(36) NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(150) NOT NULL,
	`password` varchar(255) NOT NULL,
	`role` enum('ADMIN','CLUBE') NOT NULL DEFAULT 'CLUBE',
	`phone_number` varchar(20) NOT NULL,
	`email_verified_at` timestamp,
	`verification_token` varchar(128),
	`verification_token_expires_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE INDEX `role_index` ON `users` (`role`);--> statement-breakpoint
CREATE INDEX `deleted_at_index` ON `users` (`deleted_at`);