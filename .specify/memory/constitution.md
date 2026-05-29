<!--
CONSTITUTION SYNC IMPACT REPORT
===============================
- Version change: [CONSTITUTION_VERSION] (template) -> 1.0.0
- List of modified principles:
  * [PRINCIPLE_1_NAME] -> I. PWA & Offline-First Compliance
  * [PRINCIPLE_2_NAME] -> II. Responsive Layout & Device Compatibility
  * [PRINCIPLE_3_NAME] -> III. URL-Driven Configuration & Shareability
  * [PRINCIPLE_4_NAME] -> IV. Robust Audio-Visual Cues & User Gates
  * [PRINCIPLE_5_NAME] -> V. Strict Test Discipline & High Coverage
- Added sections:
  * Technology Stack Constraints (formerly SECTION_2)
  * Development Workflow & Quality Gates (formerly SECTION_3)
- Removed sections: None
- Templates requiring updates:
  * `.specify/templates/plan-template.md` (✅ updated)
  * `.specify/templates/spec-template.md` (✅ updated / no changes required)
  * `.specify/templates/tasks-template.md` (✅ updated / no changes required)
- Follow-up TODOs: None
-->

# Countdown Timer Constitution

## Core Principles

### I. PWA & Offline-First Compliance
The application MUST function fully offline. All static resources, UI assets, and client-side logic MUST be cached via the Vite PWA service worker. The app MUST boot and display a fully interactive countdown timer even without active internet connectivity.

### II. Responsive Layout & Device Compatibility
The UI MUST adapt fluidly across varying screen sizes. Widescreen layouts (e.g. desktop/tablet landscape) and mobile layouts (e.g. phones in portrait) MUST be rendered conditionally based on viewport aspect ratio. All UI elements MUST remain fully visible and usable without horizontal or vertical scrolling on standard resolutions.

### III. URL-Driven Configuration & Shareability
The full configuration of the countdown timer (target date, audio options, background media, segment titles, and custom theme settings) MUST be serialized into the URL search parameters or hash. Parsing and validation of these parameters MUST be handled dynamically, enabling instant replication of any timer configuration via copy-pasting or scanning a QR code without database persistence.

### IV. Robust Audio-Visual Cues & User Gates
The application MUST play audio/visual cues (e.g. voice countdowns, alarm sounders, background loop videos) at precise countdown segments. Because modern browsers restrict autoplay, the app MUST enforce an user-interaction gate before initiating audio context. The system MUST handle audio contexts gracefully and fallback to visual-only indicators if permission is withheld or disabled.

### V. Strict Test Discipline & High Coverage
All business and helper logic (e.g., parser utils in `timerParams.js`, countdown hooks) MUST have corresponding unit/integration tests written with Vitest and testing-library. The project MUST maintain a minimum test coverage threshold (e.g., 90% coverage on `src/lib/` logic) to prevent regression. All UI-facing actions MUST be verifiable using automated React testing library or Playwright test suites.

## Technology Stack Constraints
All application code MUST be implemented using React 18, CoreUI 5, Redux, and React Router. Styles MUST be managed using Sass/SCSS to customize CoreUI variables. The app MUST target modern browsers via ES2020 compatibility settings and compile using Vite. Local state management MUST follow Redux guidelines for consistent state projection.

## Development Workflow & Quality Gates
- **Linting & Formatting**: All JS/JSX code MUST pass ESLint rules and Prettier formatting checks prior to commit.
- **Testing Gate**: Every feature contribution MUST include corresponding test coverage under `tests/` or inline `.test.js` files.
- **Git Strategy**: All development MUST occur on feature branches named in accordance with Specify conventions (e.g., `###-feature-name`), with automated commits for major state transitions.

## Governance
- This Constitution defines the core quality standards of the Countdown Timer project.
- Changes to these principles require a major or minor version bump in this Constitution, documenting the rationale.
- Development templates (plan, spec, tasks) MUST align with this Constitution. Run /speckit-constitution to verify and propagate amendments across templates.
- Use [AGENTS.md](file:///Users/jpwhite/Code/countdown-timer-app/AGENTS.md) and memory configurations for development guidance.

**Version**: 1.0.0 | **Ratified**: 2026-05-29 | **Last Amended**: 2026-05-29
