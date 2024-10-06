const mongoose = require('mongoose');

// Student Schema
const studentSchema = new mongoose.Schema({
  rollNo: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
  isStudent: { type: Boolean, default: true },
  isLeader: { type: Boolean, default: false },
  tutorId: { type: String, required: true },
  acId: { type: String, required: true },
  hodId: { type: String, required: true },
  courses: [
    {
      courseId: { type: String, required: true },
      teacherId: { type: String, required: true }
    }
  ]
});

module.exports = mongoose.model('Student', studentSchema);
