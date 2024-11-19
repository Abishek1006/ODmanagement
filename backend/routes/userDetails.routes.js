const express = require('express');
const { 
  getUserDetails, 
  updateUserDetails,
  addCourse,
  deleteCourse,
  updateMentors,
  getCourseTeachers,
  getAllTeachers
} = require('../controllers/userDetails.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Core routes
router.get('/', protect, getUserDetails);
router.put('/', protect, updateUserDetails);
router.post('/courses', protect, addCourse);
router.delete('/courses/:courseId', protect, deleteCourse);
router.put('/mentors', protect, updateMentors);

// Teacher-related routes
router.get('/course-teachers/:courseId', protect, getCourseTeachers);
router.get('/all-teachers', protect, getAllTeachers);

module.exports = router;