// controllers/userDetails.controller.js
const User = require('../models/user.model');
const Course = require('../models/course.model');
const asyncHandler = require('express-async-handler');

exports.getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('courses.courseId')
    .populate('courses.teacherId')
    .populate('tutorId')
    .populate('acId')
    .populate('hodId');
  res.json(user);
});

exports.updateUserCourses = asyncHandler(async (req, res) => {
  const { courses } = req.body;
  const user = await User.findById(req.user._id);
  user.courses = courses;
  await user.save();
  res.json({ message: 'Courses updated successfully', courses: user.courses });
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

exports.getTeacherCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ teachers: req.user._id });
  res.json(courses);
});

exports.updateTeacherCourses = asyncHandler(async (req, res) => {
  const { courseIds } = req.body;
  await Course.updateMany({ teachers: req.user._id }, { $pull: { teachers: req.user._id } });
  await Course.updateMany({ _id: { $in: courseIds } }, { $addToSet: { teachers: req.user._id } });
  res.json({ message: 'Teacher courses updated successfully' });
});