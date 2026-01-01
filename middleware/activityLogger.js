const elasticsearchService = require('../services/elasticsearchService');
const { applicationLogger } = require('../config/logger');

/**
 * Middleware to log user activities to Kibana/Elasticsearch only
 * Tracks each route with detailed information
 */
const logActivity = async (req, res, next) => {
  // Skip logging for certain routes
  const skipRoutes = ['/health', '/favicon.ico', '/static', '/assets', '/uploads', '/json', '/js'];
  if (skipRoutes.some(route => req.path.startsWith(route))) {
    return next();
  }

  // Store original end function
  const originalEnd = res.end;
  const startTime = Date.now();
  
  // Get route information
  const routeInfo = getRouteInfo(req);

  // Override end function to log after response
  res.end = function(chunk, encoding) {
    res.end = originalEnd;
    res.end(chunk, encoding);

    // Log activity asynchronously (don't block response)
    setImmediate(async () => {
      try {
        const userId = req.user?.id || req.session?.user?.id || null;
        const responseTime = Date.now() - startTime;

        const activityData = {
          user_id: userId,
          action: `${req.method} ${req.path}`,
          route_name: routeInfo.name,
          route_path: routeInfo.path,
          route_base: routeInfo.base,
          resource_type: routeInfo.resourceType,
          resource_id: req.params.id || null,
          ip_address: req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0],
          user_agent: req.get('user-agent'),
          session_id: req.sessionID || null,
          execution_time_ms: responseTime, // Top level for easy access in Kibana
          details: {
            method: req.method,
            original_url: req.originalUrl || req.url,
            path: req.path,
            base_url: req.baseUrl,
            route: req.route?.path || null,
            query: Object.keys(req.query).length > 0 ? req.query : null,
            params: Object.keys(req.params).length > 0 ? req.params : null,
            status_code: res.statusCode,
            response_time_ms: responseTime, // Also in details for backward compatibility
            content_length: res.get('content-length') || 0,
            content_type: res.get('content-type') || null,
            referer: req.get('referer') || null
          }
        };

        await elasticsearchService.logActivity(activityData);
      } catch (error) {
        applicationLogger.error('Error in activity logging middleware', error);
      }
    });
  };

  next();
};

/**
 * Get detailed route information
 */
function getRouteInfo(req) {
  const path = req.path;
  const baseUrl = req.baseUrl || '';
  const fullPath = baseUrl + path;
  
  // Determine route base and name
  let routeBase = '';
  let routeName = '';
  let resourceType = 'general';
  
  if (path.startsWith('/api/ai') || fullPath.startsWith('/api/ai')) {
    routeBase = '/api/ai';
    routeName = 'ai';
    resourceType = 'ai_interaction';
  } else if (path.startsWith('/api/courses') || fullPath.startsWith('/api/courses')) {
    routeBase = '/api/courses';
    routeName = 'api_courses';
    resourceType = 'course';
  } else if (path.startsWith('/api/content') || fullPath.startsWith('/api/content')) {
    routeBase = '/api/content';
    routeName = 'api_content';
    resourceType = 'content';
  } else if (path.startsWith('/api/statistics') || fullPath.startsWith('/api/statistics')) {
    routeBase = '/api/statistics';
    routeName = 'api_statistics';
    resourceType = 'statistics';
  } else if (path.startsWith('/api/files') || fullPath.startsWith('/api/files')) {
    routeBase = '/api/files';
    routeName = 'api_files';
    resourceType = 'file';
  } else if (path.startsWith('/api')) {
    routeBase = '/api';
    routeName = 'api';
    resourceType = 'api';
  } else if (path.startsWith('/courses') || fullPath.startsWith('/courses')) {
    routeBase = '/courses';
    routeName = 'courses';
    resourceType = 'course';
  } else if (path.startsWith('/blogs') || fullPath.startsWith('/blogs')) {
    routeBase = '/blogs';
    routeName = 'blogs';
    resourceType = 'blog';
  } else if (path.startsWith('/dashboard') || fullPath.startsWith('/dashboard')) {
    routeBase = '/dashboard';
    routeName = 'dashboard';
    resourceType = 'dashboard';
  } else if (path.startsWith('/profile') || fullPath.startsWith('/profile')) {
    routeBase = '/profile';
    routeName = 'profile';
    resourceType = 'profile';
  } else if (path.startsWith('/admin') || fullPath.startsWith('/admin')) {
    routeBase = '/admin';
    routeName = 'admin';
    resourceType = 'admin';
  } else if (path.startsWith('/auth') || fullPath.startsWith('/auth')) {
    routeBase = '/auth';
    routeName = 'auth';
    resourceType = 'authentication';
  } else if (path.startsWith('/chat') || fullPath.startsWith('/chat')) {
    routeBase = '/chat';
    routeName = 'chat';
    resourceType = 'chat';
  } else if (path.startsWith('/comments') || fullPath.startsWith('/comments')) {
    routeBase = '/comments';
    routeName = 'comments';
    resourceType = 'comment';
  } else if (path.startsWith('/info') || fullPath.startsWith('/info')) {
    routeBase = '/info';
    routeName = 'info';
    resourceType = 'info';
  } else if (path === '/' || path === '') {
    routeBase = '/';
    routeName = 'home';
    resourceType = 'home';
  }
  
  return {
    name: routeName,
    base: routeBase,
    path: fullPath,
    resourceType: resourceType
  };
}

/**
 * Manual activity logging function
 * Use this for specific activities that need explicit logging
 * Only logs to Elasticsearch/Kibana
 */
const logCustomActivity = async (req, activityType, details = {}) => {
  try { 
    const userId = req.user?.id || req.session?.user?.id || null;
    const routeInfo = getRouteInfo(req);

    const activityData = {
      user_id: userId,
      action: activityType,
      route_name: routeInfo.name,
      route_path: routeInfo.path,
      route_base: routeInfo.base,
      resource_type: details.resource_type || routeInfo.resourceType,
      resource_id: details.resource_id || req.params.id || null,
      ip_address: req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0],
      user_agent: req.get('user-agent'),
      session_id: req.sessionID || null,
      execution_time_ms: details.execution_time_ms || details.response_time_ms || null,
      details: {
        ...details,
        path: req.path,
        method: req.method,
        original_url: req.originalUrl || req.url
      }
    };

    // Log to Elasticsearch/Kibana only
    await elasticsearchService.logActivity(activityData);
  } catch (error) {
    applicationLogger.error('Error logging custom activity', error);
  }
};

module.exports = {
  logActivity,
  logCustomActivity
};

