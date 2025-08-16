import React from 'react'
import { Container, Typography, Box, Button } from '@mui/material'
import { Event } from '@mui/icons-material'
import EventList from '../components/events/EventList'

const Home = () => {
  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          py: 6,
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          borderRadius: 2,
          color: 'white',
          mb: 6
        }}
      >
        <Event sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h2" component="h1" gutterBottom>
          EventBooker
        </Typography>
        <Typography variant="h5" component="h2" sx={{ mb: 3, opacity: 0.9 }}>
          Discover amazing events near you
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto', opacity: 0.8 }}>
          From concerts and festivals to conferences and workshops, find and book tickets 
          for the events that matter to you.
        </Typography>
      </Box>

      {/* Events Section */}
      <Box>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
          Upcoming Events
        </Typography>
        <EventList />
      </Box>
    </Container>
  )
}

export default Home