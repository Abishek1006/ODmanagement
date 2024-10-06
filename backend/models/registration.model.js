//e-od-system/backend/models/registration.model.js
const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['registered', 'cancelled'], default: 'registered' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Registration', registrationSchema);
