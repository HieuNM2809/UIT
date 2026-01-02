const { Client } = require('@elastic/elasticsearch');
const { applicationLogger } = require('../config/logger');

class ElasticsearchService {
  constructor() {
    this.enabled = process.env.ELASTICSEARCH_ENABLED === 'true';
    this.host = process.env.ELASTICSEARCH_HOST || 'localhost';
    this.port = process.env.ELASTICSEARCH_PORT || 9200;
    this.indexPrefix = process.env.ELASTICSEARCH_INDEX_PREFIX || 'studymate';
    
    if (this.enabled) {
      try {
        this.client = new Client({
          node: `http://${this.host}:${this.port}`,
          maxRetries: 5,
          requestTimeout: 60000,
          sniffOnStart: false
        });
        
        // Test connection
        this.testConnection();
      } catch (error) {
        console.error('❌ Failed to initialize Elasticsearch client:', error.message);
        this.enabled = false;
      }
    }
  }

  async testConnection() {
    if (!this.enabled || !this.client) return;
    
    try {
      const health = await this.client.cluster.health();
      console.log(`✅ Elasticsearch connected: ${health.status}`);
    } catch (error) {
      console.error('❌ Elasticsearch connection failed:', error.message);
      this.enabled = false;
    }
  }

  /**
   * Log application log to Elasticsearch
   * @param {Object} logData - Application log data
   */
  async logApplicationLog(logData) {
    if (!this.enabled || !this.client) {
      return; // Silently fail if Elasticsearch is not enabled
    }

    try {
      const index = `${this.indexPrefix}-logs`;
      
      const document = {
        '@timestamp': logData.timestamp || new Date().toISOString(),
        timestamp: logData.timestamp || new Date().toISOString(),
        level: logData.level || 'info',
        message: logData.message || '',
        service: 'studymate',
        ...logData.metadata // Spread all metadata fields
      };

      // Handle error object if present
      if (logData.error) {
        document.error = {
          message: logData.error.message || '',
          stack: logData.error.stack || '',
          name: logData.error.name || 'Error'
        };
      }

      await this.client.index({
        index: index,
        body: document
      });

    } catch (error) {
      // Don't log to console to avoid infinite loop
      // Just silently fail
    }
  }

  /**
   * Log activity to Elasticsearch
   * @param {Object} activityData - Activity log data
   */
  async logActivity(activityData) {
    if (!this.enabled || !this.client) {
      // Fallback to application logger
      applicationLogger.activity(activityData);
      return;
    }

    try {
      const index = `${this.indexPrefix}-activities-${this.getDateIndex()}`;
      
      // Extract execution time from details or top level
      const executionTime = activityData.execution_time_ms || 
                           activityData.details?.response_time_ms || 
                           activityData.details?.execution_time_ms || 
                           null;

      const document = {
        '@timestamp': new Date().toISOString(),
        user_id: activityData.user_id,
        action: activityData.action,
        route_name: activityData.route_name || null,
        route_path: activityData.route_path || activityData.details?.path || null,
        route_base: activityData.route_base || null,
        resource_type: activityData.resource_type,
        resource_id: activityData.resource_id,
        ip_address: activityData.ip_address,
        user_agent: activityData.user_agent,
        session_id: activityData.session_id,
        execution_time_ms: executionTime,
        status_code: activityData.details?.status_code || null,
        details: activityData.details || {},
        service: 'studymate',
        type: 'activity'
      };

      await this.client.index({
        index: index,
        body: document
      });

    } catch (error) {
      console.error('Error logging activity to Elasticsearch:', error.message);
      applicationLogger.activity(activityData);
    }
  }

  /**
   * Search activities
   * @param {Object} query - Elasticsearch query
   * @param {Object} options - Search options (from, size, sort)
   */
  async searchActivities(query = {}, options = {}) {
    if (!this.enabled || !this.client) {
      throw new Error('Elasticsearch is not enabled or not connected');
    }

    try {
      const index = `${this.indexPrefix}-activities-*`;
      const from = options.from || 0;
      const size = options.size || 20;
      const sort = options.sort || [{ '@timestamp': { order: 'desc' } }];

      const searchQuery = {
        index: index,
        body: {
          from: from,
          size: size,
          sort: sort,
          query: query.match_all ? { match_all: {} } : query
        }
      };

      const response = await this.client.search(searchQuery);
      
      return {
        total: response.body.hits.total.value,
        hits: response.body.hits.hits.map(hit => ({
          ...hit._source,
          _id: hit._id
        }))
      };
    } catch (error) {
      console.error('Error searching activities in Elasticsearch:', error.message);
      throw error;
    }
  }

  /**
   * Get user activities
   * @param {String} userId - User ID
   * @param {Object} options - Search options
   */
  async getUserActivities(userId, options = {}) {
    return this.searchActivities({
      bool: {
        must: [
          { term: { user_id: userId } },
          { term: { type: 'activity' } }
        ]
      }
    }, options);
  }

  /**
   * Get activities by action
   * @param {String} action - Action name
   * @param {Object} options - Search options
   */
  async getActivitiesByAction(action, options = {}) {
    return this.searchActivities({
      bool: {
        must: [
          { term: { action: action } },
          { term: { type: 'activity' } }
        ]
      }
    }, options);
  }

  /**
   * Get activities by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {Object} options - Search options
   */
  async getActivitiesByDateRange(startDate, endDate, options = {}) {
    return this.searchActivities({
      bool: {
        must: [
          {
            range: {
              '@timestamp': {
                gte: startDate.toISOString(),
                lte: endDate.toISOString()
              }
            }
          },
          { term: { type: 'activity' } }
        ]
      }
    }, options);
  }

  /**
   * Get date-based index suffix (YYYY.MM.DD)
   */
  getDateIndex() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  }

  /**
   * Create index template for activities
   */
  async createIndexTemplate() {
    if (!this.enabled || !this.client) return;

    try {
      const templateName = `${this.indexPrefix}-activities-template`;
      const indexPattern = `${this.indexPrefix}-activities-*`;

      await this.client.indices.putIndexTemplate({
        name: templateName,
        body: {
          index_patterns: [indexPattern],
          template: {
            settings: {
              number_of_shards: 1,
              number_of_replicas: 0,
              refresh_interval: '5s'
            },
            mappings: {
              properties: {
                '@timestamp': { type: 'date' },
                user_id: { type: 'keyword' },
                action: { type: 'keyword' },
                route_name: { type: 'keyword' },
                route_path: { type: 'keyword' },
                route_base: { type: 'keyword' },
                resource_type: { type: 'keyword' },
                resource_id: { type: 'keyword' },
                ip_address: { type: 'ip' },
                user_agent: { type: 'text' },
                session_id: { type: 'keyword' },
                execution_time_ms: { type: 'long' },
                status_code: { type: 'integer' },
                details: { 
                  type: 'object',
                  enabled: true,
                  properties: {
                    request_data: { type: 'object', enabled: true },
                    response_data: { type: 'object', enabled: true }
                  }
                },
                service: { type: 'keyword' },
                type: { type: 'keyword' }
              }
            }
          }
        }
      });

      console.log(`✅ Created Elasticsearch index template: ${templateName}`);
    } catch (error) {
      console.error('Error creating index template:', error.message);
    }
  }

  /**
   * Create index template for application logs
   */
  async createLogsIndexTemplate() {
    if (!this.enabled || !this.client) return;

    try {
      const templateName = `${this.indexPrefix}-logs-template`;
      const indexPattern = `${this.indexPrefix}-logs`;

      await this.client.indices.putIndexTemplate({
        name: templateName,
        body: {
          index_patterns: [indexPattern],
          template: {
            settings: {
              number_of_shards: 1,
              number_of_replicas: 0,
              refresh_interval: '5s'
            },
            mappings: {
              properties: {
                '@timestamp': { type: 'date' },
                timestamp: { type: 'date' },
                level: { type: 'keyword' },
                message: { type: 'text' },
                service: { type: 'keyword' },
                type: { type: 'keyword' },
                operation: { type: 'keyword' },
                user_id: { type: 'keyword' },
                userId: { type: 'keyword' },
                courseId: { type: 'keyword' },
                enrollmentId: { type: 'keyword' },
                testId: { type: 'keyword' },
                ip_address: { type: 'ip' },
                user_agent: { type: 'text' },
                execution_time_ms: { type: 'long' },
                error: { 
                  properties: {
                    message: { type: 'text' },
                    stack: { type: 'text' },
                    name: { type: 'keyword' }
                  }
                }
              }
            }
          }
        }
      });

      console.log(`✅ Created Elasticsearch index template: ${templateName}`);
    } catch (error) {
      console.error('Error creating logs index template:', error.message);
    }
  }

  /**
   * Bulk index activities
   * @param {Array} activities - Array of activity objects
   */
  async bulkIndexActivities(activities) {
    if (!this.enabled || !this.client || !activities || activities.length === 0) {
      return;
    }

    try {
      const body = activities.flatMap(activity => {
        const index = `${this.indexPrefix}-activities-${this.getDateIndex()}`;
        const executionTime = activity.execution_time_ms || 
                             activity.details?.response_time_ms || 
                             activity.details?.execution_time_ms || 
                             null;
        
        return [
          { index: { _index: index } },
          {
            '@timestamp': new Date().toISOString(),
            user_id: activity.user_id,
            action: activity.action,
            route_name: activity.route_name || null,
            route_path: activity.route_path || activity.details?.path || null,
            route_base: activity.route_base || null,
            resource_type: activity.resource_type,
            resource_id: activity.resource_id,
            ip_address: activity.ip_address,
            user_agent: activity.user_agent,
            session_id: activity.session_id,
            execution_time_ms: executionTime,
            status_code: activity.details?.status_code || null,
            details: activity.details || {},
            service: 'studymate',
            type: 'activity'
          }
        ];
      });

      await this.client.bulk({ body });
      console.log(`✅ Bulk indexed ${activities.length} activities to Elasticsearch`);
    } catch (error) {
      console.error('Error bulk indexing activities:', error.message);
    }
  }
}

// Create singleton instance
const elasticsearchService = new ElasticsearchService();

// Initialize index templates on startup
if (elasticsearchService.enabled) {
  setTimeout(() => {
    elasticsearchService.createIndexTemplate(); // For activities
    elasticsearchService.createLogsIndexTemplate(); // For application logs
  }, 5000); // Wait 5 seconds for Elasticsearch to be ready
}

module.exports = elasticsearchService;

