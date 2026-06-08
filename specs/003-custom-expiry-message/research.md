# Research Findings: Custom Expiry Message

This document details the research and design decisions made for the Custom Expiry Message feature.

## Technology & Design Decisions

### 1. Naming and Schema of the Expiration Message Parameter

- **Decision**: Name the query parameter `expiry_message` and map it to a camelCase property `expiryMessage` in the parsed timer parameters object.
- **Rationale**: Keeps naming consistent with existing snake_case URL parameters (e.g., `bg_color`, `text_color`, `bg_url`, `video_bg_url`, `enable_flash`, `enable_audio`, `enable_overtime`).
- **Alternatives considered**:
  - `message`: Too generic; could clash with future general-purpose notification features.
  - `end_text`: Less descriptive of when the text is displayed (expiration vs timer end).
  - `completion_message`: Unnecessarily verbose.

### 2. Plain-Text Sanitization and Security

- **Decision**: Treat the `expiry_message` value as plain text only. Ensure it is rendered inside React text nodes (e.g., `{expiryMessage}`) rather than using `dangerouslySetInnerHTML`.
- **Rationale**: Since the custom message is loaded from the URL, it is an untrusted user input. Plain-text rendering automatically escapes any HTML characters, preventing Cross-Site Scripting (XSS) attacks. Additionally, preventing Markdown or HTML parsing ensures that formatting controls do not corrupt the auto-scaling responsive layouts.
- **Alternatives considered**:
  - Render rich HTML/Markdown: Rejected due to security risks and the unnecessary complexity/weight of adding sanitizer libraries (e.g., DOMPurify) or markdown compilers.

### 3. State Propagation in Layouts

- **Decision**: Propagate `expiryMessage` state from `TimerView` (`Timer.jsx`) down through `TimerScreen.jsx` to the layout components (`MobileLayout.jsx` and `WidescreenLayout.jsx`) instead of creating a global Redux slice.
- **Rationale**: The parsed query parameters are already centralized in `TimerView`'s local state/memo context. Passing it down via standard React props is simpler, faster, and keeps layout components functional and predictable.
- **Alternatives considered**:
  - Redux store integration: Rejected because layout configurations are transient client-only parameters that do not require global action dispatching or cross-component state synchronization.
