import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePWAInstall } from './usePWAInstall'

describe('usePWAInstall hook', () => {
  let addEventListenerSpy
  let removeEventListenerSpy
  let mockEvent

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    mockEvent = {
      preventDefault: vi.fn(),
      prompt: vi.fn(),
      userChoice: Promise.resolve({ outcome: 'accepted' }),
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('registers listener on mount and unregisters on unmount', () => {
    const { unmount } = renderHook(() => usePWAInstall())

    expect(addEventListenerSpy).toHaveBeenCalledWith('beforeinstallprompt', expect.any(Function))

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('beforeinstallprompt', expect.any(Function))
  })

  it('initially returns isInstallable as false', () => {
    const { result } = renderHook(() => usePWAInstall())
    expect(result.current.isInstallable).toBe(false)
  })

  it('captures the beforeinstallprompt event and sets isInstallable to true', () => {
    const { result } = renderHook(() => usePWAInstall())

    const callback = addEventListenerSpy.mock.calls.find(
      (call) => call[0] === 'beforeinstallprompt',
    )[1]

    act(() => {
      callback(mockEvent)
    })

    expect(mockEvent.preventDefault).toHaveBeenCalled()
    expect(result.current.isInstallable).toBe(true)
  })

  it('calls prompt and clears the event on install()', async () => {
    const { result } = renderHook(() => usePWAInstall())

    const callback = addEventListenerSpy.mock.calls.find(
      (call) => call[0] === 'beforeinstallprompt',
    )[1]

    act(() => {
      callback(mockEvent)
    })

    let outcome
    await act(async () => {
      outcome = await result.current.install()
    })

    expect(mockEvent.prompt).toHaveBeenCalled()
    expect(outcome).toBe(true)
    expect(result.current.isInstallable).toBe(false)
  })
})
