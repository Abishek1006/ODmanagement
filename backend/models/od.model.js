const mongoose = require('mongoose');

const odSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventName: { type: String, required: true },
  dateFrom: { type: Date, required: true },
  dateTo: { type: Date, required: true },
  startTime: { type: String, required: true },
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
  proof: { type: String, default: false },
  immediateApprover: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  immediateApprovalDate: { type: Date },
  expiryDate: { type: Date },
  studentDetails: {
    name: { type: String },
    rollNo: { type: String },
    department: { type: String }
  },
  approvalSequence: [{
    role: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'] },
    timestamp: Date
  }]
}, { timestamps: true });

// Add method to check approval eligibility
odSchema.methods.canBeApprovedBy = function(userRole) {
  if (userRole === 'tutor') return true;
  if (userRole === 'ac') return this.tutorApproval;
  if (userRole === 'hod') return this.tutorApproval && this.acApproval;
  return false;
};
// Add pre-save middleware to set expiry date
odSchema.pre('save', function(next) {
  if (this.dateTo) {
    // Set expiry date to 30 days after dateTo
    this.expiryDate = new Date(this.dateTo.getTime() + (30 * 24 * 60 * 60 * 1000));
  }
  next();
});

// Add TTL index on expiryDate
odSchema.index({ eventName: 1 });
odSchema.index({ expiryDate: 1 }, { expireAfterSeconds: 0 });
// Optimize OD model with compound indexes
odSchema.index({ studentId: 1, dateFrom: -1, status: 1 });
odSchema.index({ tutorId: 1, status: 1, dateFrom: -1 });
odSchema.index({ acId: 1, status: 1, dateFrom: -1 });
odSchema.index({ hodId: 1, status: 1, dateFrom: -1 });
odSchema.index({ department: 1, dateFrom: -1 });
module.exports = mongoose.model('OD', odSchema);
