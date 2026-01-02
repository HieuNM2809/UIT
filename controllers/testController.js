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


