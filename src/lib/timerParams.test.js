import { describe, it, expect } from 'vitest'
import {
  parseTimerParams,
  buildTimerSearch,
  normalizeHex,
  toAbsoluteShareSearch,
  inferMediaKind,
  parseBoolParam,
  parseDim,
  effectiveDim,
} from './timerParams'

describe('normalizeHex', () => {
  it('accepts 3-char hex with or without #', () => {
    expect(normalizeHex('fff')).toBe('#ffffff')
    expect(normalizeHex('#fff')).toBe('#ffffff')
    expect(normalizeHex('#0Af')).toBe('#00aaff')
  })

  it('accepts 6-char hex with or without #', () => {
    expect(normalizeHex('012abc')).toBe('#012abc')
    expect(normalizeHex('#FFFFFF')).toBe('#ffffff')
  })

  it('truncates 8-char hex (drops alpha)', () => {
    expect(normalizeHex('#11223344')).toBe('#112233')
  })

  it('rejects garbage', () => {
    expect(normalizeHex('zzzzzz')).toBeNull()
    expect(normalizeHex('1234567')).toBeNull()
    expect(normalizeHex('')).toBeNull()
    expect(normalizeHex(null)).toBeNull()
    expect(normalizeHex(undefined)).toBeNull()
  })
})

describe('parseTimerParams', () => {
  const FIXED_NOW = Date.parse('2026-06-01T12:00:00Z')

  it('parses timestamp (UTC)', () => {
    const out = parseTimerParams('timestamp=2026-12-31T23:59:00Z', { now: FIXED_NOW })
    expect(out.target).toBeInstanceOf(Date)
    expect(out.target.toISOString()).toBe('2026-12-31T23:59:00.000Z')
    expect(out.error).toBeNull()
  })

  it('parses timestamp with offset', () => {
    const out = parseTimerParams('timestamp=2026-12-31T23:59:00-05:00', { now: FIXED_NOW })
    expect(out.target.toISOString()).toBe('2027-01-01T04:59:00.000Z')
  })

  it('parses minutes as offset from now', () => {
    const out = parseTimerParams('minutes=15', { now: FIXED_NOW })
    expect(out.target.getTime()).toBe(FIXED_NOW + 15 * 60_000)
  })

  it('prefers timestamp when both are present', () => {
    const out = parseTimerParams('timestamp=2026-06-01T13:00:00Z&minutes=15', { now: FIXED_NOW })
    expect(out.target.toISOString()).toBe('2026-06-01T13:00:00.000Z')
  })

  it('returns missing-time error when neither is usable', () => {
    expect(parseTimerParams('', { now: FIXED_NOW }).error).toBe('missing-time')
    expect(parseTimerParams('timestamp=garbage', { now: FIXED_NOW }).error).toBe('missing-time')
    expect(parseTimerParams('minutes=-5', { now: FIXED_NOW }).error).toBe('missing-time')
    expect(parseTimerParams('minutes=abc', { now: FIXED_NOW }).error).toBe('missing-time')
  })

  it('decodes title and trims', () => {
    const out = parseTimerParams('minutes=1&title=' + encodeURIComponent('  Hello World  '), {
      now: FIXED_NOW,
    })
    expect(out.title).toBe('Hello World')
  })

  it('returns null title when empty', () => {
    expect(parseTimerParams('minutes=1', { now: FIXED_NOW }).title).toBeNull()
    expect(parseTimerParams('minutes=1&title=', { now: FIXED_NOW }).title).toBeNull()
    expect(parseTimerParams('minutes=1&title=%20%20', { now: FIXED_NOW }).title).toBeNull()
  })

  it('applies color defaults when missing or invalid', () => {
    const out = parseTimerParams('minutes=1&bg_color=zzz&text_color=', { now: FIXED_NOW })
    expect(out.bgColor).toBe('#0b0f19')
    expect(out.textColor).toBe('#f5f5f5')
  })

  it('normalizes color params with or without #', () => {
    const out = parseTimerParams('minutes=1&bg_color=000&text_color=%23ff8800', { now: FIXED_NOW })
    expect(out.bgColor).toBe('#000000')
    expect(out.textColor).toBe('#ff8800')
  })

  it('parses layout strictly', () => {
    expect(parseTimerParams('minutes=1&layout=mobile', { now: FIXED_NOW }).layout).toBe('mobile')
    expect(parseTimerParams('minutes=1&layout=widescreen', { now: FIXED_NOW }).layout).toBe(
      'widescreen',
    )
    expect(parseTimerParams('minutes=1&layout=nonsense', { now: FIXED_NOW }).layout).toBeNull()
    expect(parseTimerParams('minutes=1', { now: FIXED_NOW }).layout).toBeNull()
  })

  it('accepts only http/https URLs for bg/video', () => {
    const a = parseTimerParams(
      'minutes=1&bg_url=' +
        encodeURIComponent('https://example.com/x.png') +
        '&video_bg_url=' +
        encodeURIComponent('javascript:alert(1)'),
      { now: FIXED_NOW },
    )
    expect(a.bgUrl).toBe('https://example.com/x.png')
    expect(a.videoBgUrl).toBeNull()
  })
})

describe('buildTimerSearch', () => {
  it('produces minutes mode with extras', () => {
    const s = buildTimerSearch({
      mode: 'minutes',
      minutes: '15',
      title: 'Break time',
      bgColor: '#000',
      textColor: 'fff',
      layout: 'widescreen',
    })
    const p = new URLSearchParams(s)
    expect(p.get('minutes')).toBe('15')
    expect(p.get('title')).toBe('Break time')
    expect(p.get('bg_color')).toBe('000000')
    expect(p.get('text_color')).toBe('ffffff')
    expect(p.get('layout')).toBe('widescreen')
    expect(p.has('timestamp')).toBe(false)
  })

  it('produces timestamp mode', () => {
    const s = buildTimerSearch({ mode: 'timestamp', timestamp: '2026-12-31T23:59:00Z' })
    const p = new URLSearchParams(s)
    expect(p.get('timestamp')).toBe('2026-12-31T23:59:00Z')
    expect(p.has('minutes')).toBe(false)
  })

  it('omits invalid pieces', () => {
    const s = buildTimerSearch({
      mode: 'minutes',
      minutes: '-3',
      bgColor: 'zzz',
      layout: 'nope',
      bgUrl: '',
    })
    expect(s).toBe('')
  })

  it('round-trips through parseTimerParams', () => {
    const built = buildTimerSearch({
      mode: 'timestamp',
      timestamp: '2026-12-31T23:59:00Z',
      title: 'Hello',
      bgColor: '#abc',
      textColor: 'fff',
      bgUrl: 'https://example.com/bg.png',
      layout: 'mobile',
    })
    const parsed = parseTimerParams(built, { now: 0 })
    expect(parsed.target.toISOString()).toBe('2026-12-31T23:59:00.000Z')
    expect(parsed.title).toBe('Hello')
    expect(parsed.bgColor).toBe('#aabbcc')
    expect(parsed.textColor).toBe('#ffffff')
    expect(parsed.bgUrl).toBe('https://example.com/bg.png')
    expect(parsed.layout).toBe('mobile')
  })
})

describe('toAbsoluteShareSearch', () => {
  it('converts minutes to a fixed timestamp and drops minutes', () => {
    const target = new Date('2026-06-01T12:15:00Z')
    const out = toAbsoluteShareSearch('minutes=15&title=Hello', target)
    const p = new URLSearchParams(out)
    expect(p.get('timestamp')).toBe('2026-06-01T12:15:00.000Z')
    expect(p.has('minutes')).toBe(false)
    expect(p.get('title')).toBe('Hello')
  })

  it('overwrites an existing timestamp with the resolved one', () => {
    const target = new Date('2026-06-01T12:15:00Z')
    const out = toAbsoluteShareSearch('timestamp=2020-01-01T00:00:00Z&bg_color=000', target)
    const p = new URLSearchParams(out)
    expect(p.get('timestamp')).toBe('2026-06-01T12:15:00.000Z')
    expect(p.get('bg_color')).toBe('000')
  })

  it('preserves all other params verbatim', () => {
    const target = new Date('2026-06-01T12:15:00Z')
    const original =
      'minutes=5&title=Hi%20there&bg_color=000&text_color=fff&bg_url=' +
      encodeURIComponent('https://x/y.png') +
      '&video_bg_url=' +
      encodeURIComponent('https://x/y.mp4') +
      '&layout=widescreen'
    const out = toAbsoluteShareSearch(original, target)
    const p = new URLSearchParams(out)
    expect(p.get('title')).toBe('Hi there')
    expect(p.get('bg_color')).toBe('000')
    expect(p.get('text_color')).toBe('fff')
    expect(p.get('bg_url')).toBe('https://x/y.png')
    expect(p.get('video_bg_url')).toBe('https://x/y.mp4')
    expect(p.get('layout')).toBe('widescreen')
  })

  it('returns the original search when target is invalid', () => {
    expect(toAbsoluteShareSearch('minutes=15', null)).toBe('minutes=15')
    expect(toAbsoluteShareSearch('minutes=15', new Date('not a date'))).toBe('minutes=15')
  })
})

describe('inferMediaKind', () => {
  it('identifies common video extensions', () => {
    for (const url of [
      'https://example.com/x.mp4',
      'https://example.com/x.M4V',
      'https://example.com/x.webm',
      'https://example.com/x.mov',
      'https://example.com/x.ogv',
      'https://example.com/x.mkv',
    ]) {
      expect(inferMediaKind(url)).toBe('video')
    }
  })

  it('identifies common image extensions (including animated)', () => {
    for (const url of [
      'https://example.com/x.png',
      'https://example.com/x.jpg',
      'https://example.com/x.JPEG',
      'https://example.com/x.gif',
      'https://example.com/x.apng',
      'https://example.com/x.webp',
      'https://example.com/x.avif',
      'https://example.com/x.svg',
    ]) {
      expect(inferMediaKind(url)).toBe('image')
    }
  })

  it('ignores query strings and fragments when sniffing the extension', () => {
    expect(inferMediaKind('https://example.com/clip.mp4?token=abc&v=2')).toBe('video')
    expect(inferMediaKind('https://example.com/pic.gif#frag')).toBe('image')
  })

  it('falls back to image for extensionless or unknown URLs', () => {
    expect(inferMediaKind('https://picsum.photos/1920/1080')).toBe('image')
    expect(inferMediaKind('https://example.com/file.unknownext')).toBe('image')
  })

  it('returns null for empty/non-string input', () => {
    expect(inferMediaKind('')).toBeNull()
    expect(inferMediaKind('   ')).toBeNull()
    expect(inferMediaKind(null)).toBeNull()
    expect(inferMediaKind(undefined)).toBeNull()
  })
})

describe('parseBoolParam', () => {
  it('treats a bare flag (empty-string value) as true', () => {
    expect(parseBoolParam('')).toBe(true)
  })

  it('accepts common truthy strings', () => {
    for (const v of ['1', 'true', 'TRUE', 'Yes', 'on']) {
      expect(parseBoolParam(v)).toBe(true)
    }
  })

  it('accepts common falsy strings', () => {
    for (const v of ['0', 'false', 'no', 'OFF']) {
      expect(parseBoolParam(v)).toBe(false)
    }
  })

  it('returns false for missing key (null) and unknown values', () => {
    expect(parseBoolParam(null)).toBe(false)
    expect(parseBoolParam(undefined)).toBe(false)
    expect(parseBoolParam('huh')).toBe(false)
  })
})

describe('bool params in parseTimerParams + buildTimerSearch', () => {
  const NOW = Date.parse('2026-06-01T12:00:00Z')

  it('parses bare flags (no =) and explicit truthy/falsy values', () => {
    const a = parseTimerParams('minutes=1&enable_flash&enable_audio=true&enable_overtime=0', {
      now: NOW,
    })
    expect(a.flash).toBe(true)
    expect(a.audio).toBe(true)
    expect(a.overtime).toBe(false)
  })

  it('defaults to false when absent', () => {
    const a = parseTimerParams('minutes=1', { now: NOW })
    expect(a.flash).toBe(false)
    expect(a.audio).toBe(false)
    expect(a.overtime).toBe(false)
  })

  it('round-trips through builder + parser', () => {
    const s = buildTimerSearch({
      mode: 'minutes',
      minutes: '5',
      flash: true,
      audio: true,
      overtime: true,
    })
    const p = new URLSearchParams(s)
    expect(p.get('enable_flash')).toBe('1')
    expect(p.get('enable_audio')).toBe('1')
    expect(p.get('enable_overtime')).toBe('1')
    const parsed = parseTimerParams(s, { now: NOW })
    expect(parsed.flash).toBe(true)
    expect(parsed.audio).toBe(true)
    expect(parsed.overtime).toBe(true)
  })

  it('omits flags when false', () => {
    const s = buildTimerSearch({ mode: 'minutes', minutes: '5', flash: false })
    expect(new URLSearchParams(s).has('enable_flash')).toBe(false)
  })
})

describe('parseDim', () => {
  it('returns null when absent or unparseable', () => {
    expect(parseDim(null)).toBeNull()
    expect(parseDim(undefined)).toBeNull()
    expect(parseDim('')).toBeNull()
    expect(parseDim('huh')).toBeNull()
  })

  it('clamps to [0, 1]', () => {
    expect(parseDim('0')).toBe(0)
    expect(parseDim('1')).toBe(1)
    expect(parseDim('0.5')).toBe(0.5)
    expect(parseDim('-3')).toBe(0)
    expect(parseDim('99')).toBe(1)
  })
})

describe('effectiveDim', () => {
  it('returns the explicit value when provided (including 0 as the off switch)', () => {
    expect(effectiveDim({ dim: 0.6 })).toBe(0.6)
    expect(effectiveDim({ dim: 0 })).toBe(0)
    expect(effectiveDim({ dim: 0.5 })).toBe(0.5)
  })

  it('defaults to 0.35 when dim is absent, regardless of background assets', () => {
    expect(effectiveDim({})).toBe(0.35)
    expect(effectiveDim({ dim: null })).toBe(0.35)
    // Background assets used to suppress the scrim; the new default is to
    // keep it on (callers can pass dim: 0 to opt out).
    expect(effectiveDim({ dim: null, bgUrl: 'https://x/y.png' })).toBe(0.35)
    expect(effectiveDim({ dim: null, videoBgUrl: 'https://x/y.mp4' })).toBe(0.35)
  })
})

describe('dim in parseTimerParams + buildTimerSearch', () => {
  const NOW = Date.parse('2026-06-01T12:00:00Z')

  it('parses dim from URL into a clamped number', () => {
    expect(parseTimerParams('minutes=1&dim=0.5', { now: NOW }).dim).toBe(0.5)
    expect(parseTimerParams('minutes=1&dim=-2', { now: NOW }).dim).toBe(0)
    expect(parseTimerParams('minutes=1&dim=99', { now: NOW }).dim).toBe(1)
    expect(parseTimerParams('minutes=1', { now: NOW }).dim).toBeNull()
  })

  it('builder emits dim rounded to 2 decimal places', () => {
    const s = buildTimerSearch({ mode: 'minutes', minutes: '5', dim: 0.3456 })
    expect(new URLSearchParams(s).get('dim')).toBe('0.35')
  })

  it('builder omits dim when undefined or non-numeric', () => {
    expect(
      new URLSearchParams(buildTimerSearch({ mode: 'minutes', minutes: '5' })).has('dim'),
    ).toBe(false)
    expect(
      new URLSearchParams(buildTimerSearch({ mode: 'minutes', minutes: '5', dim: 'abc' })).has(
        'dim',
      ),
    ).toBe(false)
  })

  it('builder emits dim=0 explicitly (different from absent)', () => {
    const s = buildTimerSearch({ mode: 'minutes', minutes: '5', dim: 0 })
    expect(new URLSearchParams(s).get('dim')).toBe('0')
  })
})
