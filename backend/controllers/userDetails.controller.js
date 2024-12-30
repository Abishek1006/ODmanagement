// controllers/userDetails.controller.js
const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const Course = require('../models/course.model');
const CourseEnrollment = require('../models/courseEnrollment.model');
const { protect, restrictToRole } = require('../middleware/auth.middleware');
exports.getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate({
      path: 'courses.courseId',
      select: 'courseName courseId department'
    })
    .populate({
      path: 'courses.teacherId',
      select: 'name email'
    });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Add role-specific data for teachers
  if (user.primaryRole === 'teacher') {
    const teacherCourses = await Course.find({ teachers: user._id });
    user.teachingCourses = teacherCourses;
  }

  res.json(user);
});


exports.addCourse = asyncHandler(async (req, res) => {
  const { courseId, teacherId, semester, academicYear } = req.body;
  
  // Verify course exists
  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Verify teacher exists and teaches this course
  const teacher = await User.findById(teacherId);
  if (!teacher || !course.teachers.includes(teacherId)) {
    res.status(400);
    throw new Error('Invalid teacher for this course');
  }

  // Create enrollment
  const enrollment = await CourseEnrollment.create({
    courseId,
    studentId: req.user._id,
    teacherId,
    semester,
    academicYear
  });

  const populatedEnrollment = await CourseEnrollment.findById(enrollment._id)
    .populate('courseId')
    .populate('teacherId', 'name email');

  res.status(201).json(populatedEnrollment);
});

exports.getEnrolledCourses = asyncHandler(async (req, res) => {
  console.log('Fetching enrolled courses for user:', req.user._id);
  const enrollments = await CourseEnrollment.find({ 
    studentId: req.user._id
  })
  .populate('courseId')
  .populate('teacherId', 'name email');

  console.log('Found enrollments:', enrollments);
  res.json(enrollments);
});


exports.deleteCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  
  // Delete the enrollment directly
  const result = await CourseEnrollment.findOneAndDelete({
    courseId,
    studentId: req.user._id
  });

  if (!result) {
    res.status(404);
    throw new Error('Course enrollment not found');
  }

  res.json({ message: 'Course deleted successfully' });
});

exports.addCourse = asyncHandler(async (req, res) => {
  const { courseId, teacherId, semester, academicYear } = req.body;
  
  // Verify course exists
  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Verify teacher exists and teaches this course
  const teacher = await User.findById(teacherId);
  if (!teacher || !course.teachers.includes(teacherId)) {
    res.status(400);
    throw new Error('Invalid teacher for this course');
  }

  // Create enrollment
  const enrollment = await CourseEnrollment.create({
    courseId,
    studentId: req.user._id,
    teacherId,
    semester,
    academicYear
  });

  const populatedEnrollment = await CourseEnrollment.findById(enrollment._id)
    .populate('courseId')
    .populate('teacherId', 'name email');

  res.status(201).json(populatedEnrollment);
});



exports.updateMentors = asyncHandler(async (req, res) => {
  const { tutorId, acId, hodId } = req.body;
  const user = await User.findById(req.user._id);
  
  if (tutorId) user.tutorId = tutorId;
  if (acId) user.acId = acId;
  if (hodId) user.hodId = hodId;
  
  const updatedUser = await user.save();
  
  const populatedUser = await User.findById(updatedUser._id)
    .populate('tutorId')
    .populate('acId')
    .populate('hodId');
    
  res.json(populatedUser);
});

exports.getCourseTeachers = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const course = await Course.findOne({ courseId }).populate('teachers');
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  res.json(course.teachers);
});

exports.getAllTeachers = asyncHandler(async (req, res) => {
  const teachers = await User.find({ primaryRole: 'teacher' }, 'name _id');
  res.json(teachers);
});

exports.updateUserDetails = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const updateData = req.body;

  // Prevent updating certain fields
  const fieldsToUpdate = {
    name: updateData.name,
    email: updateData.email,
    department: updateData.department,
    staffId: updateData.staffId
  };

  const user = await User.findByIdAndUpdate(
    userId, 
    { $set: fieldsToUpdate }, 
    { new: true, runValidators: true }
  )
  .populate('courses.courseId')
  .populate('tutorId')
  .populate('acId')
  .populate('hodId');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(user);
});
