import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
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
    <AppShell>
      <Stack spacing={3}>
        {hasError === 'missing-time' ? (
          <Alert severity="warning">
            That timer link was missing a valid time. Build a new one below.
          </Alert>
        ) : (
          <Typography color="text.secondary">
            Build a shareable countdown timer. Configure when it ends and how it looks below, then
            copy the URL or click Start.
          </Typography>
        )}

        <Card>
          <CardHeader title="Preview" />
          <CardContent>
            <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
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
            <FormHelperText sx={{ textAlign: 'center', mt: 1 }}>
              Updates live as you change settings. Audio, flash, and the QR code are omitted.
            </FormHelperText>
          </CardContent>
        </Card>

        <Card>
          <CardHeader avatar={<ScheduleIcon color="primary" />} title="Duration" />
          <CardContent>
            <Tabs
              value={mode}
              onChange={(_, v) => setMode(v)}
              sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Minutes from now" value="minutes" />
              <Tab label="Specific date and time" value="timestamp" />
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

        <Card>
          <CardHeader
            avatar={<PaletteOutlinedIcon color="primary" />}
            title="Appearance"
            subheader="Optional"
          />
          <CardContent>
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
                <Grid size={{ xs: 12, md: 6 }}>
                  <ColorPickerField
                    id="bg-color-input"
                    label="Background color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    helperText="Sits behind the background asset. Visible through transparent regions of the asset, or by itself when no asset is set."
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
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
                placeholder="https://example.com/image.gif or https://example.com/video.mp4"
                fullWidth
                value={bgUrl}
                onChange={(e) => setBgUrl(e.target.value)}
                helperText="Any image (JPEG, PNG, GIF, APNG, WebP, AVIF, SVG — animated formats play automatically) or video (MP4, WebM, MOV, OGV) URL the browser can render natively. Transparent regions reveal the background color below."
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
                <FormHelperText sx={{ ml: 4, mt: -0.5 }}>
                  Adds a semi-transparent black layer over the background to keep the timer
                  readable. Turn off for full control over the background appearance.
                </FormHelperText>
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

        <Card>
          <CardHeader avatar={<VolumeUpOutlinedIcon color="primary" />} title="Cues" />
          <CardContent>
            <Stack>
              <FormControlLabel
                control={
                  <Checkbox
                    id="enable-flash"
                    checked={flash}
                    onChange={(e) => setFlash(e.target.checked)}
                  />
                }
                label="Visual flash at 1:00 and 0:30; red background in the final 10 seconds"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    id="enable-audio"
                    checked={audio}
                    onChange={(e) => setAudio(e.target.checked)}
                  />
                }
                label="Audio cues: chime at 1:00, 0:30, 0:10; tick each second in the final 10; final chime at zero"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    id="enable-overtime"
                    checked={overtime}
                    onChange={(e) => setOvertime(e.target.checked)}
                  />
                }
                label="Continue counting after zero (overtime, shown as a negative number)"
              />
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardHeader avatar={<ShareOutlinedIcon color="primary" />} title="Share & Start" />
          <CardContent>
            <TextField
              id="share-url"
              label="Shareable URL"
              fullWidth
              value={fullUrl}
              slotProps={{ input: { readOnly: true } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ContentCopyIcon />}
                      onClick={copy}
                      disabled={!canStart}
                    >
                      Copy
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </CardContent>
          <CardActions sx={{ px: 2, pb: 2 }}>
            <Button variant="contained" size="large" fullWidth onClick={start} disabled={!canStart}>
              Start Timer
            </Button>
          </CardActions>
        </Card>
      </Stack>

      <Snackbar
        open={copyState === 'copied'}
        autoHideDuration={1500}
        onClose={() => setCopyState('idle')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled">
          URL copied to clipboard
        </Alert>
      </Snackbar>
      <Snackbar
        open={copyState === 'error'}
        autoHideDuration={1500}
        onClose={() => setCopyState('idle')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" variant="filled">
          Copy failed
        </Alert>
      </Snackbar>
    </AppShell>
  )
}

export default Builder
