const { applicationLogger } = require('../config/logger');
const elasticsearchService = require('../services/elasticsearchService');
const { v4: uuidv4 } = require('uuid');
const https = require('https');
const http = require('http');

/**
 * Test Index Page - List all test features
 * GET /test
 */
exports.index = (req, res) => {
  const testFeatures = [
    {
      title: 'Test Logs',
      description: 'Test các loại logs (info, warn, error, debug) và gửi lên Elasticsearch/Kibana',
      route: '/test/logs',
      method: 'GET',
      icon: '📊',
      color: 'blue'
    },
    {
      title: 'Test Gemini Chat',
      description: 'Test các models Gemini với fallback tự động. Hệ thống sẽ thử các models theo thứ tự nếu có lỗi.',
      route: '/test/gemini-chat',
      method: 'GET',
      icon: '🤖',
      color: 'purple'
    },
    {
      title: 'Test Metrics',
      description: 'Test các loại Prometheus metrics (HTTP, Database, Redis, AI, Socket, Business metrics)',
      route: '/test/metrics',
      method: 'GET',
      icon: '📈',
      color: 'green'
    }
  ];

  res.render('pages/test/index', {
    title: 'Test Features',
    pageHeader: 'Test Features',
    testFeatures: testFeatures
  });
};

/**
 * Get Gemini models list from environment variable
 * Format: comma-separated string, e.g., "gemini-3-flash,gemini-2.5-flash,gemma-3-27b-it"
 * Falls back to default list if not set
 */
function getGeminiModels() {
  const envModels = process.env.GEMINI_MODELS;
  
  if (envModels && envModels.trim()) {
    return envModels.split(',').map(m => m.trim()).filter(m => m.length > 0);
  }
  
  // Default models list
  return [
    'gemma-3-27b-it', 
    'gemma-3-12b-it',
    'gemma-3-4b-it',
    'gemma-3-2b-it',
    'gemma-3-1b-it',
    'gemini-3-flash',
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.5-flash-tts',
    'gemini-2.5-flash-native-audio-dialog',
    'gemini-robotics-er-1.5-preview'
  ];
}

/**
 * Test all log levels
 * GET /test/logs
 */
exports.testLogs = async (req, res) => {
  try {
    const testId = `test-${Date.now()}`;
    const userId = req.user?.id || req.session?.user?.id || 'test-user';
    const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0] || '127.0.0.1';

    // Test INFO log
    applicationLogger.info('Test INFO log', {
      type: 'test',
      operation: 'test_info',
      testId: testId,
      userId: userId,
      ip_address: ipAddress,
      message: 'This is a test INFO log message',
      metadata: {
        test_type: 'info',
        timestamp: new Date().toISOString()
      }
    });

    // Test WARN log
    applicationLogger.warn('Test WARN log', {
      type: 'test',
      operation: 'test_warn',
      testId: testId,
      userId: userId,
      ip_address: ipAddress,
      message: 'This is a test WARN log message',
      metadata: {
        test_type: 'warn',
        warning_reason: 'Testing warning logs'
      }
    });

    // Test ERROR log (without error object)
    applicationLogger.error('Test ERROR log (without error)', null, {
      type: 'test',
      operation: 'test_error',
      testId: testId,
      userId: userId,
      ip_address: ipAddress,
      message: 'This is a test ERROR log message without error object',
      metadata: {
        test_type: 'error',
        error_type: 'test_error'
      }
    });

    // Test ERROR log (with error object)
    const testError = new Error('This is a test error');
    testError.name = 'TestError';
    applicationLogger.error('Test ERROR log (with error)', testError, {
      type: 'test',
      operation: 'test_error_with_stack',
      testId: testId,
      userId: userId,
      ip_address: ipAddress,
      message: 'This is a test ERROR log message with error object',
      metadata: {
        test_type: 'error',
        error_type: 'test_error_with_stack'
      }
    });

    // Test DEBUG log
    applicationLogger.debug('Test DEBUG log', {
      type: 'test',
      operation: 'test_debug',
      testId: testId,
      userId: userId,
      ip_address: ipAddress,
      message: 'This is a test DEBUG log message',
      metadata: {
        test_type: 'debug',
        debug_info: 'Testing debug logs'
      }
    });

    // Test with execution time
    const startTime = Date.now();
    // Simulate some work
    await new Promise(resolve => setTimeout(resolve, 100));
    const executionTime = Date.now() - startTime;

    applicationLogger.info('Test log with execution time', {
      type: 'test',
      operation: 'test_execution_time',
      testId: testId,
      userId: userId,
      ip_address: ipAddress,
      execution_time_ms: executionTime,
      message: 'This is a test log with execution time tracking'
    });

    // Test activity log (via elasticsearchService)
    try {
      await elasticsearchService.logActivity({
        user_id: userId,
        action: 'test_logs',
        route_name: 'test',
        route_path: '/test/logs111',
        route_base: '/test',
        resource_type: 'test',
        resource_id: testId,
        ip_address: ipAddress,
        user_agent: req.get('user-agent') || null,
        session_id: req.sessionID || null,
        execution_time_ms: executionTime,
        details: {
          method: req.method,
          test_type: 'all_logs',
          testId: testId
        }
      });
    } catch (activityError) {
      applicationLogger.warn('Failed to log activity', {
        type: 'test',
        operation: 'test_activity_log_failed',
        error: activityError.message
      });
    }

    const resultData = {
      testId: testId,
      userId: userId,
      logsSent: {
        info: 2, // info + info with execution time
        warn: 1,
        error: 2, // error without error object + error with error object
        debug: 1,
        activity: 1
      },
      instructions: {
        kibana: 'Truy cập Kibana (http://localhost:5601) và query: type: "test" AND testId: "' + testId + '"',
        elasticsearch: 'Query Elasticsearch: curl "http://localhost:9200/studymate-logs/_search?q=testId:' + testId + '"',
        index: 'studymate-logs'
      }
    };

    // Support both HTML and JSON responses
    // Check if request wants JSON (via Accept header or query parameter)
    const acceptsJson = (req.headers.accept && req.headers.accept.includes('application/json')) ||
                        req.query.format === 'json' ||
                        req.xhr; // AJAX requests
    
    if (acceptsJson) {
      res.json({
        success: true,
        message: 'Test logs đã được gửi lên Elasticsearch/Kibana',
        data: resultData
      });
    } else {
      // Render HTML page
      res.render('pages/test/logs', {
        title: 'Test Logs',
        pageHeader: 'Test Logs',
        testData: null // Don't pass data, let JavaScript fetch it
      });
    }
  } catch (error) {
    applicationLogger.error('Test logs error', error, {
      type: 'test',
      operation: 'test_logs_error',
      userId: req.user?.id || req.session?.user?.id
    });

    res.status(500).json({
      success: false,
      message: 'Lỗi khi test logs',
      error: error.message
      });
    }
  };

/**
 * Test Gemini Chat Page
 * GET /test/gemini-chat
 */
exports.geminiChatPage = (req, res) => {
  // Get models from environment variable or use default
  const models = getGeminiModels();

  res.render('pages/test/gemini-chat', {
    title: 'Test Gemini Chat',
    pageHeader: 'Test Gemini Chat API',
    models: models
  });
};

/**
 * Test Gemini Chat API with multiple models fallback
 * POST /test/gemini-chat
 */
exports.testGeminiChat = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập câu hỏi'
      });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return res.status(500).json({
        success: false,
        message: 'GEMINI_API_KEY chưa được cấu hình'
      });
    }

    // Get models from environment variable or use default
    const models = getGeminiModels();

    let lastError = null;
    let successfulModel = null;
    let response = null;

    // Try each model in order
    for (const model of models) {
      try {
        applicationLogger.info(`Trying Gemini model: ${model}`, {
          type: 'test',
          operation: 'gemini_chat_try_model',
          model: model,
          message: message.substring(0, 50)
        });

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;
        
        /**
         * Gemini API Request Structure:
         * 
         * contents: Array of Content objects (conversation history)
         *   - Mỗi Content đại diện cho một lượt tương tác trong cuộc hội thoại
         *   - Có thể chứa nhiều Content để tạo context/history
         * 
         * parts: Array of Part objects (nội dung của Content)
         *   - Mỗi Part chứa một loại dữ liệu (text, image, file, etc.)
         *   - Có thể có nhiều parts trong một Content (ví dụ: text + image)
         * 
         * text: String - Nội dung văn bản cần gửi
         * 
         * Ví dụ cấu trúc đầy đủ:
         * {
         *   contents: [
         *     {
         *       role: "user",           // Optional: "user" hoặc "model"
         *       parts: [
         *         { text: "Câu hỏi 1" },
         *         { text: "Câu hỏi 2" }  // Có thể có nhiều parts
         *       ]
         *     },
         *     {
         *       role: "model",
         *       parts: [{ text: "Câu trả lời" }]
         *     }
         *   ]
         * }
         */
        const requestData = JSON.stringify({
          contents: [{
            parts: [{ text: message }]
          }]
        });

        // Make API call using native https module
        const result = await new Promise((resolve, reject) => {
          const url = new URL(apiUrl);
          const options = {
            hostname: url.hostname,
            port: 443,
            path: url.pathname + url.search,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(requestData)
            }
          };

          const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
              data += chunk;
            });

            res.on('end', () => {
              if (res.statusCode === 200) {
                try {
                  const jsonData = JSON.parse(data);
                  resolve(jsonData);
                } catch (parseError) {
                  reject(new Error(`Failed to parse response: ${parseError.message}`));
                }
              } else {
                reject(new Error(`API returned status ${res.statusCode}: ${data}`));
              }
            });
          });

          req.on('error', (error) => {
            reject(error);
          });

          req.write(requestData);
          req.end();
        });

        // Extract response text
        if (result.candidates && result.candidates[0] && result.candidates[0].content) {
          const content = result.candidates[0].content;
          if (content.parts && content.parts[0] && content.parts[0].text) {
            response = content.parts[0].text;
            successfulModel = model;
            
            applicationLogger.info(`Gemini model ${model} succeeded`, {
              type: 'test',
              operation: 'gemini_chat_success',
              model: model,
              responseLength: response.length
            });
            
            break; // Success, exit loop
          }
        }

        // If no text found in response
        throw new Error('No text found in response');

      } catch (error) {
        lastError = error;
        applicationLogger.warn(`Gemini model ${model} failed`, {
          type: 'test',
          operation: 'gemini_chat_model_failed',
          model: model,
          error: error.message
        });
        
        // Continue to next model
        continue;
      }
    }

    // Check if any model succeeded
    if (!response || !successfulModel) {
      applicationLogger.error('All Gemini models failed', lastError, {
        type: 'test',
        operation: 'gemini_chat_all_failed',
        modelsTried: models.length
      });

      return res.status(500).json({
        success: false,
        message: 'Tất cả các models đều thất bại',
        error: lastError?.message || 'Unknown error',
        modelsTried: models
      });
    }

    applicationLogger.info('Gemini chat test completed successfully', {
      type: 'test',
      operation: 'gemini_chat_complete',
      successfulModel: successfulModel,
      responseLength: response.length
    });

    res.json({
      success: true,
      data: {
        response: response,
        model: successfulModel,
        modelsTried: models.slice(0, models.indexOf(successfulModel) + 1),
        totalModels: models.length
      }
    });

  } catch (error) {
    applicationLogger.error('Gemini chat test error', error, {
      type: 'test',
      operation: 'gemini_chat_error'
    });

    res.status(500).json({
      success: false,
      message: 'Lỗi khi test Gemini chat',
      error: error.message
    });
  }
};

/**
 * Test Prometheus Metrics
 * GET /test/metrics
 */
exports.testMetrics = async (req, res) => {
  try {
    const { metrics } = require('../middleware/metrics');
    const { connectRedis } = require('../config/redis');
    const { sequelize } = require('../models');
    const testId = `metrics-test-${Date.now()}`;
    
    const results = {
      testId: testId,
      timestamp: new Date().toISOString(),
      tests: {}
    };

    // Test 1: HTTP Metrics (đã được tự động ghi bởi metricsMiddleware)
    results.tests.http = {
      status: 'success',
      message: 'HTTP metrics được tự động ghi bởi metricsMiddleware khi request này được xử lý',
      note: 'Kiểm tra Prometheus: rate(studymate_http_requests_total[1m])'
    };

    // Test 2: Database Metrics
    try {
      const dbStartTime = Date.now();
      await sequelize.query('SELECT 1 as test');
      const dbDuration = (Date.now() - dbStartTime) / 1000;
      metrics.recordDbQuery('select', 'test', dbDuration, 'success');
      
      results.tests.database = {
        status: 'success',
        duration: `${dbDuration.toFixed(3)}s`,
        message: 'Database query metrics đã được ghi',
        note: 'Kiểm tra Prometheus: studymate_db_queries_total{operation="select",model="test"}'
      };
    } catch (dbError) {
      metrics.recordDbQuery('select', 'test', 0, 'error');
      results.tests.database = {
        status: 'error',
        error: dbError.message
      };
    }

    // Test 3: Redis Metrics
    try {
      const { getClient } = require('../config/redis');
      const redis = getClient();
      if (!redis || !redis.isReady) {
        throw new Error('Redis client not available');
      }
      const redisStartTime = Date.now();
      await redis.set(`test:${testId}`, 'test-value', 'EX', 60);
      await redis.get(`test:${testId}`);
      await redis.del(`test:${testId}`);
      const redisDuration = (Date.now() - redisStartTime) / 1000;
      
      metrics.recordRedisOperation('set', redisDuration / 3, 'success');
      metrics.recordRedisOperation('get', redisDuration / 3, 'success');
      metrics.recordRedisOperation('del', redisDuration / 3, 'success');
      
      results.tests.redis = {
        status: 'success',
        duration: `${redisDuration.toFixed(3)}s`,
        operations: ['set', 'get', 'del'],
        message: 'Redis operation metrics đã được ghi',
        note: 'Kiểm tra Prometheus: studymate_redis_operations_total'
      };
    } catch (redisError) {
      metrics.recordRedisOperation('test', 0, 'error');
      results.tests.redis = {
        status: 'error',
        error: redisError.message
      };
    }

    // Test 4: AI Metrics (simulate)
    try {
      const aiStartTime = Date.now();
      // Simulate AI request delay
      await new Promise(resolve => setTimeout(resolve, 100));
      const aiDuration = (Date.now() - aiStartTime) / 1000;
      
      // Simulate token usage
      const promptTokens = 50;
      const completionTokens = 100;
      
      metrics.recordAIRequest('gemini', 'test', aiDuration, 'success');
      metrics.recordAITokens('gemini', promptTokens, completionTokens);
      
      results.tests.ai = {
        status: 'success',
        duration: `${aiDuration.toFixed(3)}s`,
        provider: 'gemini',
        tokens: {
          prompt: promptTokens,
          completion: completionTokens,
          total: promptTokens + completionTokens
        },
        message: 'AI request metrics đã được ghi',
        note: 'Kiểm tra Prometheus: studymate_ai_requests_total, studymate_ai_tokens_total'
      };
    } catch (aiError) {
      metrics.recordAIRequest('gemini', 'test', 0, 'error');
      results.tests.ai = {
        status: 'error',
        error: aiError.message
      };
    }

    // Test 5: Socket.IO Metrics
    try {
      const mockConnectionCount = Math.floor(Math.random() * 10) + 1;
      metrics.setSocketConnections(mockConnectionCount);
      metrics.recordSocketMessage('test_message', 'success');
      
      results.tests.socket = {
        status: 'success',
        connections: mockConnectionCount,
        message: 'Socket.IO metrics đã được ghi',
        note: 'Kiểm tra Prometheus: studymate_socket_connections, studymate_socket_messages_total'
      };
    } catch (socketError) {
      results.tests.socket = {
        status: 'error',
        error: socketError.message
      };
    }

    // Test 6: Business Metrics
    try {
      const testCourseId = 'test-course-' + Date.now();
      const testContentId = 'test-content-' + Date.now();
      
      metrics.recordCourseEnrollment(testCourseId, 'success');
      metrics.recordContentCompletion(testContentId, testCourseId);
      metrics.setActiveUsers(Math.floor(Math.random() * 100) + 1);
      
      results.tests.business = {
        status: 'success',
        courseId: testCourseId,
        contentId: testContentId,
        message: 'Business metrics đã được ghi',
        note: 'Kiểm tra Prometheus: studymate_course_enrollments_total, studymate_content_completions_total, studymate_active_users'
      };
    } catch (businessError) {
      results.tests.business = {
        status: 'error',
        error: businessError.message
      };
    }

    // Test 7: Error Metrics
    try {
      metrics.recordError('test_error', '/test/metrics', 200);
      
      results.tests.errors = {
        status: 'success',
        message: 'Error metrics đã được ghi',
        note: 'Kiểm tra Prometheus: studymate_errors_total'
      };
    } catch (errorError) {
      results.tests.errors = {
        status: 'error',
        error: errorError.message
      };
    }

    // Test 8: Reports/Statistics Metrics
    try {
      const testUserId = 'test-user-' + Date.now();
      metrics.recordReportsRequest('/api/statistics', testUserId, 0.1);
      metrics.setUserTotalCourses(testUserId, 5);
      metrics.setUserActiveCourses(testUserId, 3);
      metrics.setUserCompletedCourses(testUserId, 2);
      metrics.setUserTotalTimeSpent(testUserId, 3600);
      metrics.setUserAverageProgress(testUserId, 75);
      
      metrics.setGlobalTotalCourses(1000);
      metrics.setGlobalTotalEnrollments(200);
      metrics.setGlobalActiveEnrollments(150);
      metrics.setGlobalCompletedEnrollments(50);
      metrics.setGlobalTotalUsers(100);
      
      results.tests.reports = {
        status: 'success',
        userId: testUserId,
        message: 'Reports/Statistics metrics đã được ghi',
        metrics: {
          user: [
            'studymate_user_total_courses',
            'studymate_user_active_courses',
            'studymate_user_completed_courses',
            'studymate_user_total_time_spent_seconds',
            'studymate_user_average_progress_percent'
          ],
          global: [
            'studymate_global_total_courses',
            'studymate_global_total_enrollments',
            'studymate_global_active_enrollments',
            'studymate_global_completed_enrollments',
            'studymate_global_total_users'
          ],
          requests: [
            'studymate_reports_requests_total',
            'studymate_reports_request_duration_seconds'
          ]
        },
        note: 'Kiểm tra Prometheus: studymate_reports_*, studymate_user_*, studymate_global_*'
      };
    } catch (reportsError) {
      results.tests.reports = {
        status: 'error',
        error: reportsError.message
      };
    }

    // Test 9: System Metrics (tự động từ prom-client)
    results.tests.system = {
      status: 'success',
      message: 'System metrics được tự động thu thập bởi prom-client',
      metrics: [
        'studymate_process_cpu_user_seconds_total',
        'studymate_process_resident_memory_bytes',
        'studymate_nodejs_heap_size_total_bytes',
        'studymate_nodejs_heap_size_used_bytes',
        'studymate_nodejs_eventloop_lag_seconds',
        'studymate_nodejs_gc_duration_seconds'
      ],
      note: 'Kiểm tra Prometheus: studymate_process_* hoặc studymate_nodejs_*'
    };

    // Summary
    const totalTests = Object.keys(results.tests).length;
    const successTests = Object.values(results.tests).filter(t => t.status === 'success').length;
    const errorTests = totalTests - successTests;

    results.summary = {
      total: totalTests,
      success: successTests,
      errors: errorTests,
      successRate: `${((successTests / totalTests) * 100).toFixed(1)}%`
    };

    // Log test completion
    applicationLogger.info('Metrics test completed', {
      type: 'test',
      operation: 'test_metrics',
      testId: testId,
      summary: results.summary
    });

    // Support both HTML and JSON responses
    // Check if request wants JSON (via Accept header or query parameter)
    const acceptsJson = (req.headers.accept && req.headers.accept.includes('application/json')) ||
                        req.query.format === 'json' ||
                        req.xhr; // AJAX requests
    
    if (acceptsJson) {
      res.json({
        success: true,
        message: 'Test metrics đã hoàn thành. Kiểm tra Prometheus để xem metrics.',
        data: results,
        instructions: {
          prometheus: 'Truy cập http://localhost:9090 và query các metrics đã được ghi',
          grafana: 'Truy cập http://localhost:3001 để xem dashboard',
          metricsEndpoint: 'http://localhost:3000/metrics - Xem raw metrics'
        }
      });
    } else {
      // Render HTML page
      res.render('pages/test/metrics', {
        title: 'Test Metrics',
        pageHeader: 'Test Metrics',
        testData: null // Don't pass data, let JavaScript fetch it
      });
    }

  } catch (error) {
    applicationLogger.error('Test metrics error', error, {
      type: 'test',
      operation: 'test_metrics_error'
    });

    res.status(500).json({
      success: false,
      message: 'Lỗi khi test metrics',
      error: error.message
    });
  }
};


