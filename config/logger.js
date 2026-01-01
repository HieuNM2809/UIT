const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Try to load winston-elasticsearch
let ElasticsearchTransport = null;
try {
  const winstonElasticsearch = require('winston-elasticsearch');
  
  // Debug: log what we got
  if (process.env.DEBUG_ELASTICSEARCH === 'true') {
    console.log('winston-elasticsearch module:', typeof winstonElasticsearch);
    console.log('winston-elasticsearch keys:', Object.keys(winstonElasticsearch || {}));
  }
  
  // Check if it's a class/constructor or default export
  if (winstonElasticsearch && typeof winstonElasticsearch === 'function') {
    ElasticsearchTransport = winstonElasticsearch;
  } else if (winstonElasticsearch && winstonElasticsearch.ElasticsearchTransport) {
    ElasticsearchTransport = winstonElasticsearch.ElasticsearchTransport;
  } else if (winstonElasticsearch && winstonElasticsearch.default) {
    ElasticsearchTransport = winstonElasticsearch.default;
  } else if (winstonElasticsearch && winstonElasticsearch.Transport) {
    // Some versions export as Transport
    ElasticsearchTransport = winstonElasticsearch.Transport;
  } else {
    ElasticsearchTransport = winstonElasticsearch;
  }
  
  // Final check
  if (ElasticsearchTransport && typeof ElasticsearchTransport !== 'function') {
    console.warn('⚠️  winston-elasticsearch is not a constructor. Available exports:', Object.keys(winstonElasticsearch || {}));
    ElasticsearchTransport = null;
  }
} catch (error) {
  // Module not found or other error
  console.warn('⚠️  Could not load winston-elasticsearch:', error.message);
  ElasticsearchTransport = null;
}

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

// Elasticsearch configuration
const elasticsearchEnabled = process.env.ELASTICSEARCH_ENABLED === 'true';
const elasticsearchHost = process.env.ELASTICSEARCH_HOST || 'localhost';
const elasticsearchPort = process.env.ELASTICSEARCH_PORT || 9200;
const indexPrefix = process.env.ELASTICSEARCH_INDEX_PREFIX || 'studymate';

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
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
    winston.format.printf(({ timestamp, level, message, stack, metadata }) => {
      const metaStr = Object.keys(metadata).length > 0 ? ` ${JSON.stringify(metadata)}` : '';
      const execTime = metadata.execution_time_ms ? ` [${metadata.execution_time_ms}ms]` : '';
      return `${timestamp} ${level}: ${stack || message}${execTime}${metaStr}`;
    })
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

// Add Elasticsearch transport after logger creation (for winston-elasticsearch 0.11.0 compatibility)
if (elasticsearchEnabled && ElasticsearchTransport && typeof ElasticsearchTransport === 'function') {
  try {
    const elasticsearchTransport = new ElasticsearchTransport({
      level: process.env.ELASTICSEARCH_LOG_LEVEL || 'debug', // Log all levels to Kibana (debug, info, warn, error)
      clientOpts: {
        node: `http://${elasticsearchHost}:${elasticsearchPort}`,
        maxRetries: 5,
        requestTimeout: 60000,
        sniffOnStart: false
      },
      index: `${indexPrefix}-logs`,
      indexTemplate: {
        settings: {
          number_of_shards: 1,
          number_of_replicas: 0
        },
        mappings: {
          properties: {
            '@timestamp': { type: 'date' },
            timestamp: { type: 'date' },
            level: { type: 'keyword' },
            message: { type: 'text' },
            service: { type: 'keyword' },
            type: { type: 'keyword' },
            user_id: { type: 'keyword' },
            action: { type: 'keyword' },
            resource_type: { type: 'keyword' },
            resource_id: { type: 'keyword' },
            ip_address: { type: 'ip' },
            user_agent: { type: 'text' },
            execution_time_ms: { type: 'long' },
            error: { 
              properties: {
                message: { type: 'text' },
                stack: { type: 'text' },
                name: { type: 'keyword' }
              }
            },
            metadata: { type: 'object', enabled: false }
          }
        }
      },
      indexTemplateName: `${indexPrefix}-logs-template`,
      messageType: 'log',
      transformer: (logData) => {
        return {
          '@timestamp': logData.timestamp || new Date().toISOString(),
          level: logData.level,
          message: logData.message,
          service: 'studymate',
          ...logData.meta
        };
      }
    });

    logger.add(elasticsearchTransport);
    console.log(`✅ Elasticsearch logging enabled: http://${elasticsearchHost}:${elasticsearchPort}`);
  } catch (error) {
    console.error('❌ Failed to initialize Elasticsearch transport:', error.message);
    console.error('Error details:', error.stack);
    console.log('⚠️  Continuing without Elasticsearch logging...');
  }
} else if (elasticsearchEnabled && !ElasticsearchTransport) {
  console.warn('⚠️  Elasticsearch enabled but winston-elasticsearch not available. Install: npm install winston-elasticsearch');
}

// Helper function to track execution time
const trackExecutionTime = (startTime) => {
  return Date.now() - startTime;
};

// Application-specific logger methods
const applicationLogger = {
  info: (message, meta = {}) => {
    const executionTime = meta.execution_time_ms || null;
    const logMeta = { ...meta, type: 'application' };
    if (executionTime !== null) {
      logMeta.execution_time_ms = executionTime;
    }
    logger.info(message, logMeta);
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
    logger.error(message, logMeta);
  },
  warn: (message, meta = {}) => {
    const executionTime = meta.execution_time_ms || null;
    const logMeta = { ...meta, type: 'application' };
    if (executionTime !== null) {
      logMeta.execution_time_ms = executionTime;
    }
    logger.warn(message, logMeta);
  },
  debug: (message, meta = {}) => {
    const executionTime = meta.execution_time_ms || null;
    const logMeta = { ...meta, type: 'application' };
    if (executionTime !== null) {
      logMeta.execution_time_ms = executionTime;
    }
    logger.debug(message, logMeta);
  },
  
  // Method to log with execution time tracking
  time: (label) => {
    const startTime = Date.now();
    return {
      end: (message, meta = {}) => {
        const executionTime = Date.now() - startTime;
        logger.info(message || `${label} completed`, {
          ...meta,
          type: 'application',
          execution_time_ms: executionTime,
          label: label
        });
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
        logger.error(message || `${label} failed`, {
          ...meta,
          ...errorMeta,
          type: 'application',
          execution_time_ms: executionTime,
          label: label
        });
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
    logger.info(message, logMeta);
  },
  
  // AI logging
  ai: (message, meta = {}) => {
    const executionTime = meta.execution_time_ms || null;
    const logMeta = { ...meta, type: 'ai' };
    if (executionTime !== null) {
      logMeta.execution_time_ms = executionTime;
    }
    logger.info(message, logMeta);
  },
  
  // Database logging
  db: (message, meta = {}) => {
    const executionTime = meta.execution_time_ms || null;
    const logMeta = { ...meta, type: 'database' };
    if (executionTime !== null) {
      logMeta.execution_time_ms = executionTime;
    }
    logger.debug(message, logMeta);
  }
};

module.exports = { 
  logger, 
  applicationLogger,
  trackExecutionTime 
};