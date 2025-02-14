CREATE TABLE `grades` (
	`id` integer PRIMARY KEY NOT NULL,
	`subject_id` integer NOT NULL,
	`student_id` integer NOT NULL,
	`op` integer NOT NULL,
	`type` text,
	`grade_type` text NOT NULL,
	`grade` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `presence` (
	`id` integer PRIMARY KEY NOT NULL,
	`student_id` integer NOT NULL,
	`op` text NOT NULL,
	`attendance` real NOT NULL,
	`required` integer DEFAULT 80 NOT NULL,
	`classes` integer NOT NULL,
	`present` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`student_id` text NOT NULL,
	`photo_url` text,
	`vsa_required` integer DEFAULT 77 NOT NULL,
	`vsa_max` integer DEFAULT 110 NOT NULL,
	`bsa_required` integer DEFAULT 147 NOT NULL,
	`bsa_max` integer DEFAULT 210 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `students_student_id_unique` ON `students` (`student_id`);--> statement-breakpoint
CREATE TABLE `subjects` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`credits` integer,
	`requirement` text
);
