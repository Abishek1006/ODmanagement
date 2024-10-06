//models/user.model.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Role and department fields
  role: { 
    type: String, 
    enum: ['student', 'tutor', 'ac', 'hod', 'teacher'], 
    required: true 
  },
  department: { type: String, required: true },

  // For staff members (tutor, ac, hod, teacher)
  staffId: { type: String, unique: true }, // Unique ID for staff members
  
  // Student-specific fields
  rollNo: { type: String },  // Only required for students
  isLeader: { type: Boolean, default: false }, // Optional for students

  // Relationships for students
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Refers to a tutor
  acId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Refers to an Academic Coordinator
  hodId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Refers to a Head of Department

  // Courses that the student is taking
  courses: [
    {
      courseId: { type: String, required: true },
      teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Refers to the teacher
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
