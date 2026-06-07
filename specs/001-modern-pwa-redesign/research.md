# Research Notes: Modern Mobile-First PWA Redesign

This document outlines key technical decisions, rationales, and alternatives considered for implementing the modern PWA redesign.

## Decisions & Rationales

### 1. PWA Service Worker & Offline Configuration

- **Decision**: Configure `vite-plugin-pwa` in `vite.config.js` in `injectRegister: 'auto'` and `registerType: 'autoUpdate'` mode.
- **Rationale**: The Vite PWA plugin integrates natively with our Vite build setup, automatically generating the service worker and manifest file. It parses files in the build output and pre-caches the HTML, JS, CSS, and sound asset files so that the app is fully functional offline.
- **Alternatives Considered**: 
  - *Manual Service Worker*: Writing a custom service worker is highly error-prone and requires manually listing all asset files to cache, which changes on every build.

### 2. React Custom PWA Install Hook

- **Decision**: Create a React hook (`usePWAInstall.js`) that listens to the window `beforeinstallprompt` event. It will capture the event object, expose an `isInstallable` state, and provide an `install()` callback to trigger the browser prompt when the user clicks our custom UI button.
- **Rationale**: Since browsers do not trigger PWA installation automatically, capturing the event allows us to hook it up to a custom, non-intrusive UI action (e.g. in the app header).
- **Alternatives Considered**:
  - *Native UI only*: Hard to discover for average users since browser-native PWA indicators are often tiny or hidden in menus.

### 3. Automatic System Theme Synchronization

- **Decision**: Implement the light/dark themes utilizing CSS custom variables in a global stylesheet, styled with `@media (prefers-color-scheme: dark)`. If necessary, synchronize the Material UI `ThemeProvider` by passing a dynamic theme object that adapts based on the browser's `window.matchMedia('(prefers-color-scheme: dark)')` listener in a React hook.
- **Rationale**: CSS custom variables provide ultra-fast styling changes and avoid flash-of-unstyled-content. Integrating it with MUI ensures standard components like DatePicker remain readable.
- **Alternatives Considered**:
  - *CSS-in-JS themes only*: Slightly slower runtime rendering and harder to share color tokens with standard HTML elements or external components.

### 4. Glassmorphism Styling System

- **Decision**: Define a custom Vanilla CSS design system using HSL colors, frosted glass backgrounds (`backdrop-filter: blur(12px)`), and semi-transparent borders. We will apply these custom CSS class names to our React and Material UI components to style the layouts.
- **Rationale**: Integrating Vanilla CSS with the existing Material UI codebase provides a fast, robust path to achieve the target visual goals (mobile-first, glassmorphic appearance) without introducing regression risk to core countdown logic.
- **Alternatives Considered**: 
  - *Full Custom React Component Rewrites*: Writing custom date picker and slider elements from scratch in pure CSS. Rejected because leveraging MUI's robust component models with CSS custom style overrides is significantly faster and less bug-prone.
