const express = require('express');
const { createCourse, getCourses } = require('../controllers/course.controller');
const { protect, restrictToAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

// Create a new course (admin only)
router.post('/', protect, restrictToAdmin, createCourse);

// Get all courses
router.get('/', protect, getCourses);

module.exports = router;