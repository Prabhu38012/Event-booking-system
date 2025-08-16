const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

class PDFService {
  static async generateBookingPDF(booking, event) {
    return new Promise(async (resolve, reject) => {
      try {
        // Create PDF document
        const doc = new PDFDocument({
          size: 'A4',
          margin: 50,
          info: {
            Title: `Booking Confirmation - ${event.title}`,
            Author: 'EventBooker',
            Subject: 'Event Booking Confirmation'
          }
        });

        // Create buffer to store PDF
        const chunks = [];
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(chunks);
          resolve(pdfBuffer);
        });

        // Generate QR Code data
        const qrData = JSON.stringify({
          bookingId: booking._id,
          referenceNumber: booking.referenceNumber,
          eventId: event._id,
          customerEmail: booking.customerInfo.email,
          ticketQuantity: booking.ticketQuantity,
          verificationUrl: `${process.env.FRONTEND_URL}/verify/${booking.referenceNumber}`
        });

        // Generate QR code as buffer
        const qrCodeBuffer = await QRCode.toBuffer(qrData, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });

        // Header with logo area
        doc.fontSize(28)
           .fillColor('#1976d2')
           .text('🎪 EventBooker', 50, 50);

        doc.fontSize(16)
           .fillColor('#666666')
           .text('Event Booking Confirmation', 50, 85);

        // Confirmation status
        doc.fontSize(24)
           .fillColor('#4caf50')
           .text('✅ CONFIRMED', 400, 50);

        // Reference number box
        doc.rect(50, 120, 495, 60)
           .stroke('#1976d2')
           .fillColor('#f5f5f5')
           .fill();

        doc.fontSize(14)
           .fillColor('#333333')
           .text('BOOKING REFERENCE', 60, 135);

        doc.fontSize(20)
           .fillColor('#1976d2')
           .font('Helvetica-Bold')
           .text(booking.referenceNumber, 60, 155);

        // QR Code
        doc.image(qrCodeBuffer, 450, 130, { width: 80, height: 80 });
        doc.fontSize(10)
           .fillColor('#666666')
           .text('Scan to verify', 465, 220);

        // Event Details Section
        let yPosition = 250;
        
        doc.fontSize(18)
           .fillColor('#333333')
           .font('Helvetica-Bold')
           .text('Event Details', 50, yPosition);

        yPosition += 30;

        // Event title
        doc.fontSize(16)
           .fillColor('#1976d2')
           .font('Helvetica-Bold')
           .text(event.title, 50, yPosition);

        yPosition += 25;

        // Event info
        const eventInfo = [
          { label: 'Date & Time', value: this.formatDateTime(event.date) },
          { label: 'Location', value: event.location },
          { label: 'Category', value: event.category.toUpperCase() },
          { label: 'Organizer', value: event.organizer }
        ];

        doc.fontSize(12).font('Helvetica');

        eventInfo.forEach(info => {
          doc.fillColor('#666666')
             .text(`${info.label}:`, 50, yPosition);
          doc.fillColor('#333333')
             .text(info.value, 150, yPosition);
          yPosition += 20;
        });

        // Customer Details Section
        yPosition += 20;
        
        doc.fontSize(18)
           .fillColor('#333333')
           .font('Helvetica-Bold')
           .text('Customer Details', 50, yPosition);

        yPosition += 30;

        const customerInfo = [
          { label: 'Name', value: booking.customerInfo.name },
          { label: 'Email', value: booking.customerInfo.email },
          { label: 'Phone', value: booking.customerInfo.phone }
        ];

        doc.fontSize(12).font('Helvetica');

        customerInfo.forEach(info => {
          doc.fillColor('#666666')
             .text(`${info.label}:`, 50, yPosition);
          doc.fillColor('#333333')
             .text(info.value, 150, yPosition);
          yPosition += 20;
        });

        // Booking Summary Section
        yPosition += 20;
        
        doc.fontSize(18)
           .fillColor('#333333')
           .font('Helvetica-Bold')
           .text('Booking Summary', 50, yPosition);

        yPosition += 30;

        // Summary box
        doc.rect(50, yPosition, 495, 100)
           .stroke('#e0e0e0')
           .fillColor('#fafafa')
           .fill();

        yPosition += 20;

        // Ticket details
        doc.fontSize(14)
           .fillColor('#333333')
           .font('Helvetica')
           .text(`Tickets: ${booking.ticketQuantity} × $${event.price}`, 70, yPosition);

        yPosition += 25;

        doc.fontSize(16)
           .fillColor('#1976d2')
           .font('Helvetica-Bold')
           .text(`Total Amount: $${booking.totalAmount}`, 70, yPosition);

        yPosition += 25;

        doc.fontSize(12)
           .fillColor('#666666')
           .font('Helvetica')
           .text(`Payment Method: ${booking.paymentMethod.toUpperCase()}`, 70, yPosition);

        // Important Information Section
        yPosition += 80;
        
        doc.fontSize(18)
           .fillColor('#333333')
           .font('Helvetica-Bold')
           .text('Important Information', 50, yPosition);

        yPosition += 30;

        const importantInfo = [
          '• Please arrive 30 minutes before the event starts',
          '• Bring a valid ID for verification',
          '• Show this QR code at the entrance for quick check-in',
          '• Contact support@eventbooker.com for any queries',
          '• Refunds are available up to 24 hours before the event'
        ];

        doc.fontSize(11)
           .fillColor('#555555')
           .font('Helvetica');

        importantInfo.forEach(info => {
          doc.text(info, 50, yPosition);
          yPosition += 18;
        });

        // Footer
        yPosition = 750;
        
        doc.fontSize(10)
           .fillColor('#999999')
           .text('Generated on: ' + new Date().toLocaleString(), 50, yPosition);

        doc.text('EventBooker - Your trusted event booking platform', 300, yPosition);

        // Finalize the PDF
        doc.end();

      } catch (error) {
        reject(error);
      }
    });
  }

  static formatDateTime(date) {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

module.exports = PDFService;