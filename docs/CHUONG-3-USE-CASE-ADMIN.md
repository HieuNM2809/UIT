# 3.4. Use Case cho Quản trị viên (Admin)

Quản trị viên là đối tượng người dùng có quyền hạn cao nhất trong hệ thống StudyMate, có quyền truy cập vào các chức năng quản trị toàn diện, bao gồm quản lý người dùng, khóa học, danh mục, nội dung, đăng ký, liên hệ, và hệ thống file. Quản trị viên có thể xem thống kê chi tiết, theo dõi hoạt động của hệ thống, và thực hiện các thao tác quản lý như cập nhật trạng thái, thay đổi role, duyệt đăng ký, và quản lý file trong MinIO storage. Các use case được mô tả dưới đây dựa trên các chức năng thực tế được triển khai trong hệ thống.

## UC-ADMIN-01: Đăng nhập hệ thống

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Quản trị viên đăng nhập hệ thống |
| **ID** | UC-ADMIN-01 |
| **Tác nhân** | Quản trị viên (Admin) |
| **Mô tả tóm tắt** | Quản trị viên đăng nhập vào hệ thống StudyMate bằng email/mật khẩu hoặc Google OAuth để sử dụng các chức năng quản trị hệ thống |
| **Tiền điều kiện** | - Quản trị viên đã có tài khoản trong hệ thống với role `admin`<br>- Tài khoản đã được xác thực email<br>- Quản trị viên đang ở trang đăng nhập |
| **Hậu điều kiện** | - Quản trị viên đã đăng nhập thành công<br>- Hệ thống đã tạo session và JWT token<br>- Quản trị viên có thể truy cập admin dashboard và tất cả chức năng quản trị |
| **Luồng sự kiện** | **Phương thức 1: Đăng nhập bằng email/mật khẩu**<br>1. Quản trị viên truy cập trang đăng nhập<br>2. Quản trị viên nhập email và mật khẩu vào form<br>3. Hệ thống kiểm tra email có tồn tại trong database<br>4. Hệ thống so sánh mật khẩu đã hash với mật khẩu trong database<br>5. Hệ thống kiểm tra role có phải `admin` không<br>6. Hệ thống kiểm tra tài khoản đã được kích hoạt (email_verified = true, is_active = true)<br>7. Hệ thống tạo session trong Redis<br>8. Hệ thống tạo JWT token cho API authentication<br>9. Hệ thống cập nhật last_login và increment login_count<br>10. Hệ thống chuyển hướng đến admin dashboard<br><br>**Phương thức 2: Đăng nhập bằng Google OAuth**<br>1. Quản trị viên click nút "Đăng nhập với Google"<br>2. Hệ thống chuyển hướng đến Google OAuth consent screen<br>3. Quản trị viên chọn tài khoản Google và xác nhận quyền truy cập<br>4. Google trả về authorization code<br>5. Hệ thống đổi authorization code lấy access token<br>6. Hệ thống lấy thông tin người dùng từ Google API<br>7. Hệ thống kiểm tra google_id đã tồn tại trong database<br>8. Nếu chưa có: Hệ thống tạo tài khoản mới với google_id và role = "admin"<br>9. Nếu đã có: Hệ thống cập nhật thông tin từ Google và kiểm tra role = "admin"<br>10. Hệ thống tạo session và JWT token<br>11. Hệ thống chuyển hướng đến admin dashboard |
| **Luồng thay thế** | **3a. Email không tồn tại:**<br>- Hệ thống thông báo lỗi "Email hoặc mật khẩu không đúng"<br>- Quản trị viên kiểm tra lại thông tin và thử lại<br><br>**4a. Mật khẩu sai:**<br>- Hệ thống thông báo lỗi "Email hoặc mật khẩu không đúng"<br>- Hệ thống có thể tăng số lần thử đăng nhập sai<br><br>**5a. Tài khoản không có quyền admin:**<br>- Hệ thống từ chối đăng nhập với thông báo "Tài khoản của bạn không có quyền truy cập"<br>- Quản trị viên cần liên hệ super admin để được phân quyền<br><br>**6a. Tài khoản chưa xác thực email:**<br>- Hệ thống thông báo "Vui lòng xác thực email trước khi đăng nhập"<br>- Hệ thống cung cấp link để gửi lại email xác thực<br><br>**6b. Tài khoản bị khóa (is_active = false):**<br>- Hệ thống thông báo "Tài khoản của bạn đã bị khóa"<br>- Quản trị viên cần liên hệ super admin<br><br>**7a. Google OAuth bị từ chối:**<br>- Hệ thống chuyển hướng về trang đăng nhập<br>- Hệ thống thông báo "Đăng nhập bằng Google bị hủy" |

## UC-ADMIN-02: Xem dashboard quản trị

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Quản trị viên xem dashboard quản trị |
| **ID** | UC-ADMIN-02 |
| **Tác nhân** | Quản trị viên |
| **Mô tả tóm tắt** | Quản trị viên xem dashboard tổng quan về hệ thống với các thống kê và thông tin quan trọng |
| **Tiền điều kiện** | - Quản trị viên đã đăng nhập<br>- Quản trị viên có quyền admin |
| **Hậu điều kiện** | - Quản trị viên đã xem dashboard tổng quan<br>- Quản trị viên có thể truy cập các chức năng quản trị khác |
| **Luồng sự kiện** | 1. Quản trị viên truy cập trang admin dashboard (sau khi đăng nhập hoặc từ menu)<br>2. Hệ thống tải dữ liệu thống kê:<br>   - Tổng số khóa học (totalCourses)<br>   - Số khóa học đã xuất bản (publishedCourses)<br>   - Số khóa học ở trạng thái draft (draftCourses)<br>   - Tổng số người dùng (totalUsers)<br>   - Tổng số đăng ký (totalEnrollments)<br>   - Tổng số đánh giá (totalRatings)<br>3. Hệ thống tải danh sách khóa học gần đây (10 khóa học mới nhất) với thông tin:<br>   - Tiêu đề khóa học<br>   - Giảng viên (instructor)<br>   - Danh mục (category)<br>   - Ngày tạo<br>4. Hệ thống hiển thị dashboard với:<br>   - Các card thống kê tổng quan<br>   - Bảng danh sách khóa học gần đây<br>   - Các link nhanh đến các chức năng quản trị<br>5. Quản trị viên có thể click vào các link để truy cập các chức năng quản trị khác |
| **Luồng thay thế** | **2a. Không có dữ liệu:**<br>- Hệ thống hiển thị 0 cho tất cả thống kê<br>- Hệ thống hiển thị "Chưa có khóa học nào" trong danh sách |

## UC-ADMIN-03: Xem thống kê chi tiết

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Quản trị viên xem thống kê chi tiết |
| **ID** | UC-ADMIN-03 |
| **Tác nhân** | Quản trị viên |
| **Mô tả tóm tắt** | Quản trị viên xem thống kê chi tiết về người dùng, khóa học, đăng ký, và các chỉ số khác của hệ thống |
| **Tiền điều kiện** | - Quản trị viên đã đăng nhập<br>- Quản trị viên có quyền admin |
| **Hậu điều kiện** | - Quản trị viên đã xem thống kê chi tiết<br>- Quản trị viên có thể phân tích và đưa ra quyết định quản trị |
| **Luồng sự kiện** | 1. Quản trị viên truy cập trang "Thống kê" từ menu admin<br>2. Hệ thống tính toán và hiển thị thống kê:<br>   **2a. Thống kê tổng quan:**<br>   - Tổng số người dùng, người dùng active<br>   - Tổng số khóa học, khóa học đã xuất bản<br>   - Tổng số đăng ký, đăng ký active, đăng ký đã hoàn thành<br>   - Tổng số danh mục active<br><br>   **2b. Thống kê người dùng theo role:**<br>   - Số lượng người dùng theo từng role (student, teacher, lecturer, admin)<br>   - Biểu đồ phân bổ role<br><br>   **2c. Thống kê khóa học theo trạng thái:**<br>   - Số lượng khóa học theo từng trạng thái (draft, published, archived)<br>   - Biểu đồ phân bổ trạng thái<br><br>   **2d. Thống kê khóa học theo cấp độ:**<br>   - Số lượng khóa học theo từng cấp độ (beginner, intermediate, advanced, expert)<br>   - Biểu đồ phân bổ cấp độ<br><br>   **2e. Thống kê đăng ký theo trạng thái:**<br>   - Số lượng đăng ký theo từng trạng thái (pending, active, completed, dropped)<br>   - Biểu đồ phân bổ trạng thái<br><br>   **2f. Top khóa học theo số đăng ký:**<br>   - Danh sách 10 khóa học có nhiều đăng ký nhất<br>   - Thông tin: tiêu đề, số đăng ký, đánh giá trung bình<br><br>   **2g. Thống kê tăng trưởng (30 ngày gần nhất):**<br>   - Số người dùng mới trong 30 ngày<br>   - Số khóa học mới trong 30 ngày<br>   - Số đăng ký mới trong 30 ngày<br><br>   **2h. Biểu đồ tăng trưởng (7 ngày gần nhất):**<br>   - Biểu đồ số đăng ký theo ngày (7 ngày)<br>   - Biểu đồ số người dùng mới theo ngày (7 ngày)<br>3. Quản trị viên có thể:<br>   - Xem chi tiết từng phần thống kê<br>   - Export thống kê dạng Excel/CSV<br>   - Lọc theo khoảng thời gian |
| **Luồng thay thế** | **2a. Không có dữ liệu:**<br>- Hệ thống hiển thị 0 cho tất cả thống kê<br>- Biểu đồ hiển thị trống |

## UC-ADMIN-04: Quản lý khóa học

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Quản trị viên quản lý khóa học |
| **ID** | UC-ADMIN-04 |
| **Tác nhân** | Quản trị viên |
| **Mô tả tóm tắt** | Quản trị viên xem danh sách, tạo, chỉnh sửa, xóa, và quản lý trạng thái khóa học trong hệ thống |
| **Tiền điều kiện** | - Quản trị viên đã đăng nhập<br>- Quản trị viên có quyền admin |
| **Hậu điều kiện** | - Khóa học đã được quản lý (tạo/chỉnh sửa/xóa/cập nhật trạng thái)<br>- Hệ thống đã cập nhật thông tin khóa học |
| **Luồng sự kiện** | **4a. Xem danh sách khóa học:**<br>1. Quản trị viên truy cập trang "Quản lý khóa học"<br>2. Hệ thống tải danh sách khóa học với phân trang<br>3. Hệ thống hiển thị thông tin:<br>   - Tiêu đề, giảng viên, danh mục<br>   - Trạng thái, số đăng ký, đánh giá trung bình<br>   - Ngày tạo, ngày cập nhật<br>4. Quản trị viên có thể:<br>   - Tìm kiếm khóa học<br>   - Lọc theo trạng thái, danh mục, giảng viên<br>   - Sắp xếp theo các tiêu chí<br>   - Export danh sách ra Excel<br><br>**4b. Tạo khóa học mới:**<br>1. Quản trị viên click "Tạo khóa học mới"<br>2. Hệ thống hiển thị form tạo khóa học (tương tự UC-GV-02)<br>3. Quản trị viên điền thông tin và upload ảnh<br>4. Hệ thống tạo khóa học với instructor_id có thể là admin hoặc giảng viên được chọn<br><br>**4c. Chỉnh sửa khóa học:**<br>1. Quản trị viên click "Chỉnh sửa" trên một khóa học<br>2. Hệ thống hiển thị form chỉnh sửa với thông tin hiện tại<br>3. Quản trị viên chỉnh sửa thông tin<br>4. Hệ thống cập nhật khóa học<br><br>**4d. Cập nhật trạng thái khóa học:**<br>1. Quản trị viên chọn khóa học và click "Cập nhật trạng thái"<br>2. Quản trị viên chọn trạng thái mới (draft, published, archived)<br>3. Hệ thống cập nhật trạng thái khóa học<br><br>**4e. Xóa khóa học:**<br>1. Quản trị viên click "Xóa" trên một khóa học<br>2. Hệ thống hiển thị cảnh báo và yêu cầu xác nhận<br>3. Quản trị viên xác nhận xóa<br>4. Hệ thống xóa khóa học và các dữ liệu liên quan |
| **Luồng thay thế** | **4b. Thông tin không hợp lệ:**<br>- Hệ thống hiển thị lỗi validation<br>- Quản trị viên sửa lại và thử lại<br><br>**4e. Khóa học có nhiều đăng ký:**<br>- Hệ thống cảnh báo mạnh hơn về ảnh hưởng đến học viên<br>- Quản trị viên có thể hủy hoặc xác nhận lại |

## UC-ADMIN-05: Quản lý người dùng

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Quản trị viên quản lý người dùng |
| **ID** | UC-ADMIN-05 |
| **Tác nhân** | Quản trị viên |
| **Mô tả tóm tắt** | Quản trị viên xem danh sách, chi tiết, cập nhật trạng thái, thay đổi role, và xóa người dùng trong hệ thống |
| **Tiền điều kiện** | - Quản trị viên đã đăng nhập<br>- Quản trị viên có quyền admin |
| **Hậu điều kiện** | - Người dùng đã được quản lý (cập nhật trạng thái/role/xóa)<br>- Hệ thống đã cập nhật thông tin người dùng |
| **Luồng sự kiện** | **5a. Xem danh sách người dùng:**<br>1. Quản trị viên truy cập trang "Quản lý người dùng"<br>2. Hệ thống tải danh sách người dùng với phân trang<br>3. Hệ thống hiển thị thông tin:<br>   - Tên, email, MSSV<br>   - Role, trạng thái (active/inactive)<br>   - Ngày tạo, lần đăng nhập cuối<br>4. Quản trị viên có thể:<br>   - Tìm kiếm người dùng<br>   - Lọc theo role, trạng thái<br>   - Sắp xếp theo các tiêu chí<br>   - Export danh sách ra Excel<br><br>**5b. Xem chi tiết người dùng:**<br>1. Quản trị viên click vào một người dùng<br>2. Hệ thống hiển thị thông tin chi tiết:<br>   - Thông tin cá nhân (tên, email, MSSV, avatar)<br>   - Thông tin tài khoản (role, trạng thái, ngày tạo)<br>   - Thống kê (số khóa học đã đăng ký, số khóa học đã hoàn thành)<br>   - Lịch sử hoạt động gần đây<br><br>**5c. Cập nhật trạng thái người dùng:**<br>1. Quản trị viên chọn người dùng và click "Cập nhật trạng thái"<br>2. Quản trị viên chọn trạng thái mới (active/inactive)<br>3. Hệ thống cập nhật is_active của người dùng<br>4. Nếu inactive: Người dùng không thể đăng nhập<br><br>**5d. Thay đổi role người dùng:**<br>1. Quản trị viên chọn người dùng và click "Thay đổi role"<br>2. Quản trị viên chọn role mới (student, teacher, lecturer, admin)<br>3. Hệ thống validate: Không thể thay đổi role của chính mình thành non-admin<br>4. Hệ thống cập nhật role của người dùng<br><br>**5e. Xóa người dùng (soft delete):**<br>1. Quản trị viên chọn người dùng và click "Xóa"<br>2. Hệ thống hiển thị cảnh báo và yêu cầu xác nhận<br>3. Hệ thống kiểm tra: Không thể xóa chính mình<br>4. Quản trị viên xác nhận xóa<br>5. Hệ thống đánh dấu người dùng là inactive (soft delete) |
| **Luồng thay thế** | **5d. Thay đổi role của chính mình thành non-admin:**<br>- Hệ thống từ chối với thông báo "Không thể thay đổi role của chính mình"<br><br>**5e. Xóa chính mình:**<br>- Hệ thống từ chối với thông báo "Không thể xóa chính mình"<br><br>**5e. Người dùng có nhiều dữ liệu liên quan:**<br>- Hệ thống cảnh báo về ảnh hưởng đến khóa học, đăng ký, etc.<br>- Quản trị viên có thể hủy hoặc xác nhận lại |

## UC-ADMIN-06: Quản lý danh mục

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Quản trị viên quản lý danh mục |
| **ID** | UC-ADMIN-06 |
| **Tác nhân** | Quản trị viên |
| **Mô tả tóm tắt** | Quản trị viên tạo, chỉnh sửa, xóa, và quản lý trạng thái các danh mục khóa học |
| **Tiền điều kiện** | - Quản trị viên đã đăng nhập<br>- Quản trị viên có quyền admin |
| **Hậu điều kiện** | - Danh mục đã được quản lý (tạo/chỉnh sửa/xóa/cập nhật trạng thái)<br>- Hệ thống đã cập nhật thông tin danh mục |
| **Luồng sự kiện** | **6a. Xem danh sách danh mục:**<br>1. Quản trị viên truy cập trang "Quản lý danh mục"<br>2. Hệ thống tải danh sách danh mục<br>3. Hệ thống hiển thị thông tin:<br>   - Tên danh mục, mô tả<br>   - Trạng thái (active/inactive)<br>   - Số khóa học trong danh mục<br>   - Ngày tạo<br>4. Quản trị viên có thể tìm kiếm và lọc danh mục<br><br>**6b. Tạo danh mục mới:**<br>1. Quản trị viên click "Tạo danh mục mới"<br>2. Hệ thống hiển thị form với các trường:<br>   - Tên danh mục (bắt buộc)<br>   - Mô tả (tùy chọn)<br>   - Slug (tự động tạo từ tên)<br>3. Quản trị viên điền thông tin và click "Lưu"<br>4. Hệ thống validate và tạo Category record<br><br>**6c. Chỉnh sửa danh mục:**<br>1. Quản trị viên click "Chỉnh sửa" trên một danh mục<br>2. Hệ thống hiển thị form chỉnh sửa với thông tin hiện tại<br>3. Quản trị viên chỉnh sửa thông tin<br>4. Hệ thống cập nhật danh mục<br><br>**6d. Cập nhật trạng thái danh mục:**<br>1. Quản trị viên chọn danh mục và click "Cập nhật trạng thái"<br>2. Quản trị viên chọn trạng thái mới (active/inactive)<br>3. Hệ thống cập nhật is_active của danh mục<br><br>**6e. Xóa danh mục:**<br>1. Quản trị viên click "Xóa" trên một danh mục<br>2. Hệ thống kiểm tra số khóa học trong danh mục<br>3. Hệ thống hiển thị cảnh báo và yêu cầu xác nhận<br>4. Quản trị viên xác nhận xóa<br>5. Hệ thống xóa danh mục (hoặc đánh dấu inactive nếu có khóa học) |
| **Luồng thay thế** | **6b. Tên danh mục đã tồn tại:**<br>- Hệ thống thông báo "Tên danh mục đã tồn tại"<br>- Quản trị viên chọn tên khác<br><br>**6e. Danh mục có khóa học:**<br>- Hệ thống cảnh báo "Danh mục này có X khóa học. Việc xóa sẽ ảnh hưởng đến các khóa học."<br>- Hệ thống có thể đề xuất chuyển khóa học sang danh mục khác trước khi xóa |

## UC-ADMIN-07: Quản lý liên hệ

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Quản trị viên quản lý liên hệ |
| **ID** | UC-ADMIN-07 |
| **Tác nhân** | Quản trị viên |
| **Mô tả tóm tắt** | Quản trị viên xem, cập nhật trạng thái, ưu tiên, ghi chú, và xóa các yêu cầu liên hệ từ người dùng |
| **Tiền điều kiện** | - Quản trị viên đã đăng nhập<br>- Quản trị viên có quyền admin<br>- Có yêu cầu liên hệ từ người dùng |
| **Hậu điều kiện** | - Yêu cầu liên hệ đã được xử lý (cập nhật trạng thái/ưu tiên/ghi chú/xóa)<br>- Hệ thống đã cập nhật thông tin liên hệ |
| **Luồng sự kiện** | **7a. Xem danh sách liên hệ:**<br>1. Quản trị viên truy cập trang "Quản lý liên hệ"<br>2. Hệ thống tải danh sách Contact records với phân trang<br>3. Hệ thống hiển thị thông tin:<br>   - Tên, email, số điện thoại người gửi<br>   - Tiêu đề, nội dung yêu cầu<br>   - Trạng thái (pending, in_progress, resolved, closed)<br>   - Mức độ ưu tiên (low, medium, high, urgent)<br>   - Ngày gửi<br>4. Quản trị viên có thể:<br>   - Tìm kiếm liên hệ<br>   - Lọc theo trạng thái, mức độ ưu tiên<br>   - Sắp xếp theo các tiêu chí<br><br>**7b. Xem chi tiết liên hệ:**<br>1. Quản trị viên click vào một liên hệ<br>2. Hệ thống hiển thị thông tin chi tiết:<br>   - Thông tin người gửi<br>   - Nội dung yêu cầu đầy đủ<br>   - Trạng thái, mức độ ưu tiên<br>   - Ghi chú của admin (nếu có)<br>   - Lịch sử cập nhật<br><br>**7c. Cập nhật trạng thái liên hệ:**<br>1. Quản trị viên chọn liên hệ và click "Cập nhật trạng thái"<br>2. Quản trị viên chọn trạng thái mới (pending, in_progress, resolved, closed)<br>3. Hệ thống cập nhật status của Contact record<br><br>**7d. Cập nhật mức độ ưu tiên:**<br>1. Quản trị viên chọn liên hệ và click "Cập nhật ưu tiên"<br>2. Quản trị viên chọn mức độ ưu tiên mới (low, medium, high, urgent)<br>3. Hệ thống cập nhật priority của Contact record<br><br>**7e. Thêm/sửa ghi chú admin:**<br>1. Quản trị viên chọn liên hệ và click "Ghi chú"<br>2. Quản trị viên nhập hoặc chỉnh sửa ghi chú<br>3. Hệ thống cập nhật admin_notes của Contact record<br><br>**7f. Xóa liên hệ:**<br>1. Quản trị viên click "Xóa" trên một liên hệ<br>2. Hệ thống hiển thị cảnh báo và yêu cầu xác nhận<br>3. Quản trị viên xác nhận xóa<br>4. Hệ thống xóa Contact record |
| **Luồng thay thế** | **7f. Xóa liên hệ quan trọng:**<br>- Hệ thống cảnh báo nếu liên hệ có mức độ ưu tiên cao<br>- Quản trị viên có thể hủy hoặc xác nhận lại |

## UC-ADMIN-08: Quản lý đăng ký

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Quản trị viên quản lý đăng ký khóa học |
| **ID** | UC-ADMIN-08 |
| **Tác nhân** | Quản trị viên |
| **Mô tả tóm tắt** | Quản trị viên xem, duyệt, cập nhật trạng thái, tiến độ, và xóa các đăng ký khóa học của học viên |
| **Tiền điều kiện** | - Quản trị viên đã đăng nhập<br>- Quản trị viên có quyền admin |
| **Hậu điều kiện** | - Đăng ký đã được quản lý (duyệt/cập nhật trạng thái/tiến độ/xóa)<br>- Hệ thống đã cập nhật thông tin đăng ký |
| **Luồng sự kiện** | **8a. Xem danh sách đăng ký:**<br>1. Quản trị viên truy cập trang "Quản lý đăng ký"<br>2. Hệ thống tải danh sách Enrollment records với phân trang<br>3. Hệ thống hiển thị thông tin:<br>   - Tên học viên, tên khóa học<br>   - Trạng thái (pending, active, completed, dropped)<br>   - Tiến độ (progress_percentage)<br>   - Ngày đăng ký<br>4. Quản trị viên có thể:<br>   - Tìm kiếm đăng ký<br>   - Lọc theo trạng thái, khóa học, học viên<br>   - Sắp xếp theo các tiêu chí<br>   - Export danh sách ra Excel<br><br>**8b. Xem chi tiết đăng ký:**<br>1. Quản trị viên click vào một đăng ký<br>2. Hệ thống hiển thị thông tin chi tiết:<br>   - Thông tin học viên<br>   - Thông tin khóa học<br>   - Trạng thái, tiến độ, thời gian học<br>   - Lịch sử cập nhật<br><br>**8c. Duyệt đăng ký (quick action):**<br>1. Quản trị viên chọn đăng ký có trạng thái "pending"<br>2. Quản trị viên click "Duyệt"<br>3. Hệ thống cập nhật status = "active"<br>4. Hệ thống có thể gửi email thông báo cho học viên<br><br>**8d. Cập nhật trạng thái đăng ký:**<br>1. Quản trị viên chọn đăng ký và click "Cập nhật trạng thái"<br>2. Quản trị viên chọn trạng thái mới (pending, active, completed, dropped)<br>3. Hệ thống cập nhật status của Enrollment record<br><br>**8e. Cập nhật tiến độ đăng ký:**<br>1. Quản trị viên chọn đăng ký và click "Cập nhật tiến độ"<br>2. Quản trị viên nhập progress_percentage mới (0-100)<br>3. Hệ thống validate và cập nhật progress_percentage<br><br>**8f. Xóa đăng ký:**<br>1. Quản trị viên click "Xóa" trên một đăng ký<br>2. Hệ thống hiển thị cảnh báo và yêu cầu xác nhận<br>3. Quản trị viên xác nhận xóa<br>4. Hệ thống xóa Enrollment record và các Progress records liên quan |
| **Luồng thay thế** | **8e. Tiến độ không hợp lệ:**<br>- Hệ thống thông báo "Tiến độ phải từ 0 đến 100"<br>- Quản trị viên nhập lại<br><br>**8f. Đăng ký có dữ liệu liên quan:**<br>- Hệ thống cảnh báo về ảnh hưởng đến tiến độ, chứng chỉ<br>- Quản trị viên có thể hủy hoặc xác nhận lại |

## UC-ADMIN-09: Quản lý nội dung

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Quản trị viên quản lý nội dung khóa học |
| **ID** | UC-ADMIN-09 |
| **Tác nhân** | Quản trị viên |
| **Mô tả tóm tắt** | Quản trị viên xem, tạo, chỉnh sửa, xóa, và quản lý trạng thái nội dung trong các khóa học |
| **Tiền điều kiện** | - Quản trị viên đã đăng nhập<br>- Quản trị viên có quyền admin |
| **Hậu điều kiện** | - Nội dung đã được quản lý (tạo/chỉnh sửa/xóa/cập nhật trạng thái)<br>- Hệ thống đã cập nhật thông tin nội dung |
| **Luồng sự kiện** | **9a. Xem danh sách nội dung:**<br>1. Quản trị viên truy cập trang "Quản lý nội dung"<br>2. Hệ thống tải danh sách Content records với phân trang<br>3. Hệ thống hiển thị thông tin:<br>   - Tiêu đề, loại nội dung (video/document/quiz)<br>   - Khóa học thuộc về<br>   - Trạng thái (draft, published, archived)<br>   - Thứ tự (order_index)<br>4. Quản trị viên có thể:<br>   - Tìm kiếm nội dung<br>   - Lọc theo loại, trạng thái, khóa học<br>   - Sắp xếp theo các tiêu chí<br><br>**9b. Tạo nội dung mới:**<br>1. Quản trị viên click "Tạo nội dung mới"<br>2. Hệ thống hiển thị form với các loại nội dung (tương tự UC-GV-06)<br>3. Quản trị viên chọn loại và điền thông tin<br>4. Hệ thống tạo Content record<br><br>**9c. Chỉnh sửa nội dung:**<br>1. Quản trị viên click "Chỉnh sửa" trên một nội dung<br>2. Hệ thống hiển thị form chỉnh sửa với thông tin hiện tại<br>3. Quản trị viên chỉnh sửa thông tin<br>4. Hệ thống cập nhật nội dung<br><br>**9d. Cập nhật trạng thái nội dung:**<br>1. Quản trị viên chọn nội dung và click "Cập nhật trạng thái"<br>2. Quản trị viên chọn trạng thái mới (draft, published, archived)<br>3. Hệ thống cập nhật status của Content record<br><br>**9e. Xóa nội dung:**<br>1. Quản trị viên click "Xóa" trên một nội dung<br>2. Hệ thống kiểm tra nội dung có đang được học viên sử dụng không<br>3. Hệ thống hiển thị cảnh báo và yêu cầu xác nhận<br>4. Quản trị viên xác nhận xóa<br>5. Hệ thống xóa Content record và các dữ liệu liên quan |
| **Luồng thay thế** | **9b. Thông tin không hợp lệ:**<br>- Hệ thống hiển thị lỗi validation<br>- Quản trị viên sửa lại và thử lại<br><br>**9e. Nội dung đang được sử dụng:**<br>- Hệ thống cảnh báo "Nội dung này đang được X học viên học"<br>- Quản trị viên có thể hủy hoặc xác nhận lại |

## UC-ADMIN-10: Quản lý file

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Quản trị viên quản lý file trong MinIO storage |
| **ID** | UC-ADMIN-10 |
| **Tác nhân** | Quản trị viên |
| **Mô tả tóm tắt** | Quản trị viên xem danh sách, upload, xóa, và xem thông tin các file được lưu trữ trong MinIO |
| **Tiền điều kiện** | - Quản trị viên đã đăng nhập<br>- Quản trị viên có quyền admin<br>- MinIO đã được kích hoạt (MINIO_ENABLED=true) |
| **Hậu điều kiện** | - File đã được quản lý (upload/xóa/xem thông tin)<br>- Hệ thống đã cập nhật file trong MinIO storage |
| **Luồng sự kiện** | **10a. Xem danh sách file:**<br>1. Quản trị viên truy cập trang "Quản lý File"<br>2. Hệ thống kiểm tra MinIO có được kích hoạt không<br>3. **Nếu MinIO chưa kích hoạt:**<br>   - Hệ thống hiển thị thông báo "MinIO chưa được kích hoạt"<br>   - Hệ thống gợi ý cấu hình MINIO_ENABLED=true trong .env<br>4. **Nếu MinIO đã kích hoạt:**<br>   - Hệ thống gọi minioService.listFiles() để lấy danh sách file<br>   - Hệ thống sắp xếp file theo ngày sửa đổi (mới nhất trước)<br>   - Hệ thống phân trang danh sách file<br>5. Hệ thống hiển thị danh sách file với thông tin:<br>   - Tên file (objectName)<br>   - Kích thước file<br>   - Ngày sửa đổi cuối cùng<br>   - URL để tải xuống<br>6. Quản trị viên có thể:<br>   - Tìm kiếm file theo tên<br>   - Xem chi tiết từng file<br>   - Upload file mới<br>   - Xóa file<br><br>**10b. Upload file:**<br>1. Quản trị viên click "Upload File" hoặc kéo thả file vào vùng upload<br>2. Quản trị viên chọn file (có thể chọn nhiều file, tối đa 50 file)<br>3. Hệ thống validate file:<br>   - Kiểm tra file có tồn tại không<br>   - Không giới hạn loại file (cho phép tất cả)<br>   - Không giới hạn kích thước file<br>4. Hệ thống upload từng file vào MinIO storage:<br>   - Đọc file buffer từ multer memory storage<br>   - Gọi minioService.uploadFile() với buffer, fileName, contentType<br>   - MinIO trả về objectName, URL, size<br>5. Hệ thống ghi log mỗi file upload thành công<br>6. Hệ thống trả về kết quả:<br>   - Danh sách file upload thành công<br>   - Danh sách file upload thất bại (nếu có)<br>7. Hệ thống hiển thị thông báo: "Upload thành công X file"<br>8. Hệ thống reload danh sách file<br><br>**10c. Xem thông tin file:**<br>1. Quản trị viên click "Xem thông tin" trên một file<br>2. Hệ thống gọi minioService.getFileInfo(objectName)<br>3. Hệ thống hiển thị thông tin chi tiết:<br>   - Tên file (objectName)<br>   - Kích thước (size)<br>   - Content type (MIME type)<br>   - Ngày tạo (lastModified)<br>   - URL để tải xuống<br>   - ETag (nếu có)<br><br>**10d. Xóa file:**<br>1. Quản trị viên chọn file và click "Xóa"<br>2. Hệ thống hiển thị cảnh báo và yêu cầu xác nhận:<br>   - "Bạn có chắc chắn muốn xóa file này?"<br>   - "Việc xóa không thể hoàn tác"<br>3. Quản trị viên xác nhận xóa<br>4. Hệ thống gọi minioService.deleteFile(objectName)<br>5. Hệ thống ghi log xóa file<br>6. Hệ thống thông báo "Xóa file thành công"<br>7. Hệ thống reload danh sách file |
| **Luồng thay thế** | **3a. MinIO chưa kích hoạt:**<br>- Hệ thống hiển thị thông báo lỗi và gợi ý cấu hình<br>- Quản trị viên không thể upload hoặc xóa file<br><br>**4a. Lỗi khi lấy danh sách file:**<br>- Hệ thống hiển thị thông báo lỗi "Lỗi khi tải danh sách file"<br>- Hệ thống chuyển hướng về admin dashboard<br><br>**10b. File upload thất bại:**<br>- Hệ thống ghi log lỗi cho từng file<br>- Hệ thống hiển thị danh sách file lỗi với thông báo lỗi cụ thể<br>- Hệ thống vẫn hiển thị các file upload thành công<br><br>**10b. Không có file được chọn:**<br>- Hệ thống trả về lỗi "Không có file được upload"<br>- Quản trị viên chọn file và thử lại<br><br>**10c. File không tồn tại:**<br>- Hệ thống trả về lỗi 404 "File không tìm thấy"<br>- Hệ thống thông báo cho quản trị viên<br><br>**10d. Lỗi khi xóa file:**<br>- Hệ thống ghi log lỗi<br>- Hệ thống trả về lỗi "Lỗi khi xóa file: [chi tiết lỗi]"<br>- File không bị xóa |

---

## Sơ đồ Hoạt động - Quản lý file

```mermaid
flowchart TD
    Start([Bắt đầu]) --> CheckLogin{Đã đăng nhập<br/>và có quyền admin?}
    CheckLogin -->|Không| RedirectLogin[Chuyển đến trang đăng nhập]
    RedirectLogin --> End1([Kết thúc])
    
    CheckLogin -->|Có| CheckMinIO{MinIO đã<br/>kích hoạt?}
    
    CheckMinIO -->|Không| ShowError1[Hiển thị: MinIO chưa được kích hoạt<br/>Gợi ý cấu hình MINIO_ENABLED=true]
    ShowError1 --> End2([Kết thúc])
    
    CheckMinIO -->|Có| ListFiles[Gọi minioService.listFiles<br/>để lấy danh sách file]
    ListFiles --> SortFiles[Sắp xếp file theo<br/>ngày sửa đổi mới nhất]
    SortFiles --> PaginateFiles[Phân trang danh sách file]
    PaginateFiles --> DisplayList[Hiển thị danh sách file:<br/>- Tên file<br/>- Kích thước<br/>- Ngày sửa đổi<br/>- URL]
    
    DisplayList --> UserAction{Quản trị viên<br/>thực hiện?}
    
    UserAction -->|Tìm kiếm| SearchFiles[Lọc file theo tên]
    SearchFiles --> DisplayList
    
    UserAction -->|Upload file| SelectFiles[Chọn file để upload<br/>có thể chọn nhiều file]
    SelectFiles --> ValidateFiles{Kiểm tra<br/>file hợp lệ?}
    
    ValidateFiles -->|Không| ShowError2[Hiển thị lỗi validation]
    ShowError2 --> SelectFiles
    
    ValidateFiles -->|Có| UploadToMinIO[Upload từng file vào MinIO:<br/>- Đọc file buffer<br/>- Gọi minioService.uploadFile<br/>- Lưu objectName, URL, size]
    UploadToMinIO --> LogUpload[Ghi log upload thành công]
    LogUpload --> CheckAllUploaded{Tất cả file<br/>đã upload?}
    
    CheckAllUploaded -->|Chưa| UploadToMinIO
    CheckAllUploaded -->|Có| ShowUploadResult[Hiển thị kết quả:<br/>- Số file thành công<br/>- Số file thất bại nếu có]
    ShowUploadResult --> ReloadList[Reload danh sách file]
    ReloadList --> DisplayList
    
    UserAction -->|Xem thông tin| GetFileInfo[Gọi minioService.getFileInfo<br/>với objectName]
    GetFileInfo --> CheckFileExists{File<br/>tồn tại?}
    
    CheckFileExists -->|Không| ShowError3[Hiển thị: File không tìm thấy]
    ShowError3 --> DisplayList
    
    CheckFileExists -->|Có| DisplayFileInfo[Hiển thị thông tin chi tiết:<br/>- Tên file<br/>- Kích thước<br/>- Content type<br/>- Ngày sửa đổi<br/>- URL]
    DisplayFileInfo --> DisplayList
    
    UserAction -->|Xóa file| ConfirmDelete{Xác nhận<br/>xóa file?}
    
    ConfirmDelete -->|Không| DisplayList
    ConfirmDelete -->|Có| DeleteFromMinIO[Gọi minioService.deleteFile<br/>với objectName]
    DeleteFromMinIO --> LogDelete[Ghi log xóa file]
    LogDelete --> ShowDeleteSuccess[Hiển thị: Xóa file thành công]
    ShowDeleteSuccess --> ReloadList
    
    UserAction -->|Xem xong| End3([Kết thúc])
    
    style Start fill:#4A90E2,stroke:#2E5C8A,stroke-width:2px,color:#fff
    style End1 fill:#FF6B6B,stroke:#CC5555,stroke-width:2px,color:#fff
    style End2 fill:#FFA500,stroke:#CC8800,stroke-width:2px,color:#fff
    style End3 fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style UploadToMinIO fill:#9B59B6,stroke:#7D3C98,stroke-width:2px
    style DeleteFromMinIO fill:#E74C3C,stroke:#C0392B,stroke-width:2px
```

## Sơ đồ Tuần tự - Quản lý file

```mermaid
sequenceDiagram
    participant Admin as Quản trị viên
    participant HT as Hệ thống
    participant MinIO as MinIO Service

    Admin->>HT: Truy cập trang Quản lý File
    HT->>HT: Kiểm tra MinIO có kích hoạt?
    
    alt MinIO chưa kích hoạt
        HT-->>Admin: Hiển thị: MinIO chưa được kích hoạt
    else MinIO đã kích hoạt
        HT->>MinIO: listFiles('', true)
        MinIO-->>HT: Trả về danh sách file
        HT->>HT: Sắp xếp file theo ngày sửa đổi
        HT->>HT: Phân trang danh sách
        HT-->>Admin: Hiển thị danh sách file
        
        alt Upload file
            Admin->>HT: Chọn file và click Upload
            HT->>HT: Validate file (không giới hạn loại/kích thước)
            
            loop Cho mỗi file
                HT->>MinIO: uploadFile(buffer, fileName, contentType)
                MinIO-->>HT: Trả về objectName, URL, size
                HT->>HT: Ghi log upload thành công
            end
            
            HT-->>Admin: Hiển thị: Upload thành công X file
            HT->>HT: Reload danh sách file
        end
        
        alt Xem thông tin file
            Admin->>HT: Click "Xem thông tin" trên một file
            HT->>MinIO: getFileInfo(objectName)
            
            alt File tồn tại
                MinIO-->>HT: Trả về thông tin file (size, contentType, lastModified, URL)
                HT-->>Admin: Hiển thị thông tin chi tiết file
            else File không tồn tại
                MinIO-->>HT: Lỗi 404
                HT-->>Admin: Hiển thị: File không tìm thấy
            end
        end
        
        alt Xóa file
            Admin->>HT: Click "Xóa" và xác nhận
            HT->>MinIO: deleteFile(objectName)
            MinIO-->>HT: Xóa file thành công
            HT->>HT: Ghi log xóa file
            HT-->>Admin: Hiển thị: Xóa file thành công
            HT->>HT: Reload danh sách file
        end
    end
```

---

**🏛️ Trường Đại học Công nghệ Thông tin**  
**🌍 Đại học Quốc gia TP. Hồ Chí Minh**
