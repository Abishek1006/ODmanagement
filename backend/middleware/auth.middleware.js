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

exports.restrictToRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: `Access restricted to ${role}s only.` });
    }
    next();
  };
};

exports.restrictToLeaderOrAdmin = (req, res, next) => {
  if (req.user.isLeader || req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access restricted to leaders or admins only.' });
};
