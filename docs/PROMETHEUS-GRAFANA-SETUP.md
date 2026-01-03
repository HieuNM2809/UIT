# Prometheus & Grafana Setup Guide

Hướng dẫn tích hợp và sử dụng Prometheus và Grafana để monitor StudyMate application.

## Tổng quan

Prometheus và Grafana đã được tích hợp vào dự án StudyMate để:
- Thu thập metrics từ ứng dụng Node.js/Express
- Visualize metrics qua Grafana dashboards
- Monitor performance, errors, và business metrics
- Track AI usage, database queries, và HTTP requests

## Cấu trúc Files

```
├── prometheus/
│   └── prometheus.yml          # Cấu hình Prometheus
├── grafana/
│   ├── provisioning/
│   │   ├── datasources/
│   │   │   └── prometheus.yml  # Cấu hình Prometheus datasource
│   │   └── dashboards/
│   │       └── dashboard.yml   # Cấu hình auto-load dashboards
│   └── dashboards/
│       └── studymate-overview.json  # Dashboard mẫu
├── middleware/
│   └── metrics.js              # Metrics middleware và helpers
└── docker-compose.yml          # Docker services cho Prometheus & Grafana
```

## Cài đặt

### 1. Dependencies

Package `prom-client` đã được cài đặt:
```bash
npm install prom-client --save
```

### 2. Khởi động Services

Khởi động Prometheus và Grafana qua Docker Compose:
```bash
docker-compose up -d prometheus grafana
```

Hoặc khởi động tất cả services:
```bash
docker-compose up -d
```

### 3. Truy cập Services

- **Prometheus UI**: http://localhost:9090
- **Grafana UI**: http://localhost:3001
  - Username: `admin` (hoặc từ env `GRAFANA_ADMIN_USER`)
  - Password: `admin123` (hoặc từ env `GRAFANA_ADMIN_PASSWORD`)

## Metrics Endpoint

Ứng dụng StudyMate expose metrics tại:
```
GET http://localhost:3000/metrics
```

Prometheus sẽ tự động scrape endpoint này mỗi 10 giây.

## Metrics được thu thập

### HTTP Metrics
- `studymate_http_requests_total` - Tổng số HTTP requests
- `studymate_http_request_duration_seconds` - Thời gian xử lý HTTP requests
- `studymate_http_request_size_bytes` - Kích thước HTTP requests
- `studymate_http_response_size_bytes` - Kích thước HTTP responses

### Database Metrics
- `studymate_db_query_duration_seconds` - Thời gian thực thi database queries
- `studymate_db_queries_total` - Tổng số database queries

### Redis Metrics
- `studymate_redis_operation_duration_seconds` - Thời gian Redis operations
- `studymate_redis_operations_total` - Tổng số Redis operations

### Socket.IO Metrics
- `studymate_socket_connections` - Số lượng Socket.IO connections hiện tại
- `studymate_socket_messages_total` - Tổng số Socket.IO messages

### AI Service Metrics
- `studymate_ai_request_duration_seconds` - Thời gian AI API requests
- `studymate_ai_requests_total` - Tổng số AI API requests
- `studymate_ai_tokens_total` - Tổng số AI tokens đã sử dụng

### Business Metrics
- `studymate_course_enrollments_total` - Tổng số course enrollments
- `studymate_content_completions_total` - Tổng số content completions
- `studymate_active_users` - Số lượng active users hiện tại

### Error Metrics
- `studymate_errors_total` - Tổng số errors

### System Metrics (tự động)
- `studymate_process_cpu_user_seconds_total` - CPU usage
- `studymate_process_resident_memory_bytes` - Memory usage
- `studymate_nodejs_heap_size_total_bytes` - Node.js heap size
- Và nhiều metrics khác từ `prom-client` default metrics

## Sử dụng Metrics trong Code

### Ghi Database Metrics

```javascript
const { metrics } = require('./middleware/metrics');

// Trong controller hoặc service
const startTime = Date.now();
try {
  const result = await Model.findAll();
  const duration = (Date.now() - startTime) / 1000;
  metrics.recordDbQuery('findAll', 'Model', duration, 'success');
} catch (error) {
  const duration = (Date.now() - startTime) / 1000;
  metrics.recordDbQuery('findAll', 'Model', duration, 'error');
}
```

### Ghi Redis Metrics

```javascript
const { metrics } = require('./middleware/metrics');

const startTime = Date.now();
try {
  await redisClient.get('key');
  const duration = (Date.now() - startTime) / 1000;
  metrics.recordRedisOperation('get', duration, 'success');
} catch (error) {
  const duration = (Date.now() - startTime) / 1000;
  metrics.recordRedisOperation('get', duration, 'error');
}
```

### Ghi AI Metrics

```javascript
const { metrics } = require('./middleware/metrics');

const startTime = Date.now();
try {
  const response = await aiService.generateText(prompt);
  const duration = (Date.now() - startTime) / 1000;
  
  metrics.recordAIRequest('gemini', 'generateText', duration, 'success');
  metrics.recordAITokens('gemini', response.promptTokens, response.completionTokens);
} catch (error) {
  const duration = (Date.now() - startTime) / 1000;
  metrics.recordAIRequest('gemini', 'generateText', duration, 'error');
}
```

### Ghi Business Metrics

```javascript
const { metrics } = require('./middleware/metrics');

// Khi user enroll vào course
metrics.recordCourseEnrollment(courseId, 'success');

// Khi user hoàn thành content
metrics.recordContentCompletion(contentId, courseId);

// Cập nhật số active users
metrics.setActiveUsers(activeUserCount);
```

### Ghi Socket.IO Metrics

```javascript
const { metrics } = require('./middleware/metrics');

// Trong socket handler
io.on('connection', (socket) => {
  const connectionCount = io.sockets.sockets.size;
  metrics.setSocketConnections(connectionCount);
  
  socket.on('message', (data) => {
    metrics.recordSocketMessage('message', 'success');
  });
});
```

## Grafana Dashboards

### StudyMate Overview Dashboard

Dashboard mặc định được tự động load vào Grafana với các panels:
- HTTP Request Rate và Duration
- Error Rate
- Active Socket Connections
- Database Query Performance
- AI Request Performance
- AI Tokens Usage
- Course Enrollments
- Active Users
- HTTP Status Codes
- Node.js Memory và CPU Usage

### Tạo Dashboard mới

1. Truy cập Grafana: http://localhost:3001
2. Login với admin credentials
3. Click "Create" > "Dashboard"
4. Thêm panels và sử dụng Prometheus queries

### Prometheus Queries mẫu

```promql
# HTTP Request Rate
rate(studymate_http_requests_total[5m])

# HTTP Request Duration (p95)
histogram_quantile(0.95, rate(studymate_http_request_duration_seconds_bucket[5m]))

# Error Rate
sum(rate(studymate_errors_total[5m]))

# Database Query Duration (p99)
histogram_quantile(0.99, rate(studymate_db_query_duration_seconds_bucket[5m]))

# AI Tokens Used (last hour)
sum(increase(studymate_ai_tokens_total[1h]))

# Active Users
studymate_active_users
```

## Cấu hình

### Environment Variables

Thêm vào `.env`:
```env
# Grafana
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=admin123
```

### Prometheus Configuration

File `prometheus/prometheus.yml` có thể được chỉnh sửa để:
- Thay đổi scrape interval
- Thêm targets mới
- Cấu hình alerting rules

Sau khi chỉnh sửa, reload Prometheus config:
```bash
curl -X POST http://localhost:9090/-/reload
```

### Grafana Configuration

- Datasource được tự động provision từ `grafana/provisioning/datasources/prometheus.yml`
- Dashboards được tự động load từ `grafana/dashboards/`

## Troubleshooting

### Prometheus không scrape được metrics

1. Kiểm tra ứng dụng có chạy không: `http://localhost:3000/health`
2. Kiểm tra metrics endpoint: `http://localhost:3000/metrics`
3. Kiểm tra Prometheus targets: http://localhost:9090/targets
4. Nếu app chạy trên Windows host, Prometheus trong Docker cần dùng `host.docker.internal:3000`

### Grafana không hiển thị data

1. Kiểm tra Prometheus datasource trong Grafana: Configuration > Data Sources
2. Test connection đến Prometheus
3. Kiểm tra Prometheus có scrape được metrics không
4. Kiểm tra time range trong dashboard

### Metrics không được ghi

1. Đảm bảo `metricsMiddleware` đã được thêm vào `app.js`
2. Kiểm tra `/metrics` endpoint có trả về data không
3. Xem logs của ứng dụng để tìm lỗi

## Best Practices

1. **Không ghi quá nhiều metrics**: Chỉ ghi metrics quan trọng để tránh overhead
2. **Sử dụng labels hợp lý**: Labels giúp filter và group metrics nhưng không nên quá nhiều
3. **Monitor costs**: AI tokens metrics giúp track chi phí sử dụng AI
4. **Set up alerts**: Cấu hình alerts trong Prometheus/Grafana cho critical metrics
5. **Retention policy**: Prometheus giữ metrics 30 ngày (có thể điều chỉnh trong docker-compose.yml)

## Tài liệu tham khảo

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [prom-client Documentation](https://github.com/siimon/prom-client)

