import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/plexglass-card.ts',
      formats: ['es'],
      fileName: () => 'plexglass-card.js',
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
  },
});
