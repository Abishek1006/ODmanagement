//e-od-system/backend/routes/user.routes.js
const express = require('express');
const { createUser } = require('../controllers/user.controller');
const router = express.Router();

// POST /api/users/create - Create a user (can be organizer or student)
router.post('/create', createUser);

module.exports = router;