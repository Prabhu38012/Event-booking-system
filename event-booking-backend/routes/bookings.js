const express = require('express');
const { body } = require('express-validator');
const { createBooking, getUserBookings, getBooking } = require('../controllers/bookingController');
const auth = require('../middleware/auth');

const router = express.Router();

// All booking routes require authentication
router.use(auth);

// Create booking
router.post('/', [
  body('eventId').isMongoId().withMessage('Valid event ID required'),
  body('ticketQuantity').isInt({ min: 1 }).withMessage('Ticket quantity must be at least 1'),
  body('customerInfo.name').trim().isLength({ min: 2 }).withMessage('Customer name required'),
  body('customerInfo.email').isEmail().withMessage('Valid email required'),
  body('customerInfo.phone').isMobilePhone().withMessage('Valid phone number required'),
  body('paymentMethod').isIn(['gpay', 'debit', 'credit']).withMessage('Valid payment method required')
], createBooking);

// Get user bookings
router.get('/', getUserBookings);

// Get single booking
router.get('/:id', getBooking);

module.exports = router;