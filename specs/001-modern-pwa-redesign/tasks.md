# Tasks: Modern Mobile-First PWA Redesign

**Input**: Design documents from `/specs/001-modern-pwa-redesign/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Vitest unit/integration tests are included in the phases below to comply with the project's strict test coverage principles.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- Single project: `src/` at repository root, test files adjacent to source files.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and PWA scaffolding

- [x] T001 Configure PWA settings and registration in `vite.config.js` and `package.json`
- [x] T002 [P] Create the web app manifest configuration file at `public/manifest.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: CSS variables and custom installation hook that blocking user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Create CSS variables (HSL tokens, glassmorphic styles) in `src/index.css`
- [x] T004 [P] Implement standard PWA installation capture hook in `src/hooks/usePWAInstall.js`
- [x] T005 [P] Create unit tests for install hook at `src/hooks/usePWAInstall.test.js`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Redesigned Mobile-First Dashboard (Priority: P1) 🎯 MVP

**Goal**: Render a card-based glassmorphism configuration dashboard (builder page) and responsive timer screen.

**Independent Test**: Load the builder and timer on mobile (375px width) and desktop (1920px width) viewports, verifying visual aesthetics (frosted glass, responsive grid, Outfit/Inter typography) without layout overlap or vertical scrolling.

### Implementation for User Story 1

- [x] T006 [P] [US1] Configure custom HSL color maps in `src/theme.js`
- [x] T007 [US1] Redesign top navigation and container shell in `src/components/AppShell.jsx`
- [x] T008 [US1] Redesign live layout preview card in `src/components/TimerPreview.jsx`
- [x] T009 [US1] Redesign configuration card elements in `src/views/Home.jsx`
- [x] T010 [US1] Redesign full-screen display layout in `src/views/Timer.jsx`
- [x] T011 [US1] Redesign timer viewport formats in `src/components/timer/MobileLayout.jsx` and `src/components/timer/WidescreenLayout.jsx`
- [x] T012 [P] [US1] Update routing and layout verification tests in `src/App.test.jsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - System-Based Light and Dark Theme Support (Priority: P1)

**Goal**: Automate seamless transitions between light and dark themes using system preferences.

**Independent Test**: Switch OS theme between Light and Dark; verify all app pages instantly transition colors without losing active state or resetting timers.

### Implementation for User Story 2

- [x] T013 [US2] Bind theme state to standard matchMedia queries in `src/App.jsx`
- [x] T014 [US2] Define dark-mode HSL color variable overrides in `src/index.css`
- [x] T015 [P] [US2] Create theme configuration test assertions in `src/App.test.jsx`

**Checkpoint**: At this point, User Stories 1 and 2 should both work independently.

---

## Phase 5: User Story 3 - PWA Installation and Offline Capability (Priority: P2)

**Goal**: Provide native standalone app installation, service worker offline caching, and a subtle in-app install trigger.

**Independent Test**: Build and run production preview; verify that when offline, the app shell boots instantly, and compatible browsers present our custom install button.

### Implementation for User Story 3

- [x] T016 [US3] Integrate install trigger button into header toolbar in `src/components/AppShell.jsx`
- [x] T017 [US3] Add pre-caching asset configurations to `vite.config.js`
- [x] T018 [P] [US3] Create integration tests verifying installation prompt state in `src/components/AppShell.test.jsx`

**Checkpoint**: All PWA and offline behaviors should now be independently functional.

---

## Phase 6: User Story 4 - High-Contrast Custom Appearance Controls (Priority: P2)

**Goal**: Apply user-configured background/text custom colors to override the default light/dark themes.

**Independent Test**: In the builder appearance card, set custom colors, start the timer, and verify the custom colors apply instantly on the active timer page regardless of the OS system theme.

### Implementation for User Story 4

- [x] T019 [US4] Bind custom color parameters to document body attributes in `src/views/Timer.jsx`
- [x] T020 [US4] Synchronize preview container with custom appearance variables in `src/views/Home.jsx`
- [x] T021 [P] [US4] Add custom color override assertions in `src/views/Home.test.jsx`

**Checkpoint**: Custom color overrides should function cleanly without system theme interference.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Style fine-tuning and production build validation

- [x] T022 [P] Refine transition animations for buttons and input states in `src/index.css`
- [x] T023 Perform cross-browser responsiveness tests on Safari Mobile and Chrome Desktop
- [x] T024 [P] Execute offline and production build checklists defined in `quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phases 3-6)**: Depend on Foundational phase completion.
  - User Story 1 (P1) is the MVP and should be completed first.
  - User Stories 2, 3, and 4 can proceed in parallel once the foundation is ready, or sequentially.
- **Polish (Phase 7)**: Depends on all desired user stories being complete.

### Within Each User Story

- Test setup (if included) before implementation
- Hooks/helpers before components
- UI integration before overall view layout updates

### Parallel Opportunities

- Setup tasks (T001, T002) can be worked on in parallel.
- Foundational hook setup (T004, T005) can run in parallel with theme variables layout (T003).
- Within User Story 1, creating themes (T006) can run in parallel with components (T007-T011).
- Visual asset configuration and test updates can run in parallel.

---

## Parallel Example: User Story 1

```bash
# Launch layout updates together:
Task: "Redesign timer viewport formats in src/components/timer/MobileLayout.jsx"
Task: "Redesign timer viewport formats in src/components/timer/WidescreenLayout.jsx"

# Launch hook and theme configurations:
Task: "Configure custom HSL color maps in src/theme.js"
Task: "Update routing and layout verification tests in src/App.test.jsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Verify responsive viewports and glassmorphism layouts.

### Incremental Delivery

1. Complete Setup + Foundational -> Foundation ready.
2. Complete User Story 1 -> Test independently -> Deliver MVP.
3. Complete User Story 2 -> Test theme transitions -> Deliver adaptive styles.
4. Complete User Story 3 -> Test offline capabilities -> Deliver PWA capability.
5. Complete User Story 4 -> Test color overrides -> Deliver custom appearances.
