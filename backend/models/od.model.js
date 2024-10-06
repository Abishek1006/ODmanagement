const mongoose = require('mongoose');

const odSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventName: { type: String, required: true },
  dateFrom: { type: Date, required: true },
  dateTo: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  acId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hodId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // New field for approver ID
}, {
  timestamps: true,
});

module.exports = mongoose.model('OD', odSchema);
