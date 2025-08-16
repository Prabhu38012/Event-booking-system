import React, { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  Add,
  Remove,
  Person,
  Email,
  Phone,
  CalendarToday,
  LocationOn,
  AccessTime,
  ConfirmationNumber
} from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'

const BookingForm = ({ event, onNext }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    ticketQuantity: 1,
    customerInfo: {
      name: user?.name || '',
      email: user?.email || '',
      phone: ''
    }
  })
  const [errors, setErrors] = useState({})
  const [ticketWarning, setTicketWarning] = useState('')

  // Auto-populate user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerInfo: {
          ...prev.customerInfo,
          name: user.name,
          email: user.email
        }
      }))
    }
  }, [user])

  // Check ticket availability and show warnings
  useEffect(() => {
    if (formData.ticketQuantity > event.availableTickets * 0.8) {
      setTicketWarning('Limited tickets remaining!')
    } else if (formData.ticketQuantity === event.availableTickets) {
      setTicketWarning('You are booking the last available tickets!')
    } else {
      setTicketWarning('')
    }
  }, [formData.ticketQuantity, event.availableTickets])

  const handleQuantityChange = (change) => {
    const newQuantity = formData.ticketQuantity + change
    if (newQuantity >= 1 && newQuantity <= event.availableTickets && newQuantity <= 10) {
      setFormData(prev => ({
        ...prev,
        ticketQuantity: newQuantity
      }))
      
      // Clear quantity error
      if (errors.ticketQuantity) {
        setErrors(prev => ({ ...prev, ticketQuantity: '' }))
      }
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'ticketQuantity') {
      const quantity = parseInt(value) || 1
      if (quantity >= 1 && quantity <= event.availableTickets && quantity <= 10) {
        setFormData(prev => ({
          ...prev,
          [name]: quantity
        }))
      }
    } else {
      setFormData(prev => ({
        ...prev,
        customerInfo: {
          ...prev.customerInfo,
          [name]: value
        }
      }))
    }
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Ticket quantity validation
    if (formData.ticketQuantity < 1) {
      newErrors.ticketQuantity = 'Please select at least 1 ticket'
    } else if (formData.ticketQuantity > event.availableTickets) {
      newErrors.ticketQuantity = `Only ${event.availableTickets} tickets available`
    } else if (formData.ticketQuantity > 10) {
      newErrors.ticketQuantity = 'Maximum 10 tickets per booking'
    }
    
    // Customer info validation
    if (!formData.customerInfo.name.trim()) {
      newErrors.name = 'Full name is required'
    } else if (formData.customerInfo.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    
    if (!formData.customerInfo.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerInfo.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.customerInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.customerInfo.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onNext(formData)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const totalAmount = formData.ticketQuantity * event.price
  const isFormValid = Object.keys(errors).length === 0

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Book Your Tickets
      </Typography>
      
      <Grid container spacing={4}>
        {/* Left Column - Booking Form */}
        <Grid  xs={12} lg={8}>
          {/* Event Summary Card */}
          <Card sx={{ mb: 4, overflow: 'hidden' }}>
            <Box
              sx={{
                height: 200,
                backgroundImage: `url(${event.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))'
                }
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  right: 16,
                  color: 'white'
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {event.title}
                </Typography>
                <Chip 
                  label={event.category.toUpperCase()} 
                  size="small" 
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
            </Box>
            <CardContent>
              <Grid container spacing={2}>
                <Grid  xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarToday sx={{ fontSize: 20, mr: 1, color: 'primary.main' }} />
                    <Typography variant="body1" fontWeight="medium">
                      {formatDate(event.date)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid  xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTime sx={{ fontSize: 20, mr: 1, color: 'primary.main' }} />
                    <Typography variant="body1" fontWeight="medium">
                      {formatTime(event.date)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid  xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOn sx={{ fontSize: 20, mr: 1, color: 'primary.main' }} />
                    <Typography variant="body1" fontWeight="medium">
                      {event.location}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Ticket Selection */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <ConfirmationNumber sx={{ mr: 1 }} />
                Select Tickets
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {event.availableTickets} tickets available • Maximum 10 tickets per booking
                </Typography>
                
                {ticketWarning && (
                  <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>
                    {ticketWarning}
                  </Alert>
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography variant="subtitle1" sx={{ minWidth: 120 }}>
                  Number of Tickets:
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    onClick={() => handleQuantityChange(-1)}
                    disabled={formData.ticketQuantity <= 1}
                    sx={{ 
                      border: 1, 
                      borderColor: 'divider',
                      '&:hover': { borderColor: 'primary.main' }
                    }}
                  >
                    <Remove />
                  </IconButton>
                  
                  <TextField
                    type="number"
                    value={formData.ticketQuantity}
                    onChange={handleInputChange}
                    name="ticketQuantity"
                    inputProps={{ 
                      min: 1, 
                      max: Math.min(event.availableTickets, 10),
                      style: { textAlign: 'center', width: '60px' }
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'divider' }
                      }
                    }}
                  />
                  
                  <IconButton
                    onClick={() => handleQuantityChange(1)}
                    disabled={formData.ticketQuantity >= event.availableTickets || formData.ticketQuantity >= 10}
                    sx={{ 
                      border: 1, 
                      borderColor: 'divider',
                      '&:hover': { borderColor: 'primary.main' }
                    }}
                  >
                    <Add />
                  </IconButton>
                </Box>
                
                <Typography variant="h6" color="primary" sx={{ ml: 'auto' }}>
                  ${event.price} each
                </Typography>
              </Box>

              {errors.ticketQuantity && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {errors.ticketQuantity}
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Person sx={{ mr: 1 }} />
                Customer Information
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Please provide accurate contact information for booking confirmation
              </Typography>
              
              <Grid container spacing={3}>
                <Grid  xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.customerInfo.name}
                    onChange={handleInputChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    InputProps={{
                      startAdornment: (
                        <Person sx={{ color: 'action.active', mr: 1 }} />
                      ),
                    }}
                    placeholder="Enter your full name"
                  />
                </Grid>
                
                <Grid xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.customerInfo.email}
                    onChange={handleInputChange}
                    error={!!errors.email}
                    helperText={errors.email || "Booking confirmation will be sent here"}
                    InputProps={{
                      startAdornment: (
                        <Email sx={{ color: 'action.active', mr: 1 }} />
                      ),
                    }}
                    placeholder="your@email.com"
                  />
                </Grid>
                
                <Grid xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.customerInfo.phone}
                    onChange={handleInputChange}
                    error={!!errors.phone}
                    helperText={errors.phone || "For urgent contact regarding your booking"}
                    InputProps={{
                      startAdornment: (
                        <Phone sx={{ color: 'action.active', mr: 1 }} />
                      ),
                    }}
                    placeholder="+1 (555) 123-4567"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Order Summary */}
        <Grid xs={12} lg={4}>
          <Card sx={{ position: 'sticky', top: 24 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {event.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(event.date)} at {formatTime(event.date)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.location}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Ticket Price</Typography>
                  <Typography>${event.price}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Quantity</Typography>
                  <Typography>× {formData.ticketQuantity}</Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Total Amount
                </Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                  ${totalAmount}
                </Typography>
              </Box>
              
              {/* Customer Preview */}
              {formData.customerInfo.name && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Booking For:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                        {formData.customerInfo.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {formData.customerInfo.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formData.customerInfo.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </>
              )}
              
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={!isFormValid || formData.ticketQuantity === 0}
                sx={{ 
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  boxShadow: 3,
                  '&:hover': {
                    boxShadow: 6
                  }
                }}
              >
                Continue to Payment
              </Button>
              
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
                You can review your order before final payment
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default BookingForm