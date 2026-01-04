const redis = require('redis');

// Simple Redis client
let client = null;

const connectRedis = async () => {
  try {
    // Always try to connect to Redis (running in Docker)
    const redisConfig = {
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379
      }
    };

    // Add password if provided
    if (process.env.REDIS_PASSWORD) {
      redisConfig.password = process.env.REDIS_PASSWORD;
    }

    client = redis.createClient(redisConfig);
    
    // Handle connection events
    client.on('error', (err) => {
      console.warn('⚠ Redis client error:', err.message);
    });

    client.on('connect', () => {
      console.log('🔄 Connecting to Redis...');
    });

    client.on('ready', () => {
      console.log('✅ Redis connected and ready');
    });

    await client.connect();
  } catch (error) {
    console.warn('⚠ Redis connection failed, continuing without cache:', error.message);
    client = null;
  }
};

const cacheUtils = {
  async get(key) {
    const { metrics } = require('../middleware/metrics');
    const startTime = Date.now();
    try {
      if (!client) return null;
      const data = await client.get(key);
      const duration = (Date.now() - startTime) / 1000;
      metrics.recordRedisOperation('get', duration, 'success');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      const duration = (Date.now() - startTime) / 1000;
      metrics.recordRedisOperation('get', duration, 'error');
      console.error('Redis get error:', error);
      return null;
    }
  },

  async set(key, value, expireInSeconds = 3600) {
    const { metrics } = require('../middleware/metrics');
    const startTime = Date.now();
    try {
      if (!client) return false;
      await client.setEx(key, expireInSeconds, JSON.stringify(value));
      const duration = (Date.now() - startTime) / 1000;
      metrics.recordRedisOperation('set', duration, 'success');
      return true;
    } catch (error) {
      const duration = (Date.now() - startTime) / 1000;
      metrics.recordRedisOperation('set', duration, 'error');
      console.error('Redis set error:', error);
      return false;
    }
  },

  async del(key) {
    const { metrics } = require('../middleware/metrics');
    const startTime = Date.now();
    try {
      if (!client) return false;
      await client.del(key);
      const duration = (Date.now() - startTime) / 1000;
      metrics.recordRedisOperation('del', duration, 'success');
      return true;
    } catch (error) {
      const duration = (Date.now() - startTime) / 1000;
      metrics.recordRedisOperation('del', duration, 'error');
      console.error('Redis delete error:', error);
      return false;
    }
  }
};

module.exports = { connectRedis, cacheUtils, getClient: () => client };