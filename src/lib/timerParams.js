const VALID_LAYOUTS = new Set(['mobile', 'widescreen'])

const VIDEO_EXTENSIONS = new Set([
  'mp4',
  'm4v',
  'mov',
  'webm',
  'ogv',
  'ogg',
  'mkv',
  'mpeg',
  'mpg',
  '3gp',
])

const IMAGE_EXTENSIONS = new Set([
  'apng',
  'avif',
  'bmp',
  'gif',
  'ico',
  'jpeg',
  'jpg',
  'jxl',
  'png',
  'svg',
  'tif',
  'tiff',
  'webp',
])

/**
 * Infer how to render a media URL based on its file extension.
 * Returns `'video'` for known video container extensions, `'image'` for
 * known image extensions (including animated formats like GIF/APNG/WebP/AVIF
 * that play natively in <img>), and `'image'` as the safe default for
 * extensionless or unrecognized URLs (since <img> degrades more gracefully
 * than <video>).
 */
export function inferMediaKind(url) {
  if (typeof url !== 'string' || !url.trim()) return null
  let pathname
  try {
    pathname = new URL(url, 'http://_').pathname
  } catch {
    return 'image'
  }
  const dot = pathname.lastIndexOf('.')
  if (dot < 0) return 'image'
  const ext = pathname.slice(dot + 1).toLowerCase()
  if (VIDEO_EXTENSIONS.has(ext)) return 'video'
  if (IMAGE_EXTENSIONS.has(ext)) return 'image'
  return 'image'
}

function expandShortHex(h) {
  return h
    .split('')
    .map((c) => c + c)
    .join('')
}

export function normalizeHex(value) {
  if (typeof value !== 'string') return null
  const trimmed = value.trim().replace(/^#/, '')
  if (!/^[0-9a-fA-F]+$/.test(trimmed)) return null
  let hex
  if (trimmed.length === 3) hex = expandShortHex(trimmed)
  else if (trimmed.length === 6) hex = trimmed
  else if (trimmed.length === 8) hex = trimmed.slice(0, 6)
  else return null
  return '#' + hex.toLowerCase()
}

function safeUrl(value) {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed) return null
  try {
    const u = new URL(trimmed, window.location.origin)
    if (!/^https?:$/.test(u.protocol)) return null
    return u.toString()
  } catch {
    return null
  }
}

function parseTimestamp(value) {
  if (typeof value !== 'string' || !value.trim()) return null
  const ms = Date.parse(value)
  if (Number.isNaN(ms)) return null
  return new Date(ms)
}

function parseMinutes(value, now = Date.now()) {
  if (typeof value !== 'string' || !value.trim()) return null
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) return null
  return new Date(now + n * 60_000)
}

function parseLayout(value) {
  if (typeof value !== 'string') return null
  const v = value.trim().toLowerCase()
  return VALID_LAYOUTS.has(v) ? v : null
}

const TRUTHY_BOOL = new Set(['', '1', 'true', 'yes', 'on'])
const FALSY_BOOL = new Set(['0', 'false', 'no', 'off'])

/**
 * Parse a URL bool param leniently. Accepts bare flags (`?enable_flash`,
 * value === ''), explicit truthy ('1', 'true', 'yes', 'on') and falsy
 * ('0', 'false', 'no', 'off') values. Anything else (including `null`,
 * meaning the key wasn't present) is `false`.
 */
export function parseBoolParam(value) {
  if (value == null) return false
  if (typeof value !== 'string') return false
  const v = value.trim().toLowerCase()
  if (TRUTHY_BOOL.has(v)) return true
  if (FALSY_BOOL.has(v)) return false
  return false
}

/**
 * Parse the `dim` URL parameter to a number in [0, 1], or `null` when the
 * param is absent / unparseable so the caller can apply an asset-aware
 * default. Out-of-range values are clamped rather than rejected so a
 * stray `dim=1.5` still produces something sensible.
 */
export function parseDim(value) {
  if (value == null || value === '') return null
  const n = Number(value)
  if (!Number.isFinite(n)) return null
  if (n <= 0) return 0
  if (n >= 1) return 1
  return n
}

/**
 * Parse a URL search string (without the leading `?`) into the timer view's
 * resolved props. Anything missing or invalid falls back to a default; the
 * only hard failure is the absence of a usable target time.
 */
export function parseTimerParams(search, { now = Date.now() } = {}) {
  const params = new URLSearchParams(search || '')

  const timestamp = parseTimestamp(params.get('timestamp'))
  const minutes = parseMinutes(params.get('minutes'), now)
  const target = timestamp ?? minutes

  return {
    target,
    title: (params.get('title') ?? '').trim() || null,
    bgColor: normalizeHex(params.get('bg_color')) ?? '#0b0f19',
    textColor: normalizeHex(params.get('text_color')) ?? '#f5f5f5',
    bgUrl: safeUrl(params.get('bg_url')),
    videoBgUrl: safeUrl(params.get('video_bg_url')),
    layout: parseLayout(params.get('layout')),
    dim: parseDim(params.get('dim')),
    flash: parseBoolParam(params.get('enable_flash')),
    audio: parseBoolParam(params.get('enable_audio')),
    overtime: parseBoolParam(params.get('enable_overtime')),
    error: target ? null : 'missing-time',
  }
}

/**
 * Default dim opacity applied when the URL omits the `dim` parameter.
 * Picked to soften busy backgrounds enough for text contrast without
 * fully washing out the chosen background color or asset.
 */
export const DEFAULT_DIM = 0.35

/**
 * Resolve the effective dim opacity. An explicit numeric value always wins
 * (including 0, which is the documented way to disable the scrim entirely).
 * When the URL omits `dim`, fall back to DEFAULT_DIM so plain-color and
 * image/video backgrounds both get a baseline contrast layer — users who
 * want full control can opt out with `dim=0`.
 */
export function effectiveDim({ dim } = {}) {
  if (typeof dim === 'number') return dim
  return DEFAULT_DIM
}

/**
 * Build a URL search string (without the leading `?`) for the timer view.
 * Only includes keys with meaningful values; supports either `timestamp` or
 * `minutes` mode (mutually exclusive in output).
 */
export function buildTimerSearch({
  mode,
  timestamp,
  minutes,
  title,
  bgColor,
  textColor,
  bgUrl,
  videoBgUrl,
  layout,
  dim,
  flash,
  audio,
  overtime,
} = {}) {
  const params = new URLSearchParams()

  if (mode === 'timestamp' && timestamp) {
    params.set('timestamp', timestamp)
  } else if (mode === 'minutes' && minutes !== undefined && minutes !== '') {
    const n = Number(minutes)
    if (Number.isFinite(n) && n > 0) params.set('minutes', String(n))
  }

  const t = (title ?? '').trim()
  if (t) params.set('title', t)

  const bg = normalizeHex(bgColor)
  if (bg) params.set('bg_color', bg.replace(/^#/, ''))

  const fg = normalizeHex(textColor)
  if (fg) params.set('text_color', fg.replace(/^#/, ''))

  if (bgUrl && bgUrl.trim()) params.set('bg_url', bgUrl.trim())
  if (videoBgUrl && videoBgUrl.trim()) params.set('video_bg_url', videoBgUrl.trim())

  if (layout && VALID_LAYOUTS.has(layout)) params.set('layout', layout)

  if (typeof dim === 'number' && Number.isFinite(dim)) {
    const clamped = Math.max(0, Math.min(1, dim))
    params.set('dim', String(Math.round(clamped * 100) / 100))
  }

  if (flash) params.set('enable_flash', '1')
  if (audio) params.set('enable_audio', '1')
  if (overtime) params.set('enable_overtime', '1')

  return params.toString()
}

/**
 * Rewrites a timer search string so the time is expressed as an absolute
 * `timestamp` (ISO 8601, UTC). Any `minutes` parameter is removed. All other
 * parameters are preserved verbatim. Used for share/QR URLs so a recipient
 * sees the same end time as the original viewer, regardless of when they
 * open the link.
 */
export function toAbsoluteShareSearch(search, target) {
  if (!(target instanceof Date) || Number.isNaN(target.getTime())) {
    return search ?? ''
  }
  const params = new URLSearchParams(search || '')
  params.delete('minutes')
  params.set('timestamp', target.toISOString())
  return params.toString()
}
