import React from 'react'
import {
  Box,
  TextField,
  Typography,
  Card,
  CardContent,
  InputAdornment,
  Alert
} from '@mui/material'
import {
  Payment,
  AccountCircle,
  QrCode
} from '@mui/icons-material'

const GPayPaymentForm = ({ formData, setFormData, errors, setErrors }) => {
  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateUPI = (upiId) => {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/
    return upiRegex.test(upiId)
  }

  const handleUPIChange = (e) => {
    const value = e.target.value
    setFormData(prev => ({
      ...prev,
      upiId: value
    }))
    
    if (errors.upiId) {
      setErrors(prev => ({ ...prev, upiId: '' }))
    }
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Payment sx={{ color: '#4285f4' }} />
        Google Pay (UPI)
      </Typography>
      
      <Card variant="outlined" sx={{ mb: 3, background: 'linear-gradient(135deg, #4285f4 0%, #34a853 100%)', color: 'white' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Payment sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Google Pay
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Unified Payments Interface
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="h6" sx={{ fontFamily: 'monospace', letterSpacing: 1 }}>
            {formData.upiId || 'yourname@upi'}
          </Typography>
        </CardContent>
      </Card>

      <TextField
        fullWidth
        label="UPI ID"
        value={formData.upiId || ''}
        onChange={handleUPIChange}
        error={!!errors.upiId}
        helperText={errors.upiId || 'Enter your UPI ID (e.g., yourname@paytm, mobile@ybl)'}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle sx={{ color: '#4285f4' }} />
            </InputAdornment>
          ),
        }}
        placeholder="yourname@paytm"
        sx={{ mb: 2 }}
      />
      
      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>Popular UPI suffixes:</strong><br />
          • @paytm • @ybl • @okhdfcbank • @okicici • @okaxis
        </Typography>
      </Alert>
      
      <Box sx={{ 
        border: '2px dashed #e0e0e0', 
        borderRadius: 2, 
        p: 3, 
        textAlign: 'center',
        background: '#f8f9fa'
      }}>
        <QrCode sx={{ fontSize: 48, color: '#666', mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          You'll be redirected to Google Pay to complete the payment
        </Typography>
      </Box>
    </Box>
  )
}

export default GPayPaymentForm