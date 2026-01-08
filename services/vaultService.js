const axios = require('axios');
const { applicationLogger } = require('../config/logger');
const { cacheUtils } = require('../config/redis');

/**
 * Vault Service - Quản lý secrets từ HashiCorp Vault
 * 
 * Service đơn giản để lấy giá trị từ Vault theo key
 */
class VaultService {
  constructor() {
    this.enabled = process.env.VAULT_ENABLED === 'true';
    this.address = process.env.VAULT_ADDR || 'http://localhost:8200';
    this.token = process.env.VAULT_TOKEN || process.env.VAULT_ROOT_TOKEN || 'vault-root-token';
    this.secretPath = process.env.VAULT_SECRET_PATH || 'studymate/data/studymate';
    this.client = null;
    this.cachePrefix = 'vault:config:';
    this.cacheTTL = parseInt(process.env.VAULT_CACHE_TTL) || 3600; // Default 1 hour
    
    if (this.enabled) {
      this.client = axios.create({
        baseURL: this.address,
        headers: {
          'X-Vault-Token': this.token,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });
    }
  }

  /**
   * Lấy giá trị từ Vault theo key
   * @param {string} key - Tên key cần lấy (ví dụ: 'ABC', 'DEF')
   * @returns {Promise<string|number|boolean|Object|null>} - Giá trị của key hoặc null nếu không tìm thấy
   */
  async get(key) {
    if (!this.enabled) {
      return null;
    }

    try {
      // Lấy tất cả data từ path
      const response = await this.client.get(`/v1/${this.secretPath}`);
      
      if (response.data && response.data.data && response.data.data.data) {
        const data = response.data.data.data;
        
        // Nếu có key, trả về giá trị của key đó
        if (key) {
          const value = data[key];
          
          // Cache vào Redis
          if (value !== undefined) {
            const cacheKey = `${this.cachePrefix}${key}`;
            await cacheUtils.set(cacheKey, value, this.cacheTTL).catch(() => {
              // Ignore cache errors
            });
          }
          
          return value !== undefined ? value : null;
        }
        
        return data;
      }
      
      return null;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        applicationLogger.warn(`Key not found in Vault: ${key}`, {
          type: 'vault',
          operation: 'get',
          key: key,
          path: this.secretPath
        });
        return null;
      }
      
      applicationLogger.error(`Failed to get value from Vault: ${key}`, error, {
        type: 'vault',
        operation: 'get',
        key: key
      });
      return null;
    }
  }

  /**
   * Khởi tạo Vault service
   */
  async initialize() {
    if (!this.enabled) {
      applicationLogger.info('Vault is disabled', {
        type: 'vault',
        operation: 'initialize'
      });
      return;
    }
    
    try {
      // Test connection
      await this.client.get('/v1/sys/health');
      
      applicationLogger.info('Vault service initialized successfully', {
        type: 'vault',
        operation: 'initialize',
        address: this.address
      });
    } catch (error) {
      applicationLogger.warn('Vault connection failed', {
        type: 'vault',
        operation: 'initialize',
        error: error.message
      });
    }
  }
}

// Export singleton instance
const vaultService = new VaultService();

module.exports = vaultService;
