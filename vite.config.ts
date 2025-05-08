import { resolve } from 'node:path'
import browserslist from 'browserslist'
import { browserslistToTargets } from 'lightningcss'
import { defineConfig } from 'vite'
import litLightningcss from 'vite-plugin-lit-lightningcss'
import tsconfigPaths from 'vite-tsconfig-paths'

const host = process.env.TAURI_DEV_HOST

export default defineConfig({
  plugins: [
    litLightningcss({
      include: /src\/.*\.ts$/,
      exclude: /node_modules/,
      lightningcss: { minify: true },
    }),
    tsconfigPaths(),
  ],
  publicDir: resolve('public'),
  envPrefix: ['PUBLIC_', 'VITE_'],
  clearScreen: false,
  build: {
    manifest: true,
    emptyOutDir: true,
    chunkSizeWarningLimit: 1024 * 4,
    rollupOptions: {
      input: resolve('index.html'),
      output: {
        entryFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash][extname]`,
        chunkFileNames: `assets/[name]-[hash].js`,
        manualChunks(id) {
          if (id.includes('lucide')) {
            return 'lucide'
          }
        },
      },
    },
    outDir: resolve('.output/frontend'),
    terserOptions: { format: { comments: false } },
    minify: process.env.NODE_ENV === 'production',
    cssMinify: 'lightningcss',
  },
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: browserslistToTargets(browserslist('>= 0.25%')),
    },
  },
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host ? { protocol: 'ws', host, port: 1421 } : undefined,
    watch: { ignored: ['**/src-tauri/**', '**/dist/**', '**/.output/**'] },
  },
  preview: { port: 1420, strictPort: true, host: false },
  esbuild: { legalComments: 'none' },
  optimizeDeps: { force: true },
})
