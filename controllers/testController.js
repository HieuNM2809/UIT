const { applicationLogger } = require('../config/logger');
const elasticsearchService = require('../services/elasticsearchService');

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

    res.json({
      success: true,
      message: 'Test logs đã được gửi lên Elasticsearch/Kibana',
      data: {
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
      }
    });
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


