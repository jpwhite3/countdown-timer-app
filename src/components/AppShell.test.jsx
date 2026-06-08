import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AppShell from './AppShell'
import MobileLayout from './timer/MobileLayout'
import WidescreenLayout from './timer/WidescreenLayout'

describe('AppShell', () => {
  it('renders children correctly', () => {
    render(
      <AppShell>
        <div>Test Child</div>
      </AppShell>,
    )
    expect(screen.getByText('Test Child')).toBeInTheDocument()
    expect(screen.getByText('Countdown Timer')).toBeInTheDocument()
  })

  it('does not render install button when isInstallable is false', () => {
    render(
      <AppShell isInstallable={false}>
        <div>Test</div>
      </AppShell>,
    )
    expect(screen.queryByRole('button', { name: /install app/i })).not.toBeInTheDocument()
  })

  it('renders install button and triggers onInstall when clicked and isInstallable is true', () => {
    const mockInstall = vi.fn()
    render(
      <AppShell isInstallable={true} onInstall={mockInstall}>
        <div>Test</div>
      </AppShell>,
    )

    const installButton = screen.getByRole('button', { name: /install app/i })
    expect(installButton).toBeInTheDocument()

    fireEvent.click(installButton)
    expect(mockInstall).toHaveBeenCalledTimes(1)
  })
})

describe('Timer Layouts completed state rendering', () => {
  const completedCountdown = {
    completed: true,
    overtime: false,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  }

  it('MobileLayout renders custom expiry message when completed', () => {
    render(
      <MobileLayout
        title="My Timer"
        expiryMessage="Meeting Over!"
        countdown={completedCountdown}
      />,
    )
    expect(screen.getByText('My Timer')).toBeInTheDocument()
    expect(screen.getByText('Meeting Over!')).toBeInTheDocument()
  })

  it('MobileLayout renders default expiry message when completed and none is provided', () => {
    render(<MobileLayout title="My Timer" countdown={completedCountdown} />)
    expect(screen.getByText('Time is up!')).toBeInTheDocument()
  })

  it('WidescreenLayout renders custom expiry message when completed', () => {
    render(
      <WidescreenLayout
        title="My Timer"
        expiryMessage="Coffee Break!"
        countdown={completedCountdown}
      />,
    )
    expect(screen.getByText('My Timer')).toBeInTheDocument()
    expect(screen.getByText('Coffee Break!')).toBeInTheDocument()
  })

  it('WidescreenLayout renders default expiry message when completed and none is provided', () => {
    render(<WidescreenLayout title="My Timer" countdown={completedCountdown} />)
    expect(screen.getByText('Time is up!')).toBeInTheDocument()
  })
})
