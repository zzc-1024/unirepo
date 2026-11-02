import { fileURLToPath } from 'node:url';

import { loadEnv } from 'vite';

const rootDir = fileURLToPath(new URL('../../../', import.meta.url));
const env = loadEnv('development', rootDir, '');

Object.assign(process.env, env);

await import('./index.js');
