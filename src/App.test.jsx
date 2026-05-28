import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { describe, it, expect } from 'vitest'
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
})
