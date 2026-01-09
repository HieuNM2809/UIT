# 🔐 Vault & 📊 Kibana Integration

## Part A: HashiCorp Vault - Secret Management

### Tổng quan
Vault là hệ thống quản lý secrets (API keys, passwords, tokens) một cách bảo mật và tập trung.

### Architecture
```
┌─────────────────────────────────────────────┐
│         StudyMate Application               │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │  config/vault.js                     │  │
│  │  - loadVaultSecrets()                │  │
│  │  - Loads before database connection  │  │
│  └──────────────────────────────────────┘  │
│               ↓                             │
│  ┌──────────────────────────────────────┐  │
│  │  services/vaultService.js            │  │
│  │  - getSecret(key)                    │  │
│  │  - initialize()                      │  │
│  │  - Cache with Redis                  │  │
│  └──────────────────────────────────────┘  │
│               ↓                             │
└─────────────────────────────────────────────┘
                ↓ HTTP API
┌─────────────────────────────────────────────┐
│   HashiCorp Vault (Port 8200)               │
│                                             │
│   Path: studymate/data/studymate            │
│   {                                         │
│     DB_PASSWORD: "...",                     │
│     REDIS_PASSWORD: "...",                  │
│     JWT_SECRET: "...",                      │
│     OPENAI_API_KEY: "...",                  │
│     GEMINI_API_KEY: "...",                  │
│     SMTP_PASSWORD: "..."                    │
│   }                                         │
└─────────────────────────────────────────────┘
```

### Configuration

#### Environment Variables (.env)
```bash
# Vault Configuration
VAULT_ENABLED=true
VAULT_ADDR=http://localhost:8200
VAULT_TOKEN=hvs.xxxxxxxxxxxxx
VAULT_SECRET_PATH=studymate/data/studymate
VAULT_CACHE_TTL=3600  # 1 hour cache
```

#### Docker Compose
```yaml
services:
  vault:
    image: vault:latest
    container_name: studymate_vault
    ports:
      - "8200:8200"
    environment:
      VAULT_DEV_ROOT_TOKEN_ID: vault-root-token
      VAULT_DEV_LISTEN_ADDRESS: 0.0.0.0:8200
    cap_add:
      - IPC_LOCK
    volumes:
      - vault-data:/vault/data
    command: server -dev
```

### Vault Service Implementation

#### services/vaultService.js
```javascript
class VaultService {
  constructor() {
    this.enabled = process.env.VAULT_ENABLED === 'true';
    this.address = process.env.VAULT_ADDR;
    this.token = process.env.VAULT_TOKEN;
    this.secretPath = process.env.VAULT_SECRET_PATH;
    this.cachePrefix = 'vault:config:';
    this.cacheTTL = 3600; // 1 hour
  }

  async getSecret(key) {
    if (!this.enabled) {
      return process.env[key]; // Fallback to .env
    }

    try {
      // Try cache first
      const cached = await redis.get(this.cachePrefix + key);
      if (cached) return cached;

      // Fetch from Vault
      const response = await axios.get(
        `${this.address}/v1/${this.secretPath}`,
        {
          headers: { 'X-Vault-Token': this.token }
        }
      );

      const value = response.data.data.data[key];
      
      // Cache the result
      if (value) {
        await redis.setex(
          this.cachePrefix + key,
          this.cacheTTL,
          value
        );
      }

      return value || process.env[key]; // Fallback
    } catch (error) {
      logger.error('Vault error:', error);
      return process.env[key]; // Fallback
    }
  }

  async initialize() {
    if (!this.enabled) {
      logger.info('Vault is disabled');
      return;
    }

    try {
      // Test connection
      await axios.get(`${this.address}/v1/sys/health`, {
        headers: { 'X-Vault-Token': this.token }
      });
      
      logger.info('Vault connected successfully');
    } catch (error) {
      logger.warn('Vault connection failed, using .env fallback');
    }
  }
}

module.exports = new VaultService();
```

#### config/vault.js
```javascript
const vaultService = require('../services/vaultService');

async function loadVaultSecrets() {
  try {
    await vaultService.initialize();
    
    // Override sensitive env vars with Vault values
    const secrets = [
      'DB_PASSWORD',
      'REDIS_PASSWORD', 
      'JWT_SECRET',
      'SESSION_SECRET',
      'OPENAI_API_KEY',
      'GEMINI_API_KEY',
      'SMTP_PASSWORD'
    ];

    for (const key of secrets) {
      const value = await vaultService.getSecret(key);
      if (value) {
        process.env[key] = value;
        logger.info(`✓ Loaded ${key} from Vault`);
      }
    }
  } catch (error) {
    logger.error('Failed to load Vault secrets', error);
    // Continue with .env values
  }
}

module.exports = { loadVaultSecrets };
```

### Usage Flow

#### Application Startup (index.js)
```javascript
// 1. Load .env first
require('dotenv').config();

// 2. Load Vault secrets (override .env if available)
const { loadVaultSecrets } = require('./config/vault');

async function initializeApp() {
  // Load secrets before connecting to databases
  await loadVaultSecrets();
  
  // Now connect to databases with secrets from Vault
  await connectDB();  // Uses DB_PASSWORD from Vault
  await connectRedis(); // Uses REDIS_PASSWORD from Vault
  
  // Start server
  app.listen(PORT);
}
```

### Security Benefits
1. ✅ **Centralized secret management**
2. ✅ **Encryption at rest and in transit**
3. ✅ **Audit logging** (who accessed what secret)
4. ✅ **Secret rotation** without code changes
5. ✅ **Access control** via Vault policies
6. ✅ **No secrets in code or .env files** (production)

---

## Part B: Kibana - Log Visualization & Analytics

### Tổng quan
Kibana là dashboard visualization cho Elasticsearch, giúp xem và phân tích logs.

### ELK Stack Architecture
```
┌─────────────────────────────────────────────┐
│         StudyMate Application               │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │  Winston Logger                      │  │
│  │  - Console transport                 │  │
│  │  - File transport                    │  │
│  │  - Elasticsearch transport  ────────┼──┐
│  └──────────────────────────────────────┘  ││
└─────────────────────────────────────────────┘│
                                               │
         ┌─────────────────────────────────────┘
         │
         ↓
┌────────────────────────────────────┐
│   Elasticsearch (Port 9200)        │
│   - Stores logs as documents       │
│   - Index: studymate-logs-*        │
│   - Full-text search               │
└────────────────────────────────────┘
         ↓
┌────────────────────────────────────┐
│   Kibana (Port 5601)               │
│   - Visualize logs                 │
│   - Create dashboards              │
│   - Search & filter logs           │
│   - Real-time monitoring           │
└────────────────────────────────────┘
         ↓
   👤 Developers/Admins
```

### Docker Compose Configuration

```yaml
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    container_name: studymate_elasticsearch
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch-data:/usr/share/elasticsearch/data
    networks:
      - studymate-network

  kibana:
    image: docker.elastic.co/kibana/kibana:8.11.0
    container_name: studymate_kibana
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch
    networks:
      - studymate-network

volumes:
  elasticsearch-data:

networks:
  studymate-network:
    driver: bridge
```

### Winston Elasticsearch Transport

#### config/logger.js
```javascript
const winston = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');

// Elasticsearch transport
const esTransportOpts = {
  level: 'info',
  clientOpts: {
    node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200'
  },
  index: 'studymate-logs', // Will create studymate-logs-YYYY.MM.DD
  dataStream: true,
  transformer: (logData) => {
    return {
      '@timestamp': new Date().toISOString(),
      severity: logData.level,
      message: logData.message,
      fields: logData.metadata,
      application: 'studymate',
      environment: process.env.NODE_ENV
    };
  }
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new ElasticsearchTransport(esTransportOpts)
  ]
});

module.exports = logger;
```

### Kibana Dashboards

#### 1. Application Overview Dashboard
- **Total requests** (last 24h)
- **Error rate** (percentage)
- **Response time** (avg, p95, p99)
- **Active users**
- **API endpoint usage**

#### 2. Error Monitoring Dashboard
- **Error timeline** (last 7 days)
- **Top errors** (by count)
- **Error by endpoint**
- **Error stack traces**
- **User impact** (affected users)

#### 3. User Activity Dashboard
- **Login attempts** (success/fail)
- **Registration trends**
- **Course enrollments**
- **AI chatbot usage**
- **Quiz completions**

#### 4. Performance Monitoring
- **Database query times**
- **Redis cache hit rate**
- **API response times** by endpoint
- **Slow queries** (> 1s)

### Kibana Queries Examples

#### Find all errors in last hour
```
level: "error" AND @timestamp >= now-1h
```

#### Find failed login attempts
```
message: "Invalid credentials" AND type: "auth"
```

#### Find slow API requests
```
response_time > 1000 AND @timestamp >= now-24h
```

#### Find AI chatbot errors
```
service: "aiService" AND level: "error"
```

### Alerting (Kibana Alerts)

#### High Error Rate Alert
```yaml
Trigger: 
  - Error rate > 5% in last 5 minutes
Action:
  - Send email to dev team
  - Create Slack notification
  - Log to incident management
```

#### Database Connection Alert
```yaml
Trigger:
  - Message contains "database connection failed"
Action:
  - Alert admin immediately
  - Auto-restart DB container (if configured)
```

### Log Structure

```json
{
  "@timestamp": "2026-01-09T21:30:00.000Z",
  "level": "error",
  "message": "Failed to process payment",
  "service": "paymentService",
  "user_id": "uuid-123",
  "transaction_id": "TXN_123",
  "error": {
    "name": "PaymentError",
    "message": "Insufficient funds",
    "stack": "..."
  },
  "request": {
    "method": "POST",
    "url": "/api/payments/create",
    "ip": "192.168.1.1"
  },
  "environment": "production",
  "application": "studymate"
}
```

### Access Kibana
1. Navigate to: `http://localhost:5601`
2. Go to "Discover" → Select index pattern `studymate-logs-*`
3. Create visualizations and dashboards
4. Set up alerts for critical events

---

## Integration Summary

### Secrets Flow (with Vault)
```
Application startup
  ↓
Load .env (base config)
  ↓
Connect to Vault
  ↓
Fetch secrets (DB_PASSWORD, API_KEYS, etc.)
  ↓
Override process.env with Vault values
  ↓
Connect to databases using secrets
  ↓
Application running with secure secrets
```

### Logging Flow (with Kibana)
```
Application event occurs
  ↓
Winston logger captures
  ↓
Log to Console (dev)
  ↓
Log to File (backup)
  ↓
Send to Elasticsearch (indexing)
  ↓
Kibana visualizes
  ↓
Admins/Developers analyze
```

### Benefits Combined
1. **Security**: All secrets in Vault, not in code
2. **Observability**: All logs in Kibana, easy to search
3. **Compliance**: Audit trail for secrets access
4. **Debugging**: Quick log search and analysis
5. **Alerting**: Real-time notifications for issues
