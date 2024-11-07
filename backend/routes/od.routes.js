// routes/od.route.js
const express = require('express');
const { createODRequest, approveODRequest, rejectODRequest, getODRequests, createImmediateODRequest, approveImmediateOD , getStudentsWithOD , createExternalODRequest} = require('../controllers/od.controller');
const { protect, restrictToRole } = require('../middleware/auth.middleware');

const router = express.Router();

router.route('/')
  .post(protect, createODRequest) // Create OD request
  .get(protect, getODRequests); // Get OD requests for the user

router.route('/:odId/approve')
  .patch(protect, approveODRequest); // Approve OD request

router.route('/:odId/reject')
  .patch(protect, rejectODRequest); // Reject OD request

  
router.post('/immediate', protect, createImmediateODRequest);
router.patch('/immediate/:odId/approve', protect, restrictToRole('hod'), approveImmediateOD);
router.get('/students-with-od', protect, restrictToRole(['teacher', 'hod','ac','tutor']), getStudentsWithOD);
router.post('/external', protect, createExternalODRequest);
module.exports = router;

