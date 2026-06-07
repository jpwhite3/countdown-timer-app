# Tasks: Copy Timer Link

**Input**: Design documents from `/specs/002-copy-timer-link/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks are included as strict test discipline is required by the project constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- Single project: `src/`, `tests/` at repository root (or inline tests like `src/views/Home.test.jsx`)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and baseline check

- [X] T001 Verify that existing unit tests pass successfully by running `npm run test` to establish a clean baseline

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Base imports and infrastructure that must be complete before any user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Import necessary MUI components (`IconButton`, `Tooltip`) and icons (`Check` as `CheckIcon`) in `src/views/Home.jsx`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Copy Shareable Link (Priority: P1) 🎯 MVP

**Goal**: Replace the text-based "Copy" button inside the "Shareable URL" input field with a copy icon button that copies the URL to the system clipboard when clicked.

**Independent Test**: Mock `navigator.clipboard.writeText` and trigger click in unit tests to verify clipboard function and disabled state behavior.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T003 [US1] Write baseline unit tests in `src/views/Home.test.jsx` to assert that:
  - The "Shareable URL" input field contains a copy icon button instead of the "Copy" text button.
  - The copy button is disabled when `canStart` is false.
  - Clicking the copy button calls the clipboard API with the correct URL.

### Implementation for User Story 1

- [X] T004 [US1] Replace the inline `<Button>` in `InputAdornment` endAdornment of the `TextField` with an `<IconButton>` rendering `<ContentCopyIcon />` in `src/views/Home.jsx`.
- [X] T005 [US1] Wire the new `IconButton`'s `onClick` handler to the existing `copy` function, and ensure it correctly receives the `disabled={!canStart}` property.
- [X] T006 [US1] Run unit tests (`npm run test`) and ensure the newly written tests for US1 pass successfully.

**Checkpoint**: At this point, User Story 1 is fully functional and testable independently.

---

## Phase 4: User Story 2 - UI Placement & Visual Feedback (Priority: P2)

**Goal**: Wrap the copy icon button in a Tooltip with dynamic titles, and display a checkmark icon temporarily when the copy operation succeeds.

**Independent Test**: Verify tooltip transitions and checkmark icon rendering in unit tests during the copied state.

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T007 [US2] Write unit tests in `src/views/Home.test.jsx` to assert that:
  - The copy icon button is wrapped in a `Tooltip` that displays "Copy link to clipboard" by default.
  - The copy icon button displays a check icon (`CheckIcon`) and the tooltip displays "Copied!" when `copyState` is `'copied'`.

### Implementation for User Story 2

- [X] T008 [US2] Wrap the `<IconButton>` inside a `<Tooltip>` component in `src/views/Home.jsx`. Set the tooltip `title` dynamically based on `copyState` (e.g., "Copied!" if `'copied'`, else "Copy link to clipboard").
- [X] T009 [US2] Render `<CheckIcon color="success" />` or `<ContentCopyIcon />` inside the `<IconButton>` based on whether `copyState === 'copied'` in `src/views/Home.jsx`.
- [X] T010 [US2] Run unit tests (`npm run test`) and verify that all tests for US1 and US2 pass.

**Checkpoint**: At this point, User Stories 1 and 2 are both fully functional and tested.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Code quality, formatting, performance, and validation checkups

- [X] T011 [P] Run linter and formatting checks with `npm run lint` and verify files are warning/error free
- [X] T012 Run test coverage with `npm run test:cov` and ensure no regressions in helper code coverage
- [X] T013 Verify that PWA offline functionality remains intact by reviewing browser service worker registration in Chrome DevTools or building the production bundle with `npm run build`
- [X] T014 Perform manual validation steps listed in `specs/002-copy-timer-link/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on T001.
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) completion.
- **User Story 2 (Phase 4)**: Depends on User Story 1 completion.
- **Polish (Phase 5)**: Depends on all preceding phases.

### Parallel Opportunities

- T011 (Linter and formatting checks) can run in parallel with other tasks.
- Tests can be run concurrently while working on files.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Run T001 to ensure existing tests pass.
2. Complete Foundational T002.
3. Write failing tests T003.
4. Implement US1 tasks T004 & T005.
5. Run tests T006 to verify US1 works.
6. Validate MVP scope.

### Incremental Delivery

1. Foundation ready.
2. Add User Story 1 (MVP) -> Test independently -> Verify.
3. Add User Story 2 -> Test independently -> Verify.
4. Complete Polish phase.
