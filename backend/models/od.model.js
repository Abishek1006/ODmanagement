const mongoose = require('mongoose');

const odSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventName: { type: String, required: true },
  dateFrom: { type: Date, required: true },
  dateTo: { type: Date, required: true },
  startTime: { type: String, required: true }, // Add start time
  endTime: { type: String, required: true }, 
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  acId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hodId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tutorApproval: { type: Boolean, default: false },
  acApproval: { type: Boolean, default: false },
  hodApproval: { type: Boolean, default: false },
  isImmediate: { type: Boolean, default: false },
  isExternal: { type: Boolean, default: false },
  location: { type: String },
  eventType: { type: String },
  proof: { type: String, default: false },//verification proof- links
  immediateApprover: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  immediateApprovalDate: { type: Date },
  expiryDate: { type: Date },
  studentDetails: {
    name: { type: String },
    rollNo: { type: String },
    department: { type: String }
  }
}, { timestamps: true });

// Add pre-save middleware to set expiry date
odSchema.pre('save', function(next) {
  if (this.dateTo) {
    // Set expiry date to 30 days after dateTo
    this.expiryDate = new Date(this.dateTo.getTime() + (30 * 24 * 60 * 60 * 1000));
  }
  next();
});

// Add TTL index on expiryDate
odSchema.index({ expiryDate: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('OD', odSchema);
