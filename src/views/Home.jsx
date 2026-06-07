import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Slider from '@mui/material/Slider'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import CheckIcon from '@mui/icons-material/Check'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined'
import ScheduleIcon from '@mui/icons-material/Schedule'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined'
import AppShell from '../components/AppShell'
import { buildTimerSearch, DEFAULT_DIM, effectiveDim } from '../lib/timerParams'
import { unlockAudio } from '../lib/audioCues'
import { useCountdown } from '../lib/useCountdown'
import TimerPreview from '../components/TimerPreview'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import dayjs from 'dayjs'
import { usePWAInstall } from '../hooks/usePWAInstall'

const QUICK_MINUTES = [5, 10, 15, 30, 60]

function defaultDatetimeLocal() {
  return dayjs().add(15, 'minute')
}

function datetimeLocalToIso(dl) {
  if (!dl || !dayjs.isDayjs(dl) || !dl.isValid()) return ''
  return dl.toISOString()
}

function ColorPickerField({ id, label, value, onChange, helperText }) {
  return (
    <TextField
      id={id}
      label={label}
      fullWidth
      value={value}
      onChange={onChange}
      helperText={helperText}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <input
                type="color"
                aria-label={`${label} picker`}
                value={value}
                onChange={onChange}
                style={{
                  width: 36,
                  height: 36,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  padding: 0,
                }}
              />
            </InputAdornment>
          ),
        },
      }}
    />
  )
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
  const [dimEnabled, setDimEnabled] = useState(true)
  const [dimIntensity, setDimIntensity] = useState(DEFAULT_DIM)
  const [flash, setFlash] = useState(false)
  const [audio, setAudio] = useState(false)
  const [overtime, setOvertime] = useState(false)
  const [copyState, setCopyState] = useState('idle')

  const { isInstallable, install } = usePWAInstall()

  const dimParam = !dimEnabled ? 0 : dimIntensity === DEFAULT_DIM ? undefined : dimIntensity

  const previewTarget = useMemo(() => {
    if (mode === 'minutes' && Number(minutes) > 0) {
      return new Date(Date.now() + Number(minutes) * 60_000)
    }
    if (mode === 'timestamp') {
      const iso = datetimeLocalToIso(datetimeLocal)
      if (iso) return new Date(iso)
    }
    return new Date(Date.now() + 15 * 60_000)
  }, [mode, minutes, datetimeLocal])

  const previewCountdown = useCountdown(previewTarget, { allowOvertime: overtime })
  const previewDim = effectiveDim({ dim: dimParam ?? null })

  const previewBgUrl = useMemo(() => {
    const v = (bgUrl || '').trim()
    if (!v || typeof window === 'undefined') return null
    try {
      const u = new URL(v, window.location.origin)
      return /^https?:$/.test(u.protocol) ? u.toString() : null
    } catch {
      return null
    }
  }, [bgUrl])

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
        dim: dimParam,
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
      dimParam,
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
    if (audio) unlockAudio()
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
    <AppShell isInstallable={isInstallable} onInstall={install}>
      {hasError === 'missing-time' && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: '12px' }}>
          That timer link was missing a valid time. Build a new one below.
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Left Settings Column */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={3}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
                Create a Timer
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Configure when it ends, how it looks, and set sound/visual cues.
              </Typography>
            </Box>

            {/* Duration Card */}
            <Card className="glass-card">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ScheduleIcon color="primary" sx={{ mr: 1.5 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Duration
                  </Typography>
                </Box>
                <Tabs
                  value={mode}
                  onChange={(_, v) => setMode(v)}
                  sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
                >
                  <Tab label="Minutes from now" value="minutes" />
                  <Tab label="Specific date & time" value="timestamp" />
                </Tabs>

                {mode === 'minutes' ? (
                  <Stack spacing={2}>
                    <TextField
                      id="minutes-input"
                      label="Minutes"
                      type="number"
                      inputProps={{ min: 1 }}
                      value={minutes}
                      onChange={(e) => setMinutes(e.target.value)}
                      sx={{ maxWidth: 200 }}
                    />
                    <ToggleButtonGroup
                      exclusive
                      size="small"
                      value={minutes}
                      onChange={(_, v) => v && setMinutes(v)}
                      sx={{ flexWrap: 'wrap', gap: 1 }}
                    >
                      {QUICK_MINUTES.map((m) => (
                        <ToggleButton key={m} value={String(m)} sx={{ px: 2 }}>
                          {m} min
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </Stack>
                ) : (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Date and time"
                      value={datetimeLocal}
                      onChange={(newValue) => setDatetimeLocal(newValue)}
                      slotProps={{
                        textField: {
                          id: 'datetime-input',
                          fullWidth: true,
                          helperText:
                            'Uses your local timezone. The timer URL will encode it as an ISO timestamp.',
                        },
                      }}
                    />
                  </LocalizationProvider>
                )}
              </CardContent>
            </Card>

            {/* Appearance Card */}
            <Card className="glass-card">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <PaletteOutlinedIcon color="primary" sx={{ mr: 1.5 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Appearance
                  </Typography>
                  <Typography variant="caption" sx={{ ml: 1.5, color: 'text.secondary' }}>
                    Optional
                  </Typography>
                </Box>
                <Stack spacing={3}>
                  <TextField
                    id="title-input"
                    label="Title"
                    placeholder="e.g. Lunch break"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <ColorPickerField
                        id="bg-color-input"
                        label="Background color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        helperText="Visible behind assets or as static color."
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <ColorPickerField
                        id="text-color-input"
                        label="Text color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                      />
                    </Grid>
                  </Grid>

                  <TextField
                    id="bg-url-input"
                    label="Background URL"
                    type="url"
                    placeholder="https://example.com/image.gif or video.mp4"
                    fullWidth
                    value={bgUrl}
                    onChange={(e) => setBgUrl(e.target.value)}
                    helperText="Image (JPEG, PNG, GIF, WebP) or video (MP4, WebM) URL."
                  />

                  <TextField
                    id="layout-select"
                    label="Layout"
                    select
                    value={layout}
                    onChange={(e) => setLayout(e.target.value)}
                    sx={{ maxWidth: 320 }}
                  >
                    <MenuItem value="">Responsive (default)</MenuItem>
                    <MenuItem value="mobile">Mobile</MenuItem>
                    <MenuItem value="widescreen">Widescreen</MenuItem>
                  </TextField>

                  <Box>
                    <FormControlLabel
                      control={
                        <Checkbox
                          id="dim-enabled"
                          checked={dimEnabled}
                          onChange={(e) => setDimEnabled(e.target.checked)}
                        />
                      }
                      label="Dim background for text contrast"
                    />
                    {dimEnabled && (
                      <FormControl fullWidth sx={{ mt: 2, maxWidth: 400 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Intensity: {Math.round(dimIntensity * 100)}%
                        </Typography>
                        <Slider
                          aria-label="Dim intensity"
                          min={0.05}
                          max={0.9}
                          step={0.05}
                          value={dimIntensity}
                          onChange={(_, v) => setDimIntensity(v)}
                          valueLabelDisplay="auto"
                          valueLabelFormat={(v) => `${Math.round(v * 100)}%`}
                        />
                      </FormControl>
                    )}
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Cues Card */}
            <Card className="glass-card">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <VolumeUpOutlinedIcon color="primary" sx={{ mr: 1.5 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Cues
                  </Typography>
                </Box>
                <Stack spacing={1}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="enable-flash"
                        checked={flash}
                        onChange={(e) => setFlash(e.target.checked)}
                      />
                    }
                    label="Visual flash alerts at 1:00, 0:30, and final 10s red state"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="enable-audio"
                        checked={audio}
                        onChange={(e) => setAudio(e.target.checked)}
                      />
                    }
                    label="Audio chimes & final 10s countdown ticking sound"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="enable-overtime"
                        checked={overtime}
                        onChange={(e) => setOvertime(e.target.checked)}
                      />
                    }
                    label="Continue counting as negative numbers after zero (overtime)"
                  />
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Right Sticky Preview & Action Column */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ position: { md: 'sticky' }, top: { md: '100px' }, zIndex: 1 }}>
            <Stack spacing={3}>
              {/* Preview Card */}
              <Card className="glass-card">
                <CardContent sx={{ pb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Live Preview
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{
                      overflow: 'hidden',
                      borderRadius: '12px',
                      bgcolor: 'transparent',
                      border: 'none',
                    }}
                  >
                    <TimerPreview
                      title={title}
                      countdown={previewCountdown}
                      bgColor={bgColor}
                      textColor={textColor}
                      bgUrl={previewBgUrl}
                      layout={layout}
                      dim={previewDim}
                    />
                  </Paper>
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ textAlign: 'center', mt: 1.5, color: 'text.secondary' }}
                  >
                    Audio alarms and the QR code are active only when running.
                  </Typography>
                </CardContent>
              </Card>

              {/* Action/Share Card */}
              <Card className="glass-card">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ShareOutlinedIcon color="primary" sx={{ mr: 1.5 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Share & Start
                    </Typography>
                  </Box>
                  <TextField
                    id="share-url"
                    label="Shareable URL"
                    fullWidth
                    value={fullUrl}
                    slotProps={{
                      input: {
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip
                              title={
                                copyState === 'copied'
                                  ? 'Copied!'
                                  : copyState === 'error'
                                    ? 'Copy failed'
                                    : 'Copy link to clipboard'
                              }
                            >
                              <span>
                                <IconButton
                                  aria-label="copy link"
                                  onClick={copy}
                                  disabled={!canStart}
                                  edge="end"
                                >
                                  {copyState === 'copied' ? (
                                    <CheckIcon color="success" />
                                  ) : (
                                    <ContentCopyIcon />
                                  )}
                                </IconButton>
                              </span>
                            </Tooltip>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </CardContent>
                <CardActions sx={{ px: 2, pb: 3, pt: 0 }}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={start}
                    disabled={!canStart}
                    className="interactive-element"
                    sx={{
                      borderRadius: '12px',
                      py: 1.5,
                      fontWeight: 700,
                      boxShadow: '0 4px 14px 0 rgba(30, 58, 95, 0.2)',
                    }}
                  >
                    Start Timer
                  </Button>
                </CardActions>
              </Card>
            </Stack>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={copyState === 'copied'}
        autoHideDuration={1500}
        onClose={() => setCopyState('idle')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ borderRadius: '8px' }}>
          URL copied to clipboard
        </Alert>
      </Snackbar>
      <Snackbar
        open={copyState === 'error'}
        autoHideDuration={1500}
        onClose={() => setCopyState('idle')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" variant="filled" sx={{ borderRadius: '8px' }}>
          Copy failed
        </Alert>
      </Snackbar>
    </AppShell>
  )
}

export default Builder
