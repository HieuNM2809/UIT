const winston = require('winston');
const path = require('path');
const fs = require('fs');
const elasticsearchService = require('../services/elasticsearchService');

// Create logs directory
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Activity logs are handled by elasticsearchService, no file logger needed
// This is kept for backward compatibility but won't be used
const activityFileLogger = {
  info: () => {} // No-op, activity logs go to Elasticsearch via elasticsearchService
};

// Elasticsearch configuration (now handled by elasticsearchService)
const elasticsearchEnabled = process.env.ELASTICSEARCH_ENABLED === 'true';

// Create transports array
// Console: Only show errors (for debugging)
// No file logs - all logs go to Kibana
const transports = [
  new winston.transports.Console({
    level: 'error', // Only log errors to console
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
      winston.format.printf(({ timestamp, level, message, stack, metadata }) => {
        const metaStr = Object.keys(metadata || {}).length > 0 ? ` ${JSON.stringify(metadata)}` : '';
        const execTime = metadata?.execution_time_ms ? ` [${metadata.execution_time_ms}ms]` : '';
        return `${timestamp} ${level}: ${stack || message}${execTime}${metaStr}`;
      })
    )
  })
];


// Create logger
// Note: We don't use printf format here because it serializes metadata to string
// Elasticsearch transport needs raw metadata object
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'stack'] })
    // Don't use printf here - it will serialize metadata to string
    // Elasticsearch transport will handle formatting
  ),
  transports: transports,
  // No file handlers - all logs go to Kibana
  exceptionHandlers: [
    new winston.transports.Console({
      level: 'error',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ],
  rejectionHandlers: [
    new winston.transports.Console({
      level: 'error',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Elasticsearch logging is now handled directly via elasticsearchService
// No need for winston-elasticsearch transport
if (elasticsearchEnabled && elasticsearchService.enabled) {
  console.log(`✅ Elasticsearch logging enabled via elasticsearchService: http://${elasticsearchService.host}:${elasticsearchService.port}`);
}

// Helper function to track execution time
const trackExecutionTime = (startTime) => {
  return Date.now() - startTime;
};

// Application-specific logger methods
// Now logs directly to Elasticsearch via elasticsearchService instead of winston-elasticsearch
const applicationLogger = {
  info: (message, meta = {}) => {
    const executionTime = meta.execution_time_ms || null;
    const logMeta = { ...meta, type: 'application' };
    if (executionTime !== null) {
      logMeta.execution_time_ms = executionTime;
    }
    
    // Log to console (winston)
    logger.info(message, logMeta);
    
    // Log to Elasticsearch via elasticsearchService
    if (elasticsearchEnabled && elasticsearchService.enabled) {
      elasticsearchService.logApplicationLog({
        level: 'info',
        message: message,
        timestamp: new Date().toISOString(),
        metadata: logMeta
      }).catch(() => {
        // Silently fail - don't log errors to avoid infinite loop
      });
    }
  },
  error: (message, error = null, meta = {}) => {
    const errorMeta = error ? { 
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      }
    } : {};
    const executionTime = meta.execution_time_ms || null;
    const logMeta = { ...meta, ...errorMeta, type: 'application' };
    if (executionTime !== null) {
      logMeta.execution_time_ms = executionTime;
    }
    
    // Log to console (winston)
    logger.error(message, logMeta);
    
    // Log to Elasticsearch via elasticsearchService
    if (elasticsearchEnabled && elasticsearchService.enabled) {
      elasticsearchService.logApplicationLog({
        level: 'error',
        message: message,
        timestamp: new Date().toISOString(),
        metadata: logMeta,
        error: error ? {
          message: error.message,
          stack: error.stack,
          name: error.name
        } : null
      }).catch(() => {
        // Silently fail - don't log errors to avoid infinite loop
      });
    }
  },
  warn: (message, meta = {}) => {
    const executionTime = meta.execution_time_ms || null;
    const logMeta = { ...meta, type: 'application' };
    if (executionTime !== null) {
      logMeta.execution_time_ms = executionTime;
    }
    
    // Log to console (winston)
    logger.warn(message, logMeta);
    
    // Log to Elasticsearch via elasticsearchService
    if (elasticsearchEnabled && elasticsearchService.enabled) {
      elasticsearchService.logApplicationLog({
        level: 'warn',
        message: message,
        timestamp: new Date().toISOString(),
        metadata: logMeta
      }).catch(() => {
        // Silently fail - don't log errors to avoid infinite loop
      });
    }
  },
  debug: (message, meta = {}) => {
    const executionTime = meta.execution_time_ms || null;
    const logMeta = { ...meta, type: 'application' };
    if (executionTime !== null) {
      logMeta.execution_time_ms = executionTime;
    }
    
    // Log to console (winston)
    logger.debug(message, logMeta);
    
    // Log to Elasticsearch via elasticsearchService
    if (elasticsearchEnabled && elasticsearchService.enabled) {
      elasticsearchService.logApplicationLog({
        level: 'debug',
        message: message,
        timestamp: new Date().toISOString(),
        metadata: logMeta
      }).catch(() => {
        // Silently fail - don't log errors to avoid infinite loop
      });
    }
  },
  
  // Method to log with execution time tracking
  time: (label) => {
    const startTime = Date.now();
    return {
      end: (message, meta = {}) => {
        const executionTime = Date.now() - startTime;
        const logMessage = message || `${label} completed`;
        const logMeta = {
          ...meta,
          type: 'application',
          execution_time_ms: executionTime,
          label: label
        };
        
        // Log to console (winston)
        logger.info(logMessage, logMeta);
        
        // Log to Elasticsearch via elasticsearchService
        if (elasticsearchEnabled && elasticsearchService.enabled) {
          elasticsearchService.logApplicationLog({
            level: 'info',
            message: logMessage,
            timestamp: new Date().toISOString(),
            metadata: logMeta
          }).catch(() => {
            // Silently fail
          });
        }
        
        return executionTime;
      },
      error: (message, error = null, meta = {}) => {
        const executionTime = Date.now() - startTime;
        const errorMeta = error ? {
          error: {
            message: error.message,
            stack: error.stack,
            name: error.name
          }
        } : {};
        const logMessage = message || `${label} failed`;
        const logMeta = {
          ...meta,
          ...errorMeta,
          type: 'application',
          execution_time_ms: executionTime,
          label: label
        };
        
        // Log to console (winston)
        logger.error(logMessage, logMeta);
        
        // Log to Elasticsearch via elasticsearchService
        if (elasticsearchEnabled && elasticsearchService.enabled) {
          elasticsearchService.logApplicationLog({
            level: 'error',
            message: logMessage,
            timestamp: new Date().toISOString(),
            metadata: logMeta,
            error: error ? {
              message: error.message,
              stack: error.stack,
              name: error.name
            } : null
          }).catch(() => {
            // Silently fail
          });
        }
        
        return executionTime;
      }
    };
  },
  
  // Activity logging - Only log to file (not console), Elasticsearch handles via elasticsearchService
  activity: (activityData) => {
    // Log to file only, not console
    const executionTime = activityData.details?.response_time_ms || activityData.execution_time_ms || null;
    activityFileLogger.info('Activity logged', {
      type: 'activity',
      user_id: activityData.user_id,
      action: activityData.action,
      resource_type: activityData.resource_type,
      resource_id: activityData.resource_id,
      ip_address: activityData.ip_address,
      user_agent: activityData.user_agent,
      session_id: activityData.session_id,
      details: activityData.details,
      execution_time_ms: executionTime,
      timestamp: new Date().toISOString()
    });
  },
  
  // API logging
  api: (message, req = null, meta = {}) => {
    const apiMeta = req ? {
      method: req.method,
      url: req.originalUrl || req.url,
      ip: req.ip || req.connection.remoteAddress,
      user_agent: req.get('user-agent'),
      user_id: req.user?.id || req.session?.user?.id
    } : {};
    const executionTime = meta.execution_time_ms || req?.execution_time_ms || null;
    const logMeta = { ...apiMeta, ...meta, type: 'api' };
    if (executionTime !== null) {
      logMeta.execution_time_ms = executionTime;
    }
    
    // Log to console (winston)
    logger.info(message, logMeta);
    
    // Log to Elasticsearch via elasticsearchService
    if (elasticsearchEnabled && elasticsearchService.enabled) {
      elasticsearchService.logApplicationLog({
        level: 'info',
        message: message,
        timestamp: new Date().toISOString(),
        metadata: logMeta
      }).catch(() => {
        // Silently fail
      });
    }
  },
  
  // AI logging
  ai: (message, meta = {}) => {
    const executionTime = meta.execution_time_ms || null;
    const logMeta = { ...meta, type: 'ai' };
    if (executionTime !== null) {
      logMeta.execution_time_ms = executionTime;
    }
    
    // Log to console (winston)
    logger.info(message, logMeta);
    
    // Log to Elasticsearch via elasticsearchService
    if (elasticsearchEnabled && elasticsearchService.enabled) {
      elasticsearchService.logApplicationLog({
        level: 'info',
        message: message,
        timestamp: new Date().toISOString(),
        metadata: logMeta
      }).catch(() => {
        // Silently fail
      });
    }
  },
  
  // Database logging
  db: (message, meta = {}) => {
    const executionTime = meta.execution_time_ms || null;
    const logMeta = { ...meta, type: 'database' };
    if (executionTime !== null) {
      logMeta.execution_time_ms = executionTime;
    }
    
    // Log to console (winston)
    logger.debug(message, logMeta);
    
    // Log to Elasticsearch via elasticsearchService
    if (elasticsearchEnabled && elasticsearchService.enabled) {
      elasticsearchService.logApplicationLog({
        level: 'debug',
        message: message,
        timestamp: new Date().toISOString(),
        metadata: logMeta
      }).catch(() => {
        // Silently fail
      });
    }
  }
};

module.exports = { 
  logger, 
  applicationLogger,
  trackExecutionTime 
};