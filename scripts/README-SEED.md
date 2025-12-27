# StudyMate AI - Seed Data Guide

Hướng dẫn tạo dữ liệu mẫu cho StudyMate AI

## 📋 Cách sử dụng

### Phương pháp 1: Sử dụng Node.js Script (Khuyến nghị)

Script này sẽ tự động hash passwords và tạo dữ liệu mẫu:

```bash
node scripts/seed-data.js
```

**Ưu điểm:**
- ✅ Tự động hash passwords với bcrypt
- ✅ Xử lý conflicts (không tạo duplicate)
- ✅ Cập nhật thống kê tự động
- ✅ Dễ mở rộng và maintain

### Phương pháp 2: Sử dụng SQL Script

Nếu bạn muốn chạy trực tiếp SQL:

```bash
# Kết nối PostgreSQL
psql -U postgres -d studymate_db -f scripts/seed-sample-data.sql
```

**Lưu ý:** 
- Passwords trong SQL file đã được hash sẵn (tất cả là "Password123!")
- Nếu muốn đổi password, cần hash lại bằng bcrypt

## 📊 Dữ liệu mẫu bao gồm

### 1. Users (9 users)
- **5 Students**: Sinh viên UIT với email @student.uit.edu.vn
- **3 Lecturers**: Giảng viên với email @uit.edu.vn
- **1 Admin**: Quản trị viên hệ thống

**Thông tin đăng nhập:**
- Email: `nguyen.minh.hieu@student.uit.edu.vn`
- Password: `Password123!`

- Email: `admin@studymate.uit.edu.vn`
- Password: `Password123!`

### 2. Categories (7 categories)
- 4 root categories: Lập trình, Cơ sở dữ liệu, Mạng máy tính, Trí tuệ nhân tạo
- 3 sub-categories: Web Development, Mobile Development, Algorithms

### 3. Courses (8 courses)
- Lập trình Web với React
- Node.js và Express.js
- Cơ sở dữ liệu nâng cao
- SQL Cơ bản
- Machine Learning cơ bản
- Deep Learning với TensorFlow
- Thuật toán và Cấu trúc dữ liệu
- An toàn thông tin

### 4. Enrollments (12 enrollments)
- Nhiều trạng thái: active, completed, pending
- Progress percentages khác nhau
- Time spent tracking

### 5. Contents (6+ contents)
- Lessons, Videos, Quizzes
- Được gán vào các courses

### 6. Quizzes & Questions
- 3 quizzes với questions và answers
- Multiple choice questions

### 7. Ratings (5 ratings)
- Đánh giá từ students
- Ratings từ 4-5 sao

### 8. Achievements (5 achievements)
- Người mới bắt đầu
- Học viên chăm chỉ
- Chuyên gia
- Perfect Score
- Thành viên tích cực

### 9. Activity Logs
- Course enrollments
- Content completions
- Quiz completions

### 10. AI Interactions
- Chat interactions
- Recommendations
- Với context data

### 11. Notifications
- Course updates
- Achievement notifications
- Quiz results

### 12. Discussions & Comments
- Course discussions
- Student questions
- Instructor responses

### 13. Progress Tracking
- Detailed progress per content
- Time spent tracking
- Completion status

### 14. Tags & Content Tags
- Course tags
- Content categorization

### 15. Files
- Course materials (PDFs)
- Document files

## 🔄 Reset Database

Nếu muốn xóa và tạo lại dữ liệu:

```bash
# Xóa tất cả dữ liệu (cẩn thận!)
# Sau đó chạy lại seed script
node scripts/seed-data.js
```

## ⚠️ Lưu ý

1. **Passwords**: Tất cả users có password mặc định là `Password123!`
2. **UUIDs**: Tất cả IDs sử dụng UUID cố định để dễ test
3. **Timestamps**: Sử dụng `NOW()` và intervals để tạo dữ liệu realistic
4. **Foreign Keys**: Đảm bảo thứ tự insert đúng (users → categories → courses → enrollments)
5. **Conflicts**: Script sử dụng `findOrCreate` để tránh duplicate

## 🎯 Test Accounts

### Student Account
```
Email: nguyen.minh.hieu@student.uit.edu.vn
Password: Password123!
Role: student
```

### Admin Account
```
Email: admin@studymate.uit.edu.vn
Password: Password123!
Role: admin
```

### Instructor Account
```
Email: pham.the.son@uit.edu.vn
Password: Password123!
Role: lecturer
```

## 📝 Customization

Để thêm dữ liệu mẫu mới, chỉnh sửa file `scripts/seed-data.js`:

1. Thêm vào `sampleData.users` để tạo users mới
2. Thêm vào `sampleData.courses` để tạo courses mới
3. Thêm enrollments, contents, etc. trong function `seedDatabase()`

## ✅ Verification

Sau khi chạy seed, kiểm tra:

```sql
-- Kiểm tra số lượng records
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'courses', COUNT(*) FROM courses
UNION ALL
SELECT 'enrollments', COUNT(*) FROM enrollments
UNION ALL
SELECT 'contents', COUNT(*) FROM contents;
```

## 🚀 Production Warning

**KHÔNG chạy seed script trong production!**

Script này chỉ dành cho development và testing.
