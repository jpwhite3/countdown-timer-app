# Feature Specification: Copy Timer Link

**Feature Branch**: `002-copy-timer-link`

**Created**: 2026-06-07

**Status**: Draft

**Input**: User description: "I want to add an automatic \"copy link to clipboard\" icon to the right of the \"Shareable URL\" on the timer creation view"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Copy Shareable Link (Priority: P1)

As a timer creator, I want to click a copy icon next to the Shareable URL input field to easily copy the generated link to my clipboard, so I can share it with others.

**Why this priority**: High priority because sharing the timer link is the core usage flow of creating and sharing countdowns.

**Independent Test**: Can be fully tested by creating a timer, clicking the copy icon, and verifying the URL in the clipboard matches the Shareable URL field.

**Acceptance Scenarios**:

1. **Given** a valid timer is configured, **When** the copy icon button is clicked, **Then** the current shareable URL is copied to the clipboard and a success snackbar notification is shown.
2. **Given** the timer is invalid (e.g. no duration), **When** checking the copy button, **Then** the copy icon button should be disabled.

---

### User Story 2 - UI Placement & Visual Feedback (Priority: P2)

As a user, I want the copy icon to be visually integrated to the right of the Shareable URL, and have clear visual feedback when hovered or clicked, so the interface feels intuitive and premium.

**Why this priority**: Medium priority because visual feedback improves usability and matches premium design aesthetics, but does not block the copy functionality.

**Independent Test**: Can be tested by hover and click states, ensuring correct icon is displayed and interactive states render correctly.

**Acceptance Scenarios**:

1. **Given** a copy button is visible, **When** hovered, **Then** a tooltip "Copy link to clipboard" is shown and the icon hover style is applied.
2. **Given** a copy button is clicked, **When** successfully copied, **Then** the icon changes to a checkmark for a brief duration (e.g. 1.5 seconds) to indicate success.

---

### Edge Cases

- **Clipboard Permission Denied**: How does the system handle clipboard permission denial? The system handles the error gracefully and displays an error Snackbar message "Copy failed".
- **Non-Secure Environment**: How does the system handle copy operations when not served over HTTPS or localhost? The copy operation may fail or fall back, so a user-friendly error message should be displayed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a "Copy Link" icon button (using a clipboard or copy icon) to the right of the "Shareable URL" input field on the timer creation view.
- **FR-002**: Clicking the icon button MUST copy the current value of the Shareable URL to the user's system clipboard.
- **FR-003**: System MUST show a success visual confirmation (such as a temporary checkmark icon change and a snackbar notification) when the URL is copied successfully.
- **FR-004**: The copy icon button MUST be disabled if the timer configuration is invalid (i.e. `canStart` is false).
- **FR-005**: The copy button MUST replace the existing inline "Copy" text button inside the `TextField`'s `endAdornment` with a modern clipboard icon button (`IconButton` component).
- **FR-006**: Copying to the clipboard MUST occur manually when the icon button is clicked. Automatic copying on configuration change is not required.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can copy the shareable URL to their clipboard in under 1 second with a single click.
- **SC-002**: 100% of successful copies provide visual feedback to the user (e.g. changing the icon to a checkmark and showing a toast/snackbar).
- **SC-003**: The copy action works on all supported modern browsers (Chrome, Safari, Firefox, Edge) when running on HTTPS or localhost.

## Assumptions

- The system clipboard API is available in the browser environment.
- The existing styling and component library (Material UI) will be used to render the icon button and handle state.
- The user is using a modern browser.
- Mobile and desktop both show the same icon button layout.
