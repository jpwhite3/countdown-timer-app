import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      devOptions: { enabled: true },
      manifest: {
        id: '/',
        name: 'Countdown Timer',
        short_name: 'Countdown',
        description: 'Shareable countdown timer app',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'any',
        theme_color: '#000000',
        background_color: '#000000',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  server: { port: 3000 },
  build: {
    outDir: 'dist',
    target: ['es2020', 'safari14', 'chrome87', 'edge88', 'firefox78'],
  },
  optimizeDeps: {
    rolldownOptions: {
      transform: {
        target: ['es2020', 'safari14', 'chrome87', 'edge88', 'firefox78'],
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      exclude: ['**/*index.js', '**/*index.jsx', 'src/main.jsx'],
    },
  },
})
