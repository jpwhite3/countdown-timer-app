import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { describe, it, expect } from 'vitest'
import { HashRouter } from 'react-router-dom'
import Builder from './Home'
import store from '../store'

describe('Builder Component', () => {
  it('updates background and text color inputs correctly', async () => {
    render(
      <Provider store={store}>
        <HashRouter>
          <Builder />
        </HashRouter>
      </Provider>,
    )

    const bgPicker = screen.getByLabelText(/background color picker/i)
    const fgPicker = screen.getByLabelText(/text color picker/i)

    expect(bgPicker.value).toBe('#0b0f19')
    expect(fgPicker.value).toBe('#f5f5f5')

    fireEvent.change(bgPicker, { target: { value: '#ff0000' } })
    expect(bgPicker.value).toBe('#ff0000')

    fireEvent.change(fgPicker, { target: { value: '#00ff00' } })
    expect(fgPicker.value).toBe('#00ff00')
  })

  describe('Copy Link Feature', () => {
    const originalClipboard = { ...navigator.clipboard }

    beforeEach(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: vi.fn().mockImplementation(() => Promise.resolve()),
        },
        writable: true,
        configurable: true,
      })
    })

    afterEach(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: originalClipboard,
        writable: true,
        configurable: true,
      })
    })

    it('renders a copy icon button instead of the "Copy" text button', () => {
      render(
        <Provider store={store}>
          <HashRouter>
            <Builder />
          </HashRouter>
        </Provider>,
      )

      // Ensure the old "Copy" button text does not exist
      expect(screen.queryByRole('button', { name: /^copy$/i })).toBeNull()

      // Find the new copy icon button by its role and name
      const copyBtn = screen.getByRole('button', { name: /copy link/i })
      expect(copyBtn).toBeInTheDocument()
    })

    it('disables the copy button when the timer is invalid', () => {
      render(
        <Provider store={store}>
          <HashRouter>
            <Builder />
          </HashRouter>
        </Provider>,
      )

      const copyBtn = screen.getByRole('button', { name: /copy link/i })
      expect(copyBtn).not.toBeDisabled()

      // Clear the duration/minutes input
      const minutesInput = screen.getByLabelText(/minutes/i)
      fireEvent.change(minutesInput, { target: { value: '' } })

      expect(copyBtn).toBeDisabled()
    })

    it('copies the shareable URL when the copy button is clicked', async () => {
      render(
        <Provider store={store}>
          <HashRouter>
            <Builder />
          </HashRouter>
        </Provider>,
      )

      const copyBtn = screen.getByRole('button', { name: /copy link/i })
      fireEvent.click(copyBtn)

      expect(navigator.clipboard.writeText).toHaveBeenCalled()
      // Check if it's called with the current URL containing default params (m=m, d=15)
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        expect.stringContaining('minutes=15'),
      )
    })

    it('shows visual feedback when copy succeeds', async () => {
      render(
        <Provider store={store}>
          <HashRouter>
            <Builder />
          </HashRouter>
        </Provider>,
      )

      // Initially, it should display the copy icon
      expect(screen.getByTestId('ContentCopyIcon')).toBeInTheDocument()
      expect(screen.queryByTestId('CheckIcon')).toBeNull()

      const copyBtn = screen.getByRole('button', { name: /copy link/i })
      fireEvent.click(copyBtn)

      // After clicking, it should show the check icon
      await waitFor(() => {
        expect(screen.getByTestId('CheckIcon')).toBeInTheDocument()
      })
      expect(screen.queryByTestId('ContentCopyIcon')).toBeNull()
    })
  })
})
