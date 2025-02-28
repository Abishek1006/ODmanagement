// routes/od.route.js
const express = require('express');
const { createODRequest, approveODRequest, rejectODRequest, getODRequests, createImmediateODRequest, approveImmediateOD  ,  getTeacherODRequests, teacherODApproval , createExternalODRequest ,getODHistory,getRejectedODRequests,reconsiderODRequest,getEventStudentsWithOD } = require('../controllers/od.controller');
const { protect, restrictToRole  } = require('../middleware/auth.middleware');
const { approvalFlow } = require('../middleware/approval.middleware');

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
router.get('/rejected-requests', protect, getRejectedODRequests);
router.post('/:odId/reconsider', protect, reconsiderODRequest);

// Add this new route
router.get('/history', protect, getODHistory);

router.get('/event/:eventId/students', protect, getEventStudentsWithOD);
// Get OD requests for teacher
router.get('/teacher-requests', 
  protect, 
  restrictToRole(['tutor', 'ac', 'hod']),
  approvalFlow,
  getTeacherODRequests
);

router.patch('/:odId/teacher-approval',
  protect,
  restrictToRole(['tutor', 'ac', 'hod']),
  approvalFlow,
  teacherODApproval
);

module.exports = router;


