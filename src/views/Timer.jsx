import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ReactQRCode from 'react-qr-code'
import { parseTimerParams, toAbsoluteShareSearch } from '../lib/timerParams'
import { useCountdown } from '../lib/useCountdown'
import TimerScreen from '../components/TimerScreen'

const QRCode = ReactQRCode.default ?? ReactQRCode

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

  useEffect(() => {
    if (!params.target) return undefined
    const prevBg = document.body.style.backgroundColor
    const prevColor = document.body.style.color
    const prevMargin = document.body.style.margin
    document.body.style.backgroundColor = params.bgColor
    document.body.style.color = params.textColor
    document.body.style.margin = '0'
    return () => {
      document.body.style.backgroundColor = prevBg
      document.body.style.color = prevColor
      document.body.style.margin = prevMargin
    }
  }, [params.bgColor, params.textColor, params.target])

  const countdown = useCountdown(params.target)
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

  const qrSlot = shareHref ? (
    <QRCode value={shareHref} size={120} bgColor="#ffffff" fgColor="#000000" />
  ) : null

  return (
    <TimerScreen
      title={params.title}
      countdown={countdown}
      layout={params.layout}
      bgUrl={params.bgUrl}
      videoBgUrl={params.videoBgUrl}
      qrSlot={qrSlot}
    />
  )
}

export default TimerView
