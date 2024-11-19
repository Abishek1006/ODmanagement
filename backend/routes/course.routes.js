// routes/course.route.js
const express = require('express');
const { createCourse, getCourses, getStudentsWithOD, getTeacherCourses, getCourseById } = require('../controllers/course.controller');
const { protect, restrictToAdmin, restrictToRole } = require('../middleware/auth.middleware');

const router = express.Router();

// Create a new course (admin only)
router.post('/', protect, restrictToAdmin, createCourse);

// Get all courses
router.get('/', protect, getCourses);
// routes/course.routes.js
router.get('/teacher-courses', 
  protect, 
  restrictToRole(['teacher', 'tutor', 'ac', 'hod']), 
  getTeacherCourses
);
router.get('/:courseId/students-with-od', protect, getStudentsWithOD);

// Add this new route
router.get('/search/:courseId', protect, getCourseById);module.exports = router;