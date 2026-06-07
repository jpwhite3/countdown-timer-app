# Data Model: Copy Timer Link

## Transient UI State

This feature introduces no persistent database schemas. The configuration of the timer is transiently managed in the UI state and serialized into URL search parameters.

### Form Configuration State

The following local states are used to compile the Shareable URL:

| State Variable | Type | Allowed Values / Constraints | Description |
| :--- | :--- | :--- | :--- |
| `mode` | `string` | `'minutes'` or `'timestamp'` | Timer mode selection |
| `minutes` | `string` | Positive integer string | Active when `mode === 'minutes'` |
| `datetimeLocal` | `string` | ISO-8601 local date string | Active when `mode === 'timestamp'` |
| `title` | `string` | Any string (URL encoded) | Countdown title |
| `bgColor` | `string` | Hex color code | Background color |
| `textColor` | `string` | Hex color code | Text color |
| `layout` | `string` | `'default'` or `'compact'` | Display layout mode |
| `flash` | `boolean` | `true` or `false` | Visual alert flash on complete |
| `audio` | `boolean` | `true` or `false` | Alarm audio on complete |
| `overtime` | `boolean` | `true` or `false` | Enable counting past zero |

### Component Action States

The copy action tracks state in `copyState`:

```typescript
type CopyState = 'idle' | 'copied' | 'error';
```

- **`idle`**: Default state. Icon displays `ContentCopyIcon`. Tooltip displays "Copy link to clipboard".
- **`copied`**: Active for 1.5 seconds after a successful copy. Icon displays `CheckIcon`. Tooltip displays "Copied!".
- **`error`**: Active for 1.5 seconds if copy fails. Icon displays `ContentCopyIcon`. Tooltip displays "Copy failed".

## URL Serialization Format

The shareable URL structure:
`[origin]/#/timer?[query-parameters]`

Query parameters include:
- `m`: mode (`'m'` for minutes, `'t'` for timestamp)
- `d`: duration in minutes (if `m=m`)
- `t`: target timestamp in ISO-8601 (if `m=t`)
- `title`: title of the timer
- `bg`: background color hex
- `text`: text color hex
- `layout`: layout preference
- `flash`: `1` or `0`
- `audio`: `1` or `0`
- `overtime`: `1` or `0`
