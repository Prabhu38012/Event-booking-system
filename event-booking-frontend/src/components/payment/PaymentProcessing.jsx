import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  CircularProgress,
  LinearProgress,
  Fade,
  Zoom
} from '@mui/material'
import {
  Payment,
  Security,
  CheckCircle,
  Error as ErrorIcon
} from '@mui/icons-material'

const PaymentProcessing = ({ open, onClose, paymentMethod, onSuccess, onError }) => {
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const steps = [
    { 
      label: 'Initiating Payment', 
      icon: <Payment />, 
      duration: 2000,
      color: '#1976d2'
    },
    { 
      label: 'Verifying Details', 
      icon: <Security />, 
      duration: 2000,
      color: '#ff9800'
    },
    { 
      label: 'Processing Transaction', 
      icon: <CircularProgress size={24} />, 
      duration: 3000,
      color: '#2e7d32'
    }
  ]

  useEffect(() => {
    if (!open) {
      setStep(0)
      setProgress(0)
      return
    }

    const processPayment = async () => {
      // Step through each processing step
      for (let i = 0; i < steps.length; i++) {
        setStep(i)
        
        // Animate progress for current step
        const stepDuration = steps[i].duration
        const intervalTime = 50
        const incrementPerInterval = 100 / (stepDuration / intervalTime)
        
        let currentProgress = 0
        const progressInterval = setInterval(() => {
          currentProgress += incrementPerInterval
          setProgress(Math.min(currentProgress, 100))
          
          if (currentProgress >= 100) {
            clearInterval(progressInterval)
          }
        }, intervalTime)
        
        // Wait for step to complete
        await new Promise(resolve => setTimeout(resolve, stepDuration))
        clearInterval(progressInterval)
        setProgress(100)
        
        // Short pause between steps
        if (i < steps.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500))
          setProgress(0)
        }
      }
      
      // Simulate payment result (90% success rate)
      const isSuccess = Math.random() > 0.1
      
      if (isSuccess) {
        setStep(3) // Success step
        await new Promise(resolve => setTimeout(resolve, 1500))
        onSuccess()
      } else {
        setStep(4) // Error step
        await new Promise(resolve => setTimeout(resolve, 2000))
        onError('Payment failed. Please try again.')
      }
    }

    processPayment()
  }, [open])

  const getStepContent = () => {
    if (step < 3) {
      return (
        <Fade in={true} key={step}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Box sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: '50%', 
              bgcolor: `${steps[step].color}20`,
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              border: `3px solid ${steps[step].color}30`
            }}>
              <Box sx={{ color: steps[step].color, fontSize: 32 }}>
                {steps[step].icon}
              </Box>
            </Box>
            
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              {steps[step].label}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {step === 0 && `Connecting to ${paymentMethod === 'gpay' ? 'Google Pay' : 'bank'} servers...`}
              {step === 1 && 'Validating payment information...'}
              {step === 2 && 'Completing your transaction securely...'}
            </Typography>
            
            <Box sx={{ width: '100%', mb: 2 }}>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  bgcolor: `${steps[step].color}20`,
                  '& .MuiLinearProgress-bar': {
                    bgcolor: steps[step].color,
                    borderRadius: 4
                  }
                }} 
              />
            </Box>
            
            <Typography variant="caption" color="text.secondary">
              {Math.round(progress)}% Complete
            </Typography>
          </Box>
        </Fade>
      )
    }
    
    if (step === 3) {
      return (
        <Zoom in={true}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Box sx={{ 
              width: 100, 
              height: 100, 
              borderRadius: '50%', 
              bgcolor: '#4caf5020',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              border: '3px solid #4caf5040',
              animation: 'pulse 2s infinite'
            }}>
              <CheckCircle sx={{ color: '#4caf50', fontSize: 48 }} />
            </Box>
            
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#4caf50' }}>
              Payment Successful!
            </Typography>
            
            <Typography variant="body1" color="text.secondary">
              Your transaction has been completed successfully
            </Typography>
          </Box>
        </Zoom>
      )
    }
    
    if (step === 4) {
      return (
        <Zoom in={true}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Box sx={{ 
              width: 100, 
              height: 100, 
              borderRadius: '50%', 
              bgcolor: '#f4433620',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              border: '3px solid #f4433640'
            }}>
              <ErrorIcon sx={{ color: '#f44336', fontSize: 48 }} />
            </Box>
            
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#f44336' }}>
              Payment Failed
            </Typography>
            
            <Typography variant="body1" color="text.secondary">
              Something went wrong. Please try again.
            </Typography>
          </Box>
        </Zoom>
      )
    }
  }

  return (
    <Dialog 
      open={open} 
      onClose={() => {}} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: 300
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {getStepContent()}
      </DialogContent>
    </Dialog>
  )
}

export default PaymentProcessing