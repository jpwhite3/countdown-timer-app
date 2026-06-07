import React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined'
import InstallMobileIcon from '@mui/icons-material/InstallMobile'

const AppShell = ({ children, maxWidth = 'md', isInstallable = false, onInstall = () => {} }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
        transition: 'background-color 200ms ease',
      }}
    >
      <AppBar
        position="sticky"
        sx={{
          background: 'var(--glass-bg)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
          borderBottom: '1px solid var(--glass-border)',
          boxShadow: 'var(--glass-shadow)',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TimerOutlinedIcon sx={{ mr: 1.5, color: 'primary.main' }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
              Countdown Timer
            </Typography>
          </Box>
          {isInstallable && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<InstallMobileIcon />}
              onClick={onInstall}
              className="interactive-element"
              sx={{
                borderRadius: '20px',
                textTransform: 'none',
                borderColor: 'var(--glass-border)',
                color: 'text.primary',
                '&:hover': {
                  background: 'var(--glass-border)',
                  borderColor: 'var(--glass-border)',
                },
              }}
            >
              Install App
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth={maxWidth} sx={{ flex: 1, py: 4 }}>
        {children}
      </Container>
    </Box>
  )
}

export default AppShell
