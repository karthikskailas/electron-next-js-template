import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: { 'main/index': 'src/main/index.ts' },
    outDir: 'dist-electron',
    format: ['cjs'],
    target: 'node20',
    platform: 'node',
    sourcemap: true,
    clean: true,
    external: ['electron'],
    tsconfig: 'tsconfig.main.json',
  },
  {
    entry: { 'preload/index': 'src/preload/index.ts' },
    outDir: 'dist-electron',
    format: ['cjs'],
    target: 'node20',
    platform: 'node',
    sourcemap: true,
    external: ['electron'],
    tsconfig: 'tsconfig.main.json',
  },
]);
