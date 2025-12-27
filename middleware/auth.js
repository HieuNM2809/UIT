const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'studymate-jwt-secret';

// Middleware for web routes (session-based)
const requireLogin = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  
  req.flash('error', 'Bạn cần đăng nhập để truy cập trang này');
  res.redirect('/auth/login');
};

// Middleware for API routes (JWT-based)
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies.token;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or inactive user.'
      });
    }

    req.user = user;
    next();
    
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.session.user || !['admin', 'system_admin'].includes(req.session.user.role)) {
    req.flash('error', 'Bạn không có quyền truy cập trang này');
    return res.redirect('/dashboard');
  }
  next();
};

// Generate JWT token
const generateToken = (payload, expiresIn = '24h') => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

module.exports = {
  requireLogin,
  authenticate,
  requireAdmin,
  generateToken
};