const express = require('express');
const { protect, restrictToRole } = require('../middleware/auth.middleware');

const { 
  getUserDetails, 
  updateUserDetails,
  addCourse,
  deleteCourse,
  updateMentors,
  getCourseTeachers,
  getAllTeachers,
  getEnrolledCourses
} = require('../controllers/userDetails.controller');

const router = express.Router();

router.get('/', protect, getUserDetails);
router.put('/', protect, updateUserDetails);
router.post('/courses/enroll', protect, addCourse);
router.get('/courses/enrolled', protect, getEnrolledCourses);
router.delete('/courses/:courseId', protect, deleteCourse);
router.get('/course-teachers/:courseId', protect, getCourseTeachers);
router.get('/all-teachers', protect, getAllTeachers);


module.exports = router;