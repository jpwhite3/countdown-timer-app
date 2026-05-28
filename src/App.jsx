import React, { Suspense } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import './scss/style.scss'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const Builder = React.lazy(() => import('./views/Home'))
const Timer = React.lazy(() => import('./views/Timer'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => (
  <HashRouter>
    <Suspense fallback={loading}>
      <Routes>
        <Route path="/" element={<Builder />} />
        <Route path="/timer" element={<Timer />} />
        <Route path="/404" element={<Page404 />} />
        <Route path="/500" element={<Page500 />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  </HashRouter>
)

export default App
