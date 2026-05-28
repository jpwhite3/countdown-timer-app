import { describe, it, expect } from 'vitest'
import { parseTimerParams, buildTimerSearch, normalizeHex } from './timerParams'

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
