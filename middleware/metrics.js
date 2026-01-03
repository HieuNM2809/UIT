const client = require('prom-client');
const { applicationLogger } = require('../config/logger');

// Tạo Registry mới cho metrics
const register = new client.Registry();

// Thêm default metrics (CPU, memory, event loop, etc.)
client.collectDefaultMetrics({
  register,
  prefix: 'studymate_',
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5]
});

// HTTP Request Metrics
const httpRequestDuration = new client.Histogram({
  name: 'studymate_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const httpRequestTotal = new client.Counter({
  name: 'studymate_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const httpRequestSize = new client.Histogram({
  name: 'studymate_http_request_size_bytes',
  help: 'Size of HTTP requests in bytes',
  labelNames: ['method', 'route'],
  buckets: [100, 1000, 5000, 10000, 50000, 100000, 500000]
});

const httpResponseSize = new client.Histogram({
  name: 'studymate_http_response_size_bytes',
  help: 'Size of HTTP responses in bytes',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [100, 1000, 5000, 10000, 50000, 100000, 500000, 1000000]
});

// Database Metrics
const dbQueryDuration = new client.Histogram({
  name: 'studymate_db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'model'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5]
});

const dbQueryTotal = new client.Counter({
  name: 'studymate_db_queries_total',
  help: 'Total number of database queries',
  labelNames: ['operation', 'model', 'status']
});

// Redis Metrics
const redisOperationDuration = new client.Histogram({
  name: 'studymate_redis_operation_duration_seconds',
  help: 'Duration of Redis operations in seconds',
  labelNames: ['operation'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1]
});

const redisOperationTotal = new client.Counter({
  name: 'studymate_redis_operations_total',
  help: 'Total number of Redis operations',
  labelNames: ['operation', 'status']
});

// Socket.IO Metrics
const socketConnections = new client.Gauge({
  name: 'studymate_socket_connections',
  help: 'Current number of Socket.IO connections'
});

const socketMessagesTotal = new client.Counter({
  name: 'studymate_socket_messages_total',
  help: 'Total number of Socket.IO messages',
  labelNames: ['event', 'status']
});

// AI Service Metrics
const aiRequestDuration = new client.Histogram({
  name: 'studymate_ai_request_duration_seconds',
  help: 'Duration of AI API requests in seconds',
  labelNames: ['provider', 'operation'],
  buckets: [0.5, 1, 2, 5, 10, 20, 30, 60]
});

const aiRequestTotal = new client.Counter({
  name: 'studymate_ai_requests_total',
  help: 'Total number of AI API requests',
  labelNames: ['provider', 'operation', 'status']
});

const aiTokensUsed = new client.Counter({
  name: 'studymate_ai_tokens_total',
  help: 'Total number of AI tokens used',
  labelNames: ['provider', 'type'] // type: prompt, completion, total
});

// Business Logic Metrics
const courseEnrollments = new client.Counter({
  name: 'studymate_course_enrollments_total',
  help: 'Total number of course enrollments',
  labelNames: ['course_id', 'status']
});

const contentCompletions = new client.Counter({
  name: 'studymate_content_completions_total',
  help: 'Total number of content completions',
  labelNames: ['content_id', 'course_id']
});

const activeUsers = new client.Gauge({
  name: 'studymate_active_users',
  help: 'Current number of active users'
});

// Error Metrics
const errorsTotal = new client.Counter({
  name: 'studymate_errors_total',
  help: 'Total number of errors',
  labelNames: ['type', 'route', 'status_code']
});

// Reports/Statistics Metrics
const reportsRequestTotal = new client.Counter({
  name: 'studymate_reports_requests_total',
  help: 'Total number of reports/statistics requests',
  labelNames: ['endpoint', 'user_id']
});

const reportsRequestDuration = new client.Histogram({
  name: 'studymate_reports_request_duration_seconds',
  help: 'Duration of reports/statistics requests in seconds',
  labelNames: ['endpoint'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 2, 5]
});

// Learning Statistics Metrics (Gauges - current values)
const totalCourses = new client.Gauge({
  name: 'studymate_user_total_courses',
  help: 'Total number of courses enrolled by user',
  labelNames: ['user_id']
});

const activeCourses = new client.Gauge({
  name: 'studymate_user_active_courses',
  help: 'Number of active courses for user',
  labelNames: ['user_id']
});

const completedCourses = new client.Gauge({
  name: 'studymate_user_completed_courses',
  help: 'Number of completed courses for user',
  labelNames: ['user_id']
});

const totalTimeSpent = new client.Gauge({
  name: 'studymate_user_total_time_spent_seconds',
  help: 'Total time spent learning by user in seconds',
  labelNames: ['user_id']
});

const averageProgress = new client.Gauge({
  name: 'studymate_user_average_progress_percent',
  help: 'Average progress percentage across all courses for user',
  labelNames: ['user_id']
});

// Global Statistics Metrics (aggregated)
const globalTotalCourses = new client.Gauge({
  name: 'studymate_global_total_courses',
  help: 'Total number of courses in system'
});

const globalTotalEnrollments = new client.Gauge({
  name: 'studymate_global_total_enrollments',
  help: 'Total number of enrollments in system'
});

const globalActiveEnrollments = new client.Gauge({
  name: 'studymate_global_active_enrollments',
  help: 'Total number of active enrollments'
});

const globalCompletedEnrollments = new client.Gauge({
  name: 'studymate_global_completed_enrollments',
  help: 'Total number of completed enrollments'
});

const globalTotalUsers = new client.Gauge({
  name: 'studymate_global_total_users',
  help: 'Total number of users in system'
});

// Đăng ký tất cả metrics vào registry
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(httpRequestSize);
register.registerMetric(httpResponseSize);
register.registerMetric(dbQueryDuration);
register.registerMetric(dbQueryTotal);
register.registerMetric(redisOperationDuration);
register.registerMetric(redisOperationTotal);
register.registerMetric(socketConnections);
register.registerMetric(socketMessagesTotal);
register.registerMetric(aiRequestDuration);
register.registerMetric(aiRequestTotal);
register.registerMetric(aiTokensUsed);
register.registerMetric(courseEnrollments);
register.registerMetric(contentCompletions);
register.registerMetric(activeUsers);
register.registerMetric(errorsTotal);
register.registerMetric(reportsRequestTotal);
register.registerMetric(reportsRequestDuration);
register.registerMetric(totalCourses);
register.registerMetric(activeCourses);
register.registerMetric(completedCourses);
register.registerMetric(totalTimeSpent);
register.registerMetric(averageProgress);
register.registerMetric(globalTotalCourses);
register.registerMetric(globalTotalEnrollments);
register.registerMetric(globalActiveEnrollments);
register.registerMetric(globalCompletedEnrollments);
register.registerMetric(globalTotalUsers);

// Middleware để đo lường HTTP requests
const metricsMiddleware = (req, res, next) => {
  const startTime = Date.now();
  const route = req.route ? req.route.path : req.path;
  
  // Bỏ qua metrics endpoint để tránh loop
  if (route === '/metrics') {
    return next();
  }

  // Đo kích thước request
  const requestSize = req.headers['content-length'] 
    ? parseInt(req.headers['content-length'], 10) 
    : 0;

  // Ghi lại kích thước request
  httpRequestSize.observe({ method: req.method, route }, requestSize);

  // Override res.end để đo response time và size
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = (Date.now() - startTime) / 1000;
    const statusCode = res.statusCode;
    const responseSize = res.get('content-length') 
      ? parseInt(res.get('content-length'), 10) 
      : (chunk ? Buffer.byteLength(chunk, encoding) : 0);

    // Ghi metrics
    httpRequestDuration.observe({ 
      method: req.method, 
      route, 
      status_code: statusCode 
    }, duration);

    httpRequestTotal.inc({ 
      method: req.method, 
      route, 
      status_code: statusCode 
    });

    httpResponseSize.observe({ 
      method: req.method, 
      route, 
      status_code: statusCode 
    }, responseSize);

    // Ghi lỗi nếu có
    if (statusCode >= 400) {
      errorsTotal.inc({ 
        type: 'http_error', 
        route, 
        status_code: statusCode 
      });
    }

    // Gọi original end
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

// Helper functions để ghi metrics từ các phần khác của ứng dụng
const metrics = {
  // HTTP Metrics
  recordHttpRequest: (method, route, statusCode, duration, requestSize, responseSize) => {
    httpRequestDuration.observe({ method, route, status_code: statusCode }, duration);
    httpRequestTotal.inc({ method, route, status_code: statusCode });
    if (requestSize) httpRequestSize.observe({ method, route }, requestSize);
    if (responseSize) httpResponseSize.observe({ method, route, status_code: statusCode }, responseSize);
  },

  // Database Metrics
  recordDbQuery: (operation, model, duration, status = 'success') => {
    dbQueryDuration.observe({ operation, model }, duration);
    dbQueryTotal.inc({ operation, model, status });
  },

  // Redis Metrics
  recordRedisOperation: (operation, duration, status = 'success') => {
    redisOperationDuration.observe({ operation }, duration);
    redisOperationTotal.inc({ operation, status });
  },

  // Socket.IO Metrics
  setSocketConnections: (count) => {
    socketConnections.set(count);
  },

  recordSocketMessage: (event, status = 'success') => {
    socketMessagesTotal.inc({ event, status });
  },

  // AI Metrics
  recordAIRequest: (provider, operation, duration, status = 'success') => {
    aiRequestDuration.observe({ provider, operation }, duration);
    aiRequestTotal.inc({ provider, operation, status });
  },

  recordAITokens: (provider, promptTokens, completionTokens) => {
    if (promptTokens) aiTokensUsed.inc({ provider, type: 'prompt' }, promptTokens);
    if (completionTokens) aiTokensUsed.inc({ provider, type: 'completion' }, completionTokens);
    if (promptTokens && completionTokens) {
      aiTokensUsed.inc({ provider, type: 'total' }, promptTokens + completionTokens);
    }
  },

  // Business Metrics
  recordCourseEnrollment: (courseId, status = 'success') => {
    courseEnrollments.inc({ course_id: courseId, status });
  },

  recordContentCompletion: (contentId, courseId) => {
    contentCompletions.inc({ content_id: contentId, course_id: courseId });
  },

  setActiveUsers: (count) => {
    activeUsers.set(count);
  },

  // Error Metrics
  recordError: (type, route, statusCode) => {
    errorsTotal.inc({ type, route, status_code: statusCode });
  },

  // Reports/Statistics Metrics
  recordReportsRequest: (endpoint, userId, duration) => {
    reportsRequestTotal.inc({ endpoint, user_id: userId || 'anonymous' });
    if (duration !== undefined) {
      reportsRequestDuration.observe({ endpoint }, duration);
    }
  },

  // User Statistics Metrics
  setUserTotalCourses: (userId, count) => {
    totalCourses.set({ user_id: userId }, count);
  },

  setUserActiveCourses: (userId, count) => {
    activeCourses.set({ user_id: userId }, count);
  },

  setUserCompletedCourses: (userId, count) => {
    completedCourses.set({ user_id: userId }, count);
  },

  setUserTotalTimeSpent: (userId, seconds) => {
    totalTimeSpent.set({ user_id: userId }, seconds);
  },

  setUserAverageProgress: (userId, percent) => {
    averageProgress.set({ user_id: userId }, percent);
  },

  // Global Statistics Metrics
  setGlobalTotalCourses: (count) => {
    globalTotalCourses.set(count);
  },

  setGlobalTotalEnrollments: (count) => {
    globalTotalEnrollments.set(count);
  },

  setGlobalActiveEnrollments: (count) => {
    globalActiveEnrollments.set(count);
  },

  setGlobalCompletedEnrollments: (count) => {
    globalCompletedEnrollments.set(count);
  },

  setGlobalTotalUsers: (count) => {
    globalTotalUsers.set(count);
  },

  // Get metrics registry
  getRegister: () => register,

  // Get metrics as Prometheus format
  getMetrics: async () => {
    return await register.metrics();
  }
};

module.exports = {
  metricsMiddleware,
  metrics,
  register
};

