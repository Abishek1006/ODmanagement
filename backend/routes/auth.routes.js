// routes/auth.route.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/auth.controller');
const router = express.Router();
const rateLimit = require('express-rate-limit');

// Add rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per IP
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Add logout route
router.get('/logout', (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'production',
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

router.post('/login', loginLimiter, loginUser);
router.post('/register', registerUser);

module.exports = router;
