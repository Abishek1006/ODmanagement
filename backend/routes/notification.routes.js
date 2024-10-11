// routes/notification.route.js
const express = require('express');
const { getUserNotifications, markNotificationAsRead } = require('../controllers/notification.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', protect, getUserNotifications);
router.put('/:id', protect, markNotificationAsRead);

module.exports = router;
