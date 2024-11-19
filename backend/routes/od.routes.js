// routes/od.route.js
const express = require('express');
const { createODRequest, approveODRequest, rejectODRequest, getODRequests, createImmediateODRequest, approveImmediateOD , getStudentsWithOD ,  getTeacherODRequests, teacherODApproval , createExternalODRequest } = require('../controllers/od.controller');
const { protect, restrictToRole } = require('../middleware/auth.middleware');

const router = express.Router();

router.route('/')
  .post(protect, createODRequest)
  .get(protect, getODRequests);

router.route('/:odId/approve')
  .patch(protect, approveODRequest); // Approve OD request

router.route('/:odId/reject')
  .patch(protect, rejectODRequest); // Reject OD request

  router.post('/external', protect, createExternalODRequest);
router.post('/immediate', protect, createImmediateODRequest);
router.patch('/immediate/:odId/approve', protect, restrictToRole('hod'), approveImmediateOD);
router.get('/students-with-od', protect, restrictToRole(['teacher', 'hod','ac','tutor']), getStudentsWithOD);

// Get OD requests for teacher
router.get('/teacher-requests', 
  protect, 
  restrictToRole(['tutor', 'ac', 'hod']), 
  getTeacherODRequests
);

// Approve/Reject OD request
router.patch('/:odId/teacher-approval', 
  protect, 
  restrictToRole(['tutor', 'ac', 'hod']), 
  teacherODApproval
);

module.exports = router;
