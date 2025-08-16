const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { sendBookingConfirmation } = require('../services/emailService');

// Generate random reference number
const generateReferenceNumber = () => {
  return 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
};

// Simulate payment processing (90% success rate)
const simulatePayment = () => {
  return Math.random() > 0.1; // 90% success rate
};

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const { eventId, ticketQuantity, customerInfo, paymentMethod } = req.body;

    // Validate event exists and has available tickets
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.availableTickets < ticketQuantity) {
      return res.status(400).json({ 
        message: 'Not enough tickets available',
        available: event.availableTickets
      });
    }

    // Calculate total amount
    const totalAmount = event.price * ticketQuantity;

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      event: eventId,
      ticketQuantity,
      totalAmount,
      customerInfo,
      paymentMethod,
      referenceNumber: generateReferenceNumber()
    });

    // Simulate payment processing
    const paymentSuccess = simulatePayment();

    if (paymentSuccess) {
      booking.paymentStatus = 'success';
      
      // Update available tickets
      event.availableTickets -= ticketQuantity;
      await event.save();

      // Send confirmation email
      try {
        await sendBookingConfirmation(booking, event);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the booking if email fails
      }
    } else {
      booking.paymentStatus = 'failed';
    }

    await booking.save();

    // Populate event details for response
    await booking.populate('event', 'title date location');

    res.status(201).json({
      message: paymentSuccess ? 'Booking successful!' : 'Payment failed. Please try again.',
      booking,
      success: paymentSuccess
    });

  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('event', 'title date location image')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single booking
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('event');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};