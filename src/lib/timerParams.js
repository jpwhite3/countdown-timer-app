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
    error: target ? null : 'missing-time',
  }
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
