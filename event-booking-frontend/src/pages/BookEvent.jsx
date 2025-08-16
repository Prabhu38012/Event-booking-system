import React, { useState, useEffect } from 'react'
import { Container, Stepper, Step, StepLabel, Box, Paper } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import BookingForm from '../components/booking/BookingForm'
import PaymentForm from '../components/booking/PaymentForm'
import BookingConfirmation from '../components/booking/BookingConfirmation'
import LoadingSpinner from '../components/common/LoadingSpinner'
import api from '../services/api'

const steps = ['Book Tickets', 'Payment', 'Confirmation']

const BookEvent = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const [event, setEvent] = useState(null)
  const [bookingData, setBookingData] = useState(null)
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processLoading, setProcessLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchEvent()
  }, [eventId])

  const fetchEvent = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/api/events/${eventId}`)
      setEvent(response.data)
    } catch (error) {
      console.error('Error fetching event:', error)
      toast.error('Event not found')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleBookingFormNext = (data) => {
    setBookingData(data)
    setActiveStep(1)
  }

  const handlePaymentFormNext = async (data) => {
    try {
      setProcessLoading(true)
      setError(null)
      
      const response = await api.post('/api/bookings', {
        eventId: event._id,
        ...data
      })
      
      setBooking(response.data.booking)
      setSuccess(response.data.success)
      setActiveStep(2)
      
      if (response.data.success) {
        toast.success('Booking confirmed successfully!')
      } else {
        toast.error('Payment failed. Please try again.')
      }
    } catch (error) {
      console.error('Booking error:', error)
      const errorMessage = error.response?.data?.message || 'Booking failed'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setProcessLoading(false)
    }
  }

  const handlePaymentFormBack = () => {
    setActiveStep(0)
  }

  if (loading) {
    return (
      <Container maxWidth="lg">
        <LoadingSpinner message="Loading event details..." />
      </Container>
    )
  }

  if (!event) {
    return null
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Paper elevation={2} sx={{ p: 4 }}>
        {activeStep === 0 && (
          <BookingForm
            event={event}
            onNext={handleBookingFormNext}
          />
        )}
        
        {activeStep === 1 && (
          <PaymentForm
            bookingData={bookingData}
            event={event}
            onNext={handlePaymentFormNext}
            onBack={handlePaymentFormBack}
            loading={processLoading}
            error={error}
          />
        )}
        
        {activeStep === 2 && (
          <BookingConfirmation
            booking={booking}
            event={event}
            success={success}
          />
        )}
      </Paper>
    </Container>
  )
}

export default BookEvent