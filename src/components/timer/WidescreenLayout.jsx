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
  padding: '4rem 2rem',
  textAlign: 'center',
}

const titleStyle = {
  fontSize: 'clamp(2rem, 4vw, 4rem)',
  fontWeight: 600,
  marginBottom: '2.5rem',
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
}

const row = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-end',
  justifyContent: 'center',
  gap: 'clamp(0.5rem, 1.5vw, 2rem)',
  flexWrap: 'nowrap',
}

const segmentCol = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}

const digit = {
  fontSize: 'clamp(6rem, 18vw, 18rem)',
  fontWeight: 700,
  fontVariantNumeric: 'tabular-nums',
  lineHeight: 0.95,
}

const separator = {
  fontSize: 'clamp(4rem, 12vw, 12rem)',
  fontWeight: 300,
  opacity: 0.5,
  lineHeight: 0.95,
  alignSelf: 'flex-start',
  marginTop: 'clamp(0.5rem, 2vw, 2rem)',
}

const label = {
  fontSize: 'clamp(0.85rem, 1vw, 1.25rem)',
  textTransform: 'uppercase',
  letterSpacing: '0.3em',
  opacity: 0.7,
  marginTop: '0.6rem',
}

const completed = {
  fontSize: 'clamp(3.5rem, 10vw, 10rem)',
  fontWeight: 700,
  letterSpacing: '0.08em',
}

const qrCorner = {
  position: 'fixed',
  right: '1.5rem',
  bottom: '1.5rem',
  zIndex: 3,
  background: 'rgba(255,255,255,0.92)',
  padding: '0.5rem',
  borderRadius: '0.5rem',
}

const WidescreenLayout = ({ title, countdown, qrSlot }) => {
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
        <div style={row} aria-live="polite">
          {segments.map((s, i) => (
            <React.Fragment key={s.key}>
              {i > 0 ? (
                <div style={separator} aria-hidden="true">
                  :
                </div>
              ) : null}
              <div style={segmentCol}>
                <div style={digit}>{s.display}</div>
                <div style={label}>{s.label}</div>
              </div>
            </React.Fragment>
          ))}
        </div>
      )}
      {qrSlot ? <div style={qrCorner}>{qrSlot}</div> : null}
    </div>
  )
}

export default WidescreenLayout
