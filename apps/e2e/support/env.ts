import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseEnv } from 'node:util';

const rootEnvPath = fileURLToPath(new URL('../../../.env', import.meta.url));
const rootEnv = existsSync(rootEnvPath) ? parseEnv(readFileSync(rootEnvPath, 'utf8')) : {};

/** 客户端端口与地址，Playwright 和 Vite 共用 */
export const CLIENT_PORT = Number(process.env.CLIENT_PORT ?? rootEnv.CLIENT_PORT ?? 8080);

export const CLIENT_URL = `http://localhost:${CLIENT_PORT}`;
