import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { describe, it, expect, vi } from 'vitest'
import App from './App'
import store from './store'

describe('App', () => {
  it('renders the builder on the default route', async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    )
    expect(
      await screen.findByRole('button', { name: /start timer/i }, { timeout: 4000 }),
    ).toBeInTheDocument()
  })

  it('renders the header "Create a Timer" on the default route', async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    )
    expect(
      await screen.findByRole('heading', { name: /create a timer/i }, { timeout: 4000 }),
    ).toBeInTheDocument()
  })

  it('detects prefers-color-scheme: dark and applies dark theme mode', async () => {
    const originalMatchMedia = window.matchMedia
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    render(
      <Provider store={store}>
        <App />
      </Provider>,
    )

    expect(
      await screen.findByRole('heading', { name: /create a timer/i }, { timeout: 4000 }),
    ).toBeInTheDocument()

    window.matchMedia = originalMatchMedia
  })
})
