import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AppShell from './AppShell'

describe('AppShell', () => {
  it('renders children correctly', () => {
    render(<AppShell><div>Test Child</div></AppShell>)
    expect(screen.getByText('Test Child')).toBeInTheDocument()
    expect(screen.getByText('Countdown Timer')).toBeInTheDocument()
  })

  it('does not render install button when isInstallable is false', () => {
    render(<AppShell isInstallable={false}><div>Test</div></AppShell>)
    expect(screen.queryByRole('button', { name: /install app/i })).not.toBeInTheDocument()
  })

  it('renders install button and triggers onInstall when clicked and isInstallable is true', () => {
    const mockInstall = vi.fn()
    render(<AppShell isInstallable={true} onInstall={mockInstall}><div>Test</div></AppShell>)
    
    const installButton = screen.getByRole('button', { name: /install app/i })
    expect(installButton).toBeInTheDocument()
    
    fireEvent.click(installButton)
    expect(mockInstall).toHaveBeenCalledTimes(1)
  })
})
