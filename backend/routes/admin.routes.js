const express = require('express');
const router = express.Router();
const { protect, restrictToAdmin } = require('../middleware/auth.middleware');
const { 
  getAllUsers, 
  createUser, 
  updateUser, 
  deleteUser,
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/admin.controller');

router.use(protect);
router.use(restrictToAdmin);

// User management routes
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Course management routes
router.get('/courses', getAllCourses);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

module.exports = router;
