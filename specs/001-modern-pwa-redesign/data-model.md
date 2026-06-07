# Data Model: Modern Mobile-First PWA Redesign

This document describes the schema, constraints, validation, and URL serialization rules for the timer configuration.

## Entity: TimerConfiguration

The `TimerConfiguration` represents the parameters configured by the user in the builder, which are parsed and serialized to share timers.

| Attribute | Type | Description | Constraints / Defaults |
| :--- | :--- | :--- | :--- |
| `mode` | `string` | Timer count mode | `'minutes'` or `'timestamp'` (default: `'minutes'`) |
| `target` | `Date` | Exact time the countdown ends | Must be in the future (default: current time + 15 minutes) |
| `title` | `string` | Optional name of the countdown timer | Max 100 characters (default: empty string) |
| `bgColor` | `string` | Hex value for base background color | Valid CSS hex color code (default: `'#0b0f19'`) |
| `textColor` | `string` | Hex value for text color | Valid CSS hex color code (default: `'#f5f5f5'`) |
| `bgUrl` | `string` | External background asset URL | Valid HTTP/HTTPS media URL (image/video, default: empty) |
| `layout` | `string` | Forced viewport layout style | `'mobile'`, `'widescreen'`, or `''` (responsive default) |
| `dim` | `float` | Intensity of dark backdrop filter | Float between `0.05` and `0.9` (default: `0.5`) |
| `flash` | `boolean` | Enable visual flashing alert cues | `true` or `false` (default: `false`) |
| `audio` | `boolean` | Enable chime/ticking sound cues | `true` or `false` (default: `false`) |
| `overtime` | `boolean` | Allow counting into negative values | `true` or `false` (default: `false`) |

## Validation Rules

1. **Duration validation**:
   - For `mode = 'minutes'`: the duration must be a positive integer >= 1.
   - For `mode = 'timestamp'`: the target date must be a valid, parsed date string, and it must be a future date relative to when the URL was loaded.
2. **Color validation**:
   - `bgColor` and `textColor` must be valid 3-digit or 6-digit hex color strings (e.g. `#FFF`, `#000000`).
3. **Background media validation**:
   - If `bgUrl` is non-empty, it must parse as a valid absolute URL with `http:` or `https:` protocol.
4. **Dim intensity limits**:
   - If enabled, the dim value must satisfy `0.05 <= dim <= 0.90`. If disabled, dim is set to `0`.

## URL Parameter Mapping (Serialization)

To enable offline shareability without database lookups, the data model is fully serialized into URL search query parameters:

| Model Property | Query Parameter | Serialized Format | Example |
| :--- | :--- | :--- | :--- |
| `mode` | `m` | `'min'` or `'ts'` | `m=min` |
| `target` | `t` | ISO-8601 string | `t=2026-06-07T18%3A00%3A00.000Z` |
| `minutes` | `d` | Positive integer string | `d=15` |
| `title` | `title` | URI encoded string | `title=Lunch%20Break` |
| `bgColor` | `bg` | Hex code (no `#` prefix) | `bg=0b0f19` |
| `textColor` | `fg` | Hex code (no `#` prefix) | `fg=f5f5f5` |
| `bgUrl` | `bgUrl` | URI encoded absolute URL | `bgUrl=https%3A%2F%2Fexample.com%2Fimage.gif` |
| `layout` | `layout` | `'mobile'` or `'widescreen'` | `layout=mobile` |
| `dim` | `dim` | Integer percentage `0` to `100` | `dim=50` |
| `flash` | `flash` | `'1'` (true) or `'0'` (false) | `flash=1` |
| `audio` | `audio` | `'1'` (true) or `'0'` (false) | `audio=1` |
| `overtime` | `overtime` | `'1'` (true) or `'0'` (false) | `overtime=1` |
