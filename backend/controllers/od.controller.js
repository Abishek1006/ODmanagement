const OD = require('../models/od.model');
const User = require('../models/user.model');

// Create an OD request
exports.createODRequest = async (req, res) => {
  try {
    const { studentId, eventName, dateFrom, dateTo, reason } = req.body;

    // Create a new OD request
    const odRequest = await OD.create({
      studentId,
      eventName,
      dateFrom,
      dateTo,
      reason,
      status: 'pending', // Default status
      tutorId: req.user.tutorId, // Automatically set tutor ID from user context
      acId: req.user.acId, // Similarly for AC
      hodId: req.user.hodId // Similarly for HOD
    });

    res.status(201).json({ message: 'OD request created successfully', odRequest });
  } catch (error) {
    console.error('Error creating OD request:', error);
    res.status(400).json({ message: 'Error creating OD request', error });
  }
};


// Approve OD request
exports.approveODRequest = async (req, res) => {
  try {
    const odId = req.params.odId; // Extract odId directly

    const odRequest = await OD.findById(odId);
    if (!odRequest) return res.status(404).json({ message: 'OD request not found.' });

    // Check if the user is the tutor or next approver
    if (req.user._id.toString() !== odRequest.tutorId.toString() && req.user._id.toString() !== odRequest.acId?.toString() && req.user._id.toString() !== odRequest.hodId?.toString()) {
      return res.status(403).json({ message: 'You are not authorized to approve this OD request.' });
    }

    // Set approver ID
    if (!odRequest.tutorId) {
      odRequest.tutorId = req.user._id; // Set tutor if it is the first approval
    } else if (!odRequest.acId) {
      odRequest.acId = req.user._id; // Set AC if it is the second approval
    } else if (!odRequest.hodId) {
      odRequest.hodId = req.user._id; // Set HOD if it is the third approval
    }

    // Check if all approvers have approved
    if (odRequest.tutorId && odRequest.acId && odRequest.hodId) {
      odRequest.status = 'approved'; // Change status to approved if all have approved
    }

    await odRequest.save();
    res.status(200).json({ message: 'OD request approved successfully.', odRequest });
  } catch (error) {
    console.error('Error approving OD request:', error);
    res.status(500).json({ message: 'Server error during OD request approval' });
  }
};


// Reject OD request
exports.rejectODRequest = async (req, res) => {
  try {
    const odId = req.params.odId; // Extract odId directly

    const odRequest = await OD.findById(odId);
    if (!odRequest) return res.status(404).json({ message: 'OD request not found.' });

    // Check if the user is the tutor or next approver
    if (req.user._id.toString() !== odRequest.tutorId.toString() && req.user._id.toString() !== odRequest.acId?.toString() && req.user._id.toString() !== odRequest.hodId?.toString()) {
      return res.status(403).json({ message: 'You are not authorized to reject this OD request.' });
    }

    odRequest.status = 'rejected';

    await odRequest.save();
    res.status(200).json({ message: 'OD request rejected successfully.', odRequest });
  } catch (error) {
    console.error('Error rejecting OD request:', error);
    res.status(500).json({ message: 'Server error during OD request rejection' });
  }
};

// Get OD requests for a user
exports.getODRequests = async (req, res) => {
  try {
    const odRequests = await OD.find({ studentId: req.user._id }).populate('tutorId acId hodId');
    res.status(200).json(odRequests);
  } catch (error) {
    console.error('Error fetching OD requests:', error);
    res.status(500).json({ message: 'Server error during fetching OD requests' });
  }
};
