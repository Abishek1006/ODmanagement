const Notification = require('../models/notification.model');
const asyncHandler = require('express-async-handler');

// Create a new notification
const createNotification = asyncHandler(async (userId, message, type, relatedId, onModel) => {
  const notification = new Notification({
    userId,
    message,
    type,
    relatedId,
    onModel
  });
  await notification.save();
  return notification;
});

// Get all notifications for a user
const getUserNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id }).sort('-createdAt');
  res.json(notifications);
});

// Mark a notification as read
const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (notification && notification.userId.toString() === req.user._id.toString()) {
    notification.read = true;
    await notification.save();
    res.json({ message: 'Notification marked as read' });
  } else {
    res.status(404);
    throw new Error('Notification not found or unauthorized');
  }
});

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead
};
