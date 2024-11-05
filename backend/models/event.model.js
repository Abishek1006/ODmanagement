//e-od-system/backend/models/event.model.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  prize: { type: String, required: true },
  entryFee: { type: Number, required: true },
  entryType: { type: String, enum: ['individual', 'team'], required: true },
  imageUrl: { type: String },
  details: { type: String }, // New field for comprehensive event details
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  registrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);

