# Danh sách Use Case cho Giảng viên

## Tổng quan

Hệ thống StudyMate cung cấp **18 use case** chính cho vai trò Giảng viên, bao gồm các chức năng quản lý khóa học, nội dung học tập, học viên, blog, và profile.

---

## Danh sách Use Case

### 1. UC-GV-01: Đăng nhập hệ thống
Giảng viên đăng nhập vào hệ thống StudyMate bằng email/mật khẩu hoặc Google OAuth để sử dụng các chức năng quản lý khóa học và học viên.

### 2. UC-GV-02: Tạo khóa học mới
Giảng viên tạo khóa học mới với thông tin chi tiết (tiêu đề, mô tả, giá, cấp độ, danh mục) và upload ảnh đại diện.

### 3. UC-GV-03: Chỉnh sửa khóa học
Giảng viên chỉnh sửa thông tin khóa học đã tạo (tiêu đề, mô tả, giá, cấp độ, danh mục, ảnh đại diện).

### 4. UC-GV-04: Xóa khóa học
Giảng viên xóa khóa học đã tạo khỏi hệ thống (có thể là soft delete hoặc hard delete).

### 5. UC-GV-05: Xuất bản khóa học
Giảng viên thay đổi trạng thái khóa học từ "draft" sang "published" để học viên có thể tìm thấy và đăng ký.

### 6. UC-GV-06: Thêm nội dung vào khóa học
Giảng viên thêm video, tài liệu, hoặc bài tập/quiz vào khóa học của mình.

### 7. UC-GV-07: Chỉnh sửa nội dung
Giảng viên chỉnh sửa thông tin nội dung trong khóa học (tiêu đề, mô tả, thứ tự, file mới nếu cần).

### 8. UC-GV-08: Xóa nội dung
Giảng viên xóa nội dung khỏi khóa học (video, tài liệu, quiz).

### 9. UC-GV-09: Sắp xếp thứ tự nội dung
Giảng viên thay đổi thứ tự hiển thị của nội dung trong khóa học bằng cách kéo thả hoặc nhập số thứ tự.

### 10. UC-GV-10: Xem danh sách học viên
Giảng viên xem danh sách học viên đã đăng ký khóa học của mình với thông tin cơ bản và tiến độ tổng thể.

### 11. UC-GV-11: Theo dõi tiến độ học viên
Giảng viên xem tiến độ học tập chi tiết của từng học viên trong khóa học (tiến độ theo nội dung, thời gian học, nội dung đã hoàn thành).

### 12. UC-GV-12: Xem thống kê khóa học
Giảng viên xem thống kê tổng quan về khóa học (số đăng ký, hoàn thành, đánh giá, xu hướng).

### 13. UC-GV-13: Tạo bài viết blog
Giảng viên tạo bài viết blog mới để chia sẻ kiến thức, kinh nghiệm với học viên và cộng đồng.

### 14. UC-GV-14: Chỉnh sửa bài viết blog
Giảng viên chỉnh sửa bài viết blog đã tạo (tiêu đề, nội dung, ảnh đại diện, danh mục, tags).

### 15. UC-GV-15: Xóa bài viết blog
Giảng viên xóa bài viết blog đã tạo khỏi hệ thống.

### 16. UC-GV-16: Xem đánh giá khóa học
Giảng viên xem đánh giá và nhận xét từ học viên về khóa học để phân tích hiệu quả giảng dạy và cải thiện chất lượng.

### 17. UC-GV-17: Quản lý profile
Giảng viên xem và cập nhật thông tin cá nhân, avatar, và đổi mật khẩu.

### 18. UC-GV-18: Xem dashboard giảng viên
Giảng viên xem dashboard tổng quan về khóa học, học viên, và hoạt động của mình trên hệ thống.

---

## Phân loại Use Case theo chức năng

### 🔐 Xác thực và Quản lý tài khoản
- UC-GV-01: Đăng nhập hệ thống
- UC-GV-17: Quản lý profile

### 📚 Quản lý Khóa học
- UC-GV-02: Tạo khóa học mới
- UC-GV-03: Chỉnh sửa khóa học
- UC-GV-04: Xóa khóa học
- UC-GV-05: Xuất bản khóa học
- UC-GV-18: Xem dashboard giảng viên

### 📝 Quản lý Nội dung Khóa học
- UC-GV-06: Thêm nội dung vào khóa học
- UC-GV-07: Chỉnh sửa nội dung
- UC-GV-08: Xóa nội dung
- UC-GV-09: Sắp xếp thứ tự nội dung

### 👥 Quản lý Học viên
- UC-GV-10: Xem danh sách học viên
- UC-GV-11: Theo dõi tiến độ học viên
- UC-GV-12: Xem thống kê khóa học
- UC-GV-16: Xem đánh giá khóa học

### ✍️ Quản lý Blog
- UC-GV-13: Tạo bài viết blog
- UC-GV-14: Chỉnh sửa bài viết blog
- UC-GV-15: Xóa bài viết blog

---

## Thống kê

- **Tổng số Use Case:** 18
- **Use Case có Activity Diagram:** 4 (UC-GV-02, UC-GV-06, UC-GV-11, UC-GV-13)
- **Use Case có Sequence Diagram:** 4 (UC-GV-02, UC-GV-06, UC-GV-11, UC-GV-13)

---

**🏛️ Trường Đại học Công nghệ Thông tin**  
**🌍 Đại học Quốc gia TP. Hồ Chí Minh**
