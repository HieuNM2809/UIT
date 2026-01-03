# Grafana Configuration

Thư mục này chứa cấu hình Grafana cho StudyMate monitoring.

## Cấu trúc

- `provisioning/datasources/` - Cấu hình Prometheus datasource (tự động load)
- `provisioning/dashboards/` - Cấu hình auto-load dashboards
- `dashboards/` - Dashboard JSON files

## Dashboard

Dashboard mẫu `studymate-overview.json` sẽ được tự động load khi Grafana khởi động.

### Tạo Dashboard mới

1. Tạo dashboard trong Grafana UI
2. Export dashboard (Share > Export > Save to file)
3. Lưu file JSON vào thư mục `dashboards/`
4. Dashboard sẽ tự động được load lại

### Chỉnh sửa Dashboard

1. Chỉnh sửa trong Grafana UI
2. Export lại và lưu vào `dashboards/`
3. Hoặc chỉnh sửa trực tiếp file JSON

## Lưu ý

- Dashboard JSON format có thể phức tạp, nên tạo trong UI trước rồi export
- File JSON cần có format đúng của Grafana
- Grafana sẽ tự động reload dashboards mỗi 10 giây

