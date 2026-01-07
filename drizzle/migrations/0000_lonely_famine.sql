CREATE TABLE `notifications` (
	`id` char(36) NOT NULL,
	`type` varchar(50) NOT NULL,
	`model` enum('USER') NOT NULL,
	`reference_id` char(36) NOT NULL,
	`title_en` varchar(255) NOT NULL,
	`title_fr` varchar(255) NOT NULL,
	`title_ar` varchar(255) NOT NULL,
	`message_en` text NOT NULL,
	`message_fr` text NOT NULL,
	`message_ar` text NOT NULL,
	`link` varchar(500),
	`is_read` boolean NOT NULL DEFAULT false,
	`user_id` char(36) NOT NULL,
	`actor_user_id` char(36),
	`metadata` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` char(36) NOT NULL,
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
CREATE INDEX `user_id_idx` ON `notifications` (`user_id`);--> statement-breakpoint
CREATE INDEX `model_idx` ON `notifications` (`model`);--> statement-breakpoint
CREATE INDEX `reference_id_idx` ON `notifications` (`reference_id`);--> statement-breakpoint
CREATE INDEX `is_read_idx` ON `notifications` (`is_read`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `notifications` (`created_at`);--> statement-breakpoint
CREATE INDEX `type_idx` ON `notifications` (`type`);--> statement-breakpoint
CREATE INDEX `actor_user_id_idx` ON `notifications` (`actor_user_id`);--> statement-breakpoint
CREATE INDEX `role_index` ON `users` (`role`);--> statement-breakpoint
CREATE INDEX `deleted_at_index` ON `users` (`deleted_at`);