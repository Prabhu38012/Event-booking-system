const express = require('express');
const { getEvents, getEvent, createSampleEvents } = require('../controllers/eventController');

const router = express.Router();

// Get all events
router.get('/', getEvents);

// Get single event
router.get('/:id', getEvent);

// Create sample events (development only)
router.post('/sample', createSampleEvents);

module.exports = router;