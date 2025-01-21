// backend/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(401).json({ message: `Not authorized, token failed: ${error.message}` });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

exports.restrictToRole = (roles) => {
  return (req, res, next) => {
    const userRoles = [req.user.primaryRole, ...(req.user.secondaryRoles || [])];
    const hasRequiredRole = Array.isArray(roles) ? roles.some(role => userRoles.includes(role)) : userRoles.includes(roles);
    
    if (hasRequiredRole) {
      return next();
    }
    return res.status(403).json({ message: `Access restricted to ${Array.isArray(roles) ? roles.join(' or ') : roles} only.` });
  };
};

exports.restrictToLeaderOrAdmin = (req, res, next) => {
  if (req.user.isLeader || req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access restricted to leaders or admins only.' });
};

exports.restrictToAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    return next();
  }
  return res.status(403).json({ message: 'Access restricted to admins only.' });
};

exports.canCreateEvents = (req, res, next) => {
  const isTeacher = req.user.primaryRole === 'teacher' || 
                   req.user.secondaryRoles?.includes('teacher');
  const isLeader = req.user.isLeader;
  const isAdmin = req.user.isAdmin;

  if (isTeacher || isLeader || isAdmin) {
    return next();
  }
  return res.status(403).json({ message: 'Access restricted to teachers, leaders, or admins only.' });
};
