PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_grades` (
	`id` integer PRIMARY KEY NOT NULL,
	`subject_id` integer NOT NULL,
	`student_id` integer NOT NULL,
	`op` integer NOT NULL,
	`type` text,
	`grade_type` text NOT NULL,
	`grade` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_grades`("id", "subject_id", "student_id", "op", "type", "grade_type", "grade", "created_at") SELECT "id", "subject_id", "student_id", "op", "type", "grade_type", "grade", "created_at" FROM `grades`;--> statement-breakpoint
DROP TABLE `grades`;--> statement-breakpoint
ALTER TABLE `__new_grades` RENAME TO `grades`;--> statement-breakpoint
PRAGMA foreign_keys=ON;