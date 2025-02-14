import { drizzle } from 'drizzle-orm/d1'
import * as schema from '../database/schema'

export { sql, eq, and, or } from 'drizzle-orm'

export const tables = schema

export function useDB() {
  return drizzle(hubDatabase(), { schema })
}

export type Student = typeof tables.students.$inferSelect
export type Subject = typeof tables.subjects.$inferSelect
export type Grade = typeof tables.grades.$inferSelect
export type Presence = typeof tables.presence.$inferSelect 
