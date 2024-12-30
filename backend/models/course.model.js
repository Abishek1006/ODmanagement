const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseId: { type: String, required: true, unique: true },
  courseName: { type: String, required: true },
  department: { type: String },
  teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  semester: { type: String },
  academicYear: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
