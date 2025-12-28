const { validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors
 * Returns validation errors as flash messages and redirects
 */
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Get first error message
    const firstError = errors.array()[0];
    req.flash('error', firstError.msg);
    
    // Redirect based on the route
    if (req.path.includes('/login')) {
      return res.redirect('/auth/login');
    } else if (req.path.includes('/register')) {
      return res.redirect('/auth/register');
    }
    
    // Fallback: redirect back
    return res.redirect('back');
  }
  next();
};

/**
 * Middleware to handle validation errors for API routes
 * Returns JSON response with errors
 */
exports.handleValidationErrorsAPI = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: errors.array()
    });
  }
  next();
};

