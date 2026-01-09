# 📊 Kiến Trúc Giám Sát và Quan Sát - StudyMate

**Ngày tạo:** 2026-01-02  
**Phiên bản:** 1.0.0

---

## 📋 Tổng Quan

Hệ thống giám sát và quan sát bao gồm:
- **Metrics Collection** - Thu thập metrics với Prometheus
- **Logging System** - Ghi log với Winston + Elasticsearch
- **Activity Tracking** - Theo dõi hoạt động người dùng
- **Visualization** - Hiển thị với Grafana và Kibana
- **Alerting** - Cảnh báo khi có vấn đề

---

## 🏗️ 1. Component Architecture

```mermaid
graph TB
    subgraph "Application Layer"
        App[📦 StudyMate App]
        MetricsMW[Metrics Middleware]
        Logger[Application Logger]
        ActivityLogger[Activity Logger]
    end

    subgraph "Metrics Collection"
        PromClient[Prometheus Client<br/>prom-client]
        CustomMetrics[Custom Metrics]
        HTTPMetrics[HTTP Metrics]
        DatabaseMetrics[Database Metrics]
        RedisMetrics[Redis Metrics]
        AIMetrics[AI Metrics]
        SocketMetrics[Socket Metrics]
    end

    subgraph "Logging System"
        Winston[Winston Logger]
        ElasticService[Elasticsearch Service]
        LogFormatter[Log Formatter]
    end

    subgraph "Storage & Visualization"
        Prometheus[📊 Prometheus<br/>Port: 9090]
        Elasticsearch[📊 Elasticsearch<br/>Port: 9200]
        Grafana[📈 Grafana<br/>Port: 3001]
        Kibana[📈 Kibana<br/>Port: 5601]
    end

    subgraph "Alerting"
        PrometheusAlerts[Prometheus Alerts]
        GrafanaAlerts[Grafana Alerts]
    end

    App --> MetricsMW
    App --> Logger
    App --> ActivityLogger
    
    MetricsMW --> PromClient
    MetricsMW --> CustomMetrics
    MetricsMW --> HTTPMetrics
    MetricsMW --> DatabaseMetrics
    MetricsMW --> RedisMetrics
    MetricsMW --> AIMetrics
    MetricsMW --> SocketMetrics
    
    Logger --> Winston
    Winston --> ElasticService
    ActivityLogger --> ElasticService
    
    ElasticService --> Elasticsearch
    PromClient --> Prometheus
    
    Prometheus --> Grafana
    Elasticsearch --> Kibana
    
    Prometheus --> PrometheusAlerts
    Grafana --> GrafanaAlerts

    style Prometheus fill:#E6522C,stroke:#B8411F,stroke-width:2px,color:#fff
    style Grafana fill:#F46800,stroke:#C35200,stroke-width:2px,color:#fff
    style Elasticsearch fill:#005571,stroke:#003D52,stroke-width:2px,color:#fff
    style Kibana fill:#005571,stroke:#003D52,stroke-width:2px,color:#fff
```

---

## 📊 2. Metrics Collection Flow

```mermaid
sequenceDiagram
    participant Request
    participant MetricsMW
    participant PromClient
    participant CustomMetrics
    participant Prometheus

    Request->>MetricsMW: HTTP Request
    MetricsMW->>MetricsMW: Start timer
    
    MetricsMW->>PromClient: Record HTTP request
    PromClient->>PromClient: Increment http_requests_total<br/>{ method, route, status }
    
    MetricsMW->>Request: Process request
    Request-->>MetricsMW: Response
    
    MetricsMW->>MetricsMW: Calculate duration
    MetricsMW->>PromClient: Record HTTP duration
    PromClient->>PromClient: Observe http_request_duration_seconds<br/>{ method, route, status }
    
    MetricsMW->>CustomMetrics: Record custom metrics
    CustomMetrics->>PromClient: Update custom metrics
    
    Prometheus->>PromClient: Scrape metrics (every 15s)
    PromClient-->>Prometheus: Metrics data
    Prometheus->>Prometheus: Store metrics
```

---

## 📝 3. Logging Flow

```mermaid
sequenceDiagram
    participant App
    participant Logger
    participant Winston
    participant ElasticService
    participant Elasticsearch
    participant Kibana

    App->>Logger: applicationLogger.info(message, meta)
    Logger->>Winston: logger.info(message, meta)
    Winston->>Winston: Format log entry
    
    alt Elasticsearch enabled
        Logger->>ElasticService: logApplicationLog({ level, message, metadata })
        ElasticService->>Elasticsearch: POST /_doc
        Elasticsearch-->>ElasticService: Document created
        ElasticService-->>Logger: Logged
    end
    
    Winston->>Winston: Write to console (errors only)
    
    Kibana->>Elasticsearch: Query logs
    Elasticsearch-->>Kibana: Log data
    Kibana->>Kibana: Visualize logs
```

---

## 📋 4. Activity Logging Flow

```mermaid
sequenceDiagram
    participant Request
    participant ActivityMW
    participant ElasticService
    participant Elasticsearch
    participant Kibana

    Request->>ActivityMW: HTTP Request
    ActivityMW->>ActivityMW: Extract activity data<br/>(user_id, action, resource_type, etc.)
    
    Request-->>ActivityMW: Response
    
    ActivityMW->>ActivityMW: Calculate execution time
    ActivityMW->>ElasticService: logActivity(activityData)
    
    ElasticService->>ElasticService: Format activity log
    ElasticService->>Elasticsearch: POST /activities/_doc
    Elasticsearch-->>ElasticService: Document created
    ElasticService-->>ActivityMW: Logged
    
    Kibana->>Elasticsearch: Query activities
    Elasticsearch-->>Kibana: Activity data
    Kibana->>Kibana: Visualize activities
```

---

## 📊 5. Metrics Types

```mermaid
graph TB
    subgraph "HTTP Metrics"
        HTTPRequests[http_requests_total<br/>Counter]
        HTTPDuration[http_request_duration_seconds<br/>Histogram]
        HTTPStatus[http_status_codes<br/>Counter by status]
    end

    subgraph "Database Metrics"
        DBQueries[db_queries_total<br/>Counter]
        DBDuration[db_query_duration_seconds<br/>Histogram]
        DBConnections[db_connections_active<br/>Gauge]
    end

    subgraph "Redis Metrics"
        RedisOps[redis_operations_total<br/>Counter]
        RedisDuration[redis_operation_duration_seconds<br/>Histogram]
        RedisCacheHit[redis_cache_hits<br/>Counter]
        RedisCacheMiss[redis_cache_misses<br/>Counter]
    end

    subgraph "AI Metrics"
        AIRequests[ai_requests_total<br/>Counter]
        AIDuration[ai_request_duration_seconds<br/>Histogram]
        AITokens[ai_tokens_used<br/>Counter]
        AIErrors[ai_errors_total<br/>Counter]
    end

    subgraph "Socket Metrics"
        SocketConnections[socket_connections_total<br/>Counter]
        SocketMessages[socket_messages_total<br/>Counter]
        SocketActiveUsers[socket_active_users<br/>Gauge]
    end

    subgraph "Business Metrics"
        CourseEnrollments[course_enrollments_total<br/>Counter]
        CourseCompletions[course_completions_total<br/>Counter]
        UserRegistrations[user_registrations_total<br/>Counter]
        ActiveUsers[active_users<br/>Gauge]
    end

    style HTTPRequests fill:#4A90E2,stroke:#2E5C8A,stroke-width:2px,color:#fff
    style DBQueries fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style RedisOps fill:#DC382D,stroke:#A0261E,stroke-width:2px,color:#fff
    style AIRequests fill:#FF6B6B,stroke:#CC5555,stroke-width:2px,color:#fff
```

---

## 📈 6. Dashboard Structure

```mermaid
graph TB
    subgraph "Grafana Dashboards"
        SystemMetrics[System Metrics<br/>CPU, Memory, Disk]
        ApplicationMetrics[Application Metrics<br/>HTTP, Database, Redis]
        BusinessMetrics[Business Metrics<br/>Users, Courses, Enrollments]
        AIMetrics[AI Metrics<br/>Requests, Tokens, Errors]
    end

    subgraph "Kibana Dashboards"
        ApplicationLogs[Application Logs<br/>Error logs, Info logs]
        ActivityLogs[Activity Logs<br/>User activities]
        SecurityLogs[Security Logs<br/>Auth attempts, Failed requests]
        PerformanceLogs[Performance Logs<br/>Slow queries, Timeouts]
    end

    SystemMetrics --> Grafana
    ApplicationMetrics --> Grafana
    BusinessMetrics --> Grafana
    AIMetrics --> Grafana
    
    ApplicationLogs --> Kibana
    ActivityLogs --> Kibana
    SecurityLogs --> Kibana
    PerformanceLogs --> Kibana

    style Grafana fill:#F46800,stroke:#C35200,stroke-width:2px,color:#fff
    style Kibana fill:#005571,stroke:#003D52,stroke-width:2px,color:#fff
```

---

## 🔔 7. Alerting Flow

```mermaid
sequenceDiagram
    participant Prometheus
    participant AlertManager
    participant Grafana
    participant NotificationChannel
    participant Admin

    Prometheus->>Prometheus: Evaluate alert rules
    Prometheus->>Prometheus: Check metric thresholds
    
    alt Threshold exceeded
        Prometheus->>AlertManager: Trigger alert
        AlertManager->>AlertManager: Process alert
        AlertManager->>NotificationChannel: Send notification
        NotificationChannel->>Admin: Email/Slack notification
        
        AlertManager->>Grafana: Update alert status
        Grafana->>Grafana: Display alert in dashboard
    end
```

---

## 📊 8. Log Structure

### Application Log
```javascript
{
  level: 'info' | 'error' | 'warn' | 'debug',
  message: String,
  timestamp: ISO8601,
  metadata: {
    type: 'application' | 'api' | 'database' | 'ai' | 'socket',
    operation: String,
    userId: UUID (Optional),
    execution_time_ms: Number (Optional),
    // ... additional context
  }
}
```

### Activity Log
```javascript
{
  user_id: UUID (Optional),
  action: String (e.g., 'enroll_course', 'complete_content'),
  route_name: String,
  route_path: String,
  route_base: String,
  resource_type: String (e.g., 'course', 'content'),
  resource_id: UUID (Optional),
  ip_address: String,
  user_agent: String,
  session_id: String,
  execution_time_ms: Number,
  details: JSON (Optional),
  timestamp: ISO8601
}
```

---

## 🔗 9. Metrics Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/metrics` | Prometheus metrics endpoint | No (Public) |
| GET | `/health` | Health check endpoint | No (Public) |

---

## 📝 Ghi Chú

### Metrics Collection
- **Scrape Interval**: Prometheus scrapes every 15 seconds
- **Retention**: Metrics retained for 30 days
- **Cardinality**: Limit label cardinality to prevent explosion

### Logging Best Practices
- **Structured Logging**: All logs in JSON format
- **Log Levels**: Use appropriate levels (info, error, warn, debug)
- **No PII**: Avoid logging sensitive information
- **Context**: Include relevant context in metadata

### Performance Considerations
- **Async Logging**: Logs sent asynchronously to Elasticsearch
- **Batching**: Batch logs when possible
- **Sampling**: Sample high-volume logs if needed
- **Indexing**: Proper index management in Elasticsearch

### Alert Rules Examples
- **High Error Rate**: Error rate > 5% in 5 minutes
- **Slow Response Time**: P95 latency > 2 seconds
- **Database Issues**: DB connection pool > 80% full
- **AI Service Down**: AI error rate > 50% in 1 minute

---

**Tác giả:** StudyMate Development Team  
**Cập nhật:** 2026-01-02

