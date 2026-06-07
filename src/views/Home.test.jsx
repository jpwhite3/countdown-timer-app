import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
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
})
