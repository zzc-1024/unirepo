import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig, loadEnv } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';

const envDir = fileURLToPath(new URL('../..', import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, envDir, ['VITE_', 'CLIENT_PORT', 'E2E']);

  return {
    envDir,
    plugins: [vue(), ...(env.E2E || process.env.E2E ? [] : [vueDevTools()])],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      // E2E 依赖固定端口，避免端口漂移导致 webServer 等待超时
      port: Number(env.CLIENT_PORT ?? process.env.CLIENT_PORT ?? 8080),
      strictPort: true,
    },
  };
});
