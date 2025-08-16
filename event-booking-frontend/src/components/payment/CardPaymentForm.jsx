import React, { useState } from 'react'
import {
  Box,
  TextField,
  Typography,
  Grid,
  Card,
  CardContent,
  InputAdornment,
  Chip
} from '@mui/material'
import {
  CreditCard,
  Security,
  Person,
  CalendarMonth
} from '@mui/icons-material'

const CardPaymentForm = ({ type, formData, setFormData, errors, setErrors }) => {
  const [cardType, setCardType] = useState('')

  const detectCardType = (number) => {
    const cleanNumber = number.replace(/\s/g, '')
    
    if (/^4/.test(cleanNumber)) return 'visa'
    if (/^5[1-5]/.test(cleanNumber)) return 'mastercard'
    if (/^3[47]/.test(cleanNumber)) return 'amex'
    if (/^6/.test(cleanNumber)) return 'discover'
    return ''
  }

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value)
    const detected = detectCardType(formatted)
    setCardType(detected)
    
    setFormData(prev => ({
      ...prev,
      cardNumber: formatted
    }))
    
    if (errors.cardNumber) {
      setErrors(prev => ({ ...prev, cardNumber: '' }))
    }
  }

  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value)
    setFormData(prev => ({
      ...prev,
      expiry: formatted
    }))
    
    if (errors.expiry) {
      setErrors(prev => ({ ...prev, expiry: '' }))
    }
  }

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const getCardIcon = () => {
    switch (cardType) {
      case 'visa':
        return <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzFBMUY3MSIvPgo8cGF0aCBkPSJNMTYuNSA5SDE0TDEyIDVIMTBMMTQgMTBIMTYuNUwxOCA5SDE2LjVaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMjIgOUgyNEwyNiAxNUgyOEwyNCA5SDIyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+" alt="Visa" />
      case 'mastercard':
        return <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iI0VCMDAxQiIvPgo8Y2lyY2xlIGN4PSIxNSIgY3k9IjEyIiByPSI2IiBmaWxsPSIjRkY1RjAwIiBmaWxsLW9wYWNpdHk9IjAuOCIvPgo8Y2lyY2xlIGN4PSIyNSIgY3k9IjEyIiByPSI2IiBmaWxsPSIjRkY1RjAwIi8+Cjwvzdmc+" alt="Mastercard" />
      default:
        return <CreditCard />
    }
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CreditCard />
        {type === 'debit' ? 'Debit Card' : 'Credit Card'} Details
      </Typography>
      
      <Card variant="outlined" sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {type === 'debit' ? 'DEBIT CARD' : 'CREDIT CARD'}
            </Typography>
            {cardType && (
              <Chip 
                label={cardType.toUpperCase()} 
                size="small" 
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  fontWeight: 'bold'
                }} 
              />
            )}
          </Box>
          
          <Typography variant="h5" sx={{ fontFamily: 'monospace', letterSpacing: 2, mb: 2 }}>
            {formData.cardNumber || '•••• •••• •••• ••••'}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.8, display: 'block' }}>
                CARD HOLDER
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {formData.cardHolder || 'YOUR NAME'}
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" sx={{ opacity: 0.8, display: 'block' }}>
                EXPIRES
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {formData.expiry || 'MM/YY'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Card Number"
            value={formData.cardNumber || ''}
            onChange={handleCardNumberChange}
            error={!!errors.cardNumber}
            helperText={errors.cardNumber}
            inputProps={{ maxLength: 19 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {getCardIcon()}
                </InputAdornment>
              ),
            }}
            placeholder="1234 5678 9012 3456"
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Card Holder Name"
            value={formData.cardHolder || ''}
            onChange={handleChange('cardHolder')}
            error={!!errors.cardHolder}
            helperText={errors.cardHolder}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
            placeholder="John Doe"
          />
        </Grid>
        
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Expiry Date"
            value={formData.expiry || ''}
            onChange={handleExpiryChange}
            error={!!errors.expiry}
            helperText={errors.expiry}
            inputProps={{ maxLength: 5 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarMonth />
                </InputAdornment>
              ),
            }}
            placeholder="MM/YY"
          />
        </Grid>
        
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="CVV"
            value={formData.cvv || ''}
            onChange={handleChange('cvv')}
            error={!!errors.cvv}
            helperText={errors.cvv}
            type="password"
            inputProps={{ maxLength: 4 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Security />
                </InputAdornment>
              ),
            }}
            placeholder="123"
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default CardPaymentForm