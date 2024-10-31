// routes/USERdETAILS.route.js
const express = require('express');
const { getUserDetails, updateUserCourses, getTeacherCourses, updateTeacherCourses, getCourseTeachers } = require('../controllers/userDetails.controller');
const { protect, restrictToRole } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', protect, getUserDetails);
router.put('/courses', protect, updateUserCourses);
router.get('/teacher-courses', protect, restrictToRole(['teacher', 'tutor', 'ac', 'hod']), getTeacherCourses);
router.put('/teacher-courses', protect, restrictToRole(['teacher', 'tutor', 'ac', 'hod']), updateTeacherCourses);

router.get('/course-teachers/:courseId', protect, getCourseTeachers);
module.exports = router;

