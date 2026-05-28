import { useEffect, useState } from 'react'

function diff(targetMs, nowMs, allowOvertime) {
  const signed = targetMs - nowMs
  if (signed <= 0 && !allowOvertime) {
    return {
      total: 0,
      signedTotal: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      completed: true,
      overtime: false,
    }
  }
  const abs = Math.abs(signed)
  return {
    total: abs,
    signedTotal: signed,
    days: Math.floor(abs / 86_400_000),
    hours: Math.floor((abs % 86_400_000) / 3_600_000),
    minutes: Math.floor((abs % 3_600_000) / 60_000),
    seconds: Math.floor((abs % 60_000) / 1000),
    completed: signed <= 0,
    overtime: allowOvertime && signed <= 0,
  }
}

/**
 * Returns the countdown breakdown to `target`, updating once per second.
 * If `allowOvertime` is true, the countdown keeps running past zero with
 * `overtime: true` and `signedTotal < 0`; otherwise it clamps at zero and
 * the interval is cleared.
 */
export function useCountdown(target, { allowOvertime = false } = {}) {
  const targetMs = target instanceof Date ? target.getTime() : null
  const [state, setState] = useState(() =>
    targetMs == null
      ? {
          total: 0,
          signedTotal: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          completed: false,
          overtime: false,
        }
      : diff(targetMs, Date.now(), allowOvertime),
  )

  useEffect(() => {
    if (targetMs == null) return undefined
    let cancelled = false
    const tick = () => {
      if (cancelled) return
      const next = diff(targetMs, Date.now(), allowOvertime)
      setState(next)
      if (next.completed && !allowOvertime) clearInterval(id)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [targetMs, allowOvertime])

  return state
}
