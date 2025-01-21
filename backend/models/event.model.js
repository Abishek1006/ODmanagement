const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  prize: { type: String },
  entryFee: { type: Number },
  entryType: { type: String, enum: ['individual', 'team'], required: true },
  imageUrl: { type: String },
  details: { type: String },
  formLink: { type: String, required: true },
  deadline: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});
// Add TTL index to automatically delete events after 30 days
eventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

module.exports = mongoose.model('Event', eventSchema);