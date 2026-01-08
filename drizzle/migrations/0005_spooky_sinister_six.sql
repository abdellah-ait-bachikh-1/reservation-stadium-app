ALTER TABLE `clubs` DROP FOREIGN KEY `clubs_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `clubs` DROP FOREIGN KEY `clubs_sport_id_sports_id_fk`;
--> statement-breakpoint
ALTER TABLE `notifications` DROP FOREIGN KEY `notifications_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `notifications` DROP FOREIGN KEY `notifications_actor_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `clubs` ADD CONSTRAINT `clubs_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `clubs` ADD CONSTRAINT `clubs_sport_id_sports_id_fk` FOREIGN KEY (`sport_id`) REFERENCES `sports`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_actor_user_id_users_id_fk` FOREIGN KEY (`actor_user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;