# Implementation Plan: Modern Mobile-First PWA Redesign

**Branch**: `001-modern-pwa-redesign` | **Date**: 2026-06-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-modern-pwa-redesign/spec.md`

## Summary

Visual redesign of the countdown timer app into an ultra-modern mobile-first PWA. The redesign integrates full offline PWA capabilities (service worker and manifest), system-based light/dark themes, and custom glassmorphism styles with smooth micro-animations. We maintain MUI components for complex widgets (like the datetime picker) but wrap them in custom CSS classes to support glassmorphism and HSL-based theme switching.

## Technical Context

**Language/Version**: JavaScript (ES2020) + React 18

**Primary Dependencies**: React 18, React Router v7, Material UI v7, `vite-plugin-pwa`

**Storage**: URL State (for sharing configuration) + LocalStorage (for theme/install flags)

**Testing**: Vitest + React Testing Library + Playwright

**Target Platform**: Modern mobile and desktop browsers (installed PWA)

**Project Type**: Frontend Web Application

**Performance Goals**: UI transitions < 100ms, page load < 1s, Lighthouse Accessibility score 95+

**Constraints**: Offline-capable, zero database dependency, system theme support

**Scale/Scope**: Single client-side web application

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **PWA & Offline-First**: Yes. Static assets, audio cues, and React codebase will be cached via the generated service worker.
- **Responsive Layout & Device Compatibility**: Yes. UI scales fluidly from 320px viewports up to large desktop screens.
- **URL-Driven Configuration**: Yes. Parameter serialization/deserialization logic is preserved.
- **Robust Audio-Visual Cues**: Yes. Auto-play restriction gates remain active on start.
- **Strict Test Discipline**: Yes. All core utility files and hooks are covered by Vitest suites.

## Project Structure

### Documentation (this feature)

```text
specs/001-modern-pwa-redesign/
├── plan.md              # This file
├── research.md          # Research decisions
├── data-model.md        # Data attributes and structure
├── quickstart.md        # Launch and verification guide
├── checklists/
│   └── requirements.md  # Spec quality validation checklist
└── tasks.md             # Implementation tasks (generated in next command)
```

### Source Code

```text
src/
├── components/
│   ├── AppShell.jsx
│   ├── AudioGate.jsx
│   ├── TimerPreview.jsx
│   ├── TimerScreen.jsx
│   └── timer/
│       ├── BackgroundMedia.jsx
│       ├── MobileLayout.jsx
│       └── WidescreenLayout.jsx
├── hooks/
│   └── usePWAInstall.js     # Custom hook for catching beforeinstallprompt
├── lib/
│   ├── audioCues.js
│   ├── timerParams.js
│   └── useCountdown.js
├── views/
│   ├── Home.jsx
│   └── Timer.jsx
├── index.css                # Global styles, variables, and glassmorphism styling
├── App.jsx
└── main.jsx
```

**Structure Decision**: Standard single-page React app bundled with Vite.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*No violations. The project utilizes Material UI and Vanilla CSS, fully aligning with the stack constraints.*
