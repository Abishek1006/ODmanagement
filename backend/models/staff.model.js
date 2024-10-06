const mongoose = require('mongoose');

// Staff Schema
const staffSchema = new mongoose.Schema({
  staffId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  isStudent: { type: Boolean, default: false },
  isStaff: { type: Boolean, default: true },
  role: { type: String, enum: ['teacher', 'tutor', 'ac', 'hod'], required: true },
  courses: [
    {
      courseId: { type: String, required: true },
      students: [{ type: String }]
    }
  ]
});

module.exports = mongoose.model('Staff', staffSchema);
