const User = require('../models/user.model');
const Course = require('../models/course.model');
const asyncHandler = require('express-async-handler');

// User Management
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

exports.createUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    primaryRole,
    secondaryRoles,
    department,
    staffId,
    rollNo,
    isLeader
  } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    primaryRole,
    secondaryRoles: secondaryRoles || [],
    department,
    staffId: primaryRole !== 'student' ? staffId : undefined,
    rollNo: primaryRole === 'student' ? rollNo : undefined,
    isLeader: primaryRole === 'student' ? isLeader : false
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    primaryRole: user.primaryRole,
    department: user.department
  });
});
exports.updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  Object.assign(user, req.body);
  const updatedUser = await user.save();
  res.json(updatedUser);
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'User deleted successfully' });
});

// Course Management
exports.getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find().populate('teachers', 'name email');
  res.json(courses);
});

exports.createCourse = asyncHandler(async (req, res) => {
  const { courseId, courseName, department, semester, academicYear } = req.body;

  const courseExists = await Course.findOne({ courseId });
  if (courseExists) {
    res.status(400);
    throw new Error('Course ID already exists');
  }

  const course = await Course.create({
    courseId,
    courseName,
    department,
    semester,
    academicYear
  });

  res.status(201).json(course);
});

exports.updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  Object.assign(course, req.body);
  const updatedCourse = await course.save();
  res.json(updatedCourse);
});

exports.deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  await Course.findByIdAndDelete(req.params.id);
  res.json({ message: 'Course removed successfully' });
});

