import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const clientDir = resolve(import.meta.dirname, '..');
const rootEnvPath = resolve(clientDir, '../../.env');
const functionDir = resolve(clientDir, 'cloudbase');
const envText = readFileSync(rootEnvPath, 'utf8');
const rootEnv = Object.fromEntries(
  envText
    .split(/\r?\n/)
    .filter((line) => /^\s*[A-Za-z_][A-Za-z0-9_]*\s*=/.test(line))
    .map((line) => {
      const separator = line.indexOf('=');
      return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
    }),
);
const apiOrigin = rootEnv.API_ORIGIN;
const host = rootEnv.HOST;
const port = rootEnv.CLOUDBASE_PORT;

if (!apiOrigin || !host || !port) {
  throw new Error(
    'API_ORIGIN, HOST, and CLOUDBASE_PORT must be set in the repository root .env before building the CloudBase web function.',
  );
}

mkdirSync(functionDir, { recursive: true });
copyFileSync(resolve(clientDir, 'src/cloudbase-server.js'), resolve(functionDir, 'index.js'));
writeFileSync(
  resolve(functionDir, '.env'),
  `HOST=${host}\nPORT=${port}\nAPI_ORIGIN=${apiOrigin}\n`,
);

console.log(`Prepared CloudBase web function from root .env (${dirname(rootEnvPath)}).`);
