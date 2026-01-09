# 💳 Payment & Certificate Flow

## Part A: VietQR Payment

### Step 1-3: Initiate Payment
```javascript
POST /api/payments/create

Body: {
  course_id: "uuid",
  amount: 500000
}

// Validation
- User not already enrolled?
- Course exists and active?
- Amount matches course.price?
```

### Step 4-6: Create Payment Record
```sql
INSERT INTO payment (
  id, user_id, course_id,
  amount, status, payment_method,
  transaction_id, expires_at
) VALUES (
  uuid(), ?, ?, 500000, 'pending', 'vietqr',
  'TXN_' + timestamp, NOW() + INTERVAL 15 MINUTE
);
```

### Step 7-9: Generate QR Code
```javascript
const vietQR = require('./services/vietQRService');

const qrData = await vietQR.generateQR({
  bankId: '970415', // Vietinbank
  accountNo: process.env.BANK_ACCOUNT,
  accountName: 'STUDYMATE',
  amount: '500000',
  addInfo: transactionId,
  template: 'compact'
});

// Response
{
  qrCode: "data:image/png;base64,...",
  qrDataURL: "...",
  bankInfo: {
    bankId, accountNo, accountName
  },
  amount: 500000,
  expiresAt: "2026-01-09T22:00:00Z"
}
```

### Step 10-12: Display & Wait
Frontend hiển thị:
```
┌─────────────────────────────────┐
│  Thanh toán khóa học            │
│                                 │
│  [    QR CODE IMAGE    ]        │
│                                 │
│  Số tiền: 500,000 VNĐ           │
│  Ngân hàng: Vietinbank          │
│  Số TK: 123456789               │
│  Nội dung: TXN_1736435000       │
│                                 │
│  ⏱️ Hết hạn: 14:35            │
│  🔄 Đang chờ thanh toán...     │
└─────────────────────────────────┘
```

Polling status mỗi 3s:
```javascript
setInterval(async () => {
  const status = await checkPaymentStatus(paymentId);
  if (status === 'completed') {
    redirectToCourse();
  }
}, 3000);
```

### Step 13-16: Webhook Processing
```javascript
POST /api/payments/webhook

Body: {
  transaction_id: "TXN_1736435000",
  amount: 500000,
  status: "success",
  bank_code: "VTB",
  timestamp: "...",
  signature: "..." // HMAC verification
}

// Verify
1. Validate signature
2. Check transaction exists
3. Verify amount matches
4. Not duplicate payment
```

Update payment:
```sql
UPDATE payment 
SET status = 'completed',
    paid_at = NOW(),
    bank_transaction_id = ?
WHERE transaction_id = ?;

-- Create enrollment
INSERT INTO enrollment (user_id, course_id)
VALUES (?, ?);
```

## Part B: Certificate Generation

### Trigger: Course Completion
```javascript
// Check all requirements
const requirements = await checkCompletion(userId, courseId);

if (requirements.allMet) {
  await generateCertificate(userId, courseId);
}
```

### Certificate Service
```javascript
const PDFDocument = require('pdf-lib');
const QRCode = require('qrcode');

async function generateCertificate(userId, courseId) {
  // 1. Load template
  const template = await fs.readFile('./templates/certificate.pdf');
  const pdfDoc = await PDFDocument.load(template);
  
  // 2. Get data
  const user = await User.findByPk(userId);
  const course = await Course.findByPk(courseId);
  
  // 3. Generate certificate ID
  const certId = `CERT-${Date.now()}-${userId}`;
  
  // 4. Create verification QR
  const verifyUrl = `https://studymate.com/verify/${certId}`;
  const qrCode = await QRCode.toDataURL(verifyUrl);
  
  // 5. Fill PDF
  const page = pdfDoc.getPages()[0];
  
  page.drawText(user.fullname, {
    x: 200, y: 400,
    size: 30,
    font: await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
  });
  
  page.drawText(course.title, {x: 150, y: 300, size: 20});
  page.drawText(formatDate(new Date()), {x: 200, y: 200});
  
  // Embed QR code
  const qrImage = await pdfDoc.embedPng(qrCode);
  page.drawImage(qrImage, {x: 500, y: 50, width: 80, height: 80});
  
  // 6. Save to MinIO
  const pdfBytes = await pdfDoc.save();
  const fileUrl = await minioService.upload({
    bucket: 'certificates',
    filename: `${certId}.pdf`,
    buffer: pdfBytes
  });
  
  // 7. Save to database
  await Certificate.create({
    id: certId,
    user_id: userId,
    course_id: courseId,
    file_url: fileUrl,
    issued_at: new Date(),
    verification_code: certId
  });
  
  // 8. Send email
  await emailService.send({
    to: user.email,
    subject: 'Chứng chỉ hoàn thành khóa học',
    template: 'certificate',
    data: {
      name: user.fullname,
      course: course.title,
      downloadUrl: await minioService.getSignedUrl(fileUrl, 7 * 24 * 3600)
    }
  });
  
  return certId;
}
```

### Display Certificate
```
/dashboard/certificates

┌────────────────────────┐
│  📜 My Certificates    │
├────────────────────────┤
│  ✅ Web Development    │
│  Issued: 09/01/2026    │
│  [View] [Download]     │
│  [Verify] [Share]      │
└────────────────────────┘
```
