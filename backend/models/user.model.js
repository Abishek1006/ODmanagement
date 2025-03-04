//e-od-system/backend/models/user.model.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long']
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: { type: String, required: true },
  primaryRole: { 
    type: String, 
    enum: ['student', 'teacher', 'tutor', 'ac', 'hod'], 
    required: true 
  },
  semester: {
    type: String,
    enum: ['1', '2', '3', '4', '5', '6', '7', '8'],
    required: function() {
      return this.primaryRole === 'student';
    }
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
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  isAdmin: { type: Boolean, default: false },
  profilePicture: { type: String } // Store Base64 encoded image here
});

// Add performance-optimized indexes
userSchema.index({ email: 1 }, { unique: true }); // Fast email lookups for login
userSchema.index({ staffId: 1 }, { unique: true, sparse: true }); // Fast staff ID queries
userSchema.index({ rollNo: 1 }, { sparse: true }); // Fast student roll number queries
userSchema.index({ department: 1, primaryRole: 1 }); // Fast department + role filtering
userSchema.index({ 'courses.courseId': 1 }); // Fast course lookups
userSchema.index({ primaryRole: 1 }); // Fast role-based queries

// Add compound index for common auth patterns
userSchema.index({ email: 1, primaryRole: 1 });
module.exports = mongoose.model('User', userSchema);