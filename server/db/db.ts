import * as schema from './schema';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

export const connection = new Database('sqlite.db');
export const db = drizzle(connection, { schema });

