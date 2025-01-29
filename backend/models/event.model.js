const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  prize: { type: String },
  entryFee: { type: Number },
  entryType: { type: String },
  image: { type: String },
  details: { type: String },
  deadline: { type: Date },
  formLink: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);module.exports = mongoose.model('Event', eventSchema);