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
    try {
      if (!client) return null;
      const data = await client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  },

  async set(key, value, expireInSeconds = 3600) {
    try {
      if (!client) return false;
      await client.setEx(key, expireInSeconds, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Redis set error:', error);
      return false;
    }
  },

  async del(key) {
    try {
      if (!client) return false;
      await client.del(key);
      return true;
    } catch (error) {
      console.error('Redis delete error:', error);
      return false;
    }
  }
};

module.exports = { connectRedis, cacheUtils };