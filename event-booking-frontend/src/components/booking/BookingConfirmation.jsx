import React, { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress
} from '@mui/material'
import { 
  CheckCircle, 
  Email, 
  CalendarToday, 
  LocationOn, 
  Download, 
  QrCode,
  Send
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../services/api'

const BookingConfirmation = ({ booking, event, success }) => {
  const navigate = useNavigate()
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [resendDialog, setResendDialog] = useState(false)
  const [resendEmail, setResendEmail] = useState('')
  const [resendLoading, setResendLoading] = useState(false)

  const handleDownloadPDF = async () => {
    try {
      setDownloadLoading(true)
      
      const response = await api.get(`/api/tickets/download/${booking._id}`, {
        responseType: 'blob'
      })
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `ticket-${booking.referenceNumber}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      toast.success('PDF ticket downloaded successfully!')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download PDF ticket')
    } finally {
      setDownloadLoading(false)
    }
  }

  const handleResendPDF = async () => {
    try {
      setResendLoading(true)
      
      await api.post(`/api/tickets/resend/${booking._id}`, {
        email: resendEmail || booking.customerInfo.email
      })
      
      toast.success(`PDF ticket sent to ${resendEmail || booking.customerInfo.email}`)
      setResendDialog(false)
      setResendEmail('')
    } catch (error) {
      console.error('Resend error:', error)
      toast.error('Failed to send PDF ticket')
    } finally {
      setResendLoading(false)
    }
  }

  if (!success) {
    return (
      <Box textAlign="center" py={4}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Payment Failed
          </Typography>
          <Typography>
            Unfortunately, your payment could not be processed. Please try again.
          </Typography>
        </Alert>
        
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          sx={{ mr: 2 }}
        >
          Try Again
        </Button>
        
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
        >
          Back to Events
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Box textAlign="center" mb={4}>
        <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Booking Confirmed!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your tickets have been successfully booked
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Booking Details
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Reference Number
                </Typography>
                <Typography variant="h6" color="primary">
                  {booking.referenceNumber}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Chip 
                  label={booking.paymentStatus.toUpperCase()} 
                  color="success" 
                  icon={<CheckCircle />}
                />
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Event Information
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {event.title}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {event.location}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Customer Information
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                  {booking.customerInfo.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {booking.customerInfo.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {booking.customerInfo.phone}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid  xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payment Summary
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Tickets</Typography>
                <Typography>{booking.ticketQuantity}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Price per ticket</Typography>
                <Typography>${event.price}</Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total Paid</Typography>
                <Typography variant="h6" color="primary">
                  ${booking.totalAmount}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Payment Method: {booking.paymentMethod.toUpperCase()}
                </Typography>
              </Box>
              
              <Alert severity="info" icon={<Email />} sx={{ mb: 3 }}>
                A confirmation email with PDF ticket has been sent to {booking.customerInfo.email}
              </Alert>

              {/* PDF Download Section */}
              <Alert severity="success" icon={<QrCode />} sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  📱 Digital Ticket Ready
                </Typography>
                <Typography variant="body2">
                  Your PDF ticket includes a QR code for quick venue entry
                </Typography>
              </Alert>
              
              <Button
                variant="contained"
                fullWidth
                onClick={handleDownloadPDF}
                disabled={downloadLoading}
                startIcon={downloadLoading ? <CircularProgress size={20} /> : <Download />}
                sx={{ mb: 2 }}
              >
                {downloadLoading ? 'Generating...' : 'Download PDF Ticket'}
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => setResendDialog(true)}
                startIcon={<Send />}
                sx={{ mb: 2 }}
              >
                Resend PDF Ticket
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/')}
                sx={{ mb: 1 }}
              >
                Browse More Events
              </Button>
              
              <Button
                variant="text"
                fullWidth
                onClick={() => window.print()}
                size="small"
              >
                Print Confirmation
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Resend PDF Dialog */}
      <Dialog open={resendDialog} onClose={() => setResendDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Resend PDF Ticket</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Enter email address to send the PDF ticket (leave empty to use booking email)
          </Typography>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={resendEmail}
            onChange={(e) => setResendEmail(e.target.value)}
            placeholder={booking.customerInfo.email}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResendDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleResendPDF}
            disabled={resendLoading}
            variant="contained"
          >
            {resendLoading ? <CircularProgress size={20} /> : 'Send PDF'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default BookingConfirmation