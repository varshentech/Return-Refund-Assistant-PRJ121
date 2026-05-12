import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// This setup prevents the app from crashing during Vercel build if DATABASE_URL is missing
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/mock_db';
const client = postgres(connectionString, { 
  max: 1,
  onnotice: () => {}, // suppress notices
});

export const db = drizzle(client, { schema });
