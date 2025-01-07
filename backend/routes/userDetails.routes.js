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
  getEnrolledCourses,
  addTeachingCourse,
  removeTeachingCourse,
  getTeachingCourses
} = require('../controllers/userDetails.controller');

const router = express.Router();

router.put('/update-mentors', protect, updateMentors);
router.get('/', protect, getUserDetails);
router.put('/', protect, updateUserDetails);
router.post('/courses/enroll', protect, addCourse);
router.get('/courses/enrolled', protect, getEnrolledCourses);
router.delete('/courses/:courseId', protect, deleteCourse);
router.get('/course-teachers/:courseId', protect, getCourseTeachers);
router.get('/all-teachers', protect, getAllTeachers);

router.post('/teaching-courses/add', protect, restrictToRole(['teacher']), addTeachingCourse);
router.delete('/teaching-courses/:courseId', protect, restrictToRole(['teacher']), removeTeachingCourse);
router.get('/teaching-courses', protect, restrictToRole(['teacher']), getTeachingCourses);

module.exports = router;