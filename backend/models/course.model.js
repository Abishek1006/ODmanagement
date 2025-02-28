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


// Optimize course queries
courseSchema.index({ department: 1, semester: 1 });
courseSchema.index({ teachers: 1 });

module.exports = mongoose.model('Course', courseSchema);