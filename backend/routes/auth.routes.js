// routes/auth.route.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/auth.controller');
const router = express.Router();
const rateLimit = require('express-rate-limit');

// Add rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per IP
  message: 'Too many login attempts, please try again later'
});

router.post('/login', loginLimiter, loginUser);
router.post('/register', registerUser);

module.exports = router;
