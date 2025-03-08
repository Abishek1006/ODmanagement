// routes/od.route.js
const express = require('express');
const { createODRequest, approveODRequest, rejectODRequest, getODRequests ,  getTeacherODRequests, 
  teacherODApproval , createExternalODRequest , getODHistory,getRejectedODRequests,reconsiderODRequest,
  getEventStudentsWithOD , getStudentSemesterReport , getStudentODDetails , downloadSemesterReportPDF} = require('../controllers/od.controller');
const { protect, restrictToRole   } = require('../middleware/auth.middleware');
const { approvalFlow , filterODRequests ,validateSemester } = require('../middleware/approval.middleware');
const router = express.Router();

router.route('/')
  .post(protect, createODRequest)
  .get(protect, getODRequests);

router.route('/:odId/approve')
  .patch(protect, approveODRequest); // Approve OD request

router.route('/:odId/reject')
  .patch(protect, rejectODRequest); // Reject OD request

router.post('/external', protect, createExternalODRequest);
router.get('/rejected-requests', protect, getRejectedODRequests);
router.post('/:odId/reconsider', protect, reconsiderODRequest);

// Add this new route
router.get('/history', protect, getODHistory);

router.get('/event/:eventId/students', protect, getEventStudentsWithOD);
// Get OD requests for teacher
router.get('/teacher-requests', 
  protect, 
  restrictToRole(['tutor', 'ac', 'hod']),
  filterODRequests,
  getTeacherODRequests
);

router.patch('/:odId/teacher-approval',
  protect,
  restrictToRole(['tutor', 'ac', 'hod']),
  approvalFlow,
  teacherODApproval
);

router.get('/student-semester-report', 
  protect, 
  restrictToRole(['tutor']),
  validateSemester,
  getStudentSemesterReport
);




router.get('/student-od-details/:studentId/:semester', 
  protect, 
  restrictToRole(['tutor']), 
  getStudentODDetails
);

router.get('/student-semester-report/:semester/download-pdf', 
  protect, 
  restrictToRole(['tutor']), 
  downloadSemesterReportPDF
);


module.exports = router;