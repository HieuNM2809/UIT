# 💳 Kiến Trúc Hệ Thống Thanh Toán - StudyMate

**Ngày tạo:** 2026-01-02  
**Phiên bản:** 1.0.0

---

## 📋 Tổng Quan

Hệ thống thanh toán tích hợp với **VietQR** để xử lý thanh toán cho khóa học có phí:
- **QR Code Generation** - Tạo mã QR để quét thanh toán
- **Payment Tracking** - Theo dõi trạng thái thanh toán
- **Webhook Callback** - Nhận callback từ VietQR khi thanh toán thành công
- **Payment Verification** - Xác minh và cập nhật trạng thái enrollment

---

## 🏗️ 1. Component Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        PaymentPage[💳 Payment Page]
        QRCode[📱 QR Code Display]
        PaymentStatus[📊 Payment Status]
    end

    subgraph "Route Layer"
        PaymentRoutes[💳 Payment Routes<br/>/payments/*]
        WebhookRoute[POST /api/payments/vietqr/callback]
        PaymentDetailRoute[GET /payments/:id]
        CheckStatusRoute[GET /api/payments/:id/status]
    end

    subgraph "Controller Layer"
        PaymentController[Payment Controller]
        WebhookHandler[Webhook Handler]
        PaymentStatusHandler[Payment Status Handler]
    end

    subgraph "Service Layer"
        VietQRService[💳 VietQR Service]
        EmailService[📧 Email Service]
        EnrollmentService[✅ Enrollment Service]
    end

    subgraph "Model Layer"
        PaymentModel[💳 Payment Model]
        EnrollmentModel[✅ Enrollment Model]
        CourseModel[📚 Course Model]
    end

    subgraph "Storage Layer"
        PostgreSQL[(🗄️ PostgreSQL)]
        Redis[(⚡ Redis<br/>Status Cache)]
    end

    subgraph "External Services"
        VietQRAPI[💳 VietQR API]
        SMTP[📧 SMTP Server]
    end

    PaymentPage --> PaymentRoutes
    QRCode --> PaymentRoutes
    PaymentStatus --> PaymentRoutes

    PaymentRoutes --> PaymentController
    WebhookRoute --> PaymentController
    PaymentDetailRoute --> PaymentController
    CheckStatusRoute --> PaymentController

    PaymentController --> WebhookHandler
    PaymentController --> PaymentStatusHandler

    WebhookHandler --> VietQRService
    PaymentStatusHandler --> PaymentModel

    VietQRService --> VietQRAPI
    PaymentController --> EmailService
    PaymentController --> EnrollmentService

    PaymentModel --> PostgreSQL
    EnrollmentModel --> PostgreSQL
    CourseModel --> PostgreSQL

    PaymentController --> Redis

    style PaymentController fill:#4A90E2,stroke:#2E5C8A,stroke-width:3px,color:#fff
    style VietQRService fill:#FFD700,stroke:#B8860B,stroke-width:2px
    style PaymentModel fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style VietQRAPI fill:#E74C3C,stroke:#C0392B,stroke-width:2px,color:#fff
```

---

## 🔄 2. Payment Creation Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant CourseController
    participant VietQRService
    participant VietQRAPI
    participant PaymentModel
    participant EnrollmentModel
    participant PostgreSQL

    User->>Browser: Click "Thanh toán ngay" on paid course
    Browser->>CourseController: POST /courses/enroll/:id
    
    CourseController->>CourseController: Check course price > 0
    CourseController->>EnrollmentModel: Create enrollment (status='pending')
    EnrollmentModel->>PostgreSQL: INSERT INTO enrollments
    PostgreSQL-->>EnrollmentModel: Enrollment created
    
    CourseController->>VietQRService: createQRCode({ amount, description, orderId })
    VietQRService->>VietQRAPI: POST /api/v2/generate
    Note over VietQRService,VietQRAPI: Request body:<br/>{ amount, description, orderId }
    VietQRAPI-->>VietQRService: { qrCode, qrDataURL, transactionId, deepLink }
    VietQRService-->>CourseController: QR Result
    
    CourseController->>PaymentModel: Create payment record
    PaymentModel->>PostgreSQL: INSERT INTO payments<br/>(enrollment_id, user_id, course_id,<br/>amount, status='pending',<br/>vietqr_transaction_id,<br/>vietqr_qr_code, vietqr_deep_link)
    PostgreSQL-->>PaymentModel: Payment created
    PaymentModel-->>CourseController: Payment
    
    CourseController-->>Browser: { success: true, requiresPayment: true,<br/>data: { payment: { id, qrCode, ... } } }
    Browser->>Browser: Redirect to /payments/:paymentId
    Browser->>User: Display payment page with QR code
```

---

## 📱 3. Payment Page Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant PaymentController
    participant PaymentModel
    participant EnrollmentModel
    participant CourseModel
    participant PostgreSQL

    User->>Browser: Navigate to /payments/:id
    Browser->>PaymentController: GET /payments/:id
    
    PaymentController->>PaymentModel: findByPk(paymentId)
    PaymentModel->>PostgreSQL: SELECT * FROM payments WHERE id = ?
    PostgreSQL-->>PaymentModel: Payment
    PaymentModel-->>PaymentController: Payment
    
    alt Payment not found
        PaymentController-->>Browser: 404 Error
    else Payment found
        alt Payment not belong to user
            PaymentController-->>Browser: 403 Error
        else Payment belongs to user
            PaymentController->>EnrollmentModel: Find enrollment
            EnrollmentModel->>PostgreSQL: SELECT * FROM enrollments WHERE id = ?
            PostgreSQL-->>EnrollmentModel: Enrollment
            EnrollmentModel-->>PaymentController: Enrollment
            
            PaymentController->>CourseModel: Find course
            CourseModel->>PostgreSQL: SELECT * FROM courses WHERE id = ?
            PostgreSQL-->>CourseModel: Course
            CourseModel-->>PaymentController: Course
            
            PaymentController-->>Browser: Render payment page
            Browser->>User: Display:<br/>- Course info<br/>- Amount<br/>- QR Code<br/>- Deep link button<br/>- Payment instructions
        end
    end
```

---

## 💰 4. Payment Processing Flow

```mermaid
sequenceDiagram
    participant User
    participant BankApp[🏦 Bank App]
    participant VietQRAPI
    participant Webhook
    participant PaymentController
    participant PaymentModel
    participant EnrollmentModel
    participant EmailService
    participant PostgreSQL

    User->>BankApp: Scan QR code or use deep link
    BankApp->>BankApp: Confirm payment
    BankApp->>VietQRAPI: Process payment
    VietQRAPI->>VietQRAPI: Verify payment
    VietQRAPI->>Webhook: POST /api/payments/vietqr/callback
    Note over VietQRAPI,Webhook: Payload:<br/>{ transactionId, status,<br/>amount, orderId }
    
    Webhook->>PaymentController: vietqrCallback()
    PaymentController->>PaymentController: Verify webhook signature (if available)
    
    PaymentController->>PaymentModel: Find payment by transactionId
    PaymentModel->>PostgreSQL: SELECT * FROM payments WHERE vietqr_transaction_id = ?
    PostgreSQL-->>PaymentModel: Payment
    PaymentModel-->>PaymentController: Payment
    
    alt Payment not found
        PaymentController-->>Webhook: 404 Error
    else Payment found
        alt Status is 'success' or 'completed'
            PaymentController->>PaymentModel: Update payment status='completed'
            PaymentModel->>PostgreSQL: UPDATE payments SET status='completed', paid_at=?
            PostgreSQL-->>PaymentModel: Updated
            
            PaymentController->>EnrollmentModel: Find enrollment
            EnrollmentModel->>PostgreSQL: SELECT * FROM enrollments WHERE id = ?
            PostgreSQL-->>EnrollmentModel: Enrollment
            EnrollmentModel-->>PaymentController: Enrollment
            
            Note over PaymentController,EnrollmentModel: Enrollment status remains 'pending'<br/>until admin approval
            
            PaymentController->>EmailService: Send payment confirmation email
            EmailService-->>PaymentController: Email sent
            
            PaymentController-->>Webhook: 200 OK
        else Status is 'failed' or 'cancelled'
            PaymentController->>PaymentModel: Update payment status='failed'
            PaymentModel->>PostgreSQL: UPDATE payments SET status='failed'
            PostgreSQL-->>PaymentModel: Updated
            PaymentController-->>Webhook: 200 OK
        end
    end
```

---

## 🔍 5. Payment Status Check Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant PaymentController
    participant PaymentModel
    participant Redis
    participant PostgreSQL

    User->>Browser: Check payment status (polling)
    Browser->>PaymentController: GET /api/payments/:id/status
    
    PaymentController->>Redis: Check cache
    Redis-->>PaymentController: Cached status or null
    
    alt Cache hit
        PaymentController-->>Browser: Cached status
    else Cache miss
        PaymentController->>PaymentModel: findByPk(paymentId)
        PaymentModel->>PostgreSQL: SELECT * FROM payments WHERE id = ?
        PostgreSQL-->>PaymentModel: Payment
        PaymentModel-->>PaymentController: Payment
        
        PaymentController->>PaymentController: Format status response
        PaymentController->>Redis: Cache status (TTL: 30s)
        Redis-->>PaymentController: Cached
        
        PaymentController-->>Browser: { status, amount, paid_at, ... }
        Browser->>User: Update UI with status
    end
```

---

## 📊 6. Payment States Diagram

```mermaid
stateDiagram-v2
    [*] --> pending: Payment Created
    
    pending --> processing: User scans QR
    processing --> completed: Payment successful
    processing --> failed: Payment failed
    processing --> cancelled: User cancels
    
    completed --> [*]: Payment confirmed
    failed --> [*]: Payment failed
    cancelled --> [*]: Payment cancelled
    
    note right of pending
        Initial state
        QR code generated
        Waiting for user action
    end note
    
    note right of processing
        Payment in progress
        Bank processing transaction
    end note
    
    note right of completed
        Payment successful
        Enrollment can be approved
    end note
```

---

## 🔄 7. Enrollment Approval Flow (After Payment)

```mermaid
sequenceDiagram
    participant Admin
    participant AdminPanel
    participant AdminController
    participant PaymentModel
    participant EnrollmentModel
    participant CourseModel
    participant EmailService
    participant PostgreSQL

    Admin->>AdminPanel: View pending enrollments
    AdminPanel->>AdminController: GET /admin/enrollments
    
    Admin->>AdminPanel: Click "Duyệt" on enrollment
    AdminPanel->>AdminController: POST /admin/enrollments/:id/approve
    
    AdminController->>EnrollmentModel: Find enrollment
    EnrollmentModel->>PostgreSQL: SELECT * FROM enrollments WHERE id = ?
    PostgreSQL-->>EnrollmentModel: Enrollment
    EnrollmentModel-->>AdminController: Enrollment
    
    AdminController->>CourseModel: Find course
    CourseModel->>PostgreSQL: SELECT * FROM courses WHERE id = ?
    PostgreSQL-->>CourseModel: Course
    CourseModel-->>AdminController: Course
    
    alt Course is paid (price > 0)
        AdminController->>PaymentModel: Check payment status
        PaymentModel->>PostgreSQL: SELECT * FROM payments WHERE enrollment_id = ? AND status = 'completed'
        PostgreSQL-->>PaymentModel: Payment
        
        alt Payment not completed
            AdminController-->>AdminPanel: Error: Chưa thanh toán
        else Payment completed
            AdminController->>EnrollmentModel: Update status='active'
            EnrollmentModel->>PostgreSQL: UPDATE enrollments SET status='active'
            PostgreSQL-->>EnrollmentModel: Updated
            
            AdminController->>CourseModel: Increment enrolled_count
            CourseModel->>PostgreSQL: UPDATE courses SET enrolled_count = enrolled_count + 1
            PostgreSQL-->>CourseModel: Updated
            
            AdminController->>EmailService: Send approval email
            EmailService-->>AdminController: Email sent
            
            AdminController-->>AdminPanel: Success: Enrollment approved
        end
    else Course is free (price = 0)
        AdminController->>EnrollmentModel: Update status='active'
        EnrollmentModel->>PostgreSQL: UPDATE enrollments SET status='active'
        PostgreSQL-->>EnrollmentModel: Updated
        
        AdminController->>CourseModel: Increment enrolled_count
        CourseModel->>PostgreSQL: UPDATE courses SET enrolled_count = enrolled_count + 1
        PostgreSQL-->>CourseModel: Updated
        
        AdminController->>EmailService: Send approval email
        EmailService-->>AdminController: Email sent
        
        AdminController-->>AdminPanel: Success: Enrollment approved
    end
```

---

## 📊 8. Data Models

### Payment Model
```javascript
{
  id: UUID (Primary Key),
  enrollment_id: UUID (Foreign Key -> enrollments.id),
  user_id: UUID (Foreign Key -> users.id),
  course_id: UUID (Foreign Key -> courses.id),
  amount: Decimal(10,2) (Required),
  payment_method: String (Default: 'vietqr'),
  status: ENUM('pending', 'processing', 'completed', 'failed', 'cancelled'),
  vietqr_transaction_id: String (Unique, Optional),
  vietqr_qr_code: String (QR code image URL),
  vietqr_deep_link: String (Deep link for bank app),
  payment_data: JSON (Additional payment info),
  paid_at: Date (Optional),
  created_at: Date,
  updated_at: Date
}
```

---

## 🔗 9. API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/payments/:id` | Get payment details | Yes (Owner) |
| GET | `/api/payments/:id/status` | Check payment status | Yes (Owner) |
| POST | `/api/payments/vietqr/callback` | VietQR webhook callback | No (Public) |
| GET | `/admin/payments` | List all payments (Admin) | Yes (Admin) |
| GET | `/admin/payments/:id` | Get payment details (Admin) | Yes (Admin) |

---

## 📝 Ghi Chú

### Payment Status Flow
1. **pending** - Payment created, QR code generated, waiting for user
2. **processing** - User scanned QR, bank processing transaction
3. **completed** - Payment successful, enrollment can be approved
4. **failed** - Payment failed (insufficient funds, etc.)
5. **cancelled** - User cancelled payment

### VietQR Integration
- **QR Code**: Static QR code image URL
- **Deep Link**: `vietqr://` protocol link to open bank app directly
- **Transaction ID**: Unique identifier from VietQR
- **Webhook**: Callback URL to receive payment status updates

### Security Considerations
1. **Webhook Verification**: Verify webhook signature (if provided by VietQR)
2. **Idempotency**: Handle duplicate webhook calls
3. **Amount Verification**: Verify payment amount matches course price
4. **Status Updates**: Only update status from lower to higher states

### Error Handling
- **Payment Timeout**: Handle cases where payment takes too long
- **Webhook Failures**: Retry mechanism for failed webhooks
- **Status Sync**: Periodic sync with VietQR API to check payment status

---

**Tác giả:** StudyMate Development Team  
**Cập nhật:** 2026-01-02

