# Tasks: Custom Expiry Message

**Input**: Design documents from `/specs/003-custom-expiry-message/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/url-parameters.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths assume single project structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and verifying test baseline

- [X] T001 Run existing test suites (`npm run test`) to verify baseline test success on `src/` files

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core model and utility function updates that block all user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Update `src/lib/timerParams.js` to parse `expiry_message` query parameter into `expiryMessage` (with fallback to default `"Time is up!"` if empty/whitespace-only)
- [X] T003 Update `src/lib/timerParams.js` to serialize `expiryMessage` to the `expiry_message` query parameter in `buildTimerSearch`
- [X] T004 [P] Add unit tests in `src/lib/timerParams.test.js` to verify parsing, fallback, and serialization logic of `expiry_message`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Configure Custom Expiry Message on Creation (Priority: P1) 🎯 MVP

**Goal**: Allow configuring a custom expiry message on the Home view, serializing it to the URL, and displaying it when the timer expires.

**Independent Test**: Navigate to Home, enter a custom expiry message, start the timer, wait for expiration, and verify the custom message displays in place of the default "Time is up!" text.

### Implementation for User Story 1

- [X] T005 [P] [US1] Create component tests in `src/views/Home.test.jsx` to verify that changing the Expiration Message field updates the generated URL/Share link
- [X] T006 [US1] Add the "Expiration Message" text field in `src/views/Home.jsx` under the Appearance card, linking its state to the title section and the search query parameters builder
- [X] T007 [P] [US1] Update `src/views/Timer.jsx` to pass the parsed `expiryMessage` parameter into the `TimerScreen` component
- [X] T008 [P] [US1] Update `src/components/TimerScreen.jsx` to pass the `expiryMessage` prop down to layout components
- [X] T009 [US1] Update `src/components/timer/MobileLayout.jsx` to render the custom `expiryMessage` prop in plain-text when countdown is completed
- [X] T010 [US1] Update `src/components/timer/WidescreenLayout.jsx` to render the custom `expiryMessage` prop in plain-text when countdown is completed
- [X] T011 [US1] Add integration/component tests in `src/components/AppShell.test.jsx` verifying that both mobile and widescreen layouts render the custom expiry message when complete

**Checkpoint**: User Story 1 is fully functional and testable independently.

---

## Phase 4: User Story 2 - Default Expiry Message Fallback (Priority: P2)

**Goal**: Ensure the default "Time is up!" message is displayed when no custom message is specified.

**Independent Test**: Start a timer without specifying any custom expiry message, wait for expiration, and check that it displays "Time is up!".

### Implementation for User Story 2

- [X] T012 [P] [US2] Add unit test cases in `src/lib/timerParams.test.js` to assert that when `expiry_message` is omitted, the parsed parameter defaults to `"Time is up!"`
- [X] T013 [P] [US2] Add test assertions in layout tests (`src/components/AppShell.test.jsx`) to verify that the UI falls back to rendering the default "Time is up!" message when no custom message is provided

**Checkpoint**: All user stories are now independently functional.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Verification and final packaging of the feature

- [X] T014 Run ESLint and Prettier checks to ensure code quality and style conformity
- [X] T015 Verify production bundle build compiles successfully using `npm run build`
- [X] T016 Run manual validation scenarios documented in `specs/003-custom-expiry-message/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
  - User Story 1 can proceed once Phase 2 is complete.
  - User Story 2 can proceed once Phase 2 is complete (does not strictly depend on US1 code completion, as fallback logic is established in utility parsing).
- **Polish (Final Phase)**: Depends on all user stories being complete.

### Within Each User Story

- Test setup/scenarios before/concurrently with implementation.
- Utility parameter passing (`Timer.jsx` -> `TimerScreen.jsx`) before rendering changes in layout templates.

---

## Parallel Example: User Story 1

```bash
# Launch layout/container prop updates in parallel:
Task: "Update src/views/Timer.jsx to pass the parsed expiryMessage parameter"
Task: "Update src/components/TimerScreen.jsx to pass the expiryMessage prop down"

# Implement layout rendering changes:
Task: "Update src/components/timer/MobileLayout.jsx to render the custom expiryMessage"
Task: "Update src/components/timer/WidescreenLayout.jsx to render the custom expiryMessage"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories).
3. Complete Phase 3: User Story 1.
4. **STOP and VALIDATE**: Verify custom message displays on expiration.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation utility parser ready.
2. Add User Story 1 → Test custom expiry message configuration and rendering → Deploy/Demo (MVP!).
3. Add User Story 2 → Test default fallback behavior.
4. Run Polish phase validation.
