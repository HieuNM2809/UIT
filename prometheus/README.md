# Prometheus Configuration

File `prometheus.yml` cấu hình Prometheus để scrape metrics từ StudyMate application.

## Cấu hình hiện tại

- **Scrape Interval**: 15 giây (global), 10 giây cho StudyMate app
- **Retention**: 30 ngày (cấu hình trong docker-compose.yml)
- **Target**: `host.docker.internal:3000` (Windows Docker Desktop)

## Thay đổi Target

Nếu ứng dụng chạy trong Docker container, thay đổi target trong `prometheus.yml`:

```yaml
- job_name: 'studymate-app'
  static_configs:
    - targets: ['studymate-app:3000']  # Thay vì host.docker.internal:3000
```

## Thêm Targets mới

Để thêm exporters cho PostgreSQL, Redis, hoặc Node.js:

1. Thêm exporter vào `docker-compose.yml`
2. Thêm scrape config vào `prometheus.yml`
3. Reload Prometheus: `curl -X POST http://localhost:9090/-/reload`

## Reload Configuration

Sau khi chỉnh sửa `prometheus.yml`:

```bash
curl -X POST http://localhost:9090/-/reload
```

Hoặc restart container:
```bash
docker-compose restart prometheus
```

