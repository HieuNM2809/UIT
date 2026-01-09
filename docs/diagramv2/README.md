# 📊 StudyMate - Sơ đồ Kiến trúc Hệ thống

> **Phiên bản:** 2.0  
> **Ngày tạo:** 09/01/2026  
> **Dự án:** StudyMate - Ứng dụng học tập thông minh  
> **Trường:** Đại học Công nghệ Thông tin - ĐHQG-HCM

---

## 📑 Danh sách Sơ đồ

### 1️⃣ System Architecture Overview
**File:** `01-system-architecture-overview.png`

**Mô tả:**
Sơ đồ tổng quan về kiến trúc hệ thống StudyMate, bao gồm tất cả các tầng (layers) từ Client đến Infrastructure.

**Các thành phần chính:**
- **Client Layer:** Web Browser, Mobile Devices, Desktop Applications
- **Frontend Layer:** EJS Templates, Tailwind CSS, JavaScript, Socket.IO Client
- **Backend Layer:**
  - Core Services: Express.js, JWT Authentication, Session Management, WebSocket
  - Business Logic: Course Management, User Management, AI Services, Payment Processing
  - Middleware: Rate Limiting, Logging (Winston), Validation, Error Handling
- **Data Layer:** PostgreSQL, Redis, Elasticsearch, MinIO
- **External Services:** OpenAI GPT, Google Gemini, VietQR Payment, Email Service
- **Monitoring:** Prometheus, Grafana, Winston Logs

**Công dụng:**
- Hiểu tổng quan kiến trúc hệ thống
- Giải thích cho stakeholders và giảng viên
- Onboarding cho developer mới

---

### 2️⃣ Feature Architecture Map
**File:** `02-feature-architecture-map.png`

**Mô tả:**
Sơ đồ bản đồ tính năng với 6 modules chính xoay quanh StudyMate Core.

**Các modules chính:**

#### 🔵 USER MANAGEMENT
- User Registration & Login
- Profile Management
- Role-based Access (Admin, Teacher, Student)
- Email Verification
- Password Reset
- OAuth (Google)

#### 🟢 COURSE MANAGEMENT
- Course CRUD Operations
- Content Management (Videos, Documents)
- Category & Tags
- Course Enrollment
- Progress Tracking
- Certificates

#### 🟣 AI FEATURES
- AI Chatbot (GPT/Gemini)
- Smart Recommendations
- Learning Analytics
- Content Suggestions
- Personalized Study Plans

#### 🟠 ASSESSMENT
- Quiz System
- Multiple Choice Questions
- Auto Grading
- Progress Reports
- Achievement Badges
- Performance Analytics

#### 🌸 COMMUNITY
- Discussion Forums
- Blog System
- Comments & Reviews
- Course Ratings
- Personal Notes
- Q&A Platform

#### 🔴 COMMERCE
- Payment Integration (VietQR)
- Course Pricing
- Transaction History
- Certificate Generation
- Revenue Analytics

**Công dụng:**
- Giới thiệu tính năng cho người dùng
- Planning và roadmap phát triển
- Presentation cho đồ án

---

### 3️⃣ Technology Stack Diagram
**File:** `03-technology-stack-diagram.png`  
**📝 Complete Documentation:** `TECH-STACK-COMPLETE.md` ⭐

> **⚠️ Note:** Hình hiện tại thiếu **Vault** và **Kibana**. Xem file `TECH-STACK-COMPLETE.md` để có thông tin đầy đủ. Hình sẽ được cập nhật khi có quota.

**Mô tả:**
Infographic chi tiết về toàn bộ công nghệ sử dụng trong dự án.

**6 cột công nghệ:** (Updated v2.1)

#### 🔷 FRONTEND
- EJS Templates
- Tailwind CSS
- Vanilla JavaScript
- AJAX/Fetch API
- Socket.IO Client
- Responsive Design

#### 🟩 BACKEND
- Node.js 18+
- Express.js
- Sequelize ORM
- Passport.js
- JWT
- Socket.IO
- Multer
- Sharp

#### 🟧 DATABASE & STORAGE
- PostgreSQL (Main DB)
- Redis (Cache & Sessions)
- Elasticsearch (Search)
- MinIO (Object Storage)

#### 🟪 AI & EXTERNAL
- OpenAI GPT-3.5/4
- Google Gemini AI
- Nodemailer (Email)
- VietQR Payment
- PDF Generation

#### 🟥 DEVOPS & MONITORING
- Docker & Docker Compose
- PM2 Process Manager
- Prometheus (Metrics)
- Grafana (Dashboards)
- Winston (Logging)
- GitHub Actions
- SonarQube
- 🆕 **Kibana** (Log Visualization)
- 🆕 **Elasticsearch** (Log Storage)

#### 🛡️ SECURITY & SECRETS
- 🆕 **HashiCorp Vault** (Secret Management)
- Helmet.js
- CORS
- Rate Limiting
- Bcrypt
- Input Validation
- XSS Protection

**Công dụng:**
- Technical documentation
- Recruitment (hiring developers)
- Technology decision making

---

### 4️⃣ Data Flow Architecture
**File:** `04-data-flow-diagram.png`

**Mô tả:**
Sơ đồ luồng dữ liệu từ lúc User gửi request đến khi nhận response.

**Các bước xử lý:**

1. **USER** → HTTP/HTTPS Request (REST API / WebSocket)

2. **API GATEWAY**
   - Rate Limiter
   - CORS Handler
   - Authentication Check
   - Request Validation

3. **MIDDLEWARE LAYER**
   - JWT Verification
   - Session Management
   - Role Authorization
   - Input Sanitization
   - Activity Logger

4. **Authentication Check**
   - ✅ YES → Continue to Controllers
   - ❌ NO → Return 401 Error

5. **CONTROLLERS**
   - Course Controller
   - User Controller
   - AI Controller
   - Chat Controller
   - Payment Controller

6. **SERVICES LAYER**
   - Business Logic
   - AI Service (OpenAI/Gemini)
   - Email Service
   - Payment Service
   - Certificate Service

7. **DATA ACCESS**
   - PostgreSQL (CRUD Operations)
   - Redis (Cache Check/Set)
   - Elasticsearch (Search)
   - MinIO (File Storage)

8. **RESPONSE ASSEMBLY**
   - Format Response
   - Add Metadata
   - Cache Result
   - Log Activity

9. **RETURN TO USER**
   - JSON Response
   - Real-time Update (Socket.IO)
   - File Download
   - Error Message

**Monitoring & Security:**
- 🔐 HashiCorp Vault - Secret management
- 📊 Kibana - Log visualization  
- 📝 Winston Logging
- 📈 Prometheus Metrics
- 🚨 Error Tracking

**Công dụng:**
- Debug và troubleshooting
- Performance optimization
- Understanding request lifecycle

---

### 5️⃣ Database Schema Overview
**File:** `05-database-schema-overview.png`

**Mô tả:**
Entity-Relationship Diagram (ERD) thể hiện cấu trúc database với 32 models.

**Các nhóm entities:**

#### 🔵 CORE ENTITIES
- **USER:** id, email, password, role, fullname, avatar
  - Relationships: 1:N với hầu hết các entities khác

#### 🟢 COURSE DOMAIN
- **COURSES:** id, title, description, instructor_id (FK), category_id (FK), price
- **CONTENT:** id, course_id (FK), title, type, file_url, order
- **ENROLLMENT:** id, user_id (FK), course_id (FK), enrolled_at, status
- **PROGRESS:** id, user_id (FK), content_id (FK), completed, score

#### 🟣 QUIZ & ASSESSMENT
- **QUIZ:** id, course_id (FK), title
- **QUESTION:** id, quiz_id (FK), question_text
- **ANSWER:** id, question_id (FK), is_correct

#### 🌸 COMMUNITY
- **BLOG:** id, author_id (FK), title, content
- **COMMENT:** id, user_id (FK), content, commentable_type
- **DISCUSSION:** id, course_id (FK), user_id (FK)

#### 🔷 AI & SUPPORT
- **CONVERSATION:** id, user_id (FK), title
- **MESSAGE:** id, conversation_id (FK), sender_type, content
- **NOTIFICATION:** id, user_id (FK), type, message

#### 🔴 COMMERCE
- **PAYMENT:** id, user_id (FK), course_id (FK), amount, status
- **CERTIFICATE:** id, user_id (FK), course_id (FK), issued_date

**Relationships:**
- `1:N` - One-to-Many (User → Courses, Course → Content)
- `N:M` - Many-to-Many (thông qua bảng trung gian như Enrollment)

**Công dụng:**
- Database design và migration planning
- Understanding data relationships
- Query optimization

---

## 🎯 Cách sử dụng Sơ đồ

### Cho Developer
1. **System Architecture** - Hiểu overview toàn bộ hệ thống
2. **Data Flow** - Debug và trace request/response
3. **Database Schema** - Viết query và migration
4. **Technology Stack** - Setup môi trường development

### Cho Thuyết trình Đồ án
1. **System Architecture** - Slide đầu tiên giới thiệu tổng quan
2. **Feature Map** - Trình bày các tính năng chính
3. **Technology Stack** - Giải thích lựa chọn công nghệ
4. **Data Flow** - Demo luồng xử lý của một tính năng
5. **Database Schema** - Thiết kế cơ sở dữ liệu

### Cho Stakeholders
- **Feature Map** - Hiểu các tính năng của ứng dụng
- **System Architecture** - Overview về kiến trúc tổng thể

---

## 🛠️ Công cụ tạo Sơ đồ

- **Tool:** AI Image Generation (Google Gemini)
- **Format:** PNG (High Resolution)
- **Style:** Professional, Modern, Flat Design
- **Color Scheme:** Color-coded by domains

---

## 📝 Ghi chú

### Version History
- **v2.0 (09/01/2026):** Tạo bộ sơ đồ hoàn chỉnh với 5 diagrams
- **v1.0:** Version cũ trong folder `/docs/diagram`

### Cập nhật
Khi có thay đổi về kiến trúc hoặc tính năng, cần update các sơ đồ tương ứng để đảm bảo tính chính xác.

### Liên hệ
- **Email:** studymate@uit.edu.vn
- **Nhóm phát triển:**
  - Nguyễn Minh Hiếu (24410158)
  - Lê Anh Kiệt (24410183)
- **GVHD:** ThS. Phạm Thế Sơn

---

**🏛️ Trường Đại học Công nghệ Thông tin**  
**🌍 Đại học Quốc gia TP. Hồ Chí Minh**  
**🇻🇳 Việt Nam**
