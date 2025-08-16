import React, { useState, useEffect } from 'react'
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Pagination,
  InputAdornment
} from '@mui/material'
import { Search } from '@mui/icons-material'
import EventCard from './EventCard'
import LoadingSpinner from '../common/LoadingSpinner'
import api from '../../services/api'
import { EVENT_CATEGORIES } from '../../utils/constants'

const EventList = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('all')
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  })

  const fetchEvents = async (page = 1, search = '', cat = 'all') => {
    try {
      setLoading(true)
      const response = await api.get('/api/events', {
        params: {
          page,
          search,
          category: cat,
          limit: 9
        }
      })
      setEvents(response.data.events)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchEvents(1, searchTerm, category)
    }, 500)

    return () => clearTimeout(delayedSearch)
  }, [searchTerm, category])

  const handlePageChange = (event, page) => {
    fetchEvents(page, searchTerm, category)
  }

  if (loading && events.length === 0) {
    return <LoadingSpinner message="Loading events..." />
  }

  return (
    <Box>
      {/* Search and Filter Controls */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1, minWidth: 250 }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
          >
            {EVENT_CATEGORIES.map((cat) => (
              <MenuItem key={cat.value} value={cat.value}>
                {cat.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Results Info */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {pagination.total} event{pagination.total !== 1 ? 's' : ''} found
      </Typography>

      {/* Events Grid */}
      {events.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary">
            No events found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {events.map((event) => (
              <Grid xs={12} sm={6} md={4} key={event._id}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pagination.pages}
                page={pagination.current}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

export default EventList