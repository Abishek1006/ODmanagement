
// controllers/event.controller.js
const OD = require('../models/od.model');
const User = require('../models/user.model');
const Course = require('../models/course.model');
const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');

// Create an OD request
exports.createODRequest = async (req, res) => {
  try {
    const student = await User.findById(req.body.studentId);
    if (!student || !student.semester) {
      return res.status(400).json({
        message: 'Student semester not found'
      });
    }

    const odRequest = await OD.create({
      ...req.body,
      semester: student.semester,
      status: 'pending',
      isExternal: false
    });

    res.status(201).json({ 
      message: 'OD request created successfully', 
      odRequest 
    });
  } catch (error) {
    console.error('OD Creation Error:', error);
    res.status(400).json({ 
      message: 'Error creating OD request', 
      error: error.message 
    });
  }
};


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
      const odRequests = await OD.find({ studentId: req.user._id })
        .lean()
        .select('eventName dateFrom dateTo status')
        .sort({ dateFrom: -1 })
        .limit(50);
    
      res.json(odRequests);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching OD requests' });
    }
  };
// Add this new controller method
exports.getODHistory = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentTime = currentDate.toLocaleTimeString('en-US', { hour12: false });
    
    const historyRequests = await OD.find({
      studentId: req.user._id,
      $or: [
        { status: { $in: ['approved', 'rejected'] } },
        { 
          status: 'pending',
          $and: [
            { dateFrom: { $lte: currentDate } },
            { startTime: { $lte: currentTime } }
          ]
        }
      ]
    })
    .populate('tutorId acId hodId')
    .sort('-createdAt');

    res.json(historyRequests);
  }
   catch (error) {
    console.error('Error fetching OD history:', error);
    res.status(500).json({ message: 'Error fetching OD history' });
  }
};
exports.createExternalODRequest = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('tutorId acId hodId');
    
    if (!req.body.proof) {
      return res.status(400).json({ 
        message: 'Proof link is required for external OD requests' 
      });
    }

    const odRequest = await OD.create({
      studentId: req.user._id,
      ...req.body,
      tutorId: user.tutorId,
      acId: user.acId,
      hodId: user.hodId,
      status: 'pending',
      isExternal: true,
      proof: req.body.proof,
      semester: user.semester // Get semester from user details
    });
    
    res.status(201).json({ 
      message: 'External OD request created successfully', 
      odRequest 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      message: 'Error creating external OD request', 
      error: error.message 
    });
  }
};
exports.getTeacherODRequests = async (req, res) => {
  try {
    const userRole = req.user.primaryRole;
    const approvalField = `${userRole}Approval`;

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set to start of today

    const query = {
      [`${approvalField}`]: false,
      status: 'pending',
      dateFrom: { $gte: currentDate } // This includes today and future dates
    };

    // Add previous approval requirements
    if (userRole === 'ac') {
      query.tutorApproval = true;
    }
    if (userRole === 'hod') {
      query.tutorApproval = true;
      query.acApproval = true;
    }

    const requests = await OD.find(query)
      .populate('studentId', 'name rollNo department')
      .lean();

    res.json(requests);
  } catch (error) {
    console.error('Error fetching teacher OD requests:', error);
    res.status(500).json({ message: 'Server error during OD request retrieval' });
  }
};

exports.teacherODApproval = async (req, res) => {
  try {
    const { odId } = req.params;
    const { status } = req.body;
    const userRole = req.user.primaryRole;

    const odRequest = await OD.findById(odId);
    if (!odRequest) {
      return res.status(404).json({ message: 'OD request not found' });
    }

    // Enforce hierarchical approval
    if (userRole === 'ac' && !odRequest.tutorApproval) {
      return res.status(403).json({ message: 'Tutor approval required first' });
    }
    if (userRole === 'hod' && (!odRequest.tutorApproval || !odRequest.acApproval)) {
      return res.status(403).json({ message: 'Previous approvals required' });
    }

    // Update approvals
    if (userRole === 'tutor') {
      odRequest.tutorApproval = status === 'approved';
    } else if (userRole === 'ac' && odRequest.tutorApproval) {
      odRequest.acApproval = status === 'approved';
    } else if (userRole === 'hod' && odRequest.tutorApproval && odRequest.acApproval) {
      odRequest.hodApproval = status === 'approved';
    }

    // Update final status
    if (status === 'rejected') {
      odRequest.status = 'rejected';
    } else if (odRequest.tutorApproval && odRequest.acApproval && odRequest.hodApproval) {
      odRequest.status = 'approved';
    }

    await odRequest.save();
    res.status(200).json(odRequest);
  } catch (error) {
    console.error('Error in OD approval:', error);
    res.status(500).json({ message: 'Server error during OD approval' });
  }
};
exports.getRejectedODRequests = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today
    
    const rejectedRequests = await OD.find({
      $or: [
        { tutorId: teacherId, status: 'rejected' },
        { acId: teacherId, status: 'rejected' },
        { hodId: teacherId, status: 'rejected' }
      ],
      dateFrom: { $gte: today } // Only show ODs where event hasn't started yet
    })
    .populate('studentId', 'name rollNo department')
    .sort('-createdAt')
    .lean(); // Added lean() for better performance

    res.status(200).json(rejectedRequests);
  } catch (error) {
    console.error('Error fetching rejected OD requests:', error);
    res.status(500).json({ message: 'Server error during rejected OD request retrieval' });
  }
};
exports.reconsiderODRequest = async (req, res) => {
  try {
    const { odId } = req.params;
    const teacherId = req.user._id;

    const odRequest = await OD.findById(odId);
    if (!odRequest) {
      return res.status(404).json({ message: 'OD request not found' });
    }

    // Reset the approval status for this teacher
    if (odRequest.tutorId.toString() === teacherId.toString()) {
      odRequest.tutorApproval = false;
    } else if (odRequest.acId.toString() === teacherId.toString()) {
      odRequest.acApproval = false;
    } else if (odRequest.hodId.toString() === teacherId.toString()) {
      odRequest.hodApproval = false;
    }

    // Reset overall status to pending
    odRequest.status = 'pending';
    await odRequest.save();

    res.status(200).json(odRequest);
  } catch (error) {
    console.error('Error reconsidering OD request:', error);
    res.status(500).json({ message: 'Server error during OD reconsideration' });
  }
};
exports.getEventStudentsWithOD = async (req, res) => {
  try {
    const { eventId } = req.params;
    console.log('Backend received request for event:', eventId);
    
    const odRequests = await OD.find({ eventName: eventId })
      .select('status studentId')
      .populate('studentId', 'name rollNo department')
      .lean();

    console.log('Found OD requests:', odRequests);
    
    const studentsWithODDetails = odRequests.map(od => ({
      studentName: od.studentId?.name,
      rollNo: od.studentId?.rollNo,
      department: od.studentId?.department,
      odStatus: od.status
    }));

    console.log('Sending response:', studentsWithODDetails);
    res.json(studentsWithODDetails);
  } catch (error) {
    console.error('Backend error:', error);
    res.status(500).json({ message: 'Error fetching students data' });
  }
};

exports.getStudentSemesterReport = async (req, res) => {
  try {
    const tutorId = req.user._id;
    const semester = req.query.semester;

    // Validate semester input
    const validSemesters = ['1', '2', '3', '4', '5', '6', '7', '8'];
    if (!validSemesters.includes(semester)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid semester value'
      });
    }

    // Use validated inputs in aggregation pipeline
    const odReport = await OD.aggregate([
      {
        $match: {
          tutorId: new mongoose.Types.ObjectId(String(tutorId)),
          semester: semester,
          status: 'approved'
        }
      },
      {
        $addFields: {
          startHour: { $toInt: { $substr: ["$startTime", 0, 2] } },
          endHour: { $toInt: { $substr: ["$endTime", 0, 2] } },
          dateDifference: {
            $divide: [
              { $subtract: ["$dateTo", "$dateFrom"] },
              1000 * 60 * 60 * 24
            ]
          }
        }
      },
      {
        $addFields: {
          hoursPerDay: { $subtract: ["$endHour", "$startHour"] },
          totalDays: { $add: ["$dateDifference", 1] }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'studentId',
          foreignField: '_id',
          as: 'studentDetails'
        }
      },
      {
        $unwind: '$studentDetails'
      },
      {
        $group: {
          _id: '$studentId',
          studentName: { $first: '$studentDetails.name' },
          rollNo: { $first: '$studentDetails.rollNo' },
          department: { $first: '$studentDetails.department' },
          approvedODs: { $sum: 1 },
          totalHours: { 
            $sum: { 
              $multiply: ["$hoursPerDay", "$totalDays"] 
            } 
          }
        }
      },
      { $sort: { 'rollNo': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: odReport
    });
  } catch (error) {
    console.error('Error generating semester report:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating semester report'
    });
  }
};
exports.getStudentODDetails = async (req, res) => {
  try {
    const { studentId, semester } = req.params;
    const tutorId = req.user._id;

    const odDetails = await OD.find({
      studentId: studentId,
      tutorId: tutorId,
      semester: semester,
      status: 'approved'
    })
    .select('eventName dateFrom dateTo startTime endTime location reason')
    .sort('-dateFrom');

    res.json({
      success: true,
      data: odDetails
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student OD details'
    });
  }
};


exports.downloadSemesterReportPDF = async (req, res) => {
  try {
    const tutorId = req.user._id;
    const { semester } = req.params;

    // Get the report data using the same aggregation pipeline as your view
    const odReport = await OD.aggregate([
      {
        $match: {
          tutorId: new mongoose.Types.ObjectId(String(tutorId)),
          semester: semester,
          status: 'approved'
        }
      },
      {
        $addFields: {
          startHour: { $toInt: { $substr: ["$startTime", 0, 2] } },
          endHour: { $toInt: { $substr: ["$endTime", 0, 2] } },
          dateDifference: {
            $divide: [
              { $subtract: ["$dateTo", "$dateFrom"] },
              1000 * 60 * 60 * 24
            ]
          }
        }
      },
      {
        $addFields: {
          hoursPerDay: { $subtract: ["$endHour", "$startHour"] },
          totalDays: { $add: ["$dateDifference", 1] }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'studentId',
          foreignField: '_id',
          as: 'studentDetails'
        }
      },
      {
        $unwind: '$studentDetails'
      },
      {
        $group: {
          _id: '$studentId',
          studentName: { $first: '$studentDetails.name' },
          rollNo: { $first: '$studentDetails.rollNo' },
          department: { $first: '$studentDetails.department' },
          approvedODs: { $sum: 1 },
          totalHours: { 
            $sum: { 
              $multiply: ["$hoursPerDay", "$totalDays"] 
            } 
          }
        }
      },
      { $sort: { 'rollNo': 1 } }
    ]);

    const doc = new PDFDocument({ margin: 50 }); // Added margins for better spacing
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=semester_${semester}_report.pdf`);
    
    doc.pipe(res);

    // Add title
    doc.fontSize(20).text('Semester OD Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Semester: ${semester}`, { align: 'center' });
    doc.moveDown();

    // Define table layout
    const startX = 50;
    const columnWidths = [80, 180, 120, 80, 80]; // Adjusted widths
    const columnPositions = columnWidths.reduce((acc, width, i) => {
      acc.push((acc[i - 1] || startX) + width);
      return acc;
    }, []);

    const tableTop = 150;

    // Draw table headers with proper spacing
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('Roll No', startX, tableTop);
    doc.text('Name', columnPositions[0], tableTop);
    doc.text('Department', columnPositions[1], tableTop);
    doc.text('ODs', columnPositions[2], tableTop);
    doc.text('Hours', columnPositions[3], tableTop);
    
    doc.moveDown(0.5);

    let yPosition = tableTop + 25;

    // Draw table data with proper spacing
    doc.font('Helvetica');
    odReport.forEach((student) => {
      if (yPosition > 700) {
        doc.addPage();
        yPosition = 50;
      }

      doc.text(student.rollNo, startX, yPosition);

      // Wrap long names into two lines
      const nameWidth = columnWidths[1] - 10;
      const studentName = doc.widthOfString(student.studentName) > nameWidth
        ? doc.text(student.studentName, columnPositions[0], yPosition, { width: nameWidth, lineBreak: true })
        : doc.text(student.studentName, columnPositions[0], yPosition);

      doc.text(student.department, columnPositions[1], yPosition);
      doc.text(student.approvedODs.toString(), columnPositions[2], yPosition);
      doc.text(Math.round(student.totalHours).toString(), columnPositions[3], yPosition);

      yPosition += 30; // More spacing to prevent overlap
    });

    doc.end();

  } catch (error) {
    console.error('Error generating PDF:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Error generating PDF report'
      });
    }
  }
};