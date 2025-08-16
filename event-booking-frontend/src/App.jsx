import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@mui/material'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import LoginPage from './pages/Login'
import BookEvent from './pages/BookEvent'
import TicketVerification from './pages/TicketVerification'
import { useAuth } from './context/AuthContext'
import './styles/globals.css'
// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify/:referenceNumber?" element={<TicketVerification />} />
          <Route 
            path="/book/:eventId" 
            element={
              <ProtectedRoute>
                <BookEvent />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  )
}

export default App