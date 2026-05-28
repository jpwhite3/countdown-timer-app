import '@testing-library/jest-dom/vitest'

// jsdom doesn't implement window.matchMedia. Stub a no-op so components
// that probe media queries during render (e.g. useResolvedLayout in
// TimerScreen) don't blow up the test environment.
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })
}

// jsdom doesn't ship ResizeObserver either; TimerPreview uses it to
// track its frame width. A no-op stub keeps mounts cheap and silent.
if (typeof window !== 'undefined' && typeof window.ResizeObserver !== 'function') {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserverStub
  globalThis.ResizeObserver = ResizeObserverStub
}
