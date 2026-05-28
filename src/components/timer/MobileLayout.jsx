import React from 'react'
import { formatSegments } from './segments'

const container = {
  position: 'relative',
  zIndex: 2,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem 1.25rem',
  textAlign: 'center',
}

const titleStyle = {
  fontSize: 'clamp(1.5rem, 6vw, 2.5rem)',
  fontWeight: 600,
  marginBottom: '1.5rem',
  letterSpacing: '0.02em',
}

const stack = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: '100%',
  maxWidth: '20rem',
}

const segment = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '0.75rem',
  background: 'rgba(255,255,255,0.06)',
  padding: '0.75rem 1rem',
}

const digit = {
  fontSize: 'clamp(3.5rem, 14vw, 5rem)',
  fontWeight: 700,
  fontVariantNumeric: 'tabular-nums',
  lineHeight: 1,
}

const label = {
  fontSize: '0.85rem',
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
  opacity: 0.7,
  marginTop: '0.35rem',
}

const completed = {
  fontSize: 'clamp(2rem, 9vw, 3.5rem)',
  fontWeight: 700,
  letterSpacing: '0.04em',
}

const footer = {
  marginTop: '2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.75rem',
}

const MobileLayout = ({ title, countdown, qrSlot }) => {
  const segments = formatSegments(countdown)
  const showCompleted = countdown.completed && !countdown.overtime
  return (
    <div style={container}>
      {title ? <h1 style={titleStyle}>{title}</h1> : null}
      {showCompleted ? (
        <div style={completed} aria-live="polite">
          Time is up!
        </div>
      ) : (
        <div style={stack} aria-live="polite">
          {segments.map((s) => (
            <div key={s.key} style={segment}>
              <div style={digit}>{s.display}</div>
              <div style={label}>{s.label}</div>
            </div>
          ))}
        </div>
      )}
      {qrSlot ? <div style={footer}>{qrSlot}</div> : null}
    </div>
  )
}

export default MobileLayout
