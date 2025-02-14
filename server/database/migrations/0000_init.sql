PRAGMA foreign_keys = OFF;

-- Create tables
CREATE TABLE IF NOT EXISTS `students` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `name` TEXT NOT NULL,
  `student_id` TEXT NOT NULL UNIQUE,
  `photo_url` TEXT,
  `vsa_required` INTEGER NOT NULL DEFAULT 77,
  `vsa_max` INTEGER NOT NULL DEFAULT 110,
  `bsa_required` INTEGER NOT NULL DEFAULT 147,
  `bsa_max` INTEGER NOT NULL DEFAULT 210
);

CREATE TABLE IF NOT EXISTS `subjects` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `name` TEXT NOT NULL,
  `credits` INTEGER,
  `requirement` TEXT
);

CREATE TABLE IF NOT EXISTS `grades` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `subject_id` INTEGER NOT NULL,
  `student_id` INTEGER NOT NULL,
  `op` INTEGER NOT NULL,
  `type` TEXT,
  `grade_type` TEXT NOT NULL,
  `grade` TEXT NOT NULL,
  `created_at` INTEGER NOT NULL,
  FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`),
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`)
);

CREATE TABLE IF NOT EXISTS `presence` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `student_id` INTEGER NOT NULL,
  `op` TEXT NOT NULL,
  `attendance` REAL NOT NULL,
  `required` INTEGER NOT NULL DEFAULT 80,
  `classes` INTEGER NOT NULL,
  `present` INTEGER NOT NULL,
  `updated_at` INTEGER NOT NULL,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`)
);

PRAGMA foreign_keys = ON; 
