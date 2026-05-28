let sharedCtx = null

function getContext() {
  if (typeof window === 'undefined') return null
  const Ctx = window.AudioContext || window.webkitAudioContext
  if (!Ctx) return null
  if (!sharedCtx) sharedCtx = new Ctx()
  return sharedCtx
}

/**
 * Best-effort resume of a suspended AudioContext. Browsers require a user
 * gesture before audio can start; calling this from a click/keydown handler
 * unlocks subsequent programmatic beeps.
 */
export function unlockAudio() {
  const ctx = getContext()
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {})
  }
  return ctx
}

/**
 * Play a short synthesized tone. Silently no-ops if Web Audio is unavailable
 * or the context hasn't been unlocked yet (rather than throwing).
 */
export function playTone({ frequency = 880, duration = 200, volume = 0.2, type = 'sine' } = {}) {
  const ctx = getContext()
  if (!ctx || ctx.state !== 'running') return
  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.value = frequency
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(volume, now + 0.01)
  gain.gain.linearRampToValueAtTime(0, now + duration / 1000)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(now)
  osc.stop(now + duration / 1000 + 0.02)
}

export const Cues = {
  // Mid-pitched chime at the warning thresholds (60s, 30s, 10s).
  chime: () => playTone({ frequency: 880, duration: 250, volume: 0.22, type: 'sine' }),
  // Short, dry click for the per-second ticks during the last 10s.
  tick: () => playTone({ frequency: 1320, duration: 60, volume: 0.16, type: 'square' }),
  // Longer terminal tone the moment the countdown reaches zero.
  done: () => playTone({ frequency: 440, duration: 900, volume: 0.25, type: 'sawtooth' }),
}
