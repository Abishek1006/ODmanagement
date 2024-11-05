// controllers/userDetails.controller.js
const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const Course = require('../models/course.model');

exports.getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('courses.courseId')
    .populate('courses.teacherId')
    .populate('tutorId')
    .populate('acId')
    .populate('hodId');
  res.json(user);
});

exports.addCourse = asyncHandler(async (req, res) => {
  const { courseId, teacherId } = req.body;
  const user = await User.findById(req.user._id);
  
  user.courses.push({ courseId, teacherId });
  const updatedUser = await user.save();
  
  const populatedUser = await User.findById(updatedUser._id)
    .populate('courses.courseId')
    .populate('courses.teacherId');
    
  res.json(populatedUser);
});

exports.deleteCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const user = await User.findById(req.user._id);
  
  user.courses = user.courses.filter(course => course.courseId.toString() !== courseId);
  await user.save();
  
  res.json({ message: 'Course deleted successfully' });
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
