const { logger } = require('../config/logger');

/**
 * Async handler wrapper - automatically catches errors from async route handlers
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Error handler for web requests
const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  // Check if it's an API request
  if (req.path.startsWith('/api/')) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? err : {}
    });
  }

  // Web request error
  const status = err.status || 500;
  const message = err.message || 'Đã xảy ra lỗi không mong muốn';

  if (status === 404) {
    return res.status(404).render('error', {
      title: 'Trang không tìm thấy',
      error: {
        status: 404,
        message: 'Trang bạn tìm kiếm không tồn tại'
      }
    });
  }

  res.status(status).render('error', {
    title: 'Lỗi hệ thống',
    error: {
      status,
      message,
      details: process.env.NODE_ENV === 'development' ? err.stack : null
    }
  });
};

module.exports = { errorHandler, asyncHandler };