import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
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
