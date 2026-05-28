import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import TimerScreen from './TimerScreen'

const FRAME_MAX_WIDTH = 720
// Cap the frame at 50% of the viewport height so the preview never
// dominates the builder on tall portrait screens. Combined with
// max-width and a viewport-matched aspect ratio (via CSS `min()`),
// the frame stays proportional to the user's device while remaining
// a reasonable size on any screen.
const FRAME_MAX_HEIGHT_VH = 50

function useViewportSize() {
  const [size, setSize] = useState(() =>
    typeof window === 'undefined'
      ? { w: 1280, h: 720 }
      : { w: window.innerWidth, h: window.innerHeight },
  )
  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return size
}

/**
 * Live preview of the timer view rendered into a constrained frame in the
 * builder. Reuses the production TimerScreen so colors, layout, background
 * asset, dim, title, and digit treatment are visually identical to what the
 * user will see after clicking Start.
 *
 * Implementation: TimerScreen and its descendants rely on viewport-anchored
 * units (`position: fixed`, `100vh`, `vw`-scaled fonts). Rather than refactor
 * every layout, we render TimerScreen at its real viewport size inside a
 * wrapper that uses `transform: scale()` to shrink it into the preview frame.
 * The transform establishes a new containing block, so the descendants'
 * `position: fixed` elements anchor inside the wrapper instead of the page.
 *
 * Audio/flash/critical and QR are intentionally omitted — those are runtime
 * concerns. The preview shows the steady visual state.
 */
const TimerPreview = ({ title, countdown, bgColor, textColor, bgUrl, layout, dim }) => {
  const frameRef = useRef(null)
  const [frameWidth, setFrameWidth] = useState(0)
  const vp = useViewportSize()

  useLayoutEffect(() => {
    const node = frameRef.current
    if (!node) return undefined
    setFrameWidth(node.clientWidth)
    if (typeof ResizeObserver === 'undefined') return undefined
    const ro = new ResizeObserver((entries) => {
      const e = entries[0]
      if (e) setFrameWidth(e.contentRect.width)
    })
    ro.observe(node)
    return () => ro.disconnect()
  }, [])

  const scale = frameWidth > 0 && vp.w > 0 ? frameWidth / vp.w : 1
  const aspect = vp.w / vp.h

  return (
    <div
      ref={frameRef}
      aria-label="Timer preview"
      style={{
        position: 'relative',
        // Match the user's actual viewport aspect so the scaled TimerScreen
        // fits the frame edge-to-edge without clipping. Width is bounded by
        // the parent, the absolute max, AND a height-derived cap (so a tall
        // portrait phone gets a narrow-but-fully-visible preview rather
        // than a column that pushes the form way down the page).
        width: `min(100%, ${FRAME_MAX_WIDTH}px, calc(${FRAME_MAX_HEIGHT_VH}vh * ${aspect}))`,
        aspectRatio: `${vp.w} / ${vp.h}`,
        margin: '0 auto',
        overflow: 'hidden',
        borderRadius: '0.5rem',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        backgroundColor: bgColor,
        color: textColor,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
        transition: 'background-color 200ms ease, color 200ms ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: vp.w,
          height: vp.h,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <TimerScreen
          title={title}
          countdown={countdown}
          layout={layout || undefined}
          bgUrl={bgUrl || null}
          videoBgUrl={null}
          dim={dim}
          qrSlot={null}
        />
      </div>
    </div>
  )
}

export default TimerPreview
