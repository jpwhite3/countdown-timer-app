# Interface Contract: URL Query Parameters

This document specifies the interface contract between the timer builder (Home view) and the timer player (Timer view).

## URL Contract Specification

Timer configuration states are serialized as URL search query parameters using the standard key-value encoding rules.

### Parameter Definitions

The following table lists the parameters accepted by the `/timer` route:

| Parameter Key | DataType | Description | Example |
|---------------|----------|-------------|---------|
| `timestamp` | String | ISO 8601 UTC timestamp of target end time. | `2026-06-07T19:00:00.000Z` |
| `minutes` | Decimal | Target duration in minutes. Evaluated relative to creation time. | `15` |
| `title` | String | URI-encoded title for the timer. | `Focus+Session` |
| `bg_color` | String | Hex color string (without the leading `#`). | `0b0f19` |
| `text_color` | String | Hex color string (without the leading `#`). | `f5f5f5` |
| `bg_url` | String | HTTPS URL to background image. | `https%3A%2F%2Fexample.com%2Fbg.png` |
| `video_bg_url` | String | HTTPS URL to background video. | `https%3A%2F%2Fexample.com%2Fbg.mp4` |
| `layout` | String | Specific layout lock (`mobile` or `widescreen`). | `widescreen` |
| `dim` | Decimal | Background dim level between `0.0` and `1.0`. | `0.4` |
| `enable_flash` | String | Boolean flag indicating if background flash is enabled (`1` or `true`). | `1` |
| `enable_audio` | String | Boolean flag indicating if alarm audio is enabled (`1` or `true`). | `1` |
| `enable_overtime`| String | Boolean flag indicating if counting up overtime is enabled (`1` or `true`). | `1` |
| `expiry_message` | String | URI-encoded plain text message shown on expiration. | `Time%27s+up%21` |

### Expiry Message Serialization Logic

- **Encoding**: The custom message must be URI-encoded (e.g. spaces encoded as `+` or `%20`, special characters escaped) when appended to the query string.
- **Omission**: If the user leaves the input blank, the `expiry_message` key MUST be completely omitted from the generated URL query string to reduce URL length and keep fallback resolution clean.

### Parsing and Fallback Rules

1. Parse query parameter `expiry_message`.
2. Trim leading/trailing whitespace.
3. If value is null, empty string, or whitespace-only:
   - Fall back to default value `"Time is up!"`.
4. Return the resolved string.
