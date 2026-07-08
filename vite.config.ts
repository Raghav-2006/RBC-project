import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Two build modes:
//   BUILD_TARGET=singlefile  → one self-contained index.html for offline / kiosk use
//   default                  → normal multi-file build for Vercel etc.
const singleFile = process.env.BUILD_TARGET === 'singlefile'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    ...(singleFile ? [viteSingleFile()] : []),
  ],
  build: singleFile
    ? {
        assetsInlineLimit: 100_000_000,
        cssCodeSplit: false,
        rollupOptions: { output: { inlineDynamicImports: true } },
      }
    : {},
})
