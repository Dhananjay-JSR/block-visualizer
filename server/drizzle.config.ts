// import 'dotenv/config';
import type { Config } from 'drizzle-kit';
export default {
  schema: './db/schema.ts',
  out: './drizzle/migrations',
  driver: 'better-sqlite', // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
} satisfies Config;
