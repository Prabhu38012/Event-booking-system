import React from 'react'
import { Container, Typography, Box } from '@mui/material'
import QRVerifier from '../components/tickets/QRVerifier'

const TicketVerification = () => {
  return (
    <Container maxWidth="md">
      <Box py={4}>
        <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
          Ticket Verification
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
          Verify booking authenticity using the reference number from the QR code
        </Typography>
        <QRVerifier />
      </Box>
    </Container>
  )
}

export default TicketVerification