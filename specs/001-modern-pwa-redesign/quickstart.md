# Quickstart: Modern Mobile-First PWA Redesign

This guide provides instructions on how to run, build, test, and verify the redesigned countdown timer app locally.

## Prerequisite Commands

Install dependencies:
```bash
npm install
```

## Running Dev Server (Visual Customization & Live Reload)

To start the local Vite development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

## Running Tests

To run the Vitest unit/integration tests:
```bash
npm run test
```

To run with coverage reporting:
```bash
npm run test:cov
```

## Building & Verifying PWA Capabilities (Production mode)

PWAs and service workers are optimized for production. To test the service worker caching, installability, and offline capability:

1. **Build the production assets**:
   ```bash
   npm run build
   ```
2. **Preview the production build locally**:
   ```bash
   npm run preview
   ```
   Open the port shown in the console (usually [http://localhost:4173](http://localhost:4173)).

3. **Verify offline mode**:
   - Open Developer Tools in Chrome or Safari.
   - Go to the Application/Service Workers tab.
   - Set the Network mode to **Offline**.
   - Reload the page. The app shell and countdown timer builder should load instantly from cache.

4. **Verify Lighthouse Score**:
   - Open Chrome Developer Tools -> Lighthouse.
   - Select **Progressive Web App** and **Navigation** categories.
   - Click "Analyze page load" and confirm that all PWA checks pass.
