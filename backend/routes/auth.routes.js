// routes/auth.route.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/auth.controller');
const router = express.Router();

// Register User Route
router.post('/register', registerUser);

// Login User Route
router.post('/login', loginUser);

module.exports = router;
