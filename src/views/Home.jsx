import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCardText,
  CCol,
  CContainer,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
} from '@coreui/react'
import { buildTimerSearch } from '../lib/timerParams'

const QUICK_MINUTES = [5, 10, 15, 30, 60]

function pad(n) {
  return String(n).padStart(2, '0')
}

function defaultDatetimeLocal() {
  const d = new Date(Date.now() + 15 * 60_000)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`
}

function datetimeLocalToIso(dl) {
  if (!dl) return ''
  const d = new Date(dl)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString()
}

const Builder = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const hasError = new URLSearchParams(location.search.replace(/^\?/, '')).get('error')

  const [mode, setMode] = useState('minutes')
  const [minutes, setMinutes] = useState('15')
  const [datetimeLocal, setDatetimeLocal] = useState(defaultDatetimeLocal)
  const [title, setTitle] = useState('')
  const [bgColor, setBgColor] = useState('#0b0f19')
  const [textColor, setTextColor] = useState('#f5f5f5')
  const [bgUrl, setBgUrl] = useState('')
  const [layout, setLayout] = useState('')
  const [flash, setFlash] = useState(false)
  const [audio, setAudio] = useState(false)
  const [overtime, setOvertime] = useState(false)
  const [copyState, setCopyState] = useState('idle')

  const search = useMemo(
    () =>
      buildTimerSearch({
        mode,
        timestamp: mode === 'timestamp' ? datetimeLocalToIso(datetimeLocal) : undefined,
        minutes: mode === 'minutes' ? minutes : undefined,
        title,
        bgColor,
        textColor,
        bgUrl,
        layout: layout || undefined,
        flash,
        audio,
        overtime,
      }),
    [
      mode,
      datetimeLocal,
      minutes,
      title,
      bgColor,
      textColor,
      bgUrl,
      layout,
      flash,
      audio,
      overtime,
    ],
  )

  const fullUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}#/timer${search ? '?' + search : ''}`
      : ''

  const canStart =
    (mode === 'minutes' && Number(minutes) > 0) ||
    (mode === 'timestamp' && !!datetimeLocalToIso(datetimeLocal))

  const start = () => {
    if (!canStart) return
    navigate(`/timer${search ? '?' + search : ''}`)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopyState('copied')
    } catch {
      setCopyState('error')
    }
  }

  useEffect(() => {
    if (copyState === 'idle') return undefined
    const id = setTimeout(() => setCopyState('idle'), 1500)
    return () => clearTimeout(id)
  }, [copyState])

  return (
    <CContainer sm className="py-3">
      <CCard className="shadow rounded">
        <CCardHeader className="fs-3 fw-semibold">Countdown Timer</CCardHeader>
        <CCardBody>
          {hasError === 'missing-time' ? (
            <CCardText className="text-warning">
              That timer link was missing a valid time. Build a new one below.
            </CCardText>
          ) : (
            <CCardText>
              Build a shareable countdown timer. Configure when it ends and how it looks below, then
              copy the URL or click Start.
            </CCardText>
          )}

          <CNav variant="tabs" role="tablist" className="mb-3">
            <CNavItem>
              <CNavLink
                role="tab"
                active={mode === 'minutes'}
                onClick={() => setMode('minutes')}
                style={{ cursor: 'pointer' }}
              >
                Minutes from now
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                role="tab"
                active={mode === 'timestamp'}
                onClick={() => setMode('timestamp')}
                style={{ cursor: 'pointer' }}
              >
                Specific date and time
              </CNavLink>
            </CNavItem>
          </CNav>

          <CForm>
            {mode === 'minutes' ? (
              <>
                <CRow className="mb-2">
                  <CCol>
                    <CFormLabel htmlFor="minutes-input">Minutes</CFormLabel>
                    <CFormInput
                      id="minutes-input"
                      type="number"
                      min="1"
                      value={minutes}
                      onChange={(e) => setMinutes(e.target.value)}
                    />
                  </CCol>
                </CRow>
                <CRow className="g-2 mb-3">
                  {QUICK_MINUTES.map((m) => (
                    <CCol xs={4} sm={2} key={m}>
                      <CButton
                        color="secondary"
                        variant="outline"
                        className="w-100"
                        size="sm"
                        onClick={() => setMinutes(String(m))}
                      >
                        {m} min
                      </CButton>
                    </CCol>
                  ))}
                </CRow>
              </>
            ) : (
              <CRow className="mb-3">
                <CCol>
                  <CFormLabel htmlFor="datetime-input">Date and time</CFormLabel>
                  <CFormInput
                    id="datetime-input"
                    type="datetime-local"
                    value={datetimeLocal}
                    onChange={(e) => setDatetimeLocal(e.target.value)}
                  />
                  <div className="form-text">
                    Uses your local timezone. The timer URL will encode it as an ISO timestamp.
                  </div>
                </CCol>
              </CRow>
            )}

            <hr />

            <h2 className="fs-5 mb-3">Appearance (optional)</h2>

            <CRow className="mb-3">
              <CCol>
                <CFormLabel htmlFor="title-input">Title</CFormLabel>
                <CFormInput
                  id="title-input"
                  type="text"
                  placeholder="e.g. Lunch break"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6} className="mb-3 mb-md-0">
                <CFormLabel htmlFor="bg-color-input">Background color</CFormLabel>
                <CInputGroup>
                  <CInputGroupText style={{ padding: 0 }}>
                    <input
                      type="color"
                      aria-label="Background color picker"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      style={{
                        width: 36,
                        height: 36,
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                      }}
                    />
                  </CInputGroupText>
                  <CFormInput
                    id="bg-color-input"
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                  />
                </CInputGroup>
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="text-color-input">Text color</CFormLabel>
                <CInputGroup>
                  <CInputGroupText style={{ padding: 0 }}>
                    <input
                      type="color"
                      aria-label="Text color picker"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      style={{
                        width: 36,
                        height: 36,
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                      }}
                    />
                  </CInputGroupText>
                  <CFormInput
                    id="text-color-input"
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                  />
                </CInputGroup>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol>
                <CFormLabel htmlFor="bg-url-input">Background URL</CFormLabel>
                <CFormInput
                  id="bg-url-input"
                  type="url"
                  placeholder="https://example.com/image.gif or https://example.com/video.mp4"
                  value={bgUrl}
                  onChange={(e) => setBgUrl(e.target.value)}
                />
                <div className="form-text">
                  Any image (JPEG, PNG, GIF, APNG, WebP, AVIF, SVG — animated formats play
                  automatically) or video (MP4, WebM, MOV, OGV) URL the browser can render natively.
                </div>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="layout-select">Layout</CFormLabel>
                <CFormSelect
                  id="layout-select"
                  value={layout}
                  onChange={(e) => setLayout(e.target.value)}
                >
                  <option value="">Responsive (default)</option>
                  <option value="mobile">Mobile</option>
                  <option value="widescreen">Widescreen</option>
                </CFormSelect>
              </CCol>
            </CRow>

            <hr />

            <h2 className="fs-5 mb-3">Cues</h2>

            <CRow className="mb-3">
              <CCol>
                <CFormCheck
                  id="enable-flash"
                  label="Visual flash at 1:00 and 0:30; red background in the final 10 seconds"
                  checked={flash}
                  onChange={(e) => setFlash(e.target.checked)}
                />
                <CFormCheck
                  id="enable-audio"
                  label="Audio cues at 1:00, 0:30, every second in the final 10, and a chime at zero"
                  checked={audio}
                  onChange={(e) => setAudio(e.target.checked)}
                />
                <CFormCheck
                  id="enable-overtime"
                  label="Continue counting after zero (overtime, shown as a negative number)"
                  checked={overtime}
                  onChange={(e) => setOvertime(e.target.checked)}
                />
              </CCol>
            </CRow>

            <hr />

            <CRow className="mb-3">
              <CCol>
                <CFormLabel htmlFor="share-url">Shareable URL</CFormLabel>
                <CInputGroup>
                  <CFormInput id="share-url" type="text" readOnly value={fullUrl} />
                  <CButton color="secondary" variant="outline" onClick={copy} disabled={!canStart}>
                    {copyState === 'copied'
                      ? 'Copied!'
                      : copyState === 'error'
                        ? 'Copy failed'
                        : 'Copy'}
                  </CButton>
                </CInputGroup>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
        <CCardFooter>
          <div className="d-grid">
            <CButton color="primary" size="lg" onClick={start} disabled={!canStart}>
              Start Timer
            </CButton>
          </div>
        </CCardFooter>
      </CCard>
    </CContainer>
  )
}

export default Builder
