# 📚 Course Enrollment & Learning Flow

## Stage 1: Course Discovery
1. User browses `/courses`
2. Filter by: category, price, rating, level
3. Search với Elasticsearch
4. Click course → `/courses/:slug`

## Stage 2: Payment Decision
### Nếu khóa học FREE:
- Click "Enroll Now"
- Tạo ENROLLMENT ngay lập tức
- Skip payment

### Nếu khóa học PAID:
1. Click "Buy Now - 500,000 VND"
2. Redirect → `/payments/checkout`
3. VietQR payment flow (xem FEATURE-05)
4. Sau khi thanh toán → Tạo ENROLLMENT

## Stage 3: Enrollment Creation
```sql
INSERT INTO enrollment (user_id, course_id, status, enrolled_at)
VALUES (?, ?, 'active', NOW());

-- Tạo progress records cho tất cả content
INSERT INTO progress (user_id, content_id, completed)
SELECT ?, content.id, false
FROM content WHERE course_id = ?;
```

### Notifications:
- Email: "Welcome to [Course Name]"
- In-app notification
- Dashboard update

## Stage 4: Learning Process
1. User vào `/dashboard/my-courses`
2. Select course
3. View content list với progress
4. Click content item:
   - Video → Video player
   - Document → PDF viewer
   - Quiz → Quiz interface

### Progress Tracking:
```javascript
// Auto-save mỗi 30s
setInterval(() => {
  const progress = calculateProgress(); // 0-100%
  updateProgress(contentId, progress);
}, 30000);
```

## Stage 5: Quizzes
- Take quiz (xem FEATURE-04)
- Auto-grading
- Pass/Fail based on threshold

## Stage 6: Completion
### Requirements:
- ✅ All content viewed (>80%)
- ✅ All quizzes passed
- ✅ Final exam passed (if required)

### Rewards:
- 🏆 Certificate generation
- 🎖️ Achievement badges
- 📧 Congratulation email
- ⭐ Enable course review
