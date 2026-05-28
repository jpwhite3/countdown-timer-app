import { useEffect, useRef, useState } from 'react'
import { Cues, unlockAudio } from './audioCues'

const FLASH_THRESHOLDS_MS = [60_000, 30_000]
const CRITICAL_THRESHOLD_MS = 10_000
const FLASH_DURATION_MS = 600

/**
 * Drives visual + audio cues for a running countdown.
 *
 * Visual (only when `flash` is enabled):
 *   - `flashing` pulses true for FLASH_DURATION_MS when the countdown
 *     crosses 60s and again at 30s (each threshold fires at most once).
 *   - `critical` is true when ≤10s remain, and stays true through
 *     overtime so the red state persists.
 *
 * Audio (only when `audio` is enabled, requires a prior user gesture
 * via `unlockAudio()` for browsers to honor playback):
 *   - One `done` tone, exactly once, the moment the countdown reaches
 *     zero. No periodic ticks; no warnings; no further sounds during
 *     overtime.
 */
export function useTimerCues(countdown, { flash, audio }) {
  const [flashing, setFlashing] = useState(false)
  const lastTotalRef = useRef(null)
  const firedThresholdsRef = useRef(new Set())
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
    if (prev == null) return

    if (flash) {
      for (const threshold of FLASH_THRESHOLDS_MS) {
        if (
          prev > threshold &&
          total <= threshold &&
          total > 0 &&
          !firedThresholdsRef.current.has(threshold)
        ) {
          firedThresholdsRef.current.add(threshold)
          setFlashing(true)
          window.setTimeout(() => setFlashing(false), FLASH_DURATION_MS)
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
