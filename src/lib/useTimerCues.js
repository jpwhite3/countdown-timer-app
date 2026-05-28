import { useEffect, useRef, useState } from 'react'
import { Cues, unlockAudio } from './audioCues'

const FLASH_THRESHOLDS_MS = [60_000, 30_000]
const CHIME_THRESHOLDS_MS = [60_000, 30_000, 10_000]
const CRITICAL_THRESHOLD_MS = 10_000
const TICK_WINDOW_MS = 10_000
const FLASH_DURATION_MS = 600
// Fire a chime/flash on initial mount only if the current remaining time
// is within this window of the threshold. Anything older is silently
// marked as already-fired so we never replay missed events long after
// the fact (e.g. reloading a 5-minute timer at 0:05 left).
const INITIAL_FIRE_GRACE_MS = 1500

/**
 * Drives visual + audio cues for a running countdown.
 *
 * Visual (only when `flash` is enabled):
 *   - `flashing` pulses true for FLASH_DURATION_MS when the countdown
 *     crosses 60s and 30s (each threshold fires at most once).
 *   - `critical` is true when ≤10s remain, and stays true through
 *     overtime so the red state persists.
 *
 * Audio (only when `audio` is enabled; requires a prior user gesture
 * via `unlockAudio()` for browsers to honor playback). Synchronized
 * with the visual moments above plus one extra at the critical transition:
 *   - Chime at 60s, 30s, and 10s remaining (each fires at most once).
 *   - Tick on every whole second from 9..1 (the 10s slot is the chime,
 *     the 0s slot is the done tone, so they don't double-strike).
 *   - Done tone exactly once at the moment the countdown reaches zero.
 *   - No further sounds during overtime.
 */
export function useTimerCues(countdown, { flash, audio }) {
  const [flashing, setFlashing] = useState(false)
  const lastTotalRef = useRef(null)
  const firedFlashRef = useRef(new Set())
  const firedChimeRef = useRef(new Set())
  const lastTickSecondRef = useRef(null)
  const doneFiredRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onGesture = () => unlockAudio()
    window.addEventListener('pointerdown', onGesture, { once: true })
    window.addEventListener('keydown', onGesture, { once: true })
    return () => {
      window.removeEventListener('pointerdown', onGesture)
      window.removeEventListener('keydown', onGesture)
    }
  }, [])

  const total = countdown?.signedTotal ?? null

  useEffect(() => {
    if (total == null) return
    const prev = lastTotalRef.current
    lastTotalRef.current = total

    const triggerFlash = () => {
      setFlashing(true)
      window.setTimeout(() => setFlashing(false), FLASH_DURATION_MS)
    }

    if (prev == null) {
      // First mount: fire thresholds we're currently at (within grace),
      // silently mark older ones as already-fired so we don't retroactively
      // replay them on long-running timers loaded mid-flight.
      for (const t of FLASH_THRESHOLDS_MS) {
        if (total <= t) {
          firedFlashRef.current.add(t)
          if (flash && total > t - INITIAL_FIRE_GRACE_MS && total > 0) triggerFlash()
        }
      }
      for (const t of CHIME_THRESHOLDS_MS) {
        if (total <= t) {
          firedChimeRef.current.add(t)
          if (audio && total > t - INITIAL_FIRE_GRACE_MS && total > 0) Cues.chime()
        }
      }
      if (total <= 0) doneFiredRef.current = true
      // Initialize the tick second so we don't double-fire on the next
      // render for the same second we just observed.
      lastTickSecondRef.current = Math.ceil(total / 1000)
      return
    }

    if (flash) {
      for (const threshold of FLASH_THRESHOLDS_MS) {
        if (
          prev > threshold &&
          total <= threshold &&
          total > 0 &&
          !firedFlashRef.current.has(threshold)
        ) {
          firedFlashRef.current.add(threshold)
          triggerFlash()
        }
      }
    }

    if (audio) {
      for (const threshold of CHIME_THRESHOLDS_MS) {
        if (
          prev > threshold &&
          total <= threshold &&
          total > 0 &&
          !firedChimeRef.current.has(threshold)
        ) {
          firedChimeRef.current.add(threshold)
          Cues.chime()
        }
      }

      // Per-second ticks for the 9..1 second slots.
      if (total > 0 && total < TICK_WINDOW_MS) {
        const sec = Math.ceil(total / 1000)
        if (sec >= 1 && sec <= 9 && lastTickSecondRef.current !== sec) {
          lastTickSecondRef.current = sec
          Cues.tick()
        }
      }
    }

    if (prev > 0 && total <= 0 && !doneFiredRef.current) {
      doneFiredRef.current = true
      if (audio) Cues.done()
    }
  }, [total, flash, audio])

  const critical = Boolean(
    countdown && (countdown.overtime || countdown.signedTotal <= CRITICAL_THRESHOLD_MS),
  )

  return { flashing: flash && flashing, critical }
}
