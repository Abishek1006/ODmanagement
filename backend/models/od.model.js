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
  tutorApproval: { type: Boolean, default: false },
  acApproval: { type: Boolean, default: false },
  hodApproval: { type: Boolean, default: false },
  isImmediate: { type: Boolean, default: false },
  immediateApprover: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  immediateApprovalDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('OD', odSchema);