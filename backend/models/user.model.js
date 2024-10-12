//e-od-system/backend/models/user.model.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  primaryRole: { 
    type: String, 
    enum: ['student', 'teacher', 'tutor', 'ac', 'hod'], 
    required: true 
  },
  secondaryRoles: [{
    type: String,
    enum: ['teacher', 'tutor', 'ac', 'hod']
  }],
  department: { type: String, required: true },
  staffId: { type: String, unique: true },
  rollNo: { type: String },
  isLeader: { type: Boolean, default: false },
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  acId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hodId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  courses: [{
    courseId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    teacherIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User ' }]
  }],
  isAdmin: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);