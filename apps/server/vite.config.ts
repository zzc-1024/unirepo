import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  const isCloudBaseBuild = mode === 'cloudbase';

  return {
    build: {
      ssr: 'src/index.ts',
      outDir: isCloudBaseBuild ? 'cloudbase' : 'dist',
      emptyOutDir: !isCloudBaseBuild,
      rollupOptions: {
        output: {
          entryFileNames: 'index.js',
          format: 'es',
        },
      },
    },
    ssr: {
      noExternal: true,
    },
  };
});
