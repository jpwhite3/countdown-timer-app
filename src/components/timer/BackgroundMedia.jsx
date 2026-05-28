import React from 'react'
import { inferMediaKind } from '../../lib/timerParams'

// Asset fills the viewport and sits on top of the page's background color.
// Transparent regions of the asset reveal the body's bg_color underneath.
const fill = {
  position: 'fixed',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  zIndex: 0,
  pointerEvents: 'none',
}

const VideoBg = ({ src, poster }) => (
  <video style={fill} src={src} poster={poster || undefined} autoPlay loop muted playsInline />
)

const ImageBg = ({ src }) => <img style={fill} src={src} alt="" />

/**
 * Resolve which element to render, honoring the user's media preferences.
 * Returns either a React element or `null`.
 *   - Explicit `videoBgUrl` always wins (with `bgUrl` as the poster).
 *   - Otherwise, sniff `bgUrl` by extension and pick <video> or <img>.
 *   - Under `prefers-reduced-motion`, prefer the still poster if we have one,
 *     and skip video autoplay entirely.
 */
function chooseBackground({ bgUrl, videoBgUrl, prefersReducedMotion }) {
  if (videoBgUrl) {
    if (prefersReducedMotion) {
      return bgUrl ? <ImageBg src={bgUrl} /> : null
    }
    return <VideoBg src={videoBgUrl} poster={bgUrl} />
  }
  if (!bgUrl) return null
  const kind = inferMediaKind(bgUrl)
  if (kind === 'video') {
    return prefersReducedMotion ? null : <VideoBg src={bgUrl} />
  }
  return <ImageBg src={bgUrl} />
}

const dimOverlay = (opacity) => ({
  position: 'fixed',
  inset: 0,
  background: `rgba(0,0,0,${opacity})`,
  zIndex: 1,
  pointerEvents: 'none',
})

const BackgroundMedia = ({ bgUrl, videoBgUrl, dim = 0 }) => {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const asset = chooseBackground({ bgUrl, videoBgUrl, prefersReducedMotion })
  const showDim = dim > 0
  if (!asset && !showDim) return null
  return (
    <>
      {asset}
      {showDim ? <div style={dimOverlay(dim)} /> : null}
    </>
  )
}

export default BackgroundMedia
