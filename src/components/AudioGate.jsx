import React, { useEffect, useState } from 'react'
import { getAudioState } from '../lib/audioCues'

/**
 * Small fixed-position hint shown on the timer page when audio cues are
 * enabled but the browser hasn't yet accepted a user gesture to unlock
 * the AudioContext. The most common path (Start Timer in the builder)
 * unlocks audio during that click so this hint never appears; it's here
 * for direct/shared-link loads where the user landed on the timer page
 * without ever interacting with the builder.
 *
 * The hint dismisses itself on the first pointerdown/keydown anywhere,
 * which is the same gesture that the cues hook uses to unlock audio.
 */
const AudioGate = ({ audioEnabled }) => {
  const [needsTap, setNeedsTap] = useState(false)

  useEffect(() => {
    if (!audioEnabled) {
      setNeedsTap(false)
      return undefined
    }
    if (typeof window === 'undefined') return undefined
    if (getAudioState() === 'running') {
      setNeedsTap(false)
      return undefined
    }
    setNeedsTap(true)
    const dismiss = () => setNeedsTap(false)
    window.addEventListener('pointerdown', dismiss, { once: true })
    window.addEventListener('keydown', dismiss, { once: true })
    return () => {
      window.removeEventListener('pointerdown', dismiss)
      window.removeEventListener('keydown', dismiss)
    }
  }, [audioEnabled])

  if (!needsTap) return null

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0, 0, 0, 0.72)',
        color: '#fff',
        padding: '0.5rem 1rem',
        borderRadius: 9999,
        fontSize: '0.875rem',
        lineHeight: 1.2,
        zIndex: 100,
        pointerEvents: 'none',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        whiteSpace: 'nowrap',
      }}
    >
      Tap anywhere to enable sound
    </div>
  )
}

export default AudioGate
