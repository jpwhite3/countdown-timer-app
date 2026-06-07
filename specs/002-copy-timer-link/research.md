# Research: Copy Timer Link

## Decision: UI Component Selection for Copy Action

- **Decision**: Use Material UI `IconButton` and `Tooltip` with a dynamic icon transition.
- **Rationale**: 
  - An icon button inside the `TextField`'s `endAdornment` provides a cleaner, more standard, and premium UI appearance compared to a text-based "Copy" button.
  - Using a `Tooltip` (e.g., displaying "Copy link to clipboard") makes the button self-explanatory and accessible.
  - Adding a state-driven transition where the copy icon (`ContentCopyIcon`) temporarily changes to a check icon (`CheckIcon`) on successful copy provides instantaneous, delighting visual feedback to the user.
- **Alternatives considered**:
  - Keep text-based button: Rejected because an icon button aligns better with the user's specific request for a "copy link to clipboard icon".
  - Standalone button outside the input field: Rejected because keeping it inline inside the `TextField` as an adornment maintains compact layout integrity on mobile viewport screens.

## Decision: Clipboard Action and State Management

- **Decision**: Reuse the existing asynchronous `copy` function, upgrading its state transitions to toggle the icon.
- **Rationale**:
  - The project already implements a `copyState` state ('idle' | 'copied' | 'error') and displays corresponding Snackbars.
  - We can leverage the existing `copyState` to conditionally render either `<ContentCopyIcon />` (when `idle` or `error`) or `<CheckIcon />` (when `copied`).
  - Tying this to the existing `setTimeout` mechanism ensures the check icon displays for exactly 1.5 seconds, which perfectly matches the Snackbar display duration.
- **Alternatives considered**:
  - Adding a new separate state for the icon: Rejected to prevent unnecessary state duplication. Reusing the existing `copyState` keeps the component clean and bug-free.

## Best Practices & Patterns

### 1. Material UI Tooltip Wrapper
When using a `Tooltip` with a button that can be disabled (such as when `canStart` is false), the `Tooltip` might not trigger hover events or can cause react console warnings in older React/MUI versions if the disabled element doesn't dispatch events. However, wrapping the disabled button in a `<span>` or setting the tooltip to handle the disabled state correctly is standard practice:
```jsx
<Tooltip title={copyState === 'copied' ? "Copied!" : "Copy link to clipboard"}>
  <span>
    <IconButton onClick={copy} disabled={!canStart}>
      {copyState === 'copied' ? <CheckIcon /> : <ContentCopyIcon />}
    </IconButton>
  </span>
</Tooltip>
```
We will verify that styling is clean.

### 2. Clipboard API Support
The `navigator.clipboard.writeText` API is widely supported in modern browsers, but requires a secure context (HTTPS or localhost). In non-secure environments, it might throw an error, which our existing `try-catch` block catches and handles by setting state to `'error'`.
