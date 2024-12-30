const mongoose = require('mongoose');

const courseEnrollmentSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  semester: { type: String, required: true },
  academicYear: { type: String, required: true }
}, {
  timestamps: true
});

// Indexes for efficient queries
courseEnrollmentSchema.index({ courseId: 1, teacherId: 1 });
courseEnrollmentSchema.index({ studentId: 1 });

module.exports = mongoose.model('CourseEnrollment', courseEnrollmentSchema);
