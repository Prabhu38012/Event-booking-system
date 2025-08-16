import React, { useState } from 'react'
import { Container, Paper, Box } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  const handleAuthSuccess = () => {
    toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!')
    navigate(from, { replace: true })
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          {isLogin ? (
            <Login
              onSuccess={handleAuthSuccess}
              onSwitchToRegister={() => setIsLogin(false)}
            />
          ) : (
            <Register
              onSuccess={handleAuthSuccess}
              onSwitchToLogin={() => setIsLogin(true)}
            />
          )}
        </Paper>
      </Box>
    </Container>
  )
}

export default LoginPage