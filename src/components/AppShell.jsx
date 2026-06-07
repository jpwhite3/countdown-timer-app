import React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined'

const AppShell = ({ children, maxWidth = 'md' }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <TimerOutlinedIcon sx={{ mr: 1.5 }} />
        <Typography variant="h6" component="div">
          Countdown Timer
        </Typography>
      </Toolbar>
    </AppBar>
    <Container maxWidth={maxWidth} sx={{ flex: 1, py: 3 }}>
      {children}
    </Container>
  </Box>
)

export default AppShell
