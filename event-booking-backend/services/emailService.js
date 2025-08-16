const nodemailer = require('nodemailer');
const PDFService = require('./pdfService');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send booking confirmation email with PDF
exports.sendBookingConfirmation = async (booking, event) => {
  try {
    // Generate PDF
    console.log('Generating PDF ticket...');
    const pdfBuffer = await PDFService.generateBookingPDF(booking, event);
    
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { 
            background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%); 
            color: white; 
            padding: 30px; 
            text-align: center; 
            border-radius: 10px 10px 0 0;
          }
          .content { padding: 30px; background: #f9f9f9; }
          .booking-details { 
            background: white; 
            padding: 20px; 
            margin: 20px 0; 
            border-radius: 8px; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .footer { 
            text-align: center; 
            padding: 20px; 
            color: #666; 
            background: #e3f2fd;
            border-radius: 0 0 10px 10px;
          }
          .success { color: #4caf50; font-weight: bold; font-size: 18px; }
          .qr-info {
            background: #e8f5e8;
            border: 2px solid #4caf50;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
          }
          .reference-number {
            background: #1976d2;
            color: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Booking Confirmed!</h1>
            <p style="margin: 0; font-size: 18px;">Your tickets are ready</p>
          </div>
          
          <div class="content">
            <p>Dear ${booking.customerInfo.name},</p>
            <p class="success">Your booking has been successfully confirmed!</p>
            
            <div class="reference-number">
              Booking Reference: ${booking.referenceNumber}
            </div>
            
            <div class="booking-details">
              <h3 style="color: #1976d2; margin-top: 0;">📅 Event Details</h3>
              <p><strong>Event:</strong> ${event.title}</p>
              <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
              <p><strong>Location:</strong> ${event.location}</p>
              <p><strong>Tickets:</strong> ${booking.ticketQuantity}</p>
              <p><strong>Total Amount:</strong> $${booking.totalAmount}</p>
              <p><strong>Payment Method:</strong> ${booking.paymentMethod.toUpperCase()}</p>
            </div>
            
            <div class="qr-info">
              <h3 style="color: #2e7d32; margin-top: 0;">📱 Digital Ticket Attached</h3>
              <p><strong>Your PDF ticket with QR code is attached to this email.</strong></p>
              <p>Simply show the QR code on your phone or print the PDF for quick entry at the venue.</p>
              <p style="font-size: 14px; color: #666;">💡 The QR code contains your booking verification details</p>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <h4 style="color: #856404; margin-top: 0;">📝 Important Reminders:</h4>
              <ul style="color: #856404; margin: 0;">
                <li>Arrive 30 minutes before the event starts</li>
                <li>Bring a valid ID for verification</li>
                <li>Download or save the PDF ticket to your phone</li>
                <li>Contact support if you need any assistance</li>
              </ul>
            </div>
            
            <p>We look forward to seeing you at the event!</p>
          </div>
          
          <div class="footer">
            <p><strong>Thank you for choosing EventBooker!</strong></p>
            <p>For support, contact us at support@eventbooker.com</p>
            <p style="font-size: 12px; color: #999;">This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `EventBooker <${process.env.EMAIL_USER}>`,
      to: booking.customerInfo.email,
      subject: `🎫 Your Ticket for ${event.title} - ${booking.referenceNumber}`,
      html: emailHTML,
      attachments: [
        {
          filename: `ticket-${booking.referenceNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Confirmation email with PDF sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Email sending error:', error);
    throw error;
  }
};

// Send PDF via email (standalone function)
exports.sendPDFTicket = async (booking, event, recipientEmail) => {
  try {
    const pdfBuffer = await PDFService.generateBookingPDF(booking, event);
    
    const mailOptions = {
      from: `EventBooker <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: `🎫 Your Event Ticket - ${booking.referenceNumber}`,
      html: `
        <h2>Your Event Ticket</h2>
        <p>Please find your event ticket attached as a PDF.</p>
        <p><strong>Booking Reference:</strong> ${booking.referenceNumber}</p>
        <p>Show the QR code at the venue for entry.</p>
      `,
      attachments: [
        {
          filename: `ticket-${booking.referenceNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('PDF email error:', error);
    throw error;
  }
};