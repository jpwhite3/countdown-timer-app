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

const fontFamily = '"Outfit", "Inter", "Roboto", system-ui, sans-serif'

const titleStyle = {
  fontFamily,
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
  fontFamily,
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

const countdownContainer = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1.5rem',
  width: '100%',
}

const daysRow = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
}

const timeRow = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-end',
  justifyContent: 'center',
  gap: 'clamp(0.25rem, 0.75vw, 1rem)',
  flexWrap: 'nowrap',
}

const daysDigit = {
  fontFamily,
  fontSize: 'clamp(6rem, 18vw, 18rem)',
  fontWeight: 700,
  fontVariantNumeric: 'tabular-nums',
  lineHeight: 0.95,
}

const daysLabel = {
  fontSize: 'clamp(1.2rem, 1.5vw, 1.8rem)',
  textTransform: 'uppercase',
  letterSpacing: '0.3em',
  opacity: 0.7,
  marginTop: '0.6rem',
}

const timeDigit = {
  fontFamily,
  fontSize: 'clamp(3rem, 9vw, 9rem)',
  fontWeight: 700,
  fontVariantNumeric: 'tabular-nums',
  lineHeight: 0.95,
}

const timeLabel = {
  fontSize: 'clamp(0.6rem, 0.75vw, 0.9rem)',
  textTransform: 'uppercase',
  letterSpacing: '0.3em',
  opacity: 0.7,
  marginTop: '0.6rem',
}

const timeSeparator = {
  fontSize: 'clamp(2rem, 6vw, 6rem)',
  fontWeight: 300,
  opacity: 0.5,
  lineHeight: 0.95,
  alignSelf: 'flex-start',
  marginTop: 'clamp(0.25rem, 1vw, 1rem)',
}

const WidescreenLayout = ({ title, countdown, qrSlot }) => {
  const segments = formatSegments(countdown)
  const showCompleted = countdown.completed && !countdown.overtime

  const daysSegment = segments.find((s) => s.key === 'days')
  const timeSegments = segments.filter((s) => s.key !== 'days')

  return (
    <div style={container}>
      {title ? <h1 style={titleStyle}>{title}</h1> : null}
      {showCompleted ? (
        <div style={completed} aria-live="polite">
          Time is up!
        </div>
      ) : daysSegment ? (
        <div style={countdownContainer} aria-live="polite">
          <div style={daysRow}>
            <div style={segmentCol}>
              <div style={daysDigit}>{daysSegment.display}</div>
              <div style={daysLabel}>{daysSegment.label}</div>
            </div>
          </div>
          <div style={timeRow}>
            {timeSegments.map((s, i) => (
              <React.Fragment key={s.key}>
                {i > 0 ? (
                  <div style={timeSeparator} aria-hidden="true">
                    :
                  </div>
                ) : null}
                <div style={segmentCol}>
                  <div style={timeDigit}>{s.display}</div>
                  <div style={timeLabel}>{s.label}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
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
