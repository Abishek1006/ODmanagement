// backend/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const protect = async (req, res, next) => {
  let token;
  
  console.log('Auth middleware - Cookies:', req.cookies);
  console.log('Auth middleware - Authorization header:', req.headers.authorization);

  // Check for token in cookies first
  if (req.cookies.token) {
    token = req.cookies.token;
    console.log('Token found in cookies');
  } 
  // Then check Authorization header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('Token found in Authorization header');
  }

  if (!token) {
    console.log('No token found in request');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified successfully');
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      console.log('User not found for token');
      return res.status(401).json({ message: 'User not found' });
    }
    
    console.log('User authenticated:', req.user._id);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};





// Restrict access to specified roles
const restrictToRole = (roles) => {
  return (req, res, next) => {
    const userRoles = [req.user.primaryRole, ...(req.user.secondaryRoles || [])];
    const hasRequiredRole = Array.isArray(roles)
      ? roles.some((role) => userRoles.includes(role))
      : userRoles.includes(roles);

    if (hasRequiredRole) {
      return next();
    }

    return res.status(403).json({
      message: `Access restricted to ${
        Array.isArray(roles) ? roles.join(' or ') : roles
      } only.`,
    });
  };
};

// Restrict access to leaders or admins
const restrictToLeaderOrAdmin = (req, res, next) => {
  if (req.user.isLeader || req.user.isAdmin) {
    return next();
  }

  return res.status(403).json({
    message: 'Access restricted to leaders or admins only.',
  });
};

// Restrict access to admins only
const restrictToAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    return next();
  }

  return res.status(403).json({
    message: 'Access restricted to admins only.',
  });
};

// Allow event creation by teachers, leaders, or admins
const canCreateEvents = (req, res, next) => {
  const isTeacher =
    req.user.primaryRole === 'teacher' ||
    req.user.secondaryRoles?.includes('teacher');
  const isLeader = req.user.isLeader;
  const isAdmin = req.user.isAdmin;

  if (isTeacher || isLeader || isAdmin) {
    return next();
  }

  return res.status(403).json({
    message: 'Access restricted to teachers, leaders, or admins only.',
  });
};

module.exports = {
  protect,
  restrictToRole,
  restrictToLeaderOrAdmin,
  restrictToAdmin,
  canCreateEvents,
};
