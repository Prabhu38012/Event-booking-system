import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Grid,
  Divider,
  Alert,
  RadioGroup
} from '@mui/material'
import PaymentMethodCard from '../payment/PaymentMethodCard'
import CardPaymentForm from '../payment/CardPaymentForm'
import GPayPaymentForm from '../payment/GPayPaymentForm'
import PaymentProcessing from '../payment/PaymentProcessing'

const PaymentForm = ({ bookingData, event, onNext, onBack, loading, error }) => {
  const [paymentMethod, setPaymentMethod] = useState('gpay')
  const [paymentData, setPaymentData] = useState({})
  const [errors, setErrors] = useState({})
  const [processing, setProcessing] = useState(false)

  const paymentMethods = [
    {
      id: 'gpay',
      name: 'Google Pay',
      description: 'Pay using UPI via Google Pay',
      features: '• Instant • Secure • No charges'
    },
    {
      id: 'debit',
      name: 'Debit Card',
      description: 'Pay using your debit card',
      features: '• All major banks • Secure • Instant'
    },
    {
      id: 'credit',
      name: 'Credit Card',
      description: 'Pay using your credit card',
      features: '• Visa • Mastercard • Amex'
    }
  ]

  const validatePaymentData = () => {
    const newErrors = {}
    
    if (paymentMethod === 'gpay') {
      if (!paymentData.upiId) {
        newErrors.upiId = 'UPI ID is required'
      } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/.test(paymentData.upiId)) {
        newErrors.upiId = 'Please enter a valid UPI ID'
      }
    } else {
      // Card validation
      if (!paymentData.cardNumber) {
        newErrors.cardNumber = 'Card number is required'
      } else if (paymentData.cardNumber.replace(/\s/g, '').length < 13) {
        newErrors.cardNumber = 'Please enter a valid card number'
      }
      
      if (!paymentData.cardHolder) {
        newErrors.cardHolder = 'Card holder name is required'
      }
      
      if (!paymentData.expiry) {
        newErrors.expiry = 'Expiry date is required'
      } else if (!/^\d{2}\/\d{2}$/.test(paymentData.expiry)) {
        newErrors.expiry = 'Please enter a valid expiry date (MM/YY)'
      }
      
      if (!paymentData.cvv) {
        newErrors.cvv = 'CVV is required'
      } else if (paymentData.cvv.length < 3) {
        newErrors.cvv = 'Please enter a valid CVV'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validatePaymentData()) {
      return
    }
    
    setProcessing(true)
  }

  const handlePaymentSuccess = () => {
    setProcessing(false)
    onNext({ 
      ...bookingData, 
      paymentMethod, 
      paymentData: {
        ...paymentData,
        // Don't send sensitive data to backend
        ...(paymentMethod !== 'gpay' && {
          cardNumber: '**** **** **** ' + paymentData.cardNumber?.slice(-4),
          cvv: undefined
        })
      }
    })
  }

  const handlePaymentError = (errorMessage) => {
    setProcessing(false)
    setErrors({ payment: errorMessage })
  }

  const renderPaymentForm = () => {
    if (paymentMethod === 'gpay') {
      return (
        <GPayPaymentForm
          formData={paymentData}
          setFormData={setPaymentData}
          errors={errors}
          setErrors={setErrors}
        />
      )
    } else {
      return (
        <CardPaymentForm
          type={paymentMethod}
          formData={paymentData}
          setFormData={setPaymentData}
          errors={errors}
          setErrors={setErrors}
        />
      )
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" gutterBottom>
        Payment Method
      </Typography>
      
      
      {errors.payment && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.payment}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Payment Method Selection */}
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Select Payment Method
          </Typography>
          
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => {
              setPaymentMethod(e.target.value)
              setPaymentData({})
              setErrors({})
            }}
          >
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {paymentMethods.map((method) => (
                <Grid item xs={12} sm={6} md={4} key={method.id}>
                  <PaymentMethodCard
                    method={method}
                    selected={paymentMethod === method.id}
                    onSelect={setPaymentMethod}
                    disabled={loading}
                  />
                </Grid>
              ))}
            </Grid>
          </RadioGroup>

          {/* Payment Form */}
          <Box sx={{ mt: 4 }}>
            {renderPaymentForm()}
          </Box>
          
          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              🔒 Your payment information is encrypted and secure. This is a demo environment.
            </Typography>
          </Alert>
        </Grid>
        
        <Grid item xs={12} md={4}>
          {/* Order Summary */}
          <Box sx={{ position: 'sticky', top: 24 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            
            <Box sx={{ 
              p: 3, 
              border: '1px solid #e0e0e0', 
              borderRadius: 2,
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
            }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                {event.title}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {event.location}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Customer Details
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {bookingData.customerInfo.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {bookingData.customerInfo.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {bookingData.customerInfo.phone}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Tickets ({bookingData.ticketQuantity})</Typography>
                <Typography>${event.price} each</Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Total Amount
                </Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                  ${bookingData.ticketQuantity * event.price}
                </Typography>
              </Box>
              
              {/* Payment Method Display */}
              {paymentMethod && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Payment Method
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    p: 1,
                    bgcolor: 'rgba(25, 118, 210, 0.1)',
                    borderRadius: 1
                  }}>
                    {paymentMethod === 'gpay' && '💳 Google Pay (UPI)'}
                    {paymentMethod === 'debit' && '💳 Debit Card'}
                    {paymentMethod === 'credit' && '💳 Credit Card'}
                  </Typography>
                </Box>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ 
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  boxShadow: 3,
                  '&:hover': {
                    boxShadow: 6,
                    background: 'linear-gradient(45deg, #1565c0, #1976d2)'
                  }
                }}
              >
                {paymentMethod === 'gpay' ? '📱 Pay with Google Pay' : '💳 Process Payment'}
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                onClick={onBack}
                disabled={loading}
                sx={{ py: 1.5 }}
              >
                ← Back to Details
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Payment Processing Dialog */}
      <PaymentProcessing
        open={processing}
        paymentMethod={paymentMethod}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </Box>
  )
}

export default PaymentForm