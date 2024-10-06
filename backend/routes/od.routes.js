const express = require('express');
const { createODRequest, approveODRequest, rejectODRequest, getODRequests } = require('../controllers/od.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.route('/')
  .post(protect, createODRequest) // Create OD request
  .get(protect, getODRequests); // Get OD requests for the user

router.route('/:odId/approve')
  .patch(protect, approveODRequest); // Approve OD request

router.route('/:odId/reject')
  .patch(protect, rejectODRequest); // Reject OD request

module.exports = router;
