import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material'
import { QrCodeScanner, Search, CheckCircle, Cancel } from '@mui/icons-material'
import api from '../../services/api'

const QRVerifier = () => {
  const [referenceNumber, setReferenceNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleVerify = async () => {
    if (!referenceNumber.trim()) {
      setError('Please enter a reference number')
      return
    }

    try {
      setLoading(true)
      setError('')
      setResult(null)

      const response = await api.get(`/api/tickets/verify/${referenceNumber}`)
      setResult(response.data)
    } catch (error) {
      setError(error.response?.data?.message || 'Verification failed')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleVerify()
    }
  }

  return (
    <Box maxWidth={600} mx="auto" p={3}>
      <Card>
        <CardContent>
          <Box textAlign="center" mb={3}>
            <QrCodeScanner sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Ticket Verification
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter booking reference number to verify ticket
            </Typography>
          </Box>

          <Box display="flex" gap={2} mb={3}>
            <TextField
              fullWidth
              label="Booking Reference Number"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              placeholder="BK1234567890"
              disabled={loading}
            />
            <Button
              variant="contained"
              onClick={handleVerify}
              disabled={loading || !referenceNumber.trim()}
              startIcon={loading ? <CircularProgress size={20} /> : <Search />}
              sx={{ minWidth: 120 }}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {result && (
            <Card variant="outlined" sx={{ mt: 2 }}>
              <CardContent>
                {result.valid ? (
                  <Box>
                    <Box display="flex" alignItems="center" mb={2}>
                      <CheckCircle sx={{ color: 'success.main', mr: 1 }} />
                      <Typography variant="h6" color="success.main">
                        Valid Ticket
                      </Typography>
                      <Chip 
                        label={result.booking.status.toUpperCase()} 
                        color="success" 
                        size="small" 
                        sx={{ ml: 2 }}
                      />
                    </Box>
                    
                    <Box mb={2}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Event
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {result.booking.event}
                      </Typography>
                      
                      <Typography variant="subtitle2" color="text.secondary">
                        Customer
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {result.booking.customer}
                      </Typography>
                      
                      <Typography variant="subtitle2" color="text.secondary">
                        Tickets
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {result.booking.tickets} ticket(s)
                      </Typography>
                      
                      <Typography variant="subtitle2" color="text.secondary">
                        Event Date
                      </Typography>
                      <Typography variant="body1">
                        {new Date(result.booking.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Cancel sx={{ color: 'error.main', mr: 1 }} />
                      <Typography variant="h6" color="error.main">
                        Invalid Ticket
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      This booking reference number could not be verified.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default QRVerifier