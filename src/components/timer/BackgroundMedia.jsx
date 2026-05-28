import React from 'react'

const fill = {
  position: 'fixed',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  zIndex: 0,
  pointerEvents: 'none',
}

const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.35)',
  zIndex: 1,
  pointerEvents: 'none',
}

const BackgroundMedia = ({ bgUrl, videoBgUrl }) => {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const showVideo = !!videoBgUrl && !prefersReducedMotion

  if (!showVideo && !bgUrl) return null

  return (
    <>
      {showVideo ? (
        <video
          style={fill}
          src={videoBgUrl}
          poster={bgUrl || undefined}
          autoPlay
          loop
          muted
          playsInline
        />
      ) : bgUrl ? (
        <img style={fill} src={bgUrl} alt="" />
      ) : null}
      <div style={overlay} />
    </>
  )
}

export default BackgroundMedia
