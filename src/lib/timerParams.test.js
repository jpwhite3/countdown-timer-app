import { describe, it, expect } from 'vitest'
import {
  parseTimerParams,
  buildTimerSearch,
  normalizeHex,
  toAbsoluteShareSearch,
  inferMediaKind,
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
