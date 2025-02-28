const OD = require('../models/od.model');

const approvalFlow = async (req, res, next) => {
  const userRole = req.user.primaryRole;
  const od = await OD.findById(req.params.odId);

  const approvalOrder = ['tutor', 'ac', 'hod'];
  const currentIndex = approvalOrder.indexOf(userRole);
  const previousApprovals = approvalOrder.slice(0, currentIndex);

  const hasAllPreviousApprovals = previousApprovals.every(role => {
    const approvalField = `${role}Approval`;
    return od[approvalField] === true;
  });

  if (!hasAllPreviousApprovals) {
    return res.status(403).json({
      message: 'Previous level approval required'
    });
  }

  next();
};

const filterODRequests = async (req, res, next) => {
  const userRole = req.user.primaryRole;
  const currentDate = new Date();
  
  // Set time to start of the day (00:00:00) to include today's ODs
  currentDate.setHours(0, 0, 0, 0);

  // Create the end of the day (23:59:59) to ensure inclusivity
  const endDate = new Date(currentDate);
  endDate.setDate(endDate.getDate() + 1);

  // Base query to check date (including today)
  req.query.dateFrom = { $gte: currentDate, $lt: endDate };

  // Add role-based filters
  if (userRole === 'ac') {
    req.query.tutorApproval = true;
  } else if (userRole === 'hod') {
    req.query.tutorApproval = true;
    req.query.acApproval = true;
  }

  next();
};


module.exports = { approvalFlow, filterODRequests };