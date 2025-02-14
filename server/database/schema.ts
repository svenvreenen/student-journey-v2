import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// Subjects table
export const subjects = sqliteTable('subjects', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  credits: integer('credits'),
  requirement: text('requirement')
});

// Grades table
export const grades = sqliteTable('grades', {
  id: integer('id').primaryKey(),
  subjectId: integer('subject_id').notNull().references(() => subjects.id),
  studentId: integer('student_id').notNull().references(() => students.id),
  op: integer('op').notNull(),
  type: text('type'), // 'VSA' or 'BSA' or null
  gradeType: text('grade_type').notNull(), // 'numeric' or 'level'
  grade: text('grade').notNull(), // For level grades: 'DISTINCTION', 'MERIT', 'PASS', 'FAIL'; For numeric: string representation of number
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

// Students table
export const students = sqliteTable('students', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  studentId: text('student_id').notNull().unique(),
  photoUrl: text('photo_url'),
  vsaRequired: integer('vsa_required').notNull().default(77),
  vsaMax: integer('vsa_max').notNull().default(110),
  bsaRequired: integer('bsa_required').notNull().default(147),
  bsaMax: integer('bsa_max').notNull().default(210)
});

// Presence/Attendance table
export const presence = sqliteTable('presence', {
  id: integer('id').primaryKey(),
  studentId: integer('student_id').notNull().references(() => students.id),
  op: text('op').notNull(), // 'OP1', 'OP2', 'OP3', 'OP4'
  attendance: real('attendance').notNull(),
  required: integer('required').notNull().default(80),
  classes: integer('classes').notNull(),
  present: integer('present').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
}); 
