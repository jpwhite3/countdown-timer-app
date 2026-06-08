# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Scripts
- **Development**: `npm run dev` - Starts Vite development server at http://localhost:3000.
- **Build**: `npm run build` - Builds optimized production artifacts to the `dist/` directory.
- **Preview**: `npm run preview` - Previews the production bundle locally.
- **Test**: `npm test` - Runs Vitest unit and integration tests.
- **Coverage**: `npm run test:cov` - Runs Vitest with coverage reporting.
- **Linting**: `npm run lint` - Executes ESLint on all JS/JSX files in `src/`.

## Project Architecture & Stack

### Core Technologies
- **Framework**: React 18
- **UI Components**: Material UI (MUI) with custom theme overrides and Vanilla CSS.
- **State Management**: Redux
- **Routing**: React Router
- **Build Tool**: Vite
- **PWA Support**: `vite-plugin-pwa` for offline-first functionality.

### High-Level Structure
- `src/components`: Reusable UI components (e.g., Timer, Layouts).
- `src/hooks`: Custom React hooks for timer logic and PWA interaction.
- `src/lib`: Core business logic, utilities, and parsers (e.g., `timerParams.js`). High test coverage is required here.
- `src/views`: Page components and route handlers.
- `specs/`: Contains feature specifications, plans, tasks, and research for the Spec Kit workflow.

### Architecture Constraints & Principles
1.  **PWA & Offline-First**: The app must function fully offline using a Vite PWA service worker to cache all assets and logic.
2.  **Responsive Layouts**: UI must adapt fluidly between Widescreen (desktop/landscape) and Mobile (portrait) layouts based on aspect ratio.
3.  **URL-Driven Configuration**: Every timer configuration (duration, audio, background, etc.) MUST be serialized into URL parameters to enable stateless shareability.
4.  **Audio Context Management**: User interaction gates are required before any audio/visual cues play due to browser autoplay restrictions.
5.  **Test Discipline**: Minimum 90% coverage is expected for logic in `src/lib/` and core timer hooks.

## Development Workflow (Spec Kit)

Development follows a structured 6-phase Spec Kit workflow:
1. **Specify**: Create feature spec in `specs/[###-feature-name]/spec.md`.
2. **Clarify**: Resolve underspecified requirements via `/speckit-clarify`.
3. **Plan**: Draft technical design and impact analysis in `plan.md` (must comply with the project constitution).
4. **Tasks**: Generate a dependency-ordered checklist in `tasks.md`.
5. **Implement**: Execute tasks incrementally, verifying each step with tests (`npm test`).
6. **Analyze**: Post-implementation consistency check via `/speckit-analyze`.

For detailed guidance on agents and local memory, refer to `AGENTS.md` and `.specify/memory/constitution.md`.
