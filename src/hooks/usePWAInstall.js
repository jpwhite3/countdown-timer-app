import { useState, useEffect } from 'react'

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent standard browser bar from displaying
      e.preventDefault()
      // Stash the event trigger
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const install = async () => {
    if (!deferredPrompt) return false
    
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    // Clear deferred prompt since it can only be prompted once
    setDeferredPrompt(null)
    
    return outcome === 'accepted'
  }

  return {
    isInstallable: !!deferredPrompt,
    install,
  }
}
