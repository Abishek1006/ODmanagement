// controllers/userDetails.controller.js
const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const Course = require('../models/course.model');
const CourseEnrollment = require('../models/courseEnrollment.model');
const { protect, restrictToRole } = require('../middleware/auth.middleware');

const getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('tutorId', 'name email staffId')
    .populate('acId', 'name email staffId')
    .populate('hodId', 'name email staffId')
    .populate('courses.courseId')
    .populate('courses.teacherId')
    .lean();

  if (user.primaryRole === 'teacher') {
    const teachingCourses = await Course.find({ teachers: user._id });
    user.teachingCourses = teachingCourses;
  }

  res.json(user);
});

const addCourse = asyncHandler(async (req, res) => {
  const { courseId, teacherStaffId, semester, academicYear } = req.body;
  
  // Find course by courseId (like CS101)
  const course = await Course.findOne({ courseId: courseId });
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Find teacher by staffId
  const teacher = await User.findOne({ staffId: teacherStaffId });
  if (!teacher || !course.teachers.includes(teacher._id)) {
    res.status(400);
    throw new Error('Invalid teacher for this course');
  }

  // Create enrollment
  const enrollment = await CourseEnrollment.create({
    courseId: course._id,
    studentId: req.user._id,
    teacherId: teacher._id,
    semester,
    academicYear
  });

  const populatedEnrollment = await CourseEnrollment.findById(enrollment._id)
    .populate('courseId')
    .populate('teacherId', 'name email staffId');

  res.status(201).json(populatedEnrollment);
});


const getEnrolledCourses = asyncHandler(async (req, res) => {
  console.log('Fetching enrolled courses for user:', req.user._id);
  const enrollments = await CourseEnrollment.find({ 
    studentId: req.user._id
  })
  .populate('courseId')
  .populate('teacherId', 'name email');

  console.log('Found enrollments:', enrollments);
  res.json(enrollments);
});

const deleteCourse = asyncHandler(async (req, res) => {
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

const updateMentors = asyncHandler(async (req, res) => {
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

const getCourseTeachers = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const course = await Course.findOne({ courseId }).populate('teachers');
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  res.json(course.teachers);
});

const getAllTeachers = asyncHandler(async (req, res) => {
  const teachers = await User.find({
    $or: [
      { primaryRole: 'teacher' },
      { primaryRole: 'tutor' },
      { primaryRole: 'ac' },
      { primaryRole: 'hod' }
    ]
  }, 'name _id primaryRole');
  res.json(teachers);
});

const updateUserDetails = asyncHandler(async (req, res) => {
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

const addTeachingCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const teacherId = req.user._id;
  
  // Find course by courseId (like CS102)
  const course = await Course.findOne({ courseId: courseId });
  
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Add teacher to course's teachers array
  await Course.findByIdAndUpdate(course._id, {
    $addToSet: { teachers: teacherId }
  });

  // Also update user's courses array
  await User.findByIdAndUpdate(teacherId, {
    $addToSet: { 
      courses: {
        courseId: course._id,
        teacherId: teacherId
      }
    }
  });
  
  res.status(200).json({ message: 'Course added successfully' });
});

const removeTeachingCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const teacherId = req.user._id;
  
  await Course.findByIdAndUpdate(courseId, {
    $pull: { teachers: teacherId }
  });
  
  res.status(200).json({ message: 'Course removed successfully' });
});

const getTeachingCourses = asyncHandler(async (req, res) => {
  const teacherId = req.user._id;
  const courses = await Course.find({ teachers: teacherId });
  res.json(courses);
});

module.exports = {
  getUserDetails,
  updateUserDetails,
  addCourse,
  deleteCourse,
  updateMentors,
  getCourseTeachers,
  getAllTeachers,
  getEnrolledCourses,
  addTeachingCourse,
  removeTeachingCourse,
  getTeachingCourses
};
