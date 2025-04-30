// backend/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  // Check for token in HTTP-only cookies
  if (req.cookies.token) {
    token = req.cookies.token;
  }
  // Fallback to Authorization header
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Not authorized, token failed' });
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
