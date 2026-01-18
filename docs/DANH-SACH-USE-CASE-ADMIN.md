# Danh sách Use Case cho Quản trị viên (Admin)

## Tổng quan

Hệ thống StudyMate cung cấp **10 use case** chính cho vai trò Quản trị viên, bao gồm các chức năng quản lý toàn diện hệ thống, từ quản lý người dùng, khóa học, danh mục, liên hệ, đăng ký, nội dung, đến quản lý file trong MinIO storage.

---

## Danh sách Use Case

### 1. UC-ADMIN-01: Đăng nhập hệ thống
Quản trị viên đăng nhập vào hệ thống StudyMate bằng email/mật khẩu hoặc Google OAuth để sử dụng các chức năng quản trị hệ thống.

### 2. UC-ADMIN-02: Xem dashboard quản trị
Quản trị viên xem dashboard tổng quan về hệ thống với các thống kê và thông tin quan trọng (tổng số khóa học, người dùng, đăng ký, đánh giá).

### 3. UC-ADMIN-03: Xem thống kê chi tiết
Quản trị viên xem thống kê chi tiết về người dùng, khóa học, đăng ký, và các chỉ số khác của hệ thống với biểu đồ và phân tích.

### 4. UC-ADMIN-04: Quản lý khóa học
Quản trị viên xem danh sách, tạo, chỉnh sửa, xóa, và quản lý trạng thái khóa học trong hệ thống. Có thể export danh sách ra Excel.

### 5. UC-ADMIN-05: Quản lý người dùng
Quản trị viên xem danh sách, chi tiết, cập nhật trạng thái, thay đổi role, và xóa người dùng trong hệ thống. Có thể export danh sách ra Excel.

### 6. UC-ADMIN-06: Quản lý danh mục
Quản trị viên tạo, chỉnh sửa, xóa, và quản lý trạng thái các danh mục khóa học. Kiểm tra và cảnh báo khi xóa danh mục có khóa học.

### 7. UC-ADMIN-07: Quản lý liên hệ
Quản trị viên xem, cập nhật trạng thái, ưu tiên, ghi chú, và xóa các yêu cầu liên hệ từ người dùng. Hỗ trợ tìm kiếm, lọc, và sắp xếp.

### 8. UC-ADMIN-08: Quản lý đăng ký
Quản trị viên xem, duyệt, cập nhật trạng thái, tiến độ, và xóa các đăng ký khóa học của học viên. Có thể export danh sách ra Excel.

### 9. UC-ADMIN-09: Quản lý nội dung
Quản trị viên xem, tạo, chỉnh sửa, xóa, và quản lý trạng thái nội dung trong các khóa học. Hỗ trợ tìm kiếm và lọc theo loại, trạng thái, khóa học.

### 10. UC-ADMIN-10: Quản lý file
Quản trị viên xem danh sách, upload, xóa, và xem thông tin các file được lưu trữ trong MinIO storage. Hỗ trợ upload nhiều file cùng lúc (tối đa 50 file).

---

## Phân loại Use Case theo chức năng

### 🔐 Xác thực và Dashboard
- UC-ADMIN-01: Đăng nhập hệ thống
- UC-ADMIN-02: Xem dashboard quản trị
- UC-ADMIN-03: Xem thống kê chi tiết

### 👥 Quản lý Người dùng và Nội dung
- UC-ADMIN-05: Quản lý người dùng
- UC-ADMIN-04: Quản lý khóa học
- UC-ADMIN-09: Quản lý nội dung
- UC-ADMIN-06: Quản lý danh mục

### 📋 Quản lý Hoạt động và Tương tác
- UC-ADMIN-08: Quản lý đăng ký
- UC-ADMIN-07: Quản lý liên hệ

### 💾 Quản lý Hệ thống
- UC-ADMIN-10: Quản lý file

---

## Thống kê

- **Tổng số Use Case:** 10
- **Use Case có Activity Diagram:** 1 (UC-ADMIN-10)
- **Use Case có Sequence Diagram:** 1 (UC-ADMIN-10)

---

## Chi tiết từng Use Case

### UC-ADMIN-01: Đăng nhập hệ thống
- **Phương thức:** Email/Password hoặc Google OAuth
- **Kiểm tra:** Role = admin, email_verified, is_active
- **Kết quả:** Chuyển hướng đến admin dashboard

### UC-ADMIN-02: Xem dashboard quản trị
- **Thống kê:** Tổng số khóa học, người dùng, đăng ký, đánh giá
- **Danh sách:** 10 khóa học gần đây nhất
- **Link nhanh:** Truy cập các chức năng quản trị

### UC-ADMIN-03: Xem thống kê chi tiết
- **Thống kê người dùng:** Theo role, active/inactive
- **Thống kê khóa học:** Theo trạng thái, cấp độ
- **Thống kê đăng ký:** Theo trạng thái
- **Top khóa học:** Theo số đăng ký
- **Tăng trưởng:** 30 ngày và 7 ngày gần nhất
- **Export:** Excel/CSV

### UC-ADMIN-04: Quản lý khóa học
- **Xem danh sách:** Tìm kiếm, lọc, sắp xếp, phân trang
- **Tạo mới:** Form tạo khóa học (tương tự giảng viên)
- **Chỉnh sửa:** Cập nhật thông tin khóa học
- **Cập nhật trạng thái:** draft, published, archived
- **Xóa:** Cảnh báo khi có nhiều đăng ký
- **Export:** Danh sách ra Excel

### UC-ADMIN-05: Quản lý người dùng
- **Xem danh sách:** Tìm kiếm, lọc theo role/trạng thái, sắp xếp, phân trang
- **Xem chi tiết:** Thông tin cá nhân, tài khoản, thống kê, lịch sử hoạt động
- **Cập nhật trạng thái:** active/inactive
- **Thay đổi role:** student, teacher, lecturer, admin (không thể thay đổi role của chính mình)
- **Xóa:** Soft delete (đánh dấu inactive), không thể xóa chính mình
- **Export:** Danh sách ra Excel

### UC-ADMIN-06: Quản lý danh mục
- **Xem danh sách:** Tìm kiếm, lọc
- **Tạo mới:** Tên danh mục, mô tả, slug tự động
- **Chỉnh sửa:** Cập nhật thông tin danh mục
- **Cập nhật trạng thái:** active/inactive
- **Xóa:** Cảnh báo khi có khóa học trong danh mục, có thể đề xuất chuyển khóa học

### UC-ADMIN-07: Quản lý liên hệ
- **Xem danh sách:** Tìm kiếm, lọc theo trạng thái/ưu tiên, sắp xếp, phân trang
- **Xem chi tiết:** Thông tin người gửi, nội dung yêu cầu, trạng thái, ưu tiên, ghi chú admin, lịch sử
- **Cập nhật trạng thái:** pending, in_progress, resolved, closed
- **Cập nhật ưu tiên:** low, medium, high, urgent
- **Ghi chú admin:** Thêm/sửa ghi chú cho liên hệ
- **Xóa:** Cảnh báo nếu có mức độ ưu tiên cao

### UC-ADMIN-08: Quản lý đăng ký
- **Xem danh sách:** Tìm kiếm, lọc theo trạng thái/khóa học/học viên, sắp xếp, phân trang
- **Xem chi tiết:** Thông tin học viên, khóa học, trạng thái, tiến độ, thời gian học, lịch sử
- **Duyệt đăng ký:** Quick action để duyệt đăng ký pending (status = active)
- **Cập nhật trạng thái:** pending, active, completed, dropped
- **Cập nhật tiến độ:** progress_percentage (0-100)
- **Xóa:** Cảnh báo về ảnh hưởng đến tiến độ, chứng chỉ
- **Export:** Danh sách ra Excel

### UC-ADMIN-09: Quản lý nội dung
- **Xem danh sách:** Tìm kiếm, lọc theo loại/trạng thái/khóa học, sắp xếp
- **Tạo mới:** Form với các loại nội dung (video, document, quiz)
- **Chỉnh sửa:** Cập nhật thông tin nội dung
- **Cập nhật trạng thái:** draft, published, archived
- **Xóa:** Cảnh báo khi đang được học viên sử dụng

### UC-ADMIN-10: Quản lý file
- **Xem danh sách:** Tìm kiếm theo tên, phân trang, sắp xếp theo ngày sửa đổi
- **Upload file:** Hỗ trợ nhiều file (tối đa 50), không giới hạn loại/kích thước
- **Xem thông tin:** Chi tiết file (tên, kích thước, content type, ngày sửa đổi, URL)
- **Xóa file:** Cảnh báo và xác nhận, ghi log
- **Yêu cầu:** MinIO phải được kích hoạt (MINIO_ENABLED=true)

---

**🏛️ Trường Đại học Công nghệ Thông tin**  
**🌍 Đại học Quốc gia TP. Hồ Chí Minh**
