# 📚 Kiến Trúc Quản Lý Khóa Học - StudyMate

**Ngày tạo:** 2026-01-02  
**Phiên bản:** 1.0.0

---

## 📋 Tổng Quan

Hệ thống quản lý khóa học bao gồm:
- **Course Management** - Tạo, sửa, xóa khóa học
- **Content Management** - Quản lý nội dung khóa học (video, text, quiz)
- **Enrollment System** - Đăng ký khóa học (free/paid)
- **Progress Tracking** - Theo dõi tiến độ học tập
- **Rating & Reviews** - Đánh giá khóa học
- **Certificate Generation** - Tự động tạo chứng chỉ khi hoàn thành

---

## 🏗️ 1. Component Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        CourseList[📋 Course List Page]
        CourseDetail[📄 Course Detail Page]
        LearningPage[📖 Learning Page]
        AdminPanel[👨‍💼 Admin Panel]
    end

    subgraph "Route Layer"
        CourseRoutes[📚 Course Routes<br/>/courses/*]
        ContentRoutes[📄 Content Routes<br/>/api/content/*]
        EnrollmentRoute[POST /courses/enroll/:id]
        LearnRoute[GET /courses/:slug/learn]
        CompleteRoute[POST /api/courses/:id/complete]
        RateRoute[POST /api/courses/:id/rate]
    end

    subgraph "Controller Layer"
        CourseController[Course Controller]
        ContentController[Content Controller]
        EnrollmentHandler[Enrollment Handler]
        ProgressHandler[Progress Handler]
        RatingHandler[Rating Handler]
        CertificateHandler[Certificate Handler]
    end

    subgraph "Service Layer"
        CertificateService[🎓 Certificate Service]
        PaymentService[💳 Payment Service]
        MetricsService[📊 Metrics Service]
    end

    subgraph "Model Layer"
        CourseModel[📚 Course Model]
        ContentModel[📄 Content Model]
        EnrollmentModel[✅ Enrollment Model]
        ProgressModel[📊 Progress Model]
        RatingModel[⭐ Rating Model]
        CertificateModel[🎓 Certificate Model]
        CategoryModel[📁 Category Model]
    end

    subgraph "Storage Layer"
        PostgreSQL[(🗄️ PostgreSQL)]
        Redis[(⚡ Redis Cache)]
        MinIO[📦 MinIO<br/>File Storage]
    end

    CourseList --> CourseRoutes
    CourseDetail --> CourseRoutes
    LearningPage --> CourseRoutes
    AdminPanel --> CourseRoutes

    CourseRoutes --> CourseController
    ContentRoutes --> ContentController
    EnrollmentRoute --> CourseController
    LearnRoute --> CourseController
    CompleteRoute --> CourseController
    RateRoute --> CourseController

    CourseController --> EnrollmentHandler
    CourseController --> ProgressHandler
    CourseController --> RatingHandler
    CourseController --> CertificateHandler

    EnrollmentHandler --> EnrollmentModel
    ProgressHandler --> ProgressModel
    RatingHandler --> RatingModel
    CertificateHandler --> CertificateService

    EnrollmentModel --> PostgreSQL
    ProgressModel --> PostgreSQL
    RatingModel --> PostgreSQL
    CertificateModel --> PostgreSQL
    CourseModel --> PostgreSQL
    ContentModel --> PostgreSQL
    CategoryModel --> PostgreSQL

    CertificateService --> MinIO
    ContentModel --> MinIO
    CourseModel --> Redis

    style CourseController fill:#4A90E2,stroke:#2E5C8A,stroke-width:3px,color:#fff
    style EnrollmentModel fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style PostgreSQL fill:#336791,stroke:#1A3A52,stroke-width:2px,color:#fff
    style MinIO fill:#FFD700,stroke:#B8860B,stroke-width:2px
```

---

## 🔄 2. Course Enrollment Flow (Free Course)

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Route
    participant Controller
    participant CourseModel
    participant EnrollmentModel
    participant MetricsService
    participant PostgreSQL

    User->>Browser: Click "Đăng ký ngay"
    Browser->>Route: POST /courses/enroll/:id
    Route->>Controller: enroll()
    
    Controller->>Controller: Check authentication
    Controller->>CourseModel: findByPk(courseId)
    CourseModel->>PostgreSQL: SELECT * FROM courses WHERE id = ?
    PostgreSQL-->>CourseModel: Course
    CourseModel-->>Controller: Course
    
    alt Course not found
        Controller-->>Browser: 404 Error
    else Course found
        alt Course not published
            Controller-->>Browser: 403 Error
        else Course published
            Controller->>EnrollmentModel: Check existing enrollment
            EnrollmentModel->>PostgreSQL: SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?
            PostgreSQL-->>EnrollmentModel: null (not enrolled)
            EnrollmentModel-->>Controller: Not enrolled
            
            alt Course is free (price = 0)
                Controller->>EnrollmentModel: Create enrollment (status='active')
                EnrollmentModel->>PostgreSQL: INSERT INTO enrollments (user_id, course_id, status='active')
                PostgreSQL-->>EnrollmentModel: Enrollment created
                
                Controller->>CourseModel: Increment enrolled_count
                CourseModel->>PostgreSQL: UPDATE courses SET enrolled_count = enrolled_count + 1
                PostgreSQL-->>CourseModel: Updated
                
                Controller->>MetricsService: recordCourseEnrollment(courseId, 'success')
                MetricsService-->>Controller: Metrics recorded
                
                Controller-->>Browser: { success: true, requiresPayment: false }
                Browser->>User: Hiển thị thông báo thành công
            end
        end
    end
```

---

## 💳 3. Course Enrollment Flow (Paid Course)

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Route
    participant Controller
    participant CourseModel
    participant EnrollmentModel
    participant PaymentModel
    participant VietQRService
    participant VietQRAPI
    participant PostgreSQL

    User->>Browser: Click "Thanh toán ngay"
    Browser->>Route: POST /courses/enroll/:id
    Route->>Controller: enroll()
    
    Controller->>CourseModel: findByPk(courseId)
    CourseModel->>PostgreSQL: SELECT * FROM courses WHERE id = ?
    PostgreSQL-->>CourseModel: Course
    CourseModel-->>Controller: Course (price > 0)
    
    Controller->>EnrollmentModel: Check existing enrollment
    EnrollmentModel->>PostgreSQL: SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?
    PostgreSQL-->>EnrollmentModel: null
    EnrollmentModel-->>Controller: Not enrolled
    
    Controller->>EnrollmentModel: Create enrollment (status='pending')
    EnrollmentModel->>PostgreSQL: INSERT INTO enrollments (status='pending')
    PostgreSQL-->>EnrollmentModel: Enrollment created
    
    Controller->>VietQRService: createQRCode(amount, description, orderId)
    VietQRService->>VietQRAPI: POST /api/v2/generate
    VietQRAPI-->>VietQRService: { qrCode, transactionId, deepLink }
    VietQRService-->>Controller: QR Result
    
    Controller->>PaymentModel: Create payment record
    PaymentModel->>PostgreSQL: INSERT INTO payments (status='pending', vietqr_transaction_id, ...)
    PostgreSQL-->>PaymentModel: Payment created
    PaymentModel-->>Controller: Payment
    
    Controller-->>Browser: { success: true, requiresPayment: true, data: { payment: {...} } }
    Browser->>Browser: Redirect to /payments/:paymentId
    Browser->>User: Hiển thị trang thanh toán với QR code
    
    Note over User,PostgreSQL: User quét QR và thanh toán
    
    VietQRAPI->>Route: POST /api/payments/vietqr/callback
    Route->>Controller: vietqrCallback()
    Controller->>PaymentModel: Find payment by transactionId
    PaymentModel->>PostgreSQL: SELECT * FROM payments WHERE vietqr_transaction_id = ?
    PostgreSQL-->>PaymentModel: Payment
    PaymentModel-->>Controller: Payment
    
    Controller->>PaymentModel: Update payment status='completed'
    PaymentModel->>PostgreSQL: UPDATE payments SET status='completed', paid_at=?
    PostgreSQL-->>PaymentModel: Updated
    
    Note over Controller,PostgreSQL: Enrollment vẫn là 'pending' chờ admin duyệt
```

---

## 📖 4. Learning Flow Sequence

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Route
    participant Controller
    participant CourseModel
    participant EnrollmentModel
    participant ContentModel
    participant ProgressModel
    participant PersonalNoteModel
    participant PostgreSQL

    User->>Browser: Click "Tiếp tục học"
    Browser->>Route: GET /courses/:slug/learn
    Route->>Controller: learn()
    
    Controller->>CourseModel: findOne({ slug })
    CourseModel->>PostgreSQL: SELECT * FROM courses WHERE slug = ?
    PostgreSQL-->>CourseModel: Course
    CourseModel-->>Controller: Course
    
    Controller->>EnrollmentModel: Check enrollment
    EnrollmentModel->>PostgreSQL: SELECT * FROM enrollments WHERE user_id = ? AND course_id = ? AND status IN ('active', 'completed')
    PostgreSQL-->>EnrollmentModel: Enrollment
    EnrollmentModel-->>Controller: Enrollment
    
    alt Not enrolled
        Controller-->>Browser: Redirect to course detail page
    else Enrolled
        Controller->>ContentModel: Find all published contents
        ContentModel->>PostgreSQL: SELECT * FROM contents WHERE course_id = ? AND status = 'published' ORDER BY order_index
        PostgreSQL-->>ContentModel: Contents array
        ContentModel-->>Controller: Contents
        
        Controller->>ProgressModel: Find all user progress
        ProgressModel->>PostgreSQL: SELECT * FROM progress WHERE user_id = ? AND course_id = ?
        PostgreSQL-->>ProgressModel: Progress records
        ProgressModel-->>Controller: Progress records
        
        Controller->>PersonalNoteModel: Find all personal notes
        PersonalNoteModel->>PostgreSQL: SELECT * FROM personal_notes WHERE user_id = ? AND content_id IN (...)
        PostgreSQL-->>PersonalNoteModel: Notes
        PersonalNoteModel-->>Controller: Notes
        
        Controller->>Controller: Calculate progress percentage
        Controller->>EnrollmentModel: Update enrollment progress
        EnrollmentModel->>PostgreSQL: UPDATE enrollments SET progress_percentage = ?, last_accessed = ?
        PostgreSQL-->>EnrollmentModel: Updated
        
        Controller->>Controller: Attach progress and notes to contents
        Controller-->>Browser: Render learning page with contents
        Browser->>User: Hiển thị danh sách bài học với progress
    end
```

---

## ✅ 5. Complete Course Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Route
    participant Controller
    participant EnrollmentModel
    participant ProgressModel
    participant ContentModel
    participant CertificateService
    participant CertificateModel
    participant MinIO
    participant PostgreSQL

    User->>Browser: Click "Hoàn thành khóa học"
    Browser->>Route: POST /api/courses/:id/complete
    Route->>Controller: complete()
    
    Controller->>EnrollmentModel: Find enrollment
    EnrollmentModel->>PostgreSQL: SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?
    PostgreSQL-->>EnrollmentModel: Enrollment
    EnrollmentModel-->>Controller: Enrollment
    
    alt Already completed
        Controller-->>Browser: 400 Error: Đã hoàn thành
    else Not completed
        Controller->>ContentModel: Count total contents
        ContentModel->>PostgreSQL: SELECT COUNT(*) FROM contents WHERE course_id = ? AND status = 'published'
        PostgreSQL-->>ContentModel: Total count
        ContentModel-->>Controller: Total contents
        
        Controller->>ProgressModel: Count completed contents
        ProgressModel->>PostgreSQL: SELECT COUNT(*) FROM progress WHERE user_id = ? AND course_id = ? AND status = 'completed'
        PostgreSQL-->>ProgressModel: Completed count
        ProgressModel-->>Controller: Completed contents
        
        Controller->>Controller: Calculate progress percentage
        Controller->>EnrollmentModel: Update status='completed', progress_percentage=100
        EnrollmentModel->>PostgreSQL: UPDATE enrollments SET status='completed', progress_percentage=100
        PostgreSQL-->>EnrollmentModel: Updated
        
        Controller->>CertificateService: generateCertificate(studentName, courseTitle, ...)
        CertificateService->>CertificateService: Generate PDF
        CertificateService->>MinIO: Upload PDF
        MinIO-->>CertificateService: PDF URL
        CertificateService-->>Controller: { pdfPath, filename }
        
        Controller->>CertificateModel: Create certificate record
        CertificateModel->>PostgreSQL: INSERT INTO certificates (user_id, course_id, enrollment_id, pdf_path, ...)
        PostgreSQL-->>CertificateModel: Certificate created
        CertificateModel-->>Controller: Certificate
        
        Controller-->>Browser: { success: true, message: "Chúc mừng! Bạn đã hoàn thành khóa học!" }
        Browser->>User: Hiển thị thông báo và link tải chứng chỉ
    end
```

---

## ⭐ 6. Rating & Review Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Route
    participant Controller
    participant EnrollmentModel
    participant RatingModel
    participant CourseModel
    participant PostgreSQL

    User->>Browser: Submit rating (1-5 stars + review)
    Browser->>Route: POST /api/courses/:id/rate
    Route->>Controller: submitRating()
    
    Controller->>Controller: Validate rating (1-5)
    
    Controller->>EnrollmentModel: Check enrollment completed
    EnrollmentModel->>PostgreSQL: SELECT * FROM enrollments WHERE user_id = ? AND course_id = ? AND status = 'completed'
    PostgreSQL-->>EnrollmentModel: Enrollment
    EnrollmentModel-->>Controller: Enrollment (completed)
    
    alt Not completed
        Controller-->>Browser: 403 Error: Cần hoàn thành khóa học
    else Completed
        Controller->>RatingModel: findOrCreate rating
        RatingModel->>PostgreSQL: SELECT * FROM ratings WHERE user_id = ? AND course_id = ?
        PostgreSQL-->>RatingModel: Rating or null
        
        alt Rating exists
            RatingModel->>RatingModel: Update rating and review
            RatingModel->>PostgreSQL: UPDATE ratings SET rating = ?, review = ?
            PostgreSQL-->>RatingModel: Updated
        else New rating
            RatingModel->>PostgreSQL: INSERT INTO ratings (user_id, course_id, rating, review, is_verified=true)
            PostgreSQL-->>RatingModel: Rating created
        end
        
        Controller->>RatingModel: Calculate average rating
        RatingModel->>PostgreSQL: SELECT AVG(rating) FROM ratings WHERE course_id = ?
        PostgreSQL-->>RatingModel: Average rating
        RatingModel-->>Controller: Average
        
        Controller->>CourseModel: Update course average_rating
        CourseModel->>PostgreSQL: UPDATE courses SET average_rating = ?
        PostgreSQL-->>CourseModel: Updated
        
        Controller-->>Browser: { success: true, data: { rating: {...}, course: { average_rating: ... } } }
        Browser->>User: Hiển thị thông báo thành công
    end
```

---

## 📊 7. Progress Tracking Architecture

```mermaid
graph TB
    subgraph "Progress States"
        NotStarted[⭕ Not Started<br/>progress_percentage = 0]
        InProgress[🔄 In Progress<br/>0 < progress_percentage < 100]
        Completed[✅ Completed<br/>progress_percentage = 100]
    end

    subgraph "Progress Calculation"
        ContentProgress[Content Progress<br/>Based on completed contents]
        TimeSpent[Time Spent<br/>Tracked per content]
        LastAccessed[Last Accessed<br/>Updated on each visit]
    end

    subgraph "Auto-Update Triggers"
        ContentComplete[Content Completed<br/>Update progress]
        CourseComplete[Course Completed<br/>Set to 100%]
        ManualUpdate[Manual Update<br/>API call]
    end

    subgraph "Progress Storage"
        ProgressModel[Progress Model<br/>Per content]
        EnrollmentModel[Enrollment Model<br/>Overall course progress]
    end

    NotStarted --> InProgress
    InProgress --> Completed
    
    ContentProgress --> ProgressModel
    TimeSpent --> ProgressModel
    LastAccessed --> EnrollmentModel
    
    ContentComplete --> ContentProgress
    CourseComplete --> EnrollmentModel
    ManualUpdate --> ContentProgress
    
    ProgressModel --> EnrollmentModel

    style NotStarted fill:#E74C3C,stroke:#C0392B,stroke-width:2px,color:#fff
    style InProgress fill:#F39C12,stroke:#D68910,stroke-width:2px,color:#fff
    style Completed fill:#27AE60,stroke:#229954,stroke-width:2px,color:#fff
```

---

## 🎓 8. Certificate Generation Flow

```mermaid
sequenceDiagram
    participant System
    participant CertificateService
    participant PDFLib
    participant MinIO
    participant CertificateModel
    participant UserModel
    participant CourseModel
    participant PostgreSQL

    System->>CertificateService: generateCertificate(data)
    
    CertificateService->>UserModel: Get user info
    UserModel->>PostgreSQL: SELECT * FROM users WHERE id = ?
    PostgreSQL-->>UserModel: User
    UserModel-->>CertificateService: User data
    
    CertificateService->>CourseModel: Get course info
    CourseModel->>PostgreSQL: SELECT * FROM courses WHERE id = ?
    PostgreSQL-->>CourseModel: Course
    CourseModel-->>CertificateService: Course data
    
    CertificateService->>CertificateService: Generate certificate number
    CertificateService->>PDFLib: Create PDF document
    PDFLib->>PDFLib: Add certificate template
    PDFLib->>PDFLib: Add student name
    PDFLib->>PDFLib: Add course title
    PDFLib->>PDFLib: Add certificate number
    PDFLib->>PDFLib: Add date
    PDFLib->>PDFLib: Add instructor signature
    PDFLib-->>CertificateService: PDF buffer
    
    CertificateService->>MinIO: Upload PDF
    MinIO-->>CertificateService: PDF URL/filename
    
    CertificateService->>CertificateModel: Create certificate record
    CertificateModel->>PostgreSQL: INSERT INTO certificates (user_id, course_id, pdf_path, certificate_number, ...)
    PostgreSQL-->>CertificateModel: Certificate created
    CertificateModel-->>CertificateService: Certificate
    
    CertificateService-->>System: { pdfPath, filename, certificate }
```

---

## 📊 9. Data Models

### Course Model
```javascript
{
  id: UUID (Primary Key),
  title: String (Required),
  slug: String (Unique, Required),
  description: Text,
  short_description: String(500),
  thumbnail: String,
  instructor_id: UUID (Foreign Key -> users.id),
  level: ENUM('beginner', 'intermediate', 'advanced', 'expert'),
  price: Decimal(10,2) (Default: 0),
  status: ENUM('draft', 'published', 'archived'),
  category_id: UUID (Foreign Key -> categories.id),
  enrolled_count: Integer (Default: 0),
  average_rating: Decimal(3,2),
  created_at: Date,
  updated_at: Date
}
```

### Enrollment Model
```javascript
{
  id: UUID (Primary Key),
  user_id: UUID (Foreign Key -> users.id),
  course_id: UUID (Foreign Key -> courses.id),
  status: ENUM('pending', 'active', 'completed', 'dropped'),
  enrolled_at: Date (Default: NOW),
  progress_percentage: Decimal(5,2) (Default: 0),
  total_time_spent: Integer (Default: 0, seconds),
  last_accessed: Date,
  created_at: Date,
  updated_at: Date
}
```

### Progress Model
```javascript
{
  id: UUID (Primary Key),
  user_id: UUID (Foreign Key -> users.id),
  course_id: UUID (Foreign Key -> courses.id),
  content_id: UUID (Foreign Key -> contents.id),
  status: ENUM('not_started', 'in_progress', 'completed'),
  progress_percentage: Decimal(5,2) (Default: 0),
  time_spent: Integer (Default: 0, seconds),
  last_accessed: Date,
  completed_at: Date,
  created_at: Date,
  updated_at: Date
}
```

### Rating Model
```javascript
{
  id: UUID (Primary Key),
  user_id: UUID (Foreign Key -> users.id),
  course_id: UUID (Foreign Key -> courses.id),
  rating: Integer (1-5, Required),
  review: Text (Optional),
  is_verified: Boolean (Default: false),
  created_at: Date,
  updated_at: Date
}
```

### Certificate Model
```javascript
{
  id: UUID (Primary Key),
  user_id: UUID (Foreign Key -> users.id),
  course_id: UUID (Foreign Key -> courses.id),
  enrollment_id: UUID (Foreign Key -> enrollments.id),
  certificate_number: String (Unique, Required),
  pdf_path: String (Required),
  metadata: JSON (Optional),
  issued_at: Date (Default: NOW),
  created_at: Date,
  updated_at: Date
}
```

---

## 🔗 10. API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/courses` | List all courses | No |
| GET | `/courses/:slug` | Get course details | No |
| POST | `/courses/enroll/:id` | Enroll in course | Yes |
| GET | `/courses/:slug/learn` | Learning page | Yes (Enrolled) |
| GET | `/courses/:slug/preview/:contentId` | Preview free content | No |
| POST | `/api/courses/:id/complete` | Complete course | Yes |
| POST | `/api/courses/:id/rate` | Submit rating | Yes (Completed) |
| GET | `/api/courses/:id/progress` | Get progress | Yes |
| PUT | `/api/content/:id/progress` | Update content progress | Yes |

---

## 📝 Ghi Chú

### Enrollment Status Flow
1. **pending** - Chờ thanh toán (paid courses) hoặc chờ admin duyệt
2. **active** - Đã kích hoạt, user có thể học
3. **completed** - Đã hoàn thành khóa học
4. **dropped** - Đã hủy/ngừng học

### Progress Calculation
- **Content Level**: Mỗi content có progress riêng (0-100%)
- **Course Level**: Tính dựa trên số content đã hoàn thành / tổng số content
- **Auto-complete**: Enrollment tự động chuyển sang 'completed' khi progress = 100%

### Certificate Generation
- Tự động tạo khi user hoàn thành khóa học
- PDF được lưu trong MinIO
- Certificate number format: `CERT-YYYYMMDD-XXXXXX`
- Metadata chứa thông tin student, course, instructor

---

**Tác giả:** StudyMate Development Team  
**Cập nhật:** 2026-01-02

