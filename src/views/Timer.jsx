import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ReactQRCode from 'react-qr-code'
import { parseTimerParams, toAbsoluteShareSearch, effectiveDim } from '../lib/timerParams'
import { useCountdown } from '../lib/useCountdown'
import { useTimerCues } from '../lib/useTimerCues'
import TimerScreen from '../components/TimerScreen'
import AudioGate from '../components/AudioGate'

const QRCode = ReactQRCode.default ?? ReactQRCode

const FLASH_BG = '#ffffff'
const FLASH_FG = '#000000'
const CRITICAL_BG = '#b00020'
const CRITICAL_FG = '#ffffff'

const TimerView = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const params = useMemo(
    () => parseTimerParams(location.search.replace(/^\?/, '')),
    [location.search],
  )

  useEffect(() => {
    if (params.error === 'missing-time') {
      navigate('/?error=missing-time', { replace: true })
    }
  }, [params.error, navigate])

  const countdown = useCountdown(params.target, { allowOvertime: params.overtime })
  const { flashing, critical } = useTimerCues(countdown, {
    flash: params.flash,
    audio: params.audio,
  })

  const activeBg = flashing ? FLASH_BG : critical ? CRITICAL_BG : params.bgColor
  const activeFg = flashing ? FLASH_FG : critical ? CRITICAL_FG : params.textColor

  useEffect(() => {
    if (!params.target) return undefined
    const prevBg = document.body.style.backgroundColor
    const prevColor = document.body.style.color
    const prevMargin = document.body.style.margin
    const prevTransition = document.body.style.transition
    document.body.style.backgroundColor = activeBg
    document.body.style.color = activeFg
    document.body.style.margin = '0'
    document.body.style.transition = flashing
      ? 'background-color 0ms, color 0ms'
      : 'background-color 200ms ease, color 200ms ease'
    return () => {
      document.body.style.backgroundColor = prevBg
      document.body.style.color = prevColor
      document.body.style.margin = prevMargin
      document.body.style.transition = prevTransition
    }
  }, [activeBg, activeFg, flashing, params.target])

  const [shareHref, setShareHref] = useState('')

  useEffect(() => {
    if (!params.target) {
      setShareHref('')
      return
    }
    const absSearch = toAbsoluteShareSearch(location.search.replace(/^\?/, ''), params.target)
    const { origin, pathname } = window.location
    setShareHref(`${origin}${pathname}#/timer${absSearch ? '?' + absSearch : ''}`)
  }, [location.search, params.target])

  if (!params.target) return null

  // Hide the QR while in flash/critical so it doesn't clash with the alert
  // colors and to keep the urgent state visually clean.
  const showQr = !flashing && !critical && shareHref
  const qrSlot = showQr ? (
    <QRCode value={shareHref} size={120} bgColor="#ffffff" fgColor="#000000" />
  ) : null

  const dim = flashing || critical ? 0 : effectiveDim({ dim: params.dim })

  return (
    <>
      <TimerScreen
        title={params.title}
        countdown={countdown}
        layout={params.layout}
        bgUrl={flashing || critical ? null : params.bgUrl}
        videoBgUrl={flashing || critical ? null : params.videoBgUrl}
        dim={dim}
        qrSlot={qrSlot}
      />
      <AudioGate audioEnabled={params.audio} />
    </>
  )
}

export default TimerView
