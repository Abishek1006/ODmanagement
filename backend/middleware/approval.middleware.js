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

module.exports = { approvalFlow };
