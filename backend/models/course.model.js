//e-od-system/backend/models/course.model.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseId: { type: String, required: true, unique: true },
  courseName: { type: String, required: true },
  department: { type: String, required: true },
  teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]  // List of teacher IDs
});

module.exports = mongoose.model('Course', courseSchema);
