# Flow Đăng Ký Khóa Học - StudyMate

## Tổng Quan

Tài liệu này mô tả chi tiết quy trình đăng ký khóa học trong hệ thống StudyMate, bao gồm cả khóa học miễn phí và khóa học có phí với tích hợp thanh toán VietQR.

---

## 1. Flow Tổng Quan

```
User → Xem khóa học → Click "Đăng ký" → Kiểm tra loại khóa học
                                              ├─ Miễn phí → Tự động kích hoạt
                                              └─ Có phí → Tạo payment → QR Code → Thanh toán → Chờ duyệt → Kích hoạt
```

---

## 2. Flow Chi Tiết

### 2.1. Khóa Học Miễn Phí (Free Course)

#### Bước 1: User Click "Đăng ký ngay"
- **Route**: `POST /courses/enroll/:id`
- **Middleware**: `authenticate` (kiểm tra đăng nhập)
- **Validation**: `courseIdValidation`

#### Bước 2: Kiểm tra và Tạo Enrollment
```javascript
// Kiểm tra:
- User đã đăng nhập ✓
- Khóa học tồn tại ✓
- Khóa học đã published ✓
- User chưa đăng ký ✓
- course.price === 0 ✓

// Tạo enrollment:
Enrollment.create({
  user_id: userId,
  course_id: courseId,
  status: 'active'  // Tự động kích hoạt
})

// Cập nhật:
course.increment('enrolled_count')
```

#### Bước 3: Response
```json
{
  "success": true,
  "requiresPayment": false,
  "message": "Đăng ký khóa học thành công!",
  "data": {
    "enrollment": {
      "id": "uuid",
      "status": "active",
      "enrolled_at": "2026-01-02T..."
    }
  }
}
```

#### Bước 4: Frontend
- Hiển thị thông báo thành công
- Reload trang sau 1.5 giây
- Button "Đăng ký ngay" → "Tiếp tục học"

---

### 2.2. Khóa Học Có Phí (Paid Course)

#### Bước 1: User Click "Thanh toán ngay"
- **Route**: `POST /courses/enroll/:id`
- **Middleware**: `authenticate`
- **Validation**: `courseIdValidation`

#### Bước 2: Kiểm tra và Tạo Enrollment (Pending)
```javascript
// Kiểm tra:
- User đã đăng nhập ✓
- Khóa học tồn tại ✓
- Khóa học đã published ✓
- User chưa đăng ký ✓
- course.price > 0 ✓

// Tạo enrollment với status 'pending':
Enrollment.create({
  user_id: userId,
  course_id: courseId,
  status: 'pending'  // Chờ thanh toán và duyệt
})
```

#### Bước 3: Tạo Payment và QR Code
```javascript
// Gọi VietQR API:
vietQRService.createQRCode({
  amount: coursePrice,
  description: `Thanh toan khoa hoc: ${course.title}`,
  orderId: enrollment.id
})

// Tạo payment record:
Payment.create({
  enrollment_id: enrollment.id,
  user_id: userId,
  course_id: courseId,
  amount: coursePrice,
  payment_method: 'vietqr',
  status: 'pending',
  vietqr_transaction_id: qrResult.transactionId,
  vietqr_qr_code: qrResult.qrCode,  // QR code image URL
  vietqr_deep_link: qrResult.deepLink,
  payment_data: JSON.stringify({
    qrCodeUrl: qrResult.qrCode,
    qrData: qrResult.qrData,
    transactionId: qrResult.transactionId
  })
})
```

#### Bước 4: Response
```json
{
  "success": true,
  "requiresPayment": true,
  "message": "Vui lòng thanh toán để hoàn tất đăng ký",
  "data": {
    "enrollment": {
      "id": "uuid",
      "status": "pending"
    },
    "payment": {
      "id": "uuid",
      "amount": 500000,
      "qrCode": "https://...",
      "qrCodeUrl": "https://...",
      "deepLink": "vietqr://..."
    }
  }
}
```

#### Bước 5: Frontend Redirect
```javascript
if (data.requiresPayment && data.data.payment) {
  window.location.href = `/payments/${data.data.payment.id}`;
}
```

#### Bước 6: Trang Thanh Toán (`/payments/:id`)
- **Route**: `GET /payments/:id`
- **Middleware**: `requireLogin`
- **Hiển thị**:
  - Thông tin khóa học và số tiền
  - QR Code để quét thanh toán
  - Nút "Mở ứng dụng ngân hàng" (deep link)
  - Hướng dẫn thanh toán
  - Thông tin thanh toán (mã đơn hàng, thời gian)

#### Bước 7: User Thanh Toán
- User quét QR code hoặc mở ứng dụng ngân hàng
- Xác nhận thanh toán trong app ngân hàng
- VietQR xử lý thanh toán

#### Bước 8: VietQR Webhook Callback
- **Route**: `POST /api/payments/vietqr/callback`
- **Access**: Public (Webhook từ VietQR)
- **Payload**:
```json
{
  "transactionId": "uuid",
  "status": "success|completed|failed|cancelled",
  "amount": 500000,
  "orderId": "enrollment_id"
}
```

**Xử lý Callback:**
```javascript
// Tìm payment theo transactionId hoặc enrollment_id
Payment.findOne({
  where: {
    [Op.or]: [
      { vietqr_transaction_id: transactionId },
      { enrollment_id: orderId }
    ]
  }
})

// Nếu status === 'success' || 'completed':
payment.status = 'completed'
payment.paid_at = new Date()
enrollment.status = 'pending'  // Chờ admin duyệt
```

#### Bước 9: Admin Duyệt Enrollment
- **Route**: `POST /admin/enrollments/:id/approve`
- **Access**: Admin only
- **Xử lý**:
```javascript
// Kiểm tra payment đã completed (cho khóa học có phí)
if (coursePrice > 0) {
  const payment = await Payment.findOne({
    where: {
      enrollment_id: enrollment.id,
      status: 'completed'
    }
  });
  
  if (!payment) {
    return error('Chưa thanh toán');
  }
}

// Duyệt enrollment:
enrollment.status = 'active'
course.increment('enrolled_count')

// Gửi email thông báo:
emailService.sendEnrollmentApprovalEmail(
  user.email,
  user.first_name,
  course.title,
  `/courses/${course.slug}/learn`
)
```

#### Bước 10: User Nhận Email và Bắt Đầu Học
- Email thông báo: "Đăng ký khóa học đã được duyệt!"
- Link: `/courses/:slug/learn`
- Button "Tiếp tục học" xuất hiện trên trang khóa học

---

## 3. Các Trạng Thái Enrollment

### 3.1. `pending`
- **Mô tả**: Đang chờ thanh toán hoặc chờ admin duyệt
- **Khi nào**:
  - Khóa học có phí: Sau khi tạo enrollment, chờ thanh toán
  - Sau khi thanh toán thành công: Chờ admin duyệt
- **UI**: Badge "Đang chờ duyệt" + Button "Thanh toán ngay" (nếu payment pending)

### 3.2. `active`
- **Mô tả**: Đã được kích hoạt, user có thể học
- **Khi nào**:
  - Khóa học miễn phí: Ngay sau khi đăng ký
  - Khóa học có phí: Sau khi admin duyệt
- **UI**: Button "Tiếp tục học"

### 3.3. `completed`
- **Mô tả**: Đã hoàn thành khóa học
- **Khi nào**: Progress đạt 100% hoặc user click "Hoàn thành khóa học"
- **UI**: Badge "Đã hoàn thành" + Link xem/tải chứng chỉ + Button đánh giá

### 3.4. `dropped`
- **Mô tả**: Đã hủy đăng ký
- **Khi nào**: Admin hoặc user hủy
- **UI**: Button "Kích hoạt khóa học" (nếu có quyền)

---

## 4. Các Trạng Thái Payment

### 4.1. `pending`
- **Mô tả**: Đang chờ thanh toán
- **Khi nào**: Sau khi tạo payment, chờ user thanh toán
- **UI**: QR code hiển thị, hướng dẫn thanh toán

### 4.2. `completed`
- **Mô tả**: Đã thanh toán thành công
- **Khi nào**: Sau khi VietQR callback với status 'success' hoặc 'completed'
- **UI**: Thông báo "Thanh toán thành công! Đang chờ admin duyệt"

### 4.3. `failed`
- **Mô tả**: Thanh toán thất bại
- **Khi nào**: VietQR callback với status 'failed'
- **UI**: Thông báo lỗi, có thể thử lại

### 4.4. `cancelled`
- **Mô tả**: Đã hủy thanh toán
- **Khi nào**: User hoặc hệ thống hủy
- **UI**: Thông báo đã hủy

---

## 5. Database Schema

### 5.1. Enrollment Table
```sql
CREATE TABLE enrollments (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  course_id UUID NOT NULL REFERENCES courses(id),
  status ENUM('pending', 'active', 'completed', 'dropped') DEFAULT 'pending',
  enrolled_at TIMESTAMP DEFAULT NOW(),
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  total_time_spent INTEGER DEFAULT 0,
  last_accessed TIMESTAMP
);
```

### 5.2. Payment Table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  enrollment_id UUID NOT NULL REFERENCES enrollments(id),
  user_id UUID NOT NULL REFERENCES users(id),
  course_id UUID NOT NULL REFERENCES courses(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_method ENUM('vietqr', 'bank_transfer', 'other') DEFAULT 'vietqr',
  status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
  vietqr_transaction_id VARCHAR(255),
  vietqr_qr_code TEXT,
  vietqr_deep_link TEXT,
  payment_data TEXT,  -- JSON string
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 6. API Endpoints

### 6.1. Đăng Ký Khóa Học
```
POST /courses/enroll/:id
Headers: Cookie (session) hoặc Authorization (JWT)
Response: {
  success: boolean,
  requiresPayment: boolean,
  message: string,
  data: {
    enrollment: {...},
    payment?: {...}
  }
}
```

### 6.2. Xem Trang Thanh Toán
```
GET /payments/:id
Headers: Cookie (session)
Response: HTML page với QR code
```

### 6.3. VietQR Webhook Callback
```
POST /api/payments/vietqr/callback
Headers: (từ VietQR)
Body: {
  transactionId: string,
  status: string,
  amount: number,
  orderId: string
}
Response: {
  success: boolean,
  message: string
}
```

### 6.4. Admin Duyệt Enrollment
```
POST /admin/enrollments/:id/approve
Headers: Cookie (session, admin role)
Response: Redirect với flash message
```

---

## 7. Error Handling

### 7.1. Lỗi Thường Gặp

#### User chưa đăng nhập
- **Status**: 401 Unauthorized
- **Message**: "Bạn cần đăng nhập để đăng ký khóa học"
- **Action**: Redirect đến `/auth/login`

#### Khóa học không tồn tại
- **Status**: 404 Not Found
- **Message**: "Khóa học không tìm thấy"
- **Action**: Hiển thị error page

#### Đã đăng ký rồi
- **Status**: 400 Bad Request
- **Message**: "Bạn đã đăng ký khóa học này rồi"
- **Action**: Hiển thị thông báo, không tạo enrollment mới

#### Lỗi tạo QR code
- **Status**: 500 Internal Server Error
- **Message**: "Lỗi khi khởi tạo thanh toán. Vui lòng thử lại sau."
- **Action**: Xóa enrollment đã tạo, log error

#### Payment không tìm thấy
- **Status**: 404 Not Found
- **Message**: "Thanh toán không tìm thấy"
- **Action**: Redirect đến dashboard

---

## 8. Security Considerations

### 8.1. Authentication
- Tất cả routes đăng ký đều yêu cầu authentication
- Sử dụng `authenticate` middleware (hỗ trợ cả session và JWT)

### 8.2. Authorization
- User chỉ có thể xem payment của chính mình
- Admin mới có thể duyệt enrollment

### 8.3. Payment Security
- VietQR webhook nên có IP whitelist (nếu có thể)
- Verify transactionId và orderId trước khi cập nhật
- Log tất cả payment events để audit

### 8.4. Data Validation
- Validate courseId là UUID hợp lệ
- Validate amount > 0 cho khóa học có phí
- Validate enrollment không duplicate

---

## 9. Logging

Tất cả các events quan trọng đều được log vào Kibana:

### 9.1. Enrollment Events
```javascript
applicationLogger.info('Course enrollment successful', {
  type: 'course',
  operation: 'enroll_success',
  courseId: courseId,
  userId: userId,
  enrollmentId: enrollment.id,
  enrollmentStatus: enrollment.status,
  courseTitle: course.title
});
```

### 9.2. Payment Events
```javascript
applicationLogger.info('Paid course enrollment - Payment initiated', {
  type: 'course',
  operation: 'enroll_payment_initiated',
  courseId: courseId,
  userId: userId,
  enrollmentId: enrollment.id,
  paymentId: payment.id,
  amount: coursePrice
});
```

### 9.3. Approval Events
```javascript
applicationLogger.info('Enrollment approved', {
  type: 'enrollment',
  operation: 'enrollment_approved',
  enrollmentId: enrollment.id,
  userId: enrollment.user_id,
  courseId: enrollment.course_id,
  adminId: req.user.id
});
```

---

## 10. Email Notifications

### 10.1. Enrollment Approval Email
- **Trigger**: Khi admin duyệt enrollment
- **Recipient**: User đã đăng ký
- **Content**:
  - Tiêu đề: "Đăng ký khóa học [Tên khóa học] đã được duyệt"
  - Nội dung: Thông báo duyệt thành công, link bắt đầu học
  - CTA: "Bắt đầu học ngay"

---

## 11. Frontend Flow

### 11.1. Trang Khóa Học (`/courses/:slug`)

#### Trường hợp 1: Chưa đăng ký
```javascript
// Khóa học miễn phí:
<button onclick="enrollCourse(courseId)">
  Đăng ký ngay
</button>

// Khóa học có phí:
<button onclick="enrollCourse(courseId)">
  Thanh toán ngay
</button>
```

#### Trường hợp 2: Đã đăng ký - Pending
```html
<span>Đang chờ duyệt</span>
<a href="/payments/:paymentId">Thanh toán ngay</a>  <!-- Nếu payment pending -->
```

#### Trường hợp 3: Đã đăng ký - Active
```html
<a href="/courses/:slug/learn">Tiếp tục học</a>
```

#### Trường hợp 4: Đã đăng ký - Completed
```html
<span>Đã hoàn thành</span>
<a href="/certificates/:id/view">Xem chứng chỉ</a>
<button onclick="openRatingModal()">Đánh giá khóa học</button>
```

### 11.2. Trang Thanh Toán (`/payments/:id`)

**Hiển thị:**
- Thông tin khóa học và số tiền
- QR Code (nếu có)
- Deep link button (nếu có)
- Hướng dẫn thanh toán
- Thông tin thanh toán (mã đơn hàng, thời gian)

**Không có:**
- Auto-check payment status (đã bỏ)
- Payment status updates (chỉ hiển thị QR code)

---

## 12. Admin Flow

### 12.1. Xem Danh Sách Enrollments
- **Route**: `GET /admin/enrollments`
- **Filter**: status, course_id, user_id, search
- **Hiển thị**: Bảng danh sách với status badges

### 12.2. Xem Chi Tiết Enrollment
- **Route**: `GET /admin/enrollments/:id`
- **Hiển thị**:
  - Thông tin user và khóa học
  - Trạng thái enrollment
  - Payment info (nếu có)
  - Progress details
  - Certificate (nếu completed)
  - Button "Duyệt đăng ký" (nếu status = 'pending')

### 12.3. Duyệt Enrollment
- **Route**: `POST /admin/enrollments/:id/approve`
- **Xử lý**:
  1. Kiểm tra payment completed (nếu khóa học có phí)
  2. Cập nhật enrollment.status = 'active'
  3. Increment course.enrolled_count
  4. Gửi email thông báo
  5. Log event

---

## 13. Testing Scenarios

### 13.1. Khóa Học Miễn Phí
1. ✅ User đăng nhập → Click "Đăng ký ngay" → Enrollment active ngay
2. ✅ User chưa đăng nhập → Click "Đăng ký ngay" → Redirect login
3. ✅ User đã đăng ký → Click "Đăng ký ngay" → Error "Đã đăng ký rồi"

### 13.2. Khóa Học Có Phí
1. ✅ User đăng nhập → Click "Thanh toán ngay" → Tạo enrollment pending + payment → Redirect payment page
2. ✅ User thanh toán → VietQR callback → Payment completed, enrollment vẫn pending
3. ✅ Admin duyệt → Enrollment active → Email gửi → User có thể học
4. ✅ Payment failed → Payment status = 'failed' → User có thể thử lại

### 13.3. Edge Cases
1. ✅ Khóa học không tồn tại → 404
2. ✅ Khóa học chưa published → 403
3. ✅ VietQR API lỗi → Rollback enrollment, error message
4. ✅ Duplicate enrollment → Error message
5. ✅ Admin duyệt khi chưa thanh toán → Error "Chưa thanh toán"

---

## 14. Configuration

### 14.1. Environment Variables

```env
# VietQR Configuration
VIETQR_API_KEY=your_vietqr_api_key
VIETQR_CLIENT_ID=your_vietqr_client_id
VIETQR_API_SECRET=your_vietqr_api_secret
VIETQR_BASE_URL=https://api.vietqr.io
VIETQR_ACCOUNT_NO=your_bank_account_number
VIETQR_ACCOUNT_NAME=StudyMate
VIETQR_BANK_CODE=970415

# Email Configuration (for approval notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
BASE_URL=http://localhost:3000
```

### 14.2. VietQR Webhook Setup

1. Đăng nhập VietQR Dashboard
2. Vào phần Webhook Settings
3. Thêm webhook URL: `https://yourdomain.com/api/payments/vietqr/callback`
4. Chọn events: `payment.completed`, `payment.failed`
5. Lưu cấu hình

---

## 15. Troubleshooting

### 15.1. QR Code Không Hiển Thị
- **Nguyên nhân**: VietQR API lỗi hoặc chưa config
- **Giải pháp**: 
  - Kiểm tra `VIETQR_API_KEY`, `VIETQR_CLIENT_ID`, `VIETQR_API_SECRET`
  - Check logs trong Kibana: `type: "payment" AND operation: "vietqr_error"`
  - Verify VietQR account có đủ quota

### 15.2. Payment Không Được Cập Nhật
- **Nguyên nhân**: Webhook callback không đến hoặc lỗi xử lý
- **Giải pháp**:
  - Kiểm tra webhook URL trong VietQR dashboard
  - Check server logs cho callback requests
  - Verify transactionId và orderId matching

### 15.3. Enrollment Không Được Duyệt
- **Nguyên nhân**: Payment chưa completed hoặc admin chưa duyệt
- **Giải pháp**:
  - Kiểm tra payment status trong admin panel
  - Verify payment.status === 'completed' trước khi duyệt
  - Check email có được gửi không

---

## 16. Best Practices

### 16.1. Payment Handling
- ✅ Luôn verify payment status trước khi duyệt enrollment
- ✅ Log tất cả payment events để audit trail
- ✅ Handle webhook idempotency (tránh duplicate processing)
- ✅ Set timeout cho payment (ví dụ: 24h)

### 16.2. User Experience
- ✅ Hiển thị rõ ràng trạng thái enrollment
- ✅ Provide clear next steps (thanh toán, chờ duyệt, học ngay)
- ✅ Send email notifications khi có thay đổi quan trọng
- ✅ Allow user xem lại payment page nếu cần

### 16.3. Security
- ✅ Validate tất cả inputs
- ✅ Check ownership trước khi hiển thị payment
- ✅ Rate limit enrollment requests
- ✅ Monitor suspicious activities

---

## 17. Future Enhancements

### 17.1. Payment Timeout
- Tự động hủy enrollment nếu payment không hoàn thành trong 24h

### 17.2. Payment Retry
- Cho phép user tạo payment mới nếu payment failed

### 17.3. Partial Refund
- Hỗ trợ hoàn tiền một phần nếu user drop course

### 17.4. Payment Methods
- Thêm các phương thức thanh toán khác (MoMo, ZaloPay, etc.)

### 17.5. Auto-Approval
- Tự động duyệt enrollment sau khi payment completed (nếu config)

---

## 18. Related Documentation

- [VietQR API Documentation](https://www.vietqr.io/)
- [Email Service Documentation](./EMAIL-SERVICE.md)
- [Admin Panel Guide](./ADMIN-GUIDE.md)
- [Functional Report](./FUNCTIONAL-REPORT.md)

---

**Last Updated**: 2026-01-02  
**Version**: 1.0  
**Author**: StudyMate Development Team

