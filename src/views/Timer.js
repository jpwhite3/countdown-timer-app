import React from 'react'
import { CContainer, CCol, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilAlarm } from '@coreui/icons'
import Countdown from 'react-countdown'
import QRCode from 'react-qr-code'
import 'react-datetime/css/react-datetime.css'

const CountdownView = () => {
  const queryString = require('query-string')
  const queryParams = queryString.parse(window.location.hash.replace('#/countdown', ''))
  const title = queryParams.title || 'Time Remaining'
  const until = queryParams.until || new Date().toISOString()
  const selected_time = new Date(Date.parse(until)) || new Date()

  // What to show when time has elapsed
  const Completionist = () => (
    <div className="text-danger fs-1">
      <CIcon icon={cilAlarm} size="xxl" />
      <p>Time is up!</p>
    </div>
  )

  // Renderer callback with condition
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <Completionist />
    } else {
      // Render a countdown
      return (
        <div className="text-center">
          <CContainer>
            <CRow className="fs-1 justify-content-center">
              <CCol xl={1} md={2} xs={4}>
                {hours + 24 * days}
              </CCol>
              <CCol xl={1} md={2} xs={4}>
                {minutes}
              </CCol>
              <CCol xl={1} md={2} xs={4}>
                {seconds}
              </CCol>
            </CRow>
            <CRow className="justify-content-center text-uppercase">
              <CCol xl={1} md={2} xs={4}>
                hours
              </CCol>
              <CCol xl={1} md={2} xs={4}>
                minutes
              </CCol>
              <CCol xl={1} md={2} xs={4}>
                seconds
              </CCol>
            </CRow>
          </CContainer>
        </div>
      )
    }
  }

  return (
    <div className="m-4 text-center">
      <h1>{title}</h1>
      <hr />
      <Countdown date={selected_time} renderer={renderer} />
      <hr />
      <QRCode value={window.location.href} />
    </div>
  )
}

export default CountdownView
