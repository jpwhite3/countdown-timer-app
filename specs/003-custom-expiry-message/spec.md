# Feature Specification: Custom Expiry Message

**Feature Branch**: `003-custom-expiry-message`

**Created**: 2026-06-07

**Status**: Draft

**Input**: User description: "I want to add a configuration message that will replace the \"Title\" of the timer once the time is up. Currently, when the timer expires it show the title with a static \"times up\" message below it. I want that string to be configurable but still default to the current message."

## Clarifications

### Session 2026-06-07

- Q: Which element should the custom expiration message replace when the timer expires? → A: Replace the static "Time is up!" text below the title (title remains visible at the top).
- Q: Should the custom expiration message input field support rich text formatting (Markdown/HTML) or only plain text? → A: Plain text only.

## User Scenarios & Testing *(mandatory)*


### User Story 1 - Configure Custom Expiry Message on Creation (Priority: P1)

As a user configuring a countdown timer, I want to enter a custom message that will display when the timer finishes, so that recipients see context-specific text (e.g., "Lunch Time!", "Class starts now!", or "Take a break!") instead of the generic "Time is up!".

**Why this priority**: Core value of the request, allowing customization of the expiry message.

**Independent Test**: Enter a custom message during timer setup, generate the timer URL, open the URL, let it expire, and verify the custom message is shown.

**Acceptance Scenarios**:

1. **Given** the timer creation page, **When** a custom string (e.g., "Meeting Over!") is entered in the Expiration Message field, **Then** the generated URL contains the query parameter `expiry_message=Meeting+Over%21`.
2. **Given** a timer page opened with `expiry_message=Meeting+Over%21`, **When** the countdown reaches zero, **Then** the message "Meeting Over!" is displayed in the completed/expired state below the title.

---

### User Story 2 - Default Expiry Message Fallback (Priority: P2)

As a user, if I do not specify a custom expiry message, I want the timer to use the default "Time is up!" message so that the behavior remains unchanged for standard timers.

**Why this priority**: Ensures backwards compatibility and standard fallback behavior.

**Independent Test**: Create or open a timer without specifying an expiry message parameter, wait for expiry, and verify "Time is up!" is shown.

**Acceptance Scenarios**:

1. **Given** the timer creation page, **When** the Expiration Message field is left blank, **Then** the generated URL does not contain an `expiry_message` parameter.
2. **Given** a timer page opened without the `expiry_message` parameter, **When** the countdown reaches zero, **Then** the default message "Time is up!" is displayed.

---

### Edge Cases

- **Very long custom messages**: If the user enters a long message, it should wrap correctly and scale appropriately using typography styling, without breaking the layout or overflowing off-screen.
- **Empty or whitespace-only custom messages**: If the URL contains an empty `expiry_message=` or a whitespace-only value, the application must fallback gracefully to the default "Time is up!" message.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The timer configuration interface (Home page) MUST include a new input field labeled "Expiration Message" under the Appearance card.
- **FR-002**: The Expiration Message input field MUST show a placeholder of "Time is up!".
- **FR-003**: The generated timer URL MUST include a query parameter `expiry_message` set to the URL-encoded value of the custom message, if a non-empty value is provided.
- **FR-004**: If the custom expiry message is left empty or whitespace-only, the `expiry_message` parameter MUST be omitted from the generated URL.
- **FR-005**: The timer screen (Mobile and Widescreen layouts) MUST read the `expiry_message` parameter from the URL.
- **FR-006**: When the countdown finishes (completed state), the timer screen MUST display the custom expiry message in place of the default "Time is up!" text, while keeping the original title and layout styling.
- **FR-007**: If no `expiry_message` parameter is provided in the URL, the timer screen MUST display the default "Time is up!" text when the countdown finishes.
- **FR-008**: The custom expiration message MUST be rendered as plain text, escaping or stripping any HTML/Markdown tags to prevent cross-site scripting (XSS) and layout formatting corruption.

### Key Entities

- **Timer Configuration**: Represents the set of options used to customize and generate a countdown timer. Key attributes include `target`, `title`, `bgColor`, `textColor`, and the new `expiryMessage`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can customize the timer's expiration message in the configuration UI and see it updated in the preview or share URL.
- **SC-002**: The custom message is shown on expiration, replacing "Time is up!" across both Mobile and Widescreen layouts.
- **SC-003**: When no custom message is specified, the default "Time is up!" displays, ensuring zero regression for existing timers.
- **SC-004**: The timer's completion state layout remains visually centered, responsive, and functional even with custom messages up to 100 characters.

## Assumptions

- The UI controls for the configuration will be placed in the "Appearance" card on the Home page, grouped with other text-based optional configurations like Title.
- An empty or blank input field is treated as if no custom message was set, defaulting to "Time is up!".
- Character limits: While not strictly capped, the UI will handle typical message lengths (e.g., short phrases up to 100 characters) cleanly.
