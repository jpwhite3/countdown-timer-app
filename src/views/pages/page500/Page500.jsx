import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import AppShell from '../../../components/AppShell'

const Page500 = () => (
  <AppShell>
    <Box sx={{ textAlign: 'center', py: 6 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        500
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph>
        Something went wrong on our end. Please try again later.
      </Typography>
      <Button variant="contained" href="#/">
        Back to home
      </Button>
    </Box>
  </AppShell>
)

export default Page500
