# Flow Tích Hợp VietQR - StudyMate

## Tổng Quan

Tài liệu này mô tả chi tiết quy trình tích hợp VietQR vào hệ thống StudyMate để xử lý thanh toán khóa học qua QR code. VietQR là dịch vụ thanh toán qua QR code phổ biến tại Việt Nam, cho phép người dùng quét mã QR để thanh toán trực tiếp từ ứng dụng ngân hàng.

---

## 1. Giới Thiệu VietQR

### 1.1. VietQR là gì?
- Dịch vụ thanh toán qua QR code được phát triển bởi VietQR
- Hỗ trợ thanh toán từ các ứng dụng ngân hàng Việt Nam
- Tích hợp với hơn 40 ngân hàng tại Việt Nam
- API đơn giản, dễ tích hợp

### 1.2. Tính Năng
- ✅ Tạo QR code thanh toán động
- ✅ Deep link để mở ứng dụng ngân hàng
- ✅ Webhook callback khi thanh toán thành công
- ✅ Hỗ trợ nhiều ngân hàng (Vietcombank, Techcombank, BIDV, etc.)

### 1.3. Tài Liệu Chính Thức
- Website: https://www.vietqr.io/
- API Documentation: https://www.vietqr.io/api
- Support: support@vietqr.io

---

## 2. Kiến Trúc Tích Hợp

```
┌─────────────┐
│   User      │
│  (Browser)  │
└──────┬──────┘
       │
       │ 1. Click "Thanh toán ngay"
       ▼
┌─────────────────────────────────┐
│   StudyMate Backend             │
│   POST /courses/enroll/:id      │
└──────┬──────────────────────────┘
       │
       │ 2. Create Enrollment (pending)
       │ 3. Call VietQR API
       ▼
┌─────────────────────────────────┐
│   VietQR API                    │
│   POST /v2/generate             │
└──────┬──────────────────────────┘
       │
       │ 4. Return QR Code
       ▼
┌─────────────────────────────────┐
│   StudyMate Backend             │
│   Create Payment Record         │
└──────┬──────────────────────────┘
       │
       │ 5. Return Payment Page
       ▼
┌─────────────┐
│   User      │
│  (Browser)  │
│  /payments/:id                  │
└──────┬──────┘
       │
       │ 6. Scan QR Code
       │    or Click Deep Link
       ▼
┌─────────────────────────────────┐
│   Banking App                   │
│   (Vietcombank, Techcombank...) │
└──────┬──────────────────────────┘
       │
       │ 7. Confirm Payment
       ▼
┌─────────────────────────────────┐
│   VietQR Service                │
│   Process Payment                │
└──────┬──────────────────────────┘
       │
       │ 8. Webhook Callback
       ▼
┌─────────────────────────────────┐
│   StudyMate Backend             │
│   POST /api/payments/vietqr/callback │
└──────┬──────────────────────────┘
       │
       │ 9. Update Payment Status
       │ 10. Update Enrollment Status
       ▼
┌─────────────────────────────────┐
│   Database                      │
│   Payment: completed            │
│   Enrollment: pending           │
└─────────────────────────────────┘
```

---

## 3. Cấu Hình và Setup

### 3.1. Đăng Ký Tài Khoản VietQR

1. Truy cập https://www.vietqr.io/
2. Đăng ký tài khoản merchant
3. Xác thực thông tin doanh nghiệp
4. Nhận API credentials:
   - `API Key`
   - `Client ID`
   - `API Secret`

### 3.2. Cấu Hình Environment Variables

Thêm vào file `.env`:

```env
# VietQR Configuration
VIETQR_API_KEY=your_vietqr_api_key_here
VIETQR_CLIENT_ID=your_vietqr_client_id_here
VIETQR_API_SECRET=your_vietqr_api_secret_here
VIETQR_BASE_URL=https://api.vietqr.io

# Bank Account Information
VIETQR_ACCOUNT_NO=your_bank_account_number
VIETQR_ACCOUNT_NAME=StudyMate
VIETQR_BANK_CODE=970415  # Vietcombank (default)
```

**Lưu ý về Bank Code:**
- `970415` - Vietcombank (VCB)
- `970407` - Techcombank (TCB)
- `970422` - BIDV
- `970436` - Agribank
- Xem danh sách đầy đủ tại: https://www.vietqr.io/bank-codes

### 3.3. Cấu Hình Webhook

1. Đăng nhập VietQR Dashboard
2. Vào phần **Webhook Settings**
3. Thêm webhook URL:
   ```
   https://yourdomain.com/api/payments/vietqr/callback
   ```
4. Chọn events:
   - ✅ `payment.completed`
   - ✅ `payment.failed`
   - ✅ `payment.cancelled`
5. Lưu cấu hình

**Lưu ý:**
- Webhook URL phải là HTTPS
- Webhook URL phải accessible từ internet (không phải localhost)
- Có thể test webhook bằng cách gửi test request từ dashboard

---

## 4. Service Implementation

### 4.1. VietQR Service (`services/vietQRService.js`)

#### 4.1.1. Constructor
```javascript
class VietQRService {
  constructor() {
    this.apiKey = process.env.VIETQR_API_KEY;
    this.clientId = process.env.VIETQR_CLIENT_ID;
    this.apiSecret = process.env.VIETQR_API_SECRET;
    this.baseUrl = process.env.VIETQR_BASE_URL || 'https://api.vietqr.io';
    this.enabled = !!(this.apiKey && this.clientId && this.apiSecret);
  }
}
```

#### 4.1.2. Create QR Code Method
```javascript
async createQRCode(params) {
  const {
    amount,        // Số tiền (VND)
    description,    // Mô tả thanh toán
    orderId,       // Mã đơn hàng (enrollment_id)
    accountNo,     // Số tài khoản (optional, dùng env)
    accountName,   // Tên chủ tài khoản (optional, dùng env)
    bankCode       // Mã ngân hàng (optional, dùng env)
  } = params;

  const requestData = {
    accountNo: accountNo || process.env.VIETQR_ACCOUNT_NO,
    accountName: accountName || process.env.VIETQR_ACCOUNT_NAME || 'StudyMate',
    acqId: bankCode || process.env.VIETQR_BANK_CODE || '970415',
    amount: Math.round(amount), // Amount in VND
    addInfo: description || `Thanh toan khoa hoc - ${orderId}`,
    format: 'text',
    template: 'compact2'
  };

  // Make POST request to /v2/generate
  const result = await this.makeRequest('/v2/generate', 'POST', requestData);

  if (result.code === '00' && result.data) {
    return {
      success: true,
      qrCode: result.data.qrDataURL || result.data.qrCode,
      qrData: result.data.qrCode,
      qrDataURL: result.data.qrDataURL,
      deepLink: result.data.deeplink,
      transactionId: result.data.transactionId || orderId
    };
  }
}
```

#### 4.1.3. Make Request Method
```javascript
async makeRequest(endpoint, method = 'GET', data = null) {
  const url = new URL(`${this.baseUrl}${endpoint}`);
  
  const options = {
    hostname: url.hostname,
    port: 443,
    path: url.pathname + url.search,
    method: method,
    headers: {
      'x-client-id': this.clientId,
      'x-api-key': this.apiKey,
      'Content-Type': 'application/json'
    }
  };

  // Add API secret if provided
  if (this.apiSecret) {
    options.headers['x-api-secret'] = this.apiSecret;
  }

  // Make HTTPS request
  // Return parsed JSON response
}
```

---

## 5. Flow Chi Tiết

### 5.1. Flow Tạo QR Code (Khi User Đăng Ký Khóa Học Có Phí)

#### Bước 1: User Click "Thanh toán ngay"
- **Route**: `POST /courses/enroll/:id`
- **Controller**: `courseController.enroll`
- **Validation**: User đã đăng nhập, khóa học tồn tại, chưa đăng ký

#### Bước 2: Tạo Enrollment (Pending)
```javascript
const enrollment = await Enrollment.create({
  user_id: userId,
  course_id: courseId,
  status: 'pending'  // Chờ thanh toán
});
```

#### Bước 3: Gọi VietQR API
```javascript
const vietQRService = require('../services/vietQRService');

const qrResult = await vietQRService.createQRCode({
  amount: coursePrice,
  description: `Thanh toan khoa hoc: ${course.title}`,
  orderId: enrollment.id
});
```

**Request Body:**
```json
{
  "accountNo": "1234567890",
  "accountName": "StudyMate",
  "acqId": "970415",
  "amount": 500000,
  "addInfo": "Thanh toan khoa hoc: Lập trình Web với React",
  "format": "text",
  "template": "compact2"
}
```

**Response:**
```json
{
  "code": "00",
  "desc": "Success",
  "data": {
    "qrCode": "00020101021238570010A00000072701270006...",
    "qrDataURL": "https://img.vietqr.io/image/...",
    "deeplink": "vietqr://transfer?accountNo=...",
    "transactionId": "66356cfe-746a-4e30-b10f-66c0354d4930"
  }
}
```

#### Bước 4: Tạo Payment Record
```javascript
const payment = await Payment.create({
  enrollment_id: enrollment.id,
  user_id: userId,
  course_id: courseId,
  amount: coursePrice,
  payment_method: 'vietqr',
  status: 'pending',
  vietqr_transaction_id: qrResult.transactionId,
  vietqr_qr_code: qrResult.qrCode || qrResult.qrDataURL,
  vietqr_deep_link: qrResult.deepLink,
  payment_data: JSON.stringify({
    qrCodeUrl: qrResult.qrCode || qrResult.qrDataURL,
    qrData: qrResult.qrData,
    transactionId: qrResult.transactionId
  })
});
```

#### Bước 5: Response và Redirect
```javascript
res.json({
  success: true,
  requiresPayment: true,
  message: 'Vui lòng thanh toán để hoàn tất đăng ký',
  data: {
    enrollment: {
      id: enrollment.id,
      status: 'pending'
    },
    payment: {
      id: payment.id,
      amount: coursePrice,
      qrCode: qrResult.qrCode,
      qrCodeUrl: qrResult.qrCode || qrResult.qrDataURL,
      deepLink: qrResult.deepLink
    }
  }
});
```

**Frontend:**
```javascript
if (data.requiresPayment && data.data.payment) {
  window.location.href = `/payments/${data.data.payment.id}`;
}
```

---

### 5.2. Flow Hiển Thị Trang Thanh Toán

#### Bước 1: User Truy Cập Trang Thanh Toán
- **Route**: `GET /payments/:id`
- **Controller**: `paymentController.show`
- **Middleware**: `requireLogin`

#### Bước 2: Lấy Payment và Course Info
```javascript
const payment = await Payment.findOne({
  where: {
    id: id,
    user_id: userId  // Verify ownership
  },
  include: [
    { model: Course, as: 'course' },
    { model: Enrollment, as: 'enrollment' }
  ]
});
```

#### Bước 3: Parse Payment Data
```javascript
let paymentData = null;
try {
  paymentData = payment.payment_data 
    ? JSON.parse(payment.payment_data) 
    : null;
} catch (e) {
  paymentData = null;
}

const qrCodeUrl = paymentData?.qrCodeUrl || payment.vietqr_qr_code;
```

#### Bước 4: Render Payment Page
- Hiển thị thông tin khóa học và số tiền
- Hiển thị QR code image (`<img src="<%= qrCodeUrl %>">`)
- Hiển thị deep link button (nếu có)
- Hiển thị hướng dẫn thanh toán

---

### 5.3. Flow Webhook Callback (Khi Thanh Toán Thành Công)

#### Bước 1: VietQR Gửi Webhook
- **Route**: `POST /api/payments/vietqr/callback`
- **Access**: Public (Webhook từ VietQR)
- **Headers**: (từ VietQR)

**Request Body:**
```json
{
  "transactionId": "66356cfe-746a-4e30-b10f-66c0354d4930",
  "status": "success",  // hoặc "completed", "failed", "cancelled"
  "amount": 500000,
  "orderId": "enrollment_id_uuid"
}
```

#### Bước 2: Tìm Payment
```javascript
const payment = await Payment.findOne({
  where: {
    [Op.or]: [
      { vietqr_transaction_id: transactionId },
      { enrollment_id: orderId }
    ]
  },
  include: [
    {
      model: Enrollment,
      as: 'enrollment',
      include: [
        { model: Course, as: 'course' },
        { model: User, as: 'user' }
      ]
    }
  ]
});
```

#### Bước 3: Xử Lý Theo Status

**Nếu `status === 'success' || status === 'completed'`:**
```javascript
// Update payment
payment.status = 'completed';
payment.paid_at = new Date();
await payment.save();

// Update enrollment (chờ admin duyệt)
const enrollment = payment.enrollment;
enrollment.status = 'pending';  // Chờ admin duyệt
await enrollment.save();

// Log event
applicationLogger.info('Payment completed - Enrollment pending approval', {
  type: 'payment',
  operation: 'payment_completed',
  paymentId: payment.id,
  enrollmentId: enrollment.id,
  userId: enrollment.user_id
});
```

**Nếu `status === 'failed'`:**
```javascript
payment.status = 'failed';
await payment.save();
```

**Nếu `status === 'cancelled'`:**
```javascript
payment.status = 'cancelled';
await payment.save();
```

#### Bước 4: Response
```javascript
res.json({
  success: true,
  message: 'Payment verified. Enrollment is pending admin approval.'
});
```

---

## 6. API Endpoints

### 6.1. Tạo QR Code (Internal)
- **Method**: N/A (gọi từ `vietQRService.createQRCode()`)
- **Endpoint**: `POST https://api.vietqr.io/v2/generate`
- **Headers**:
  ```
  x-client-id: your_client_id
  x-api-key: your_api_key
  x-api-secret: your_api_secret
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "accountNo": "1234567890",
    "accountName": "StudyMate",
    "acqId": "970415",
    "amount": 500000,
    "addInfo": "Thanh toan khoa hoc: ...",
    "format": "text",
    "template": "compact2"
  }
  ```
- **Response**:
  ```json
  {
    "code": "00",
    "desc": "Success",
    "data": {
      "qrCode": "...",
      "qrDataURL": "https://...",
      "deeplink": "vietqr://...",
      "transactionId": "..."
    }
  }
  ```

### 6.2. Webhook Callback (Public)
- **Route**: `POST /api/payments/vietqr/callback`
- **Access**: Public (Webhook từ VietQR)
- **Body**:
  ```json
  {
    "transactionId": "uuid",
    "status": "success|completed|failed|cancelled",
    "amount": 500000,
    "orderId": "enrollment_id"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Payment verified. Enrollment is pending admin approval."
  }
  ```

### 6.3. Xem Trang Thanh Toán (Private)
- **Route**: `GET /payments/:id`
- **Access**: Private (User phải đăng nhập)
- **Response**: HTML page với QR code

### 6.4. Kiểm Tra Trạng Thái Thanh Toán (Private)
- **Route**: `GET /api/payments/:paymentId/status`
- **Access**: Private
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "payment": {
        "id": "uuid",
        "status": "pending|completed|failed|cancelled",
        "amount": 500000,
        "paid_at": "2026-01-02T...",
        "enrollment": {
          "id": "uuid",
          "status": "pending|active|completed"
        }
      }
    }
  }
  ```

---

## 7. Database Schema

### 7.1. Payment Table
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

### 7.2. Payment Data Structure (JSON)
```json
{
  "qrCodeUrl": "https://img.vietqr.io/image/...",
  "qrData": "00020101021238570010A00000072701270006...",
  "transactionId": "66356cfe-746a-4e30-b10f-66c0354d4930"
}
```

---

## 8. Error Handling

### 8.1. Lỗi Thường Gặp

#### VietQR API Lỗi
- **Nguyên nhân**: API key không hợp lệ, thiếu thông tin, network error
- **Xử lý**:
  ```javascript
  try {
    const qrResult = await vietQRService.createQRCode({...});
  } catch (error) {
    // Log error
    applicationLogger.error('VietQR create QR code error', error, {
      type: 'payment',
      operation: 'vietqr_error',
      orderId: orderId,
      amount: amount
    });
    
    // Rollback enrollment
    await enrollment.destroy();
    
    // Return error
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi khởi tạo thanh toán. Vui lòng thử lại sau.'
    });
  }
  ```

#### Payment Không Tìm Thấy (Webhook)
- **Nguyên nhân**: `transactionId` hoặc `orderId` không khớp
- **Xử lý**:
  ```javascript
  if (!payment) {
    applicationLogger.warn('Payment not found for VietQR callback', {
      type: 'payment',
      operation: 'vietqr_callback_not_found',
      transactionId: transactionId,
      orderId: orderId
    });
    return res.status(404).json({ 
      success: false, 
      message: 'Payment not found' 
    });
  }
  ```

#### Webhook Callback Lỗi
- **Nguyên nhân**: Database error, validation error
- **Xử lý**:
  ```javascript
  try {
    // Process callback
  } catch (error) {
    applicationLogger.error('VietQR callback error', error, {
      type: 'payment',
      operation: 'vietqr_callback_error'
    });
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
  ```

### 8.2. Retry Logic

**Lưu ý**: VietQR không hỗ trợ retry tự động. Nếu webhook callback thất bại:
1. VietQR sẽ retry webhook (theo chính sách của họ)
2. Nên implement idempotency để tránh duplicate processing
3. Có thể implement manual retry từ admin panel

---

## 9. Security Considerations

### 9.1. API Key Protection
- ✅ **Không commit API keys vào Git**
- ✅ **Sử dụng environment variables**
- ✅ **Rotate API keys định kỳ**
- ✅ **Giới hạn IP whitelist** (nếu VietQR hỗ trợ)

### 9.2. Webhook Security
- ✅ **Verify webhook signature** (nếu VietQR cung cấp)
- ✅ **IP whitelist** (nếu có thể)
- ✅ **HTTPS only** cho webhook URL
- ✅ **Idempotency** để tránh duplicate processing

### 9.3. Payment Verification
- ✅ **Verify `transactionId` và `orderId`** trước khi cập nhật
- ✅ **Verify `amount`** khớp với payment record
- ✅ **Log tất cả payment events** để audit

### 9.4. User Authorization
- ✅ **User chỉ có thể xem payment của chính mình**
- ✅ **Verify `user_id`** trong payment queries
- ✅ **Admin mới có thể duyệt enrollment**

---

## 10. Logging

Tất cả các events quan trọng đều được log vào Kibana:

### 10.1. Create QR Code
```javascript
applicationLogger.info('Creating VietQR payment QR code', {
  type: 'payment',
  operation: 'vietqr_create',
  orderId: orderId,
  amount: amount
});

applicationLogger.info('VietQR QR code created successfully', {
  type: 'payment',
  operation: 'vietqr_success',
  orderId: orderId,
  qrCode: result.data.qrDataURL ? 'generated' : null
});
```

### 10.2. Webhook Callback
```javascript
applicationLogger.info('VietQR callback received', {
  type: 'payment',
  operation: 'vietqr_callback',
  transactionId: transactionId,
  status: status,
  orderId: orderId
});

applicationLogger.info('Payment completed - Enrollment pending approval', {
  type: 'payment',
  operation: 'payment_completed',
  paymentId: payment.id,
  enrollmentId: enrollment.id,
  userId: enrollment.user_id
});
```

### 10.3. Errors
```javascript
applicationLogger.error('VietQR create QR code error', error, {
  type: 'payment',
  operation: 'vietqr_error',
  orderId: orderId,
  amount: amount
});
```

---

## 11. Testing

### 11.1. Test Tạo QR Code

**Test Case 1: Tạo QR Code Thành Công**
```javascript
// Test với valid credentials
const qrResult = await vietQRService.createQRCode({
  amount: 500000,
  description: 'Test payment',
  orderId: 'test-order-123'
});

// Verify
expect(qrResult.success).toBe(true);
expect(qrResult.qrCode).toBeDefined();
expect(qrResult.qrDataURL).toBeDefined();
expect(qrResult.deepLink).toBeDefined();
```

**Test Case 2: Tạo QR Code Lỗi (Invalid Credentials)**
```javascript
// Test với invalid API key
process.env.VIETQR_API_KEY = 'invalid_key';

await expect(
  vietQRService.createQRCode({...})
).rejects.toThrow();
```

### 11.2. Test Webhook Callback

**Test Case 1: Payment Thành Công**
```javascript
// Simulate webhook callback
const response = await request(app)
  .post('/api/payments/vietqr/callback')
  .send({
    transactionId: 'test-transaction-id',
    status: 'success',
    amount: 500000,
    orderId: enrollment.id
  });

// Verify
expect(response.status).toBe(200);
expect(response.body.success).toBe(true);

// Check database
const payment = await Payment.findByPk(paymentId);
expect(payment.status).toBe('completed');
expect(payment.paid_at).toBeDefined();
```

**Test Case 2: Payment Không Tìm Thấy**
```javascript
const response = await request(app)
  .post('/api/payments/vietqr/callback')
  .send({
    transactionId: 'non-existent-id',
    status: 'success',
    amount: 500000,
    orderId: 'non-existent-order'
  });

expect(response.status).toBe(404);
expect(response.body.success).toBe(false);
```

### 11.3. Test Integration

**Test Case: Full Flow**
1. User đăng ký khóa học có phí
2. Verify enrollment created với status 'pending'
3. Verify payment created với status 'pending'
4. Verify QR code được tạo
5. Simulate webhook callback với status 'success'
6. Verify payment status = 'completed'
7. Verify enrollment status = 'pending' (chờ admin duyệt)

---

## 12. Troubleshooting

### 12.1. QR Code Không Hiển Thị

**Nguyên nhân:**
- VietQR API lỗi
- API credentials không đúng
- Network error

**Giải pháp:**
1. Kiểm tra logs trong Kibana:
   ```
   type: "payment" AND operation: "vietqr_error"
   ```
2. Verify environment variables:
   ```bash
   echo $VIETQR_API_KEY
   echo $VIETQR_CLIENT_ID
   echo $VIETQR_API_SECRET
   ```
3. Test API call trực tiếp:
   ```bash
   curl -X POST https://api.vietqr.io/v2/generate \
     -H "x-client-id: $VIETQR_CLIENT_ID" \
     -H "x-api-key: $VIETQR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"accountNo":"...","amount":500000,...}'
   ```
4. Kiểm tra VietQR account có đủ quota không

### 12.2. Webhook Callback Không Đến

**Nguyên nhân:**
- Webhook URL không đúng
- Server không accessible từ internet
- Firewall block

**Giải pháp:**
1. Verify webhook URL trong VietQR dashboard
2. Test webhook URL có accessible không:
   ```bash
   curl -X POST https://yourdomain.com/api/payments/vietqr/callback \
     -H "Content-Type: application/json" \
     -d '{"test":true}'
   ```
3. Check server logs cho incoming requests
4. Verify firewall rules cho port 443 (HTTPS)
5. Sử dụng ngrok hoặc similar tool để test local development

### 12.3. Payment Không Được Cập Nhật

**Nguyên nhân:**
- Webhook callback lỗi
- `transactionId` hoặc `orderId` không khớp
- Database error

**Giải pháp:**
1. Check logs cho webhook callback:
   ```
   type: "payment" AND operation: "vietqr_callback"
   ```
2. Verify `transactionId` và `orderId` trong database:
   ```sql
   SELECT id, vietqr_transaction_id, enrollment_id 
   FROM payments 
   WHERE status = 'pending';
   ```
3. Check database constraints và foreign keys
4. Verify payment record tồn tại trước khi webhook đến

### 12.4. Duplicate Payment Processing

**Nguyên nhân:**
- Webhook được gọi nhiều lần
- Không có idempotency check

**Giải pháp:**
1. Implement idempotency check:
   ```javascript
   // Check if payment already processed
   if (payment.status === 'completed' && payment.paid_at) {
     return res.json({
       success: true,
       message: 'Payment already processed'
     });
   }
   ```
2. Log duplicate attempts để monitor
3. Verify webhook signature (nếu VietQR cung cấp)

---

## 13. Best Practices

### 13.1. Payment Handling
- ✅ **Luôn verify payment status trước khi cập nhật**
- ✅ **Log tất cả payment events để audit trail**
- ✅ **Handle webhook idempotency** (tránh duplicate processing)
- ✅ **Set timeout cho payment** (ví dụ: 24h, tự động hủy nếu chưa thanh toán)

### 13.2. Error Handling
- ✅ **Rollback enrollment nếu tạo QR code lỗi**
- ✅ **Return user-friendly error messages**
- ✅ **Log detailed errors cho debugging**
- ✅ **Implement retry logic** (nếu cần)

### 13.3. Security
- ✅ **Never expose API keys trong frontend**
- ✅ **Verify webhook requests** (signature, IP)
- ✅ **Validate tất cả inputs** (amount, orderId, etc.)
- ✅ **Rate limit payment requests** (tránh abuse)

### 13.4. Monitoring
- ✅ **Monitor payment success rate**
- ✅ **Alert khi webhook callback fails**
- ✅ **Track payment processing time**
- ✅ **Monitor VietQR API response times**

---

## 14. VietQR API Response Codes

| Code | Description | Action |
|------|-------------|--------|
| `00` | Success | Process normally |
| `01` | Invalid account | Check account number |
| `02` | Invalid amount | Verify amount > 0 |
| `03` | Invalid bank code | Check bank code |
| `04` | API key invalid | Verify API credentials |
| `05` | Rate limit exceeded | Wait and retry |
| `99` | Unknown error | Contact VietQR support |

---

## 15. Limitations

### 15.1. VietQR API Limitations
- ❌ **Không có endpoint để check payment status** (chỉ dùng webhook)
- ❌ **Không hỗ trợ refund** (phải xử lý manual)
- ❌ **Webhook có thể bị delay** (vài phút đến vài giờ)
- ❌ **Không có test mode** (phải dùng real account)

### 15.2. Workarounds
- ✅ **Implement manual status check** từ admin panel
- ✅ **Set payment timeout** (tự động hủy sau 24h)
- ✅ **Allow retry payment** nếu payment failed
- ✅ **Monitor webhook delays** và alert nếu cần

---

## 16. Future Enhancements

### 16.1. Payment Methods
- Thêm các phương thức thanh toán khác (MoMo, ZaloPay, etc.)
- Hỗ trợ thanh toán trả góp

### 16.2. Payment Features
- Auto-approval enrollment sau khi payment completed
- Payment timeout và auto-cancel
- Payment retry mechanism
- Refund support

### 16.3. Admin Features
- Payment dashboard với statistics
- Manual payment verification
- Bulk payment processing
- Payment export/reporting

---

## 17. Related Documentation

- [Course Enrollment Flow](./COURSE-ENROLLMENT-FLOW.md)
- [Payment Service Documentation](./PAYMENT-SERVICE.md) (nếu có)
- [VietQR Official Documentation](https://www.vietqr.io/api)
- [Admin Panel Guide](./ADMIN-GUIDE.md)

---

## 18. Support

### 18.1. VietQR Support
- Email: support@vietqr.io
- Website: https://www.vietqr.io/
- Documentation: https://www.vietqr.io/api

### 18.2. Internal Support
- Check logs trong Kibana: `type: "payment"`
- Review error logs: `operation: "vietqr_error"`
- Contact development team nếu cần

---

**Last Updated**: 2026-01-02  
**Version**: 1.0  
**Author**: StudyMate Development Team

