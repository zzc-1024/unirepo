import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { migrate as migratePg } from 'drizzle-orm/node-postgres/migrator';
import { migrate as migratePglite } from 'drizzle-orm/pglite/migrator';
import { loadEnv } from 'vite';

import { createDatabase } from '../src/database/connection.js';

const rootDir = fileURLToPath(new URL('../../../', import.meta.url));
Object.assign(process.env, loadEnv('development', rootDir, ''));

const connection = createDatabase();
try {
  const migrationsFolder = resolve(rootDir, 'apps', 'server', 'drizzle');
  if (connection.provider === 'pglite') {
    await migratePglite(connection.db, { migrationsFolder });
  } else {
    await migratePg(connection.db, { migrationsFolder });
  }
  console.log('Database migrations completed.');
} finally {
  await connection.close();
}
