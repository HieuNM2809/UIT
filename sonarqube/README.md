# SonarQube Configuration

Thư mục này chứa thông tin về cấu hình SonarQube cho StudyMate project.

## Tổng quan

SonarQube đã được tích hợp vào dự án StudyMate để:
- Phân tích chất lượng code (Code Quality)
- Phát hiện lỗi bảo mật (Security Vulnerabilities)
- Phát hiện code smells và bugs
- Đo lường code coverage
- Theo dõi technical debt

## Cài đặt

### 1. Khởi động SonarQube

SonarQube được cấu hình trong `docker-compose.yml` và sẽ tự động khởi động cùng với các services khác:

```bash
# Khởi động SonarQube và database
docker-compose up -d postgres_sonar sonarqube

# Hoặc khởi động tất cả services
docker-compose up -d
```

### 2. Truy cập SonarQube

- **URL:** http://localhost:9002
- **Default Username:** `admin`
- **Default Password:** `admin`

**Lưu ý:** Lần đầu đăng nhập, bạn sẽ được yêu cầu đổi mật khẩu.

## Cấu hình

### Environment Variables

Thêm vào `.env` file (tùy chọn):

```env
# SonarQube Database Password
SONAR_DB_PASSWORD=sonar123
```

### Database

SonarQube sử dụng PostgreSQL database riêng:
- **Container:** `studymate-sonar-db`
- **Database:** `sonar`
- **User:** `sonar`
- **Password:** `sonar123` (hoặc từ env `SONAR_DB_PASSWORD`)
- **Port:** `5433` (tránh conflict với main postgres trên port 5432)

## Sử dụng

### 1. Tạo Project trong SonarQube

1. Đăng nhập vào SonarQube: http://localhost:9002
2. Click **"Create Project"** > **"Manually"**
3. Điền thông tin:
   - **Project Key:** `studymate`
   - **Display Name:** `StudyMate`
4. Click **"Set Up"**
5. Chọn **"Locally"** (vì chạy SonarQube local)
6. Chọn **"Generate a token"** và lưu token lại

### 2. Cài đặt SonarQube Scanner

Cài đặt SonarQube Scanner CLI:

**Windows:**
```bash
# Download từ https://docs.sonarqube.org/latest/analyzing-source-code/scanners/sonarscanner/
# Hoặc sử dụng npm package
npm install -g sonarqube-scanner
```

**Hoặc sử dụng Docker:**
```bash
docker pull sonarsource/sonar-scanner-cli
```

### 3. Tạo sonar-project.properties

Copy file mẫu từ thư mục `sonarqube/`:

```bash
# Windows PowerShell
Copy-Item sonarqube\sonar-project.properties.example sonar-project.properties

# Linux/Mac
cp sonarqube/sonar-project.properties.example sonar-project.properties
```

Sau đó chỉnh sửa file `sonar-project.properties` và cập nhật:
- `sonar.login=YOUR_SONAR_TOKEN` - Thay bằng token của bạn

### 4. Chạy Analysis

**Cách 1: Sử dụng Script (Khuyến nghị)**

**Windows Command Prompt:**
```cmd
cd sonarqube
run-analysis.bat
```

**Windows PowerShell:**
```powershell
cd sonarqube
.\run-analysis.ps1
```

Script sẽ tự động:
- Kiểm tra Docker đang chạy
- Kiểm tra SonarQube container
- Đọc token từ `sonar-project.properties`
- Chạy analysis
- Mở report trong browser

**Cách 2: Sử dụng Web Interface**

1. Truy cập: http://localhost:3000/tools/sonarqube/report
2. Click nút **"🔄 Chạy Analysis"**
3. Đợi analysis hoàn thành
4. Xem report trong iframe hoặc click link để mở trong tab mới

**Cách 3: Sử dụng Docker trực tiếp**

**Windows PowerShell:**
```powershell
docker run --rm `
  -v "${PWD}:/usr/src" `
  -w /usr/src `
  sonarsource/sonar-scanner-cli `
  -Dsonar.projectKey=studymate `
  -Dsonar.sources=. `
  -Dsonar.host.url=http://host.docker.internal:9002 `
  -Dsonar.login=YOUR_SONAR_TOKEN
```

**Linux/Mac:**
```bash
docker run --rm \
  -v "$(pwd):/usr/src" \
  -w /usr/src \
  sonarsource/sonar-scanner-cli \
  -Dsonar.projectKey=studymate \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://host.docker.internal:9002 \
  -Dsonar.login=YOUR_SONAR_TOKEN
```

**Cách 4: Sử dụng npm package:**
```bash
# Cài đặt sonarqube-scanner
npm install --save-dev sonarqube-scanner

# Chạy analysis
npx sonar-scanner
```

## Tích hợp với CI/CD

### GitHub Actions Example

```yaml
name: SonarQube Analysis

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  sonarqube:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: SonarQube Scan
        uses: sonarsource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
```

## Quality Gates

SonarQube có sẵn Quality Gate mặc định. Bạn có thể tùy chỉnh trong:
- **Quality Gates** > **Create** hoặc **Edit**

Các metrics quan trọng:
- **Coverage:** Code coverage percentage
- **Duplicated Lines:** Duplicated code percentage
- **Maintainability Rating:** Code maintainability
- **Reliability Rating:** Bugs và reliability issues
- **Security Rating:** Security vulnerabilities

## Troubleshooting

### SonarQube không khởi động

1. Kiểm tra logs:
```bash
docker logs studymate-sonarqube
```

2. Kiểm tra database connection:
```bash
docker logs studymate-sonar-db
```

3. Kiểm tra memory:
```bash
# SonarQube cần ít nhất 2GB RAM
docker stats studymate-sonarqube
```

### Analysis fails

1. Kiểm tra token có đúng không
2. Kiểm tra `sonar.host.url` có đúng không
3. Kiểm tra file `sonar-project.properties` có đúng format không
4. Xem logs của SonarQube scanner

### Port conflict

Nếu port 9002 đã được sử dụng, thay đổi trong `docker-compose.yml`:
```yaml
ports:
  - "9003:9000"  # Thay đổi port bên trái
```

## Best Practices

1. **Chạy analysis thường xuyên:** Tích hợp vào CI/CD pipeline
2. **Fix critical issues:** Ưu tiên fix các issues có mức độ cao
3. **Maintain code coverage:** Giữ code coverage trên 70%
4. **Review quality gates:** Đảm bảo code pass quality gates trước khi merge
5. **Use quality profiles:** Tùy chỉnh rules phù hợp với project

## Tài liệu tham khảo

- [SonarQube Documentation](https://docs.sonarqube.org/)
- [SonarQube Scanner](https://docs.sonarqube.org/latest/analyzing-source-code/scanners/sonarscanner/)
- [Quality Gates](https://docs.sonarqube.org/latest/user-guide/quality-gates/)

