const express = require('express');
const PDFService = require('../services/pdfService');
const { sendPDFTicket } = require('../services/emailService');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

// Download PDF ticket
router.get('/download/:bookingId', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      user: req.user._id
    }).populate('event');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.paymentStatus !== 'success') {
      return res.status(400).json({ message: 'Ticket not available - payment not confirmed' });
    }

    // Generate PDF
    const pdfBuffer = await PDFService.generateBookingPDF(booking, booking.event);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="ticket-${booking.referenceNumber}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF download error:', error);
    res.status(500).json({ message: 'Error generating PDF ticket' });
  }
});

// Resend PDF ticket via email
router.post('/resend/:bookingId', auth, async (req, res) => {
  try {
    const { email } = req.body;
    
    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      user: req.user._id
    }).populate('event');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.paymentStatus !== 'success') {
      return res.status(400).json({ message: 'Ticket not available - payment not confirmed' });
    }

    // Send PDF via email
    await sendPDFTicket(booking, booking.event, email || booking.customerInfo.email);

    res.json({ 
      message: 'PDF ticket sent successfully',
      sentTo: email || booking.customerInfo.email
    });

  } catch (error) {
    console.error('PDF resend error:', error);
    res.status(500).json({ message: 'Error sending PDF ticket' });
  }
});

// Verify QR code data
router.get('/verify/:referenceNumber', async (req, res) => {
  try {
    const booking = await Booking.findOne({
      referenceNumber: req.params.referenceNumber
    }).populate('event user', '-password');

    if (!booking) {
      return res.status(404).json({ 
        valid: false, 
        message: 'Booking not found' 
      });
    }

    res.json({
      valid: true,
      booking: {
        referenceNumber: booking.referenceNumber,
        event: booking.event.title,
        customer: booking.customerInfo.name,
        tickets: booking.ticketQuantity,
        status: booking.paymentStatus,
        date: booking.event.date
      }
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ 
      valid: false, 
      message: 'Error verifying booking' 
    });
  }
});

module.exports = router;