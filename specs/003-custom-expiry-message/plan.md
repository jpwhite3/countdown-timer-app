# Implementation Plan: Custom Expiry Message

**Branch**: `003-custom-expiry-message` | **Date**: 2026-06-07 | **Spec**: [spec.md](file:///Users/jpwhite/Code/countdown-timer-app/specs/003-custom-expiry-message/spec.md)

**Input**: Feature specification from `specs/003-custom-expiry-message/spec.md`

## Summary

- **Primary Requirement**: Add a custom expiration message that replaces the static "Time is up!" text when the countdown timer expires.
- **Technical Approach**:
  - Add an "Expiration Message" text input field under the "Appearance" card on the Home view (`src/views/Home.jsx`).
  - Serialize/deserialize the new state variable as `expiry_message` query parameter in `src/lib/timerParams.js` (`buildTimerSearch` and `parseTimerParams`).
  - Propagate the parsed `expiryMessage` from `TimerView` (`src/views/Timer.jsx`) through `TimerScreen` (`src/components/TimerScreen.jsx`) to `MobileLayout` and `WidescreenLayout` to render it plain-text on countdown completion.
  - Write unit and component tests to verify parameter parsing, UI field changes, URL serialization, and proper message rendering.

## Technical Context

**Language/Version**: JavaScript (ES2020)

**Primary Dependencies**: React 18, Material UI, Redux, React Router

**Storage**: N/A (URL-driven client state)

**Testing**: Vitest, React Testing Library

**Target Platform**: Modern web browsers (PWA-enabled)

**Project Type**: React web application

**Performance Goals**: UI rendering at 60fps, parameter parsing in <5ms

**Constraints**: Offline-capable, URL parameter length within browser limits (typically <2000 chars)

**Scale/Scope**: 1 new configuration field, 1 new query parameter, 5 source files updated

## Constitution Check

*GATE: Passed. No deviations required.*

- **PWA & Offline-First**: Yes. All logic runs completely on the client side without database or server dependencies, complying with PWA requirements.
- **Responsive Layout & Device Compatibility**: Yes. Custom message text wraps gracefully and utilizes responsive typography (`clamp` font sizes) in both mobile and widescreen layouts.
- **URL-Driven Configuration**: Yes. Serialized via query parameter `expiry_message` to support copy-pasting/QR sharing.
- **Robust Audio-Visual Cues**: Yes. The modification operates entirely within standard React render flows and has no impact on browser autoplay gates.
- **Strict Test Discipline**: Yes. Corresponding unit tests for URL parsing (`timerParams.test.js`) and component rendering will be added.

## Project Structure

### Documentation (this feature)

```text
specs/003-custom-expiry-message/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── checklists/
    └── requirements.md  # Spec checklist (completed)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── timer/
│   │   ├── MobileLayout.jsx
│   │   └── WidescreenLayout.jsx
│   └── TimerScreen.jsx
├── lib/
│   ├── timerParams.js
├── views/
│   ├── Home.jsx
│   └── Timer.jsx
```

**Structure Decision**: Single React project structure is used. Files to update are located under `src/components/`, `src/lib/`, and `src/views/`. Tests will be updated in place next to their respective source files.

## Complexity Tracking

*No violations identified.*
