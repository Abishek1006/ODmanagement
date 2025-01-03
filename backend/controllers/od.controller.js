// controllers/event.controller.js
const OD = require('../models/od.model');
const User = require('../models/user.model');

const Course = require('../models/course.model');
// Create an OD request
exports.createODRequest = async (req, res) => {
  try {
    const { studentId, eventName, dateFrom, dateTo, reason, tutorId, acId, hodId, isExternal, location, eventType } = req.body;

    // Ensure we have all required mentor IDs
    if (!tutorId || !acId || !hodId) {
      return res.status(400).json({ message: 'Missing mentor details' });
    }

    const odRequest = await OD.create({
      studentId,
      eventName,
      dateFrom,
      dateTo,
      reason,
      tutorId,
      acId,
      hodId,
      status: 'pending',
      isExternal: isExternal || false,
      location,
      eventType
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
    const odId = req.params.odId;

    const odRequest = await OD.findById(odId);
    if (!odRequest) return res.status(404).json({ message: 'OD request not found.' });

    // Check if the user is authorized to approve this request
    const userRole = req.user.primaryRole;
    if (!['tutor', 'ac', 'hod'].includes(userRole)) {
      return res.status(403).json({ message: 'You are not authorized to approve this OD request.' });
    }

    // Update the appropriate approval field based on the user's role
    if (userRole === 'tutor' && !odRequest.tutorApproval) {
      odRequest.tutorApproval = true;
      odRequest.tutorId = req.user._id;
    } else if (userRole === 'ac' && !odRequest.acApproval) {
      odRequest.acApproval = true;
      odRequest.acId = req.user._id;
    } else if (userRole === 'hod' && !odRequest.hodApproval) {
      odRequest.hodApproval = true;
      odRequest.hodId = req.user._id;
    } else {
      return res.status(400).json({ message: 'This approval has already been made or is not in the correct order.' });
    }

    // Check if all approvals have been made
    if (odRequest.tutorApproval && odRequest.acApproval && odRequest.hodApproval) {
      odRequest.status = 'approved';
    } else {
      odRequest.status = 'pending'; // Ensure it stays pending until all approve
    }

    await odRequest.save();

    // Create notification for the student
    await createNotification(
      odRequest.studentId,
      `Your OD request for ${odRequest.eventName} has been approved by ${userRole.toUpperCase()}`,
      'OD_STATUS',
      odRequest._id,
      'OD'
    );

    res.status(200).json({ message: 'OD request updated successfully.', odRequest });
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

    // Create notification for the student
    await createNotification(
      odRequest.studentId,
      `Your OD request for ${odRequest.eventName} has been rejected by ${req.user.role}`,
      'OD_STATUS',
      odRequest._id,
      'OD'
    );

    res.status(200).json({ message: 'OD request rejected successfully.', odRequest });
  } catch (error) {
    console.error('Error rejecting OD request:', error);
    res.status(500).json({ message: 'Server error during OD request rejection' });
  }
};

// Get OD requests for a user
// controllers/od.controller.js
exports.getODRequests = async (req, res) => {
  try {
    const odRequests = await OD.find({ studentId: req.user._id }).populate('tutorId acId hodId');
    res.json(odRequests);
  } catch (error) {
    console.error('Error fetching OD requests:', error);
    res.status(500).json({ message: 'Error fetching OD requests' });
  }
};
exports.createImmediateODRequest = async (req, res) => {
  try {
    const { studentId, eventName, dateFrom, dateTo, reason } = req.body;

    const odRequest = await OD.create({
      studentId,
      eventName,
      dateFrom,
      dateTo,
      reason,
      status: 'pending',
      isImmediate: true
    });

    // Notify HOD about immediate OD request
    await createNotification(
      req.user.hodId,
      `Immediate OD request from ${req.user.name} for ${eventName}`,
      'OD_STATUS',
      odRequest._id,
      'OD'
    );

    res.status(201).json({ message: 'Immediate OD request created successfully', odRequest });
  } catch (error) {
    console.error('Error creating immediate OD request:', error);
    res.status(400).json({ message: 'Error creating immediate OD request', error });
  }
};

exports.approveImmediateOD = async (req, res) => {
  try {
    const { odId } = req.params;
    const od = await OD.findById(odId);

    if (!od) {
      return res.status(404).json({ message: 'OD request not found.' });
    }

    if (!od.isImmediate) {
      return res.status(400).json({ message: 'This is not an immediate OD request.' });
    }

    od.status = 'approved';
    od.immediateApprover = req.user._id;
    od.immediateApprovalDate = new Date();
    await od.save();

    // Notify student about approval
    await createNotification(
      od.studentId,
      `Your immediate OD request for ${od.eventName} has been approved`,
      'OD_STATUS',
      od._id,
      'OD'
    );

    res.status(200).json({ message: 'Immediate OD request approved successfully', od });
  } catch (error) {
    console.error('Error approving immediate OD request:', error);
    res.status(400).json({ message: 'Error approving immediate OD request', error });
  }
};
exports.getStudentsWithOD = async (req, res) => {
  try {
    const { courseId } = req.query;
    console.log('Fetching students for course:', courseId);

    // Get course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Find students enrolled in this course
    const students = await User.find({
      'courses.courseId': courseId,
      primaryRole: 'student'
    });

    console.log('Found students:', students);

    // Get OD details for each student
    const studentsWithODDetails = await Promise.all(students.map(async (student) => {
      const odRequests = await OD.find({
        studentId: student._id,
        status: 'approved',
        dateFrom: { $lte: new Date() },
        dateTo: { $gte: new Date() }
      });

      console.log(`OD requests for student ${student.name}:`, odRequests);

      return {
        _id: student._id,
        name: student.name,
        rollNo: student.rollNo,
        department: student.department,
        odRequests: odRequests
      };
    }));

    const response = {
      courseName: course.courseName,
      courseId: course.courseId,
      students: studentsWithODDetails
    };

    console.log('Sending response:', response);
    res.json(response);

  } catch (error) {
    console.error('Detailed error in getStudentsWithOD:', error);
    res.status(500).json({ 
      message: 'Error fetching students data',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
exports.createExternalODRequest = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('tutorId acId hodId');
    const odRequest = await OD.create({
      studentId: req.user._id,
      ...req.body,
      tutorId: user.tutorId,
      acId: user.acId,
      hodId: user.hodId,
      status: 'pending',
      isExternal: true
    });
    res.status(201).json({ message: 'External OD request created successfully', odRequest });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error creating external OD request', error: error.message });
  }
};
exports.getTeacherODRequests = async (req, res) => {
  try {
    const teacherId = req.user._id;
    
    const odRequests = await OD.find({
      $or: [
        { tutorId: teacherId, status: 'pending' },
        { acId: teacherId, status: 'pending' },
        { hodId: teacherId, status: 'pending' }
      ]
    })
    .populate('studentId', 'name rollNo department');

    res.status(200).json(odRequests);
  } catch (error) {
    console.error('Error fetching teacher OD requests:', error);
    res.status(500).json({ message: 'Server error during OD request retrieval' });
  }
};

exports.teacherODApproval = async (req, res) => {
  try {
    const { odId } = req.params;
    const { status } = req.body;
    const teacherId = req.user._id;

    const odRequest = await OD.findById(odId);

    if (!odRequest) {
      return res.status(404).json({ message: 'OD request not found' });
    }

    // Determine approval based on teacher's role
    if (odRequest.tutorId.toString() === teacherId.toString()) {
      odRequest.tutorApproval = status === 'approved';
    } else if (odRequest.acId.toString() === teacherId.toString()) {
      odRequest.acApproval = status === 'approved';
    } else if (odRequest.hodId.toString() === teacherId.toString()) {
      odRequest.hodApproval = status === 'approved';
    } else {
      return res.status(403).json({ message: 'Unauthorized to approve this request' });
    }

    // Update overall status if all approvals are complete
    if (odRequest.tutorApproval && odRequest.acApproval && odRequest.hodApproval) {
      odRequest.status = 'approved';
    } else if (status === 'rejected') {
      odRequest.status = 'rejected';
    }

    await odRequest.save();

    // Create notification for student
    await createNotification(
      odRequest.studentId,
      `Your OD request for ${odRequest.eventName} has been ${status}`,
      'OD_STATUS',
      odRequest._id,
      'OD'
    );

    res.status(200).json(odRequest);
  } catch (error) {
    console.error('Error in OD approval:', error);
    res.status(500).json({ message: 'Server error during OD approval' });
  }
};
