import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db } from '.';

// This will run migrations
migrate(db, { migrationsFolder: './server/database/migrations' });

console.log('Migrations completed'); 
