# Implementation Plan: Copy Timer Link

**Branch**: `002-copy-timer-link` | **Date**: 2026-06-07 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-copy-timer-link/spec.md`

## Summary

The primary requirement is to replace the text-based "Copy" button inside the "Shareable URL" input field with a modern clipboard icon button. Clicking the button copies the URL to the system clipboard, changes the icon to a green checkmark, updates the tooltip to "Copied!" for 1.5 seconds, and triggers a success snackbar. The copy icon is disabled if the timer configuration is invalid.

Technical approach:
- Import `IconButton`, `Tooltip`, and `CheckIcon` from Material UI.
- Update the `TextField`'s `endAdornment` in `src/views/Home.jsx` to render an `IconButton` wrapped in a `Tooltip`.
- Use the existing `copyState` (`'idle' | 'copied' | 'error'`) to conditionally render the icons (`ContentCopyIcon` or `CheckIcon`) and update the tooltip title text dynamically.
- Ensure the tooltip functions correctly when the button is disabled by wrapping the disabled button in a `<span>` or handling pointer events.
- Update unit tests in `src/views/Home.test.jsx` or create new tests to verify that clicking the copy icon copies the URL and updates the visual state/icon.

## Technical Context

**Language/Version**: JavaScript (ES2020), Node.js >=20
**Primary Dependencies**: React 18, `@mui/material` v7, `@mui/icons-material` v7
**Storage**: None (Client-side URL state only, no DB)
**Testing**: Vitest, React Testing Library
**Target Platform**: Modern web browsers (PWA-enabled)
**Project Type**: React Web App (Vite)
**Performance Goals**: Instant copy action (under 50ms user interface reaction)
**Constraints**: PWA offline-first compliance, fully responsive layout
**Scale/Scope**: Single builder screen update

## Constitution Check

*GATE: Passed. Re-checked after Phase 1 design.*

- **PWA & Offline-First**: Yes, complies. Service worker caching needs no changes as we only modify UI code.
- **Responsive Layout & Device Compatibility**: Yes, using standard inline adornment keeps the layout compact and responsive.
- **URL-Driven Configuration**: Yes, URL search params format is unchanged.
- **Robust Audio-Visual Cues**: N/A for this change, but doesn't affect existing cues.
- **Strict Test Discipline**: Yes, we will modify or add tests for the new icon button interaction.

## Project Structure

### Documentation (this feature)

```text
specs/002-copy-timer-link/
├── spec.md              # Feature specification
├── plan.md              # This file (Implementation Plan)
├── research.md          # Research and decisions
├── data-model.md        # UI transient state and URL serialization data model
├── quickstart.md        # Feature onboarding guide
├── contracts/
│   └── ui-contract.md   # UI Component interaction contract
└── checklists/
    └── requirements.md  # Specification quality checklist
```

### Source Code

```text
src/
├── views/
│   ├── Home.jsx         # Target file for implementing the copy button UI and action
│   └── Home.test.jsx    # Unit/integration tests for Home view
```

**Structure Decision**: Single React web application project. The relevant views are located in `src/views/`.

## Complexity Tracking

*No constitution check violations; tracking table not required.*
