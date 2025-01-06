// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const Payment = require('../models/paymentModel');
const nodemailer = require('nodemailer');

const emailOtpStore = new Map();

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ggs699000@gmail.com',
    pass: 'ggxe sjmy hqyn byjp',
  },
});

router.post('/', async (req, res) => {
  const { product, quantity, paymentMethod, price, cardNumber, mobileNumber, address, expiryDate, cvv } = req.body;

  try {
    const newPayment = new Payment({
      product,
      quantity,
      paymentMethod,
      price,
      cardNumber,
      expiryDate,
      mobileNumber,
      address,
      cvv,
    });

    await newPayment.save();

    res.status(201).json({ message: 'Payment data stored successfully', payment: newPayment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error storing payment data', error });
  }
});

router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching payment data', error });
  }
});



// Continuing routes/paymentRoutes.js from where it left off...

router.post('/send-payment-otp', async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }
  
    try {
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP with 5-minute expiration
      emailOtpStore.set(email, {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000 
      });
      
      // Use existing transporter
      const mailOptions = {
        from: 'ggs699000@gmail.com',
        to: email,
        subject: 'Payment Verification OTP',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Payment Verification OTP</h2>
            <p>Your payment verification OTP is:</p>
            <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 5px; text-align: center; padding: 10px; background: #f5f5f5; border-radius: 5px;">${otp}</h1>
            <p><strong>This OTP will expire in 5 minutes.</strong></p>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">If you did not request this OTP, please ignore this email.</p>
          </div>
        `
      };
  
      await transport.sendMail(mailOptions);
      
      res.status(200).json({ 
        success: true, 
        message: 'OTP sent successfully'
      });
  
    } catch (error) {
      console.error('Error sending OTP:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send OTP. Please try again.' 
      });
    }
  });
  
  router.post('/verify-payment-otp', (req, res) => {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }
  
    const storedData = emailOtpStore.get(email);
    
    // Check if OTP exists
    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found for this email. Please request a new OTP.'
      });
    }
    
    // Check if OTP has expired
    if (Date.now() > storedData.expiresAt) {
      emailOtpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP.'
      });
    }
    
    // Verify OTP
    if (storedData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.'
      });
    }
    
    // Clear the OTP after successful verification
    emailOtpStore.delete(email);
    
    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  });
  
  // Cleanup expired OTPs periodically
  setInterval(() => {
    const now = Date.now();
    for (const [email, data] of emailOtpStore.entries()) {
      if (now > data.expiresAt) {
        emailOtpStore.delete(email);
      }
    }
  }, 5 * 60 * 1000); // Run every 5 minutes
  
  module.exports = router;