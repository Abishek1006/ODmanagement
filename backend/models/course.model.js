//models/course.model.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseId: { type: String, required: true, unique: true },
  courseName: { type: String, required: true },
  department: { type: String, required: true },
  teachers: [{ type: String }],  // List of teacher IDs
  students: [{ type: String }]  // List of student roll numbers
});

module.exports = mongoose.model('Course', courseSchema);
