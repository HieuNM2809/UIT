const { applicationLogger } = require('../config/logger');

// 404 Not Found middleware
const notFound = (req, res, next) => {
  const message = `Route ${req.originalUrl} not found with method ${req.method}`;
  
  // Log the 404 error
  applicationLogger.api(`404 Not Found: ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  
  // Send 404 response
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      code: 'ROUTE_NOT_FOUND',
      details: {
        path: req.originalUrl,
        method: req.method,
        suggestion: 'Please check the API documentation for available endpoints'
      }
    },
    timestamp: new Date().toISOString(),
    availableRoutes: {
      authentication: {
        'POST /api/auth/login': 'User login',
        'POST /api/auth/register': 'User registration',
        'POST /api/auth/logout': 'User logout',
        'POST /api/auth/refresh': 'Refresh token',
        'POST /api/auth/forgot-password': 'Forgot password',
        'POST /api/auth/reset-password': 'Reset password'
      },
      users: {
        'GET /api/users': 'Get all users',
        'GET /api/users/:id': 'Get user by ID',
        'PUT /api/users/:id': 'Update user',
        'DELETE /api/users/:id': 'Delete user'
      },
      courses: {
        'GET /api/courses': 'Get all courses',
        'POST /api/courses': 'Create course',
        'GET /api/courses/:id': 'Get course by ID',
        'PUT /api/courses/:id': 'Update course',
        'DELETE /api/courses/:id': 'Delete course'
      },
      content: {
        'GET /api/content': 'Get all content',
        'POST /api/content': 'Create content',
        'GET /api/content/:id': 'Get content by ID',
        'PUT /api/content/:id': 'Update content',
        'DELETE /api/content/:id': 'Delete content'
      },
      statistics: {
        'GET /api/statistics': 'Get statistics',
        'GET /api/statistics/dashboard': 'Get dashboard data',
        'GET /api/statistics/reports': 'Get reports'
      },
      ai: {
        'POST /api/ai/chat': 'AI chatbot',
        'POST /api/ai/recommendations': 'Get AI recommendations',
        'POST /api/ai/analyze': 'AI analysis'
      },
      files: {
        'POST /api/files/upload': 'Upload files',
        'GET /api/files/:id': 'Get file',
        'DELETE /api/files/:id': 'Delete file'
      },
      utility: {
        'GET /health': 'Health check endpoint'
      }
    }
  });
};

module.exports = notFound;
