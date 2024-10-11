const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['OD_STATUS', 'EVENT_UPDATE'], required: true },
  read: { type: Boolean, default: false },
  relatedId: { type: mongoose.Schema.Types.ObjectId, refPath: 'onModel' },
  onModel: { type: String, enum: ['OD', 'Event'] }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
