/**
 * Returns the segments to display, dropping leading zero buckets so
 * sub-hour countdowns stay compact (e.g. just `04 : 37`).
 */
export function visibleSegments({ days, hours, minutes, seconds }) {
  const all = [
    { key: 'days', label: 'days', value: days },
    { key: 'hours', label: 'hours', value: hours },
    { key: 'minutes', label: 'minutes', value: minutes },
    { key: 'seconds', label: 'seconds', value: seconds },
  ]
  let started = false
  return all
    .filter((s, idx) => {
      if (started) return true
      if (s.value > 0) {
        started = true
        return true
      }
      return idx >= 2
    })
    .map((s) => ({ ...s, display: String(s.value).padStart(2, '0') }))
}
