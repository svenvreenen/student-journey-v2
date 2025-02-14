import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema.js';
import { mkdir } from 'fs/promises';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Make sure the .data directory exists
try {
  await mkdir('.data');
} catch (error) {
  // Directory already exists
}

// Initialize SQLite database
const sqlite = new Database('.data/sqlite.db');
export const db = drizzle(sqlite, { schema }); 
