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

// Remove explicit index definitions to avoid duplication
// userSchema.index({ email: 1 }, { unique: true });
// userSchema.index({ staffId: 1 }, { unique: true, sparse: true });
// userSchema.index({ rollNo: 1 }, { sparse: true });
// userSchema.index({ department: 1, primaryRole: 1 });
// userSchema.index({ 'courses.courseId': 1 });
// userSchema.index({ primaryRole: 1 });
// userSchema.index({ email: 1, primaryRole: 1 });

module.exports = mongoose.model('User', userSchema);
