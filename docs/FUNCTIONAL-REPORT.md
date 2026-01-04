# 📋 Báo Cáo Chức Năng - StudyMate AI

**Ngày tạo:** 2026-01-02  
**Cập nhật lần cuối:** 2026-01-02  
**Phiên bản:** 1.1.0  
**Trạng thái:** Đang phát triển

---

## 📊 Tổng Quan Dự Án

**StudyMate** là nền tảng học tập thông minh được phát triển cho sinh viên UIT, tích hợp công nghệ AI để hỗ trợ quá trình học tập. Ứng dụng được lấy cảm hứng từ Duolingo với các nguyên tắc gamification và trải nghiệm học tập cá nhân hóa.

### Thông Tin Dự Án
- **Trường:** Đại học Công nghệ Thông tin - ĐHQG-HCM
- **Năm học:** 2026-2025
- **Giáo viên hướng dẫn:** ThS. Phạm Thế Sơn
- **Nhóm phát triển:**
  - Nguyễn Minh Hiếu (MSSV: 24410158)
  - Lê Anh Kiệt (MSSV: 24410183)

---

## 🏗️ Kiến Trúc Hệ Thống

### Công Nghệ Backend
- **Framework:** Node.js + Express.js
- **Database:** PostgreSQL (chính), Redis (cache/session)
- **ORM:** Sequelize
- **Authentication:** JWT + Passport.js (Local, Google OAuth)
- **Real-time:** Socket.IO
- **Logging:** Winston + Elasticsearch/Kibana
- **Storage:** MinIO (Object Storage)
- **AI Services:** OpenAI GPT, Google Gemini

### Công Nghệ Frontend
- **Template Engine:** EJS
- **Styling:** Tailwind CSS
- **JavaScript:** Vanilla JS (ES6+)
- **Real-time:** Socket.IO Client

### DevOps & Infrastructure
- **Containerization:** Docker & Docker Compose
- **Process Manager:** PM2
- **Monitoring:** 
  - Elasticsearch/Kibana (Logging)
  - Prometheus/Grafana (Metrics)
- **Code Quality:** SonarQube (Code analysis & security scanning)
- **Message Queue:** Apache Kafka (Event streaming & message queue)

---

## 📦 Cấu Trúc Dự Án

```
studymate/
├── controllers/          # Business logic (MVC)
│   ├── admin/           # Admin controllers
│   ├── aiController.js  # AI features
│   ├── authController.js
│   ├── chatController.js
│   ├── courseController.js
│   └── ...
├── routes/              # Route definitions
├── models/             # Database models (Sequelize)
├── services/           # External services
│   ├── aiService.js
│   ├── geminiService.js
│   ├── elasticsearchService.js
│   └── ...
├── middleware/         # Express middleware
├── validators/         # Input validation
├── views/             # EJS templates
├── public/            # Static assets
├── socketHandlers/    # Socket.IO handlers
├── config/            # Configuration files
├── sonarqube/         # SonarQube configuration
│   ├── run-analysis.bat  # Analysis script
│   ├── sonar-project.properties  # SonarQube config
│   └── README.md      # SonarQube documentation
├── prometheus/        # Prometheus configuration
└── grafana/           # Grafana dashboards
```

---

## 🎯 Chức Năng Chính

## 1. 🔐 Xác Thực & Quản Lý Người Dùng

### 1.1. Đăng Ký & Đăng Nhập
- ✅ **Đăng ký tài khoản** với email/password
- ✅ **Đăng nhập** với email/password
- ✅ **Google OAuth** - Đăng nhập bằng Google
- ✅ **Xác thực email** - Email verification system
- ✅ **Quên mật khẩu** - Password reset via email
- ✅ **JWT Authentication** - Token-based auth
- ✅ **Session Management** - Redis-based sessions

### 1.2. Quản Lý Hồ Sơ
- ✅ **Xem/Chỉnh sửa hồ sơ** cá nhân
- ✅ **Upload avatar** - Ảnh đại diện
- ✅ **Cập nhật thông tin** (tên, email, số điện thoại)
- ✅ **Đổi mật khẩu**

### 1.3. Phân Quyền
- ✅ **Role-based Access Control:**
  - `student` - Sinh viên
  - `teacher` - Giảng viên
  - `lecturer` - Giảng viên
  - `admin` - Quản trị viên
  - `system_admin` - Quản trị hệ thống

**Routes:**
- `GET /auth/login` - Trang đăng nhập
- `POST /auth/login` - Xử lý đăng nhập
- `GET /auth/register` - Trang đăng ký
- `POST /auth/register` - Xử lý đăng ký
- `GET /auth/google` - Google OAuth
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/logout` - Đăng xuất
- `POST /auth/forgot-password` - Quên mật khẩu
- `POST /auth/reset-password` - Đặt lại mật khẩu

---

## 2. 📚 Quản Lý Khóa Học

### 2.1. Khóa Học (Courses)
- ✅ **Danh sách khóa học** - Xem tất cả khóa học
- ✅ **Chi tiết khóa học** - Thông tin đầy đủ
- ✅ **Tìm kiếm & Lọc** - Theo category, level, instructor
- ✅ **Đăng ký khóa học** - Enrollment system
- ✅ **Khóa học miễn phí/trả phí** - Pricing system
- ✅ **Đánh giá khóa học** - Rating & Review (sau khi hoàn thành)
- ✅ **Preview nội dung** - Xem trước nội dung miễn phí

### 2.2. Nội Dung Khóa Học (Content)
- ✅ **Quản lý nội dung** - Video, bài đọc, quiz
- ✅ **Xem nội dung** - Học bài trong khóa học
- ✅ **Đánh dấu hoàn thành** - Mark content as complete
- ✅ **Theo dõi tiến độ** - Progress tracking
- ✅ **Hoàn thành khóa học** - Course completion

### 2.3. Chứng Chỉ (Certificates)
- ✅ **Tự động tạo chứng chỉ** khi hoàn thành khóa học
- ✅ **Xem chứng chỉ** - View certificate
- ✅ **Tải chứng chỉ PDF** - Download certificate
- ✅ **Số chứng chỉ duy nhất** - Unique certificate number

**Routes:**
- `GET /courses` - Danh sách khóa học
- `GET /courses/:slug` - Chi tiết khóa học
- `POST /courses/enroll/:id` - Đăng ký khóa học
- `GET /courses/:slug/learn` - Học khóa học
- `GET /courses/:slug/preview/:contentId` - Xem trước nội dung
- `POST /courses/:id/complete` - Hoàn thành khóa học
- `POST /courses/:id/rate` - Đánh giá khóa học
- `GET /certificates/:id/view` - Xem chứng chỉ
- `GET /certificates/:id/download` - Tải chứng chỉ

---

## 2.4. 💳 Thanh Toán (Payments)

### 2.4.1. Hệ Thống Thanh Toán
- ✅ **Tích hợp VietQR** - Thanh toán qua QR code
- ✅ **Tạo QR code thanh toán** - Dynamic QR code generation
- ✅ **Deep link** - Mở ứng dụng ngân hàng trực tiếp
- ✅ **Webhook callback** - Tự động cập nhật trạng thái thanh toán
- ✅ **Trang thanh toán** - Payment page với QR code
- ✅ **Kiểm tra trạng thái** - Check payment status
- ✅ **Hỗ trợ nhiều ngân hàng** - 40+ ngân hàng Việt Nam

### 2.4.2. Quy Trình Thanh Toán
- ✅ **Khóa học miễn phí** - Tự động kích hoạt enrollment
- ✅ **Khóa học có phí** - Tạo payment → QR code → Thanh toán → Chờ duyệt
- ✅ **Payment status tracking** - pending, completed, failed, cancelled
- ✅ **Enrollment approval** - Admin duyệt enrollment sau khi thanh toán

### 2.4.3. VietQR Integration
- ✅ **VietQR Service** - Service layer cho VietQR API
- ✅ **QR Code Generation** - Tạo QR code động với thông tin thanh toán
- ✅ **Transaction ID** - Tracking giao dịch
- ✅ **Error handling** - Xử lý lỗi và retry mechanism

**Routes:**
- `GET /payments/:id` - Trang thanh toán với QR code
- `POST /api/payments/vietqr/callback` - Webhook callback từ VietQR
- `GET /api/payments/:paymentId/status` - Kiểm tra trạng thái thanh toán

**Payment Flow:**
1. User đăng ký khóa học có phí
2. Hệ thống tạo enrollment (status: pending)
3. Tạo payment record và gọi VietQR API
4. Hiển thị QR code cho user
5. User quét QR và thanh toán
6. VietQR gửi webhook callback
7. Cập nhật payment status → completed
8. Enrollment status → pending (chờ admin duyệt)
9. Admin duyệt enrollment → active

---

## 3. 🤖 AI & Trợ Lý Thông Minh

### 3.1. AI Chat Assistant
- ✅ **Chat với AI** - Trò chuyện với Gemini AI
- ✅ **Context-aware** - AI hiểu ngữ cảnh người dùng
- ✅ **Lịch sử chat** - Lưu trữ lịch sử trò chuyện
- ✅ **Đánh giá phản hồi AI** - Rate AI responses
- ✅ **Markdown formatting** - Format câu trả lời AI
- ✅ **Text selection AI** - Chọn text và hỏi AI về đoạn đó

### 3.2. AI Roadmap Generator
- ✅ **Tạo lộ trình học tập** - AI-powered roadmap generation
- ✅ **Cá nhân hóa** - Personalization modal với:
  - Phong cách học tập (Video, Bài tập, Đọc tài liệu)
  - Thời gian học tốt nhất (Sáng, Tối)
  - Mức độ kỹ năng (Mới bắt đầu, Trung cấp, Nâng cao)
  - Thời lượng khóa học (2-3 tuần, 4-6 tuần, 8+ tuần)
  - Chủ đề quan tâm (Topics)
- ✅ **Lịch sử roadmap** - Xem các roadmap đã tạo
- ✅ **Chi tiết roadmap** - Xem chi tiết một roadmap
- ✅ **Fallback models** - Tự động thử nhiều Gemini models

### 3.3. AI Recommendations
- ✅ **Gợi ý khóa học** - Personalized course recommendations
- ✅ **Phân tích học tập** - Learning progress analysis

**Routes:**
- `GET /chat-ai` - Trang chat với AI
- `POST /chat/:conversationId/message` - Gửi tin nhắn đến AI
- `GET /roadmap` - Trang tạo roadmap
- `POST /api/ai/roadmap` - API tạo roadmap
- `GET /roadmap/history` - Lịch sử roadmap
- `GET /roadmap/:id` - Chi tiết roadmap
- `POST /api/ai/chat` - Chat với AI (API)
- `POST /api/ai/recommendations` - Gợi ý khóa học
- `POST /api/ai/analyze` - Phân tích học tập

---

## 4. 💬 Hệ Thống Chat

### 4.1. Chat Người Dùng - Người Dùng
- ✅ **Real-time messaging** - Socket.IO
- ✅ **Danh sách cuộc trò chuyện** - Conversation list
- ✅ **Tìm kiếm người dùng** - Search users to chat
- ✅ **Gửi tin nhắn** - Send messages
- ✅ **Trạng thái đã đọc** - Read receipts (Đã gửi, Đã đọc)
- ✅ **Typing indicator** - Hiển thị đang gõ
- ✅ **Thông báo** - Browser notifications, sound, toast
- ✅ **Đánh dấu đã đọc** - Mark messages as read

### 4.2. Chat với AI
- ✅ **Chat riêng với AI** - Dedicated AI chat page
- ✅ **HTTP API calls** - Không dùng Socket.IO cho AI
- ✅ **Markdown formatting** - Format AI responses
- ✅ **Lịch sử chat** - Conversation history

**Routes:**
- `GET /chat` - Danh sách cuộc trò chuyện
- `GET /chat/search/users` - Tìm kiếm người dùng
- `GET /chat/:userId` - Trò chuyện với người dùng
- `GET /chat/:conversationId/messages` - Lấy tin nhắn
- `POST /chat/:conversationId/message` - Gửi tin nhắn

**Socket.IO Events:**
- `send_message` - Gửi tin nhắn
- `new_message` - Nhận tin nhắn mới
- `user_typing` - Người dùng đang gõ
- `messages_read` - Đánh dấu đã đọc
- `join_conversation` - Tham gia cuộc trò chuyện
- `leave_conversation` - Rời cuộc trò chuyện

---

## 5. 📝 Ghi Chú Cá Nhân

### 5.1. Personal Notes
- ✅ **Ghi chú cho từng bài học** - Notes per content
- ✅ **Tạo/Sửa/Xóa ghi chú** - CRUD operations
- ✅ **Ghim ghi chú** - Pin notes
- ✅ **Quản lý ghi chú đã ghim** - Pinned notes page
- ✅ **Đếm ký tự** - Character counter
- ✅ **Liên kết đến bài học** - Link to content from pinned notes

**Routes:**
- `GET /api/personal-notes/content/:contentId` - Lấy ghi chú
- `PUT /api/personal-notes/:noteId` - Cập nhật ghi chú
- `DELETE /api/personal-notes/:noteId` - Xóa ghi chú
- `GET /api/personal-notes/course/:courseId` - Ghi chú theo khóa học
- `GET /personal-notes/pinned` - Trang ghi chú đã ghim

---

## 6. 📊 Dashboard & Thống Kê

### 6.1. Dashboard Người Dùng
- ✅ **Tổng quan học tập** - Learning overview
- ✅ **Hoạt động gần đây** - Recent activities (dynamic loading)
- ✅ **Khóa học đang học** - Current courses
- ✅ **Tiến độ học tập** - Learning progress
- ✅ **Thống kê nhanh** - Quick statistics

### 6.2. Thống Kê
- ✅ **Thống kê học tập** - Learning statistics
- ✅ **Phân tích tiến độ** - Progress analysis
- ✅ **Báo cáo hoạt động** - Activity reports

**Routes:**
- `GET /dashboard` - Trang dashboard
- `GET /dashboard/api/recent-activities` - API hoạt động gần đây
- `GET /statistics` - Thống kê

---

## 7. 👨‍💼 Quản Trị (Admin Panel)

### 7.1. Quản Lý Người Dùng
- ✅ **Danh sách người dùng** - User list
- ✅ **Chi tiết người dùng** - User details
- ✅ **Chỉnh sửa người dùng** - Edit user
- ✅ **Xóa người dùng** - Delete user
- ✅ **Phân quyền** - Role management

### 7.2. Quản Lý Khóa Học
- ✅ **Danh sách khóa học** - Course list
- ✅ **Tạo/Sửa/Xóa khóa học** - CRUD courses
- ✅ **Quản lý nội dung** - Content management
- ✅ **Quản lý category** - Category management

### 7.3. Quản Lý Đăng Ký
- ✅ **Danh sách đăng ký** - Enrollment list
- ✅ **Chi tiết đăng ký** - Enrollment details
- ✅ **Xem tiến độ** - View progress
- ✅ **Xem chứng chỉ** - View certificates

### 7.4. Quản Lý File
- ✅ **Upload files** - File upload
- ✅ **Quản lý files** - File management
- ✅ **MinIO integration** - Object storage

### 7.5. Quản Lý Liên Hệ
- ✅ **Danh sách liên hệ** - Contact list
- ✅ **Xử lý liên hệ** - Handle contacts

**Routes:**
- `GET /admin` - Admin dashboard
- `GET /admin/users` - Quản lý người dùng
- `GET /admin/courses` - Quản lý khóa học
- `GET /admin/enrollments` - Quản lý đăng ký
- `GET /admin/files` - Quản lý files
- `GET /admin/contacts` - Quản lý liên hệ

---

## 8. 📰 Blog & Thảo Luận

### 8.1. Blog
- ✅ **Danh sách bài viết** - Blog posts
- ✅ **Chi tiết bài viết** - Post details
- ✅ **Tạo/Sửa/Xóa bài viết** - CRUD posts
- ✅ **Tìm kiếm bài viết** - Search posts

### 8.2. Bình Luận
- ✅ **Bình luận bài viết** - Comment on posts
- ✅ **Bình luận khóa học** - Comment on courses
- ✅ **Reply comments** - Trả lời bình luận
- ✅ **Xóa bình luận** - Delete comments

**Routes:**
- `GET /blogs` - Danh sách blog
- `GET /blogs/:id` - Chi tiết blog
- `POST /comments` - Tạo bình luận
- `DELETE /comments/:id` - Xóa bình luận

---

## 9. 📁 Quản Lý File & Storage

### 9.1. File Upload
- ✅ **Upload files** - File upload system
- ✅ **Image processing** - Sharp for image optimization
- ✅ **MinIO storage** - Object storage integration
- ✅ **File proxy** - MinIO file proxy route

### 9.2. Storage Services
- ✅ **MinIO service** - Object storage service
- ✅ **File metadata** - File metadata management
- ✅ **Public/Private files** - Access control

**Routes:**
- `POST /files/upload` - Upload file
- `GET /files/:id` - Get file
- `GET /minio/*` - MinIO proxy

---

## 10. 📧 Email & Thông Báo

### 10.1. Email Service
- ✅ **Gửi email** - Email sending
- ✅ **Xác thực email** - Email verification
- ✅ **Quên mật khẩu** - Password reset emails
- ✅ **Thông báo** - Notification emails

### 10.2. In-App Notifications
- ✅ **Browser notifications** - Desktop notifications
- ✅ **Sound notifications** - Audio alerts
- ✅ **Toast notifications** - In-app toasts

---

## 11. 📈 Logging & Monitoring

### 11.1. Application Logging
- ✅ **Winston logger** - Structured logging
- ✅ **Elasticsearch integration** - Centralized logging
- ✅ **Kibana dashboards** - Log visualization
- ✅ **Activity logging** - User activity tracking
- ✅ **Error logging** - Error tracking

### 11.2. Log Types
- ✅ **Application logs** - `studymate-logs` index
- ✅ **Activity logs** - `studymate-activities-*` index
- ✅ **AI logs** - AI interaction logs
- ✅ **Database logs** - Database query logs
- ✅ **API logs** - API request/response logs

**Logging Structure:**
```javascript
{
  type: 'application' | 'activity' | 'ai' | 'database' | 'api',
  operation: 'operation_name',
  userId: 'user_id',
  metadata: { ... }
}
```

### 11.3. Metrics & Monitoring (Prometheus & Grafana)
- ✅ **Prometheus** - Metrics collection và storage
- ✅ **Grafana** - Metrics visualization và dashboards
- ✅ **Metrics endpoint** - `/metrics` endpoint cho Prometheus scraping
- ✅ **Auto-refresh metrics** - Tự động refresh metrics từ database trước khi trả về
- ✅ **Custom metrics** - Tích hợp metrics vào các phần của ứng dụng

### 11.4. Metrics Types
- ✅ **HTTP Metrics** - Request rate, duration, status codes
- ✅ **Database Metrics** - Query duration, total queries, errors
- ✅ **Redis Metrics** - Operation duration, cache hits/misses
- ✅ **AI Metrics** - Request duration, token usage, provider stats
- ✅ **Socket.IO Metrics** - Active connections, message counts
- ✅ **Business Metrics** - Course enrollments, content completions
- ✅ **User Metrics** - Active users, total courses, progress tracking
- ✅ **Global Metrics** - Total users, courses, enrollments

### 11.5. Prometheus Configuration
- ✅ **Scrape interval** - 5 giây (có thể cấu hình)
- ✅ **Metrics retention** - 30 ngày
- ✅ **Target configuration** - Tự động scrape từ `/metrics` endpoint
- ✅ **Docker integration** - Chạy trong Docker container

**Prometheus Access:**
- **URL:** http://localhost:9090
- **Targets:** http://localhost:9090/targets
- **Query:** http://localhost:9090/graph

### 11.6. Grafana Dashboards
- ✅ **StudyMate Overview Dashboard** - Dashboard tổng quan với các panels:
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
- ✅ **Auto-provisioning** - Dashboards tự động load khi Grafana khởi động
- ✅ **Prometheus datasource** - Tự động cấu hình kết nối Prometheus

**Grafana Access:**
- **URL:** http://localhost:3001
- **Default Username:** `admin` (hoặc từ env `GRAFANA_ADMIN_USER`)
- **Default Password:** `admin123` (hoặc từ env `GRAFANA_ADMIN_PASSWORD`)

### 11.7. Metrics Integration
Metrics được tích hợp vào các phần của ứng dụng:
- ✅ **Course Controller** - Track enrollments và completions
- ✅ **Content Controller** - Track content completions
- ✅ **AI Services** - Track AI requests, tokens, duration
- ✅ **Socket Handlers** - Track connections và messages
- ✅ **Statistics Controller** - Track user statistics
- ✅ **Redis Operations** - Track cache operations
- ✅ **Database Queries** - Track query performance (via helper)

**Routes:**
- `GET /metrics` - Prometheus metrics endpoint (text/plain format)
- `GET /test/metrics` - Test metrics generation

**Metrics Controller:**
- `controllers/metricsController.js` - Xử lý metrics endpoint và refresh từ database

### 11.8. Code Quality & Security Analysis (SonarQube)
- ✅ **SonarQube Integration** - Code quality và security analysis
- ✅ **Docker Setup** - SonarQube chạy trong Docker container với PostgreSQL database riêng
- ✅ **Analysis Script** - Script `run-analysis.bat` để tự động chạy analysis từ command line
- ✅ **Web Interface** - Tích hợp vào trang `/tools` với command display
- ✅ **Auto Configuration** - Đọc settings từ `sonar-project.properties` file

### 11.9. SonarQube Features
- ✅ **Code Quality Analysis** - Phân tích chất lượng code
- ✅ **Security Vulnerability Detection** - Phát hiện lỗ hổng bảo mật
- ✅ **Code Smells Detection** - Phát hiện code smells
- ✅ **Code Coverage** - Đo lường code coverage
- ✅ **Technical Debt Tracking** - Theo dõi technical debt
- ✅ **Quality Gates** - Quality gates để đảm bảo code quality

**SonarQube Access:**
- **URL:** http://localhost:9002
- **Default Username:** `admin`
- **Default Password:** `admin` (đổi mật khẩu lần đầu đăng nhập)

**SonarQube Configuration:**
- **Config File:** `sonarqube/sonar-project.properties`
- **Example Config:** `sonarqube/sonar-project.properties.example`
- **Script:** `sonarqube/run-analysis.bat` - Script để chạy analysis
- **Project Key:** `studymate`
- **Database:** PostgreSQL riêng (port 5433, container: `studymate-sonar-db`)

**SonarQube Tools Page:**
- Hiển thị command để chạy analysis: 
  ```
  cd sonarqube
  run-analysis.bat
  ```
- Click vào command để copy
- Link đến SonarQube dashboard

**Routes:**
- `GET /tools` - Trang tools với SonarQube item và command display
- `GET /tools/sonarqube/run` - Chạy SonarQube analysis (API endpoint)

### 11.10. Message Queue & Event Streaming (Apache Kafka)
- ✅ **Kafka Integration** - Apache Kafka cho event streaming và message queue
- ✅ **Docker Setup** - Kafka, Zookeeper và Kafka UI chạy trong Docker containers
- ✅ **Kafka UI** - Web interface để quản lý và monitor Kafka clusters
- ✅ **Auto Topic Creation** - Tự động tạo topics khi cần
- ✅ **Multi-listener Support** - Hỗ trợ cả internal và external connections

### 11.11. Kafka Features
- ✅ **Distributed Event Streaming** - Xử lý event streaming phân tán
- ✅ **Real-time Data Processing** - Xử lý dữ liệu real-time
- ✅ **Message Queue** - Hàng đợi tin nhắn
- ✅ **Event Sourcing** - Event sourcing pattern
- ✅ **Log Aggregation** - Tập hợp logs
- ✅ **Microservices Communication** - Giao tiếp giữa các microservices

**Kafka Access:**
- **Kafka UI:** http://localhost:8080
- **Kafka Broker:** localhost:9092 (external), kafka:29092 (internal)
- **Zookeeper:** localhost:2181

**Kafka Configuration:**
- **Broker ID:** 1
- **Replication Factor:** 1 (single broker setup)
- **Auto Create Topics:** Enabled
- **Network:** studymate-network

**Kafka Services:**
- **Zookeeper** - Service discovery và coordination (port 2181)
- **Kafka Broker** - Message broker (port 9092)
- **Kafka UI** - Web interface (port 8080)

**Routes:**
- `GET /tools` - Trang tools với Kafka item

---

## 12. 🔒 Bảo Mật

### 12.1. Authentication & Authorization
- ✅ **JWT tokens** - Token-based auth
- ✅ **Session management** - Redis sessions
- ✅ **Password hashing** - bcrypt
- ✅ **Role-based access** - RBAC
- ✅ **Route protection** - Middleware protection

### 12.2. Security Features
- ✅ **Helmet.js** - Security headers
- ✅ **CORS** - Cross-origin resource sharing
- ✅ **Rate limiting** - Request rate limiting
- ✅ **Input validation** - express-validator
- ✅ **SQL injection protection** - Sequelize ORM
- ✅ **XSS protection** - Input sanitization

---

## 13. 🎨 Giao Diện Người Dùng

### 13.1. Design System
- ✅ **Tailwind CSS** - Utility-first CSS
- ✅ **Responsive design** - Mobile-first approach
- ✅ **Dark/Light mode ready** - Theme support
- ✅ **Accessibility** - WCAG compliance

### 13.2. UI Components
- ✅ **Navigation bar** - Main navigation
- ✅ **Footer** - Site footer
- ✅ **Flash messages** - Success/error messages
- ✅ **Modals** - Dialog modals
- ✅ **Forms** - Form components
- ✅ **Cards** - Content cards
- ✅ **Buttons** - Button components

---

## 14. 🧪 Testing & Development

### 14.1. Test Routes
- ✅ **Test logging** - `/test/logs`
- ✅ **Test Gemini chat** - `/test/gemini-chat`
- ✅ **Test metrics** - `/test/metrics` - Test Prometheus metrics
- ✅ **Test index** - `/test` - List test features

### 14.2. Development Tools
- ✅ **Nodemon** - Hot reload
- ✅ **ESLint** - Code linting
- ✅ **Prettier** - Code formatting
- ✅ **SonarQube** - Code quality analysis
  - Script: `sonarqube/run-analysis.bat`
  - Config: `sonarqube/sonar-project.properties`
  - Access: http://localhost:9002
- ✅ **Apache Kafka** - Message queue và event streaming
  - Kafka UI: http://localhost:8080
  - Broker: localhost:9092
  - Zookeeper: localhost:2181

---

## 15. 📱 Tính Năng Đặc Biệt

### 15.1. Text Selection AI
- ✅ **Chọn text và hỏi AI** - Select text → Ask AI
- ✅ **Global feature** - Available on all pages
- ✅ **Auto-redirect** - Redirect to AI chat with selected text

### 15.2. Real-time Features
- ✅ **Socket.IO** - Real-time communication
- ✅ **Live chat** - Instant messaging
- ✅ **Typing indicators** - Real-time typing status
- ✅ **Read receipts** - Message read status

### 15.3. Gamification (Planned)
- ⏳ **Streak system** - Daily learning streaks
- ⏳ **XP/Points** - Experience points
- ⏳ **Achievements** - Badges and achievements
- ⏳ **Leaderboards** - Rankings
- ⏳ **Daily goals** - Daily learning goals

---

## 📊 Thống Kê Codebase

### Models (Database Tables)
- **32 models** được định nghĩa:
  - User, Course, Content, Enrollment, Progress
  - Certificate, Rating, PersonalNote, AIInteraction
  - Conversation, Message, Comment, Blog
  - Achievement, UserAchievement, ActivityLog
  - File, Contact, Category, Tag
  - Quiz, Question, Answer, UserAnswer
  - PasswordResetToken, EmailVerification
  - Notification, Discussion, ContentTag
  - Payment (Thanh toán)

### Controllers
- **17 controllers** chính:
  - authController, courseController, contentController
  - aiController, chatController, dashboardController
  - profileController, statisticsController
  - certificateController, personalNoteController
  - blogController, commentController, fileController
  - homeController, infoController, testController
  - metricsController (Prometheus metrics)
  - toolsController (Tools & Services page)
  - **8 admin controllers** trong `controllers/admin/`

### Routes
- **20 route files**:
  - auth, courses, content, dashboard, profile
  - ai, chat, blogs, comments, certificates
  - personalNotes, files, statistics, admin
  - home, info, test, minio, metrics, tools

### Services
- **7 services**:
  - aiService, geminiService, elasticsearchService
  - certificateService, emailService, minioService
  - vietQRService (Thanh toán VietQR)

---

## 🚀 API Endpoints Summary

### Public Endpoints
- `GET /` - Trang chủ
- `GET /courses` - Danh sách khóa học
- `GET /courses/:slug` - Chi tiết khóa học
- `GET /auth/login` - Đăng nhập
- `GET /auth/register` - Đăng ký
- `GET /metrics` - Prometheus metrics endpoint
- `GET /health` - Health check endpoint
- `GET /tools` - Tools & Services page (MinIO, Kibana, Elasticsearch, Prometheus, Grafana, SonarQube, Kafka)
- `GET /tools/sonarqube/run` - Run SonarQube analysis (API)
- `POST /api/payments/vietqr/callback` - VietQR webhook callback (Public webhook)

### Protected Endpoints (Require Login)
- `GET /dashboard` - Dashboard
- `GET /profile` - Hồ sơ
- `GET /chat` - Chat
- `GET /chat-ai` - Chat với AI
- `GET /roadmap` - Tạo roadmap
- `GET /roadmap/history` - Lịch sử roadmap
- `GET /roadmap/:id` - Chi tiết roadmap
- `POST /courses/enroll/:id` - Đăng ký khóa học
- `GET /payments/:id` - Trang thanh toán
- `GET /api/payments/:paymentId/status` - Kiểm tra trạng thái thanh toán
- `POST /api/ai/roadmap` - Tạo roadmap (API)
- `POST /api/ai/chat` - Chat với AI (API)

### Admin Endpoints (Require Admin)
- `GET /admin/*` - Tất cả admin routes

---

## 📝 Ghi Chú Kỹ Thuật

### Database
- **PostgreSQL** - Primary database
- **Redis** - Caching & sessions
- **Sequelize ORM** - Database abstraction
- **UUID primary keys** - Unique identifiers
- **Soft deletes** - Data retention

### Real-time Communication
- **Socket.IO** - WebSocket library
- **Redis adapter** - Multi-server support
- **Room-based** - Conversation rooms

### AI Integration
- **OpenAI GPT** - Primary AI service
- **Google Gemini** - Fallback AI service
- **Model fallback** - Automatic model switching
- **Context management** - User context awareness

### File Storage
- **MinIO** - S3-compatible object storage
- **Local storage** - Fallback storage
- **Image processing** - Sharp library

### Payment Integration
- **VietQR** - QR code payment integration
- **Webhook handling** - Payment status updates
- **Transaction tracking** - Payment transaction management
- **Multi-bank support** - 40+ Vietnamese banks

---

## 🔮 Tính Năng Đang Phát Triển

### Planned Features
- ⏳ Streak system
- ⏳ XP/Points system
- ⏳ Achievements & Badges
- ⏳ Leaderboards
- ⏳ Daily goals
- ⏳ Spaced repetition
- ⏳ Adaptive difficulty
- ⏳ Practice mode
- ⏳ Social features (Friends, Clubs)
- ⏳ Mobile app (React Native)
- ⏳ Offline mode

---

## 📚 Tài Liệu Tham Khảo

- [QUICK-START.md](./QUICK-START.md) - Hướng dẫn cài đặt nhanh
- [GEMINI-API-USAGE.md](./GEMINI-API-USAGE.md) - Hướng dẫn sử dụng Gemini API
- [GOOGLE-OAUTH-SETUP.md](./GOOGLE-OAUTH-SETUP.md) - Cấu hình Google OAuth
- [MINIO-IMAGE-EMBEDDING-EXPLAINED.md](./MINIO-IMAGE-EMBEDDING-EXPLAINED.md) - Giải thích MinIO
- [PROMETHEUS-GRAFANA-SETUP.md](./PROMETHEUS-GRAFANA-SETUP.md) - Hướng dẫn Prometheus & Grafana
- [sonarqube/README.md](../sonarqube/README.md) - Hướng dẫn SonarQube
- [FEATURE-SUGGESTIONS.md](./FEATURE-SUGGESTIONS.md) - Đề xuất tính năng mới
- [VIETQR-INTEGRATION-FLOW.md](./VIETQR-INTEGRATION-FLOW.md) - Hướng dẫn tích hợp VietQR
- [COURSE-ENROLLMENT-FLOW.md](./COURSE-ENROLLMENT-FLOW.md) - Flow đăng ký khóa học

---

## 📞 Liên Hệ

- **Email:** studymate@uit.edu.vn
- **GitHub:** [StudyMate Repository](https://github.com/your-username/studymate)

---

**🏛️ Trường Đại học Công nghệ Thông tin**  
**🌍 Đại học Quốc gia TP. Hồ Chí Minh**  
**🇻🇳 Việt Nam**

---

*Tài liệu này được tạo tự động từ source code - Cập nhật lần cuối: 2026-01-02*

---

## 📝 Changelog

### Version 1.1.0 (2026-01-02)
- ✅ Thêm hệ thống thanh toán VietQR
- ✅ Thêm Payment model và controller
- ✅ Cập nhật số lượng models (27 → 32)
- ✅ Cập nhật số lượng services (6 → 7)
- ✅ Thêm tài liệu tham khảo VietQR và Course Enrollment Flow

