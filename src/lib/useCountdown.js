import { useEffect, useState } from 'react'

function diff(targetMs, nowMs) {
  const total = Math.max(0, targetMs - nowMs)
  const days = Math.floor(total / 86_400_000)
  const hours = Math.floor((total % 86_400_000) / 3_600_000)
  const minutes = Math.floor((total % 3_600_000) / 60_000)
  const seconds = Math.floor((total % 60_000) / 1000)
  return { total, days, hours, minutes, seconds, completed: total === 0 }
}

/**
 * Returns the countdown breakdown to `target`, updating once per second.
 * Stops the interval when complete.
 */
export function useCountdown(target) {
  const targetMs = target instanceof Date ? target.getTime() : null
  const [state, setState] = useState(() =>
    targetMs == null
      ? { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, completed: false }
      : diff(targetMs, Date.now()),
  )

  useEffect(() => {
    if (targetMs == null) return undefined
    let cancelled = false
    const tick = () => {
      if (cancelled) return
      const next = diff(targetMs, Date.now())
      setState(next)
      if (next.completed) clearInterval(id)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [targetMs])

  return state
}
