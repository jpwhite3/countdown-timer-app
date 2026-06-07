# URL Schema Contract: Countdown Timer Configuration

This document specifies the interface contract for loading the countdown timer screen via URL query parameters.

## Interface URL Endpoint

The application loads the active timer screen on the route:
`#/timer` (using hash routing).

Parameters are passed via standard query parameters following the hash (e.g. `#/timer?m=min&d=10`).

## Parameter Specifications

All keys are case-sensitive. Unsupported keys must be ignored.

### 1. Timing Configuration

- **`m`** (Mode)
  - *Type*: Enum string
  - *Values*: `min` (minutes from load), `ts` (absolute timestamp)
  - *Mandatory*: Yes.
- **`d`** (Duration)
  - *Type*: Integer string
  - *Constraint*: Must be >= 1.
  - *Condition*: Mandatory if `m=min`.
- **`t`** (Target Timestamp)
  - *Type*: ISO-8601 UTC date-time string
  - *Format*: `YYYY-MM-DDTHH:mm:ss.sssZ` (must be URL-encoded)
  - *Condition*: Mandatory if `m=ts`.

### 2. Styling & Layout

- **`title`** (Title)
  - *Type*: String
  - *Format*: URI-encoded plaintext (e.g. `%20` for spaces).
- **`bg`** (Background Color)
  - *Type*: Hex string (without prefix `#`)
  - *Example*: `0b0f19` representing `#0b0f19`.
- **`fg`** (Text Color)
  - *Type*: Hex string (without prefix `#`)
  - *Example*: `f5f5f5` representing `#f5f5f5`.
- **`bgUrl`** (Background Media URL)
  - *Type*: Absolute HTTP/HTTPS URL
  - *Format*: URI-encoded string.
- **`layout`** (Forced Layout)
  - *Type*: Enum string
  - *Values*: `mobile` (force mobile viewport scaling), `widescreen` (force widescreen aspect ratios).
  - *Default*: If omitted, standard responsive scaling is used.
- **`dim`** (Dim overlay intensity)
  - *Type*: Integer string
  - *Range*: `0` to `100` (e.g., `50` maps to overlay opacity `0.5`).

### 3. Cues & Behavior

- **`flash`** (Visual Flashing)
  - *Type*: Binary string
  - *Values*: `1` (enabled), `0` (disabled)
- **`audio`** (Audio cues)
  - *Type*: Binary string
  - *Values*: `1` (enabled), `0` (disabled)
- **`overtime`** (Continue count after zero)
  - *Type*: Binary string
  - *Values*: `1` (enabled), `0` (disabled)

## Exception Handling

If parsing fails due to invalid parameters:
1. Missing `m`, or missing required `d` / `t` fields: The app must redirect to the home builder page with the error parameter: `/#/?error=missing-time`.
2. Invalid colors (e.g., non-hex characters): Fallback to standard theme defaults (dark/light theme based on system settings).
3. Invalid media URL: Fallback to the background color.
