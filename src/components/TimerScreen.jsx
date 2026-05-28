import React, { useEffect, useState } from 'react'
import BackgroundMedia from './timer/BackgroundMedia'
import MobileLayout from './timer/MobileLayout'
import WidescreenLayout from './timer/WidescreenLayout'

function useResolvedLayout(lockedLayout) {
  const [responsive, setResponsive] = useState(() => {
    if (typeof window === 'undefined') return 'widescreen'
    return window.matchMedia('(min-width: 768px)').matches ? 'widescreen' : 'mobile'
  })

  useEffect(() => {
    if (lockedLayout) return undefined
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = (e) => setResponsive(e.matches ? 'widescreen' : 'mobile')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [lockedLayout])

  return lockedLayout ?? responsive
}

const TimerScreen = ({ title, countdown, layout: lockedLayout, bgUrl, videoBgUrl, qrSlot }) => {
  const layout = useResolvedLayout(lockedLayout)
  const Layout = layout === 'mobile' ? MobileLayout : WidescreenLayout
  return (
    <>
      <BackgroundMedia bgUrl={bgUrl} videoBgUrl={videoBgUrl} />
      <Layout title={title} countdown={countdown} qrSlot={qrSlot} />
    </>
  )
}

export default TimerScreen
