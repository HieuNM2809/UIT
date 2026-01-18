# 3.3. Use Case cho Giảng viên

## UC-GV-01: Đăng nhập hệ thống

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Giảng viên đăng nhập hệ thống |
| **ID** | UC-GV-01 |
| **Tác nhân** | Giảng viên |
| **Mô tả tóm tắt** | Giảng viên đăng nhập vào hệ thống StudyMate bằng email/mật khẩu hoặc Google OAuth để sử dụng các chức năng quản lý khóa học và học viên |
| **Tiền điều kiện** | - Giảng viên đã có tài khoản trong hệ thống với role `teacher` hoặc `lecturer`<br>- Tài khoản đã được xác thực email<br>- Giảng viên đang ở trang đăng nhập |
| **Hậu điều kiện** | - Giảng viên đã đăng nhập thành công<br>- Hệ thống đã tạo session và JWT token<br>- Giảng viên có thể truy cập dashboard và các chức năng quản lý |
| **Luồng sự kiện** | **Phương thức 1: Đăng nhập bằng email/mật khẩu**<br>1. Giảng viên truy cập trang đăng nhập<br>2. Giảng viên nhập email và mật khẩu vào form<br>3. Hệ thống kiểm tra email có tồn tại trong database<br>4. Hệ thống so sánh mật khẩu đã hash với mật khẩu trong database<br>5. Hệ thống kiểm tra role có phải `teacher` hoặc `lecturer` không<br>6. Hệ thống kiểm tra tài khoản đã được kích hoạt (email_verified = true)<br>7. Hệ thống tạo session trong Redis<br>8. Hệ thống tạo JWT token cho API authentication<br>9. Hệ thống cập nhật last_login và increment login_count<br>10. Hệ thống chuyển hướng đến dashboard giảng viên<br><br>**Phương thức 2: Đăng nhập bằng Google OAuth**<br>1. Giảng viên click nút "Đăng nhập với Google"<br>2. Hệ thống chuyển hướng đến Google OAuth consent screen<br>3. Giảng viên chọn tài khoản Google và xác nhận quyền truy cập<br>4. Google trả về authorization code<br>5. Hệ thống đổi authorization code lấy access token<br>6. Hệ thống lấy thông tin người dùng từ Google API<br>7. Hệ thống kiểm tra google_id đã tồn tại trong database<br>8. Nếu chưa có: Hệ thống tạo tài khoản mới với google_id và role phù hợp<br>9. Nếu đã có: Hệ thống cập nhật thông tin từ Google và kiểm tra role<br>10. Hệ thống tạo session và JWT token<br>11. Hệ thống chuyển hướng đến dashboard giảng viên |
| **Luồng thay thế** | **3a. Email không tồn tại:**<br>- Hệ thống thông báo lỗi "Email hoặc mật khẩu không đúng"<br>- Giảng viên kiểm tra lại thông tin và thử lại<br><br>**4a. Mật khẩu sai:**<br>- Hệ thống thông báo lỗi "Email hoặc mật khẩu không đúng"<br>- Hệ thống có thể tăng số lần thử đăng nhập sai<br><br>**5a. Tài khoản không có quyền teacher/lecturer:**<br>- Hệ thống từ chối đăng nhập với thông báo "Tài khoản của bạn không có quyền truy cập"<br>- Giảng viên cần liên hệ quản trị viên để được phân quyền<br><br>**6a. Tài khoản chưa xác thực email:**<br>- Hệ thống thông báo "Vui lòng xác thực email trước khi đăng nhập"<br>- Hệ thống cung cấp link để gửi lại email xác thực<br><br>**6b. Tài khoản bị khóa (is_active = false):**<br>- Hệ thống thông báo "Tài khoản của bạn đã bị khóa"<br>- Giảng viên cần liên hệ quản trị viên<br><br>**7a. Google OAuth bị từ chối:**<br>- Hệ thống chuyển hướng về trang đăng nhập<br>- Hệ thống thông báo "Đăng nhập bằng Google bị hủy" |

## UC-GV-02: Tạo khóa học mới

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Giảng viên tạo khóa học mới |
| **ID** | UC-GV-02 |
| **Tác nhân** | Giảng viên |
| **Mô tả tóm tắt** | Giảng viên tạo khóa học mới với thông tin chi tiết (tiêu đề, mô tả, giá, cấp độ, danh mục) và upload ảnh đại diện |
| **Tiền điều kiện** | - Giảng viên đã đăng nhập<br>- Giảng viên có quyền teacher/lecturer |
| **Hậu điều kiện** | - Khóa học mới đã được tạo với status "draft"<br>- Giảng viên có thể thêm nội dung vào khóa học |
| **Luồng sự kiện** | 1. Giảng viên truy cập trang "Tạo khóa học" hoặc từ dashboard<br>2. Hệ thống hiển thị form tạo khóa học với các trường:<br>   - Tiêu đề (bắt buộc)<br>   - Mô tả ngắn (short_description)<br>   - Mô tả chi tiết (description, rich text editor)<br>   - Giá (có thể miễn phí = 0)<br>   - Cấp độ (beginner, intermediate, advanced, expert)<br>   - Danh mục (dropdown từ danh sách categories)<br>   - Upload ảnh đại diện (thumbnail)<br>3. Giảng viên điền thông tin khóa học<br>4. Giảng viên upload ảnh đại diện (nếu có)<br>5. Giảng viên click "Lưu" hoặc "Tạo khóa học"<br>6. Hệ thống validate thông tin:<br>   - Tiêu đề không được rỗng, độ dài 3-200 ký tự<br>   - Giá >= 0<br>   - Cấp độ phải là một trong các giá trị hợp lệ<br>   - Danh mục phải tồn tại và active<br>7. Hệ thống kiểm tra file ảnh (nếu có):<br>   - Định dạng hợp lệ (jpg, png, webp)<br>   - Kích thước không quá giới hạn<br>8. Hệ thống upload ảnh vào MinIO storage (nếu có)<br>9. Hệ thống tạo slug tự động từ tiêu đề (lowercase, loại bỏ ký tự đặc biệt)<br>10. Hệ thống kiểm tra slug đã tồn tại chưa (nếu có thì thêm số)<br>11. Hệ thống tạo Course record:<br>    - title, slug, description, short_description<br>    - instructor_id = user_id của giảng viên<br>    - category_id, level, price<br>    - thumbnail (URL từ MinIO)<br>    - status = "draft"<br>    - enrolled_count = 0, average_rating = null<br>12. Hệ thống cập nhật category.course_count (nếu có category)<br>13. Hệ thống thông báo "Tạo khóa học thành công!"<br>14. Hệ thống chuyển hướng đến trang chỉnh sửa khóa học để thêm nội dung |
| **Luồng thay thế** | **6a. Thông tin không hợp lệ:**<br>- Hệ thống hiển thị lỗi validation cụ thể<br>- Giảng viên sửa lại thông tin và thử lại<br><br>**7a. File ảnh quá lớn hoặc không đúng định dạng:**<br>- Hệ thống thông báo "File ảnh không hợp lệ"<br>- Hệ thống yêu cầu upload lại với định dạng đúng<br><br>**10a. Slug đã tồn tại (sau khi thêm số vẫn trùng):**<br>- Hệ thống tự động tạo slug mới với timestamp hoặc random string<br>- Hệ thống tiếp tục tạo khóa học |

## UC-GV-03: Chỉnh sửa khóa học

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Giảng viên chỉnh sửa khóa học |
| **ID** | UC-GV-03 |
| **Tác nhân** | Giảng viên |
| **Mô tả tóm tắt** | Giảng viên chỉnh sửa thông tin khóa học đã tạo (tiêu đề, mô tả, giá, cấp độ, danh mục, ảnh đại diện) |
| **Tiền điều kiện** | - Giảng viên đã đăng nhập<br>- Khóa học tồn tại và thuộc về giảng viên (instructor_id = user_id) |
| **Hậu điều kiện** | - Thông tin khóa học đã được cập nhật trong database<br>- Nếu có thay đổi ảnh, ảnh cũ có thể được xóa khỏi MinIO |
| **Luồng sự kiện** | 1. Giảng viên truy cập trang danh sách khóa học của mình<br>2. Giảng viên click vào khóa học cần chỉnh sửa<br>3. Giảng viên click "Chỉnh sửa" hoặc "Edit"<br>4. Hệ thống kiểm tra quyền truy cập (instructor_id = user_id hoặc admin)<br>5. Hệ thống tải thông tin khóa học hiện tại từ database<br>6. Hệ thống hiển thị form chỉnh sửa với thông tin đã điền sẵn<br>7. Giảng viên chỉnh sửa thông tin:<br>   - Tiêu đề, mô tả, giá, cấp độ, danh mục<br>   - Upload ảnh mới (nếu muốn thay đổi)<br>8. Giảng viên click "Lưu thay đổi"<br>9. Hệ thống validate thông tin (tương tự UC-GV-02)<br>10. Nếu có ảnh mới:<br>    - Hệ thống upload ảnh mới vào MinIO<br>    - Hệ thống xóa ảnh cũ khỏi MinIO (nếu có)<br>11. Nếu tiêu đề thay đổi:<br>    - Hệ thống tạo slug mới từ tiêu đề<br>    - Hệ thống kiểm tra slug mới có trùng không<br>12. Hệ thống cập nhật Course record trong database<br>13. Nếu category thay đổi:<br>    - Hệ thống giảm course_count của category cũ<br>    - Hệ thống tăng course_count của category mới<br>14. Hệ thống thông báo "Cập nhật khóa học thành công!"<br>15. Hệ thống reload trang hoặc chuyển hướng đến trang chi tiết khóa học |
| **Luồng thay thế** | **4a. Khóa học không tồn tại:**<br>- Hệ thống hiển thị lỗi 404 "Khóa học không tìm thấy"<br>- Hệ thống chuyển hướng về danh sách khóa học<br><br>**4b. Khóa học không thuộc về giảng viên:**<br>- Hệ thống từ chối truy cập với thông báo "Bạn không có quyền chỉnh sửa khóa học này"<br>- Hệ thống chuyển hướng về danh sách khóa học<br><br>**9a. Thông tin không hợp lệ:**<br>- Hệ thống hiển thị lỗi validation<br>- Giảng viên sửa lại và thử lại<br><br>**11a. Slug mới đã tồn tại:**<br>- Hệ thống tự động tạo slug mới với số hoặc timestamp<br>- Hệ thống tiếp tục cập nhật |

## UC-GV-04: Xóa khóa học

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Giảng viên xóa khóa học |
| **ID** | UC-GV-04 |
| **Tác nhân** | Giảng viên |
| **Mô tả tóm tắt** | Giảng viên xóa khóa học đã tạo khỏi hệ thống (có thể là soft delete hoặc hard delete) |
| **Tiền điều kiện** | - Giảng viên đã đăng nhập<br>- Khóa học tồn tại và thuộc về giảng viên |
| **Hậu điều kiện** | - Khóa học đã bị xóa khỏi hệ thống<br>- Nếu là hard delete: Tất cả nội dung, enrollments liên quan cũng bị xóa<br>- Nếu là soft delete: Khóa học được đánh dấu deleted_at |
| **Luồng sự kiện** | 1. Giảng viên truy cập trang danh sách khóa học<br>2. Giảng viên click vào khóa học cần xóa<br>3. Giảng viên click "Xóa khóa học" hoặc "Delete"<br>4. Hệ thống kiểm tra quyền truy cập<br>5. Hệ thống đếm số lượng học viên đã đăng ký khóa học<br>6. Hệ thống hiển thị cảnh báo và yêu cầu xác nhận:<br>   - "Bạn có chắc chắn muốn xóa khóa học này?"<br>   - Nếu có học viên đăng ký: "Khóa học này có X học viên đăng ký. Việc xóa sẽ ảnh hưởng đến học viên."<br>7. Giảng viên xác nhận xóa<br>8. Hệ thống thực hiện xóa:<br>   - **Nếu soft delete:**<br>     - Cập nhật status = "archived" hoặc set deleted_at = now()<br>     - Khóa học không hiển thị trong danh sách công khai<br>   - **Nếu hard delete:**<br>     - Xóa tất cả Content records liên quan<br>     - Xóa tất cả Enrollment records (hoặc đánh dấu dropped)<br>     - Xóa ảnh thumbnail khỏi MinIO<br>     - Xóa Course record<br>9. Hệ thống cập nhật category.course_count (giảm 1)<br>10. Hệ thống thông báo "Xóa khóa học thành công!"<br>11. Hệ thống chuyển hướng về danh sách khóa học |
| **Luồng thay thế** | **5a. Khóa học có nhiều học viên đăng ký (>10):**<br>- Hệ thống cảnh báo mạnh hơn: "Khóa học này có X học viên đăng ký. Việc xóa sẽ ảnh hưởng nghiêm trọng đến học viên. Bạn có chắc chắn?"<br>- Hệ thống yêu cầu xác nhận lại<br>- Giảng viên có thể hủy hoặc xác nhận lại<br><br>**7a. Giảng viên hủy xóa:**<br>- Hệ thống không thực hiện xóa<br>- Hệ thống chuyển hướng về trang chi tiết khóa học |

## UC-GV-05: Xuất bản khóa học

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Giảng viên xuất bản khóa học |
| **ID** | UC-GV-05 |
| **Tác nhân** | Giảng viên |
| **Mô tả tóm tắt** | Giảng viên thay đổi trạng thái khóa học từ "draft" sang "published" để học viên có thể tìm thấy và đăng ký |
| **Tiền điều kiện** | - Giảng viên đã đăng nhập<br>- Khóa học ở trạng thái "draft"<br>- Khóa học thuộc về giảng viên<br>- Khóa học có ít nhất một nội dung học tập (content) |
| **Hậu điều kiện** | - Khóa học đã được xuất bản (status = "published")<br>- Khóa học xuất hiện trong danh sách khóa học công khai<br>- Học viên có thể tìm thấy và đăng ký khóa học |
| **Luồng sự kiện** | 1. Giảng viên truy cập trang chỉnh sửa khóa học<br>2. Giảng viên click "Xuất bản khóa học" hoặc "Publish"<br>3. Hệ thống kiểm tra quyền truy cập<br>4. Hệ thống kiểm tra khóa học có nội dung không:<br>   - Đếm số lượng Content records với course_id<br>   - Kiểm tra có ít nhất 1 content với status = "published" hoặc "draft"<br>5. **Nếu có nội dung:**<br>   5a. Hệ thống cập nhật Course record:<br>       - status = "published"<br>       - published_at = now() (nếu chưa có)<br>   5b. Hệ thống thông báo "Khóa học đã được xuất bản thành công!"<br>   5c. Khóa học xuất hiện trong danh sách khóa học công khai<br>   5d. Hệ thống có thể gửi thông báo đến học viên đã quan tâm (nếu có tính năng)<br><br>6. **Nếu chưa có nội dung:**<br>   6a. Hệ thống thông báo "Khóa học cần có ít nhất một nội dung học tập trước khi xuất bản"<br>   6b. Hệ thống gợi ý "Thêm nội dung vào khóa học"<br>   6c. Hệ thống chuyển hướng đến trang quản lý nội dung |
| **Luồng thay thế** | **4a. Khóa học đã được xuất bản:**<br>- Hệ thống hiển thị "Khóa học đã được xuất bản"<br>- Nút "Xuất bản" được thay bằng "Hủy xuất bản" hoặc "Lưu nháp"<br><br>**6a. Khóa học chưa có nội dung:**<br>- Hệ thống không cho phép xuất bản<br>- Giảng viên cần thêm nội dung trước |

## UC-GV-06: Thêm nội dung vào khóa học

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Giảng viên thêm nội dung vào khóa học |
| **ID** | UC-GV-06 |
| **Tác nhân** | Giảng viên |
| **Mô tả tóm tắt** | Giảng viên thêm video, tài liệu, hoặc bài tập/quiz vào khóa học của mình |
| **Tiền điều kiện** | - Giảng viên đã đăng nhập<br>- Khóa học thuộc về giảng viên |
| **Hậu điều kiện** | - Nội dung đã được thêm vào khóa học<br>- Nội dung có thể ở trạng thái "draft" hoặc "published"<br>- Thứ tự nội dung được cập nhật |
| **Luồng sự kiện** | 1. Giảng viên truy cập trang quản lý nội dung của khóa học<br>2. Giảng viên click "Thêm nội dung" hoặc "Add Content"<br>3. Hệ thống hiển thị form với các loại nội dung:<br>   - Video<br>   - Tài liệu (Document/PDF)<br>   - Bài tập/Quiz<br>4. Giảng viên chọn loại nội dung<br>5. **Nếu chọn Video:**<br>   5a. Giảng viên upload file video (hoặc nhập video URL)<br>   5b. Hệ thống validate file video (định dạng, kích thước)<br>   5c. Hệ thống upload video vào MinIO storage<br>   5d. Giảng viên điền thông tin:<br>       - Tiêu đề (bắt buộc)<br>       - Mô tả<br>       - Thứ tự (order_index)<br>       - Thời lượng ước tính (estimated_duration)<br>       - Có phải preview/free không (is_preview, is_free)<br>   5e. Hệ thống tạo Content record với content_type = "video"<br><br>6. **Nếu chọn Tài liệu:**<br>   6a. Giảng viên upload file PDF/Document<br>   6b. Hệ thống validate file (định dạng, kích thước)<br>   6c. Hệ thống upload tài liệu vào MinIO storage<br>   6d. Giảng viên điền thông tin:<br>       - Tiêu đề (bắt buộc)<br>       - Mô tả<br>       - Thứ tự<br>       - Thời gian đọc ước tính<br>   6e. Hệ thống tạo Content record với content_type = "document"<br><br>7. **Nếu chọn Bài tập/Quiz:**<br>   7a. Giảng viên điền thông tin:<br>       - Tiêu đề (bắt buộc)<br>       - Mô tả<br>       - Thứ tự<br>   7b. Giảng viên thêm câu hỏi và đáp án:<br>       - Câu hỏi (text)<br>       - Các lựa chọn đáp án (multiple choice)<br>       - Đáp án đúng<br>       - Điểm số cho mỗi câu hỏi<br>   7c. Hệ thống tạo Content record với content_type = "quiz"<br>   7d. Hệ thống tạo Question records và Answer records liên quan<br><br>8. Hệ thống tạo slug tự động từ tiêu đề<br>9. Hệ thống lưu Content record vào database<br>10. Hệ thống cập nhật thứ tự nội dung (order_index) của khóa học<br>11. Hệ thống tăng course.content_count (nếu có)<br>12. Hệ thống thông báo "Thêm nội dung thành công!"<br>13. Hệ thống reload danh sách nội dung |
| **Luồng thay thế** | **5b. File video quá lớn hoặc không đúng định dạng:**<br>- Hệ thống thông báo "File video không hợp lệ"<br>- Hệ thống yêu cầu upload lại với định dạng đúng (mp4, webm, etc.)<br>- Giảng viên upload lại file<br><br>**6b. File tài liệu không hợp lệ:**<br>- Hệ thống thông báo "File tài liệu không hợp lệ"<br>- Hệ thống yêu cầu upload lại với định dạng PDF hoặc DOCX<br><br>**7b. Quiz không có câu hỏi nào:**<br>- Hệ thống thông báo "Quiz cần có ít nhất một câu hỏi"<br>- Giảng viên thêm câu hỏi và thử lại |

## UC-GV-07: Chỉnh sửa nội dung

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Giảng viên chỉnh sửa nội dung |
| **ID** | UC-GV-07 |
| **Tác nhân** | Giảng viên |
| **Mô tả tóm tắt** | Giảng viên chỉnh sửa thông tin nội dung trong khóa học (tiêu đề, mô tả, thứ tự, file mới nếu cần) |
| **Tiền điều kiện** | - Giảng viên đã đăng nhập<br>- Nội dung tồn tại và thuộc khóa học của giảng viên |
| **Hậu điều kiện** | - Nội dung đã được cập nhật trong database<br>- Nếu có file mới, file cũ có thể được xóa khỏi MinIO |
| **Luồng sự kiện** | 1. Giảng viên truy cập trang quản lý nội dung<br>2. Giảng viên click vào nội dung cần chỉnh sửa<br>3. Giảng viên click "Chỉnh sửa" hoặc "Edit"<br>4. Hệ thống kiểm tra quyền truy cập (nội dung thuộc khóa học của giảng viên)<br>5. Hệ thống tải thông tin nội dung hiện tại<br>6. Hệ thống hiển thị form chỉnh sửa với thông tin đã điền sẵn<br>7. Giảng viên chỉnh sửa thông tin:<br>   - Tiêu đề, mô tả<br>   - Thứ tự (order_index)<br>   - Upload file mới (nếu muốn thay đổi video/tài liệu)<br>   - Chỉnh sửa câu hỏi/đáp án (nếu là quiz)<br>8. Giảng viên click "Lưu thay đổi"<br>9. Hệ thống validate thông tin<br>10. Nếu có file mới:<br>    - Hệ thống upload file mới vào MinIO<br>    - Hệ thống xóa file cũ khỏi MinIO (nếu có)<br>11. Hệ thống cập nhật Content record trong database<br>12. Nếu là quiz và có thay đổi câu hỏi:<br>    - Hệ thống cập nhật Question records<br>    - Hệ thống cập nhật Answer records<br>13. Hệ thống thông báo "Cập nhật nội dung thành công!"<br>14. Hệ thống reload trang hoặc chuyển hướng về danh sách nội dung |
| **Luồng thay thế** | **4a. Nội dung không tồn tại:**<br>- Hệ thống hiển thị lỗi 404 "Nội dung không tìm thấy"<br><br>**4b. Nội dung không thuộc khóa học của giảng viên:**<br>- Hệ thống từ chối truy cập "Bạn không có quyền chỉnh sửa nội dung này"<br><br>**9a. Thông tin không hợp lệ:**<br>- Hệ thống hiển thị lỗi validation<br>- Giảng viên sửa lại và thử lại |

## UC-GV-08: Xóa nội dung

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Giảng viên xóa nội dung |
| **ID** | UC-GV-08 |
| **Tác nhân** | Giảng viên |
| **Mô tả tóm tắt** | Giảng viên xóa nội dung khỏi khóa học (video, tài liệu, quiz) |
| **Tiền điều kiện** | - Giảng viên đã đăng nhập<br>- Nội dung tồn tại và thuộc khóa học của giảng viên |
| **Hậu điều kiện** | - Nội dung đã bị xóa khỏi khóa học<br>- File trong MinIO đã được xóa (nếu có)<br>- Thứ tự nội dung còn lại được cập nhật |
| **Luồng sự kiện** | 1. Giảng viên truy cập trang quản lý nội dung<br>2. Giảng viên click vào nội dung cần xóa<br>3. Giảng viên click "Xóa" hoặc "Delete"<br>4. Hệ thống kiểm tra quyền truy cập<br>5. Hệ thống kiểm tra nội dung có đang được học viên sử dụng không:<br>   - Đếm số Progress records với content_id<br>   - Kiểm tra có học viên đang học nội dung này không<br>6. Hệ thống hiển thị cảnh báo và yêu cầu xác nhận:<br>   - "Bạn có chắc chắn muốn xóa nội dung này?"<br>   - Nếu có học viên đang học: "Nội dung này đang được X học viên học. Việc xóa sẽ ảnh hưởng đến tiến độ học tập."<br>7. Giảng viên xác nhận xóa<br>8. Hệ thống thực hiện xóa:<br>   - Xóa file khỏi MinIO (nếu có video_url hoặc document_url)<br>   - Xóa Question records và Answer records (nếu là quiz)<br>   - Xóa Progress records liên quan (hoặc đánh dấu invalid)<br>   - Xóa Content record<br>9. Hệ thống cập nhật thứ tự nội dung còn lại (order_index)<br>10. Hệ thống giảm course.content_count<br>11. Hệ thống thông báo "Xóa nội dung thành công!"<br>12. Hệ thống reload danh sách nội dung |
| **Luồng thay thế** | **5a. Nội dung đang được nhiều học viên sử dụng (>5):**<br>- Hệ thống cảnh báo mạnh hơn<br>- Hệ thống yêu cầu xác nhận lại<br>- Giảng viên có thể hủy hoặc xác nhận lại<br><br>**7a. Giảng viên hủy xóa:**<br>- Hệ thống không thực hiện xóa<br>- Hệ thống chuyển hướng về trang quản lý nội dung |

## UC-GV-09: Sắp xếp thứ tự nội dung

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Giảng viên sắp xếp thứ tự nội dung |
| **ID** | UC-GV-09 |
| **Tác nhân** | Giảng viên |
| **Mô tả tóm tắt** | Giảng viên thay đổi thứ tự hiển thị của nội dung trong khóa học bằng cách kéo thả hoặc nhập số thứ tự |
| **Tiền điều kiện** | - Giảng viên đã đăng nhập<br>- Khóa học có nhiều nội dung (>= 2) |
| **Hậu điều kiện** | - Thứ tự nội dung đã được cập nhật (order_index)<br>- Nội dung hiển thị theo thứ tự mới |
| **Luồng sự kiện** | 1. Giảng viên truy cập trang quản lý nội dung<br>2. Hệ thống hiển thị danh sách nội dung với thứ tự hiện tại<br>3. Giảng viên chọn phương thức sắp xếp:<br>   - **Phương thức 1: Kéo thả (Drag & Drop)**<br>     3a. Giảng viên kéo một nội dung lên hoặc xuống<br>     3b. Hệ thống cập nhật order_index theo vị trí mới<br>   - **Phương thức 2: Nhập số thứ tự**<br>     3c. Giảng viên click vào số thứ tự của một nội dung<br>     3d. Giảng viên nhập số thứ tự mới<br>     3e. Hệ thống validate số thứ tự (>= 0, không trùng với nội dung khác)<br>     3f. Hệ thống tự động điều chỉnh order_index của các nội dung khác<br>4. Hệ thống cập nhật order_index cho tất cả nội dung trong database<br>5. Hệ thống thông báo "Sắp xếp thành công!" (có thể tự động, không cần click Save)<br>6. Hệ thống reload danh sách nội dung với thứ tự mới |
| **Luồng thay thế** | **3e. Số thứ tự trùng với nội dung khác:**<br>- Hệ thống tự động điều chỉnh: tăng order_index của nội dung bị trùng lên 1<br>- Hệ thống tiếp tục cập nhật<br><br>**3e. Số thứ tự không hợp lệ (âm hoặc quá lớn):**<br>- Hệ thống thông báo "Số thứ tự không hợp lệ"<br>- Giảng viên nhập lại |

## UC-GV-10: Xem danh sách học viên

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Giảng viên xem danh sách học viên |
| **ID** | UC-GV-10 |
| **Tác nhân** | Giảng viên |
| **Mô tả tóm tắt** | Giảng viên xem danh sách học viên đã đăng ký khóa học của mình với thông tin cơ bản và tiến độ tổng thể |
| **Tiền điều kiện** | - Giảng viên đã đăng nhập<br>- Khóa học có học viên đăng ký |
| **Hậu điều kiện** | - Giảng viên đã xem danh sách học viên<br>- Giảng viên có thể click vào học viên để xem chi tiết tiến độ |
| **Luồng sự kiện** | 1. Giảng viên truy cập trang quản lý khóa học<br>2. Giảng viên chọn khóa học<br>3. Giảng viên click "Học viên" hoặc "Students" hoặc "Danh sách học viên"<br>4. Hệ thống tải danh sách Enrollment records với course_id<br>5. Hệ thống join với User records để lấy thông tin học viên<br>6. Hệ thống hiển thị danh sách học viên với thông tin:<br>   - Tên học viên (first_name, last_name)<br>   - Email<br>   - MSSV (student_id)<br>   - Ngày đăng ký (enrolled_at)<br>   - Tiến độ tổng thể (progress_percentage)<br>   - Trạng thái (status: active, completed, dropped)<br>   - Tổng thời gian học (total_time_spent, đổi sang giờ/phút)<br>7. Giảng viên có thể:<br>   - Tìm kiếm học viên theo tên, email, MSSV<br>   - Lọc theo trạng thái (active, completed, dropped)<br>   - Sắp xếp theo tiến độ, ngày đăng ký, tên<br>   - Click vào học viên để xem chi tiết tiến độ (UC-GV-11)<br>8. Hệ thống hỗ trợ phân trang nếu có nhiều học viên |
| **Luồng thay thế** | **3a. Không có học viên đăng ký:**<br>- Hệ thống hiển thị thông báo "Chưa có học viên đăng ký khóa học này"<br>- Hệ thống gợi ý "Chia sẻ khóa học để thu hút học viên" |

## UC-GV-11: Theo dõi tiến độ học viên

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Giảng viên theo dõi tiến độ học viên |
| **ID** | UC-GV-11 |
| **Tác nhân** | Giảng viên |
| **Mô tả tóm tắt** | Giảng viên xem tiến độ học tập chi tiết của từng học viên trong khóa học (tiến độ theo nội dung, thời gian học, nội dung đã hoàn thành) |
| **Tiền điều kiện** | - Giảng viên đã đăng nhập<br>- Có học viên đã đăng ký khóa học |
| **Hậu điều kiện** | - Giảng viên đã xem thông tin tiến độ chi tiết<br>- Giảng viên có thể xuất báo cáo (nếu có chức năng) |
| **Luồng sự kiện** | 1. Giảng viên truy cập trang danh sách học viên (UC-GV-10)<br>2. Giảng viên click vào một học viên<br>3. Hệ thống tải thông tin chi tiết:<br>   - Thông tin học viên (tên, email, MSSV)<br>   - Enrollment record (ngày đăng ký, trạng thái, tiến độ tổng thể)<br>   - Tất cả Progress records với user_id và course_id<br>4. Hệ thống join Progress với Content để lấy thông tin nội dung<br>5. Hệ thống tính toán thống kê:<br>   - Tổng thời gian học (total_time_spent từ Enrollment)<br>   - Số nội dung đã hoàn thành (Progress với status = "completed")<br>   - Số nội dung đang học (status = "in_progress")<br>   - Số nội dung chưa bắt đầu (status = "not_started")<br>   - Tỷ lệ hoàn thành (completed / total * 100%)<br>6. Hệ thống hiển thị chi tiết tiến độ:<br>   - **Thông tin học viên:** Tên, email, MSSV, ngày đăng ký<br>   - **Tiến độ tổng thể:** Progress bar, phần trăm<br>   - **Tiến độ theo nội dung:**<br>     * Danh sách tất cả nội dung trong khóa học<br>     * Với mỗi nội dung: trạng thái (not_started, in_progress, completed), tiến độ (%), thời gian học<br>     * Màu sắc phân biệt: xám (chưa bắt đầu), vàng (đang học), xanh (đã hoàn thành)<br>   - **Thống kê:**<br>     * Tổng thời gian học (giờ/phút)<br>     * Số nội dung đã hoàn thành / Tổng số nội dung<br>     * Tỷ lệ hoàn thành<br>     * Ngày truy cập cuối cùng (last_accessed)<br>7. Giảng viên có thể:<br>   - Xem chi tiết từng nội dung<br>   - Xuất báo cáo PDF/CSV (nếu có chức năng)<br>   - Xem lịch sử hoạt động (nếu có)<br>8. Hệ thống có thể hiển thị biểu đồ tiến độ theo thời gian (nếu có) |
| **Luồng thay thế** | **2a. Học viên chưa bắt đầu học:**<br>- Hệ thống hiển thị "Học viên chưa bắt đầu học khóa học này"<br>- Tất cả nội dung hiển thị trạng thái "not_started"<br>- Thống kê: 0% hoàn thành, 0 phút học tập |

## UC-GV-12: Xem thống kê khóa học

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Giảng viên xem thống kê khóa học |
| **ID** | UC-GV-12 |
| **Tác nhân** | Giảng viên |
| **Mô tả tóm tắt** | Giảng viên xem thống kê tổng quan về khóa học (số đăng ký, hoàn thành, đánh giá, xu hướng) |
| **Tiền điều kiện** | - Giảng viên đã đăng nhập<br>- Có khóa học |
| **Hậu điều kiện** | - Giảng viên đã xem thống kê khóa học<br>- Giảng viên có thể phân tích hiệu quả giảng dạy |
| **Luồng sự kiện** | 1. Giảng viên truy cập trang quản lý khóa học<br>2. Giảng viên chọn khóa học<br>3. Giảng viên click "Thống kê" hoặc "Statistics" hoặc "Dashboard"<br>4. Hệ thống tính toán và hiển thị thống kê:<br>   **4a. Thống kê đăng ký:**<br>   - Tổng số học viên đăng ký (enrolled_count)<br>   - Số học viên đang học (status = "active")<br>   - Số học viên đã hoàn thành (status = "completed")<br>   - Số học viên đã bỏ học (status = "dropped")<br>   - Tỷ lệ hoàn thành (completed / total * 100%)<br><br>   **4b. Thống kê tiến độ:**<br>   - Tiến độ trung bình của tất cả học viên (AVG progress_percentage)<br>   - Phân bổ tiến độ: 0-25%, 25-50%, 50-75%, 75-100%<br>   - Thời gian học trung bình (AVG total_time_spent)<br><br>   **4c. Thống kê đánh giá:**<br>   - Đánh giá trung bình (average_rating từ Course)<br>   - Tổng số đánh giá (COUNT Rating records)<br>   - Phân bổ đánh giá: 5 sao, 4 sao, 3 sao, 2 sao, 1 sao<br><br>   **4d. Thống kê theo thời gian:**<br>   - Biểu đồ số đăng ký theo ngày/tuần/tháng<br>   - Biểu đồ tiến độ trung bình theo thời gian<br>   - Xu hướng học tập<br>5. Giảng viên có thể:<br>   - Xem thống kê chi tiết hơn<br>   - Export thống kê dạng CSV/PDF<br>   - Lọc theo khoảng thời gian<br>   - So sánh với các khóa học khác (nếu có) |
| **Luồng thay thế** | **3a. Khóa học chưa có học viên đăng ký:**<br>- Hệ thống hiển thị "Chưa có dữ liệu thống kê"<br>- Tất cả số liệu = 0<br>- Hệ thống gợi ý "Chia sẻ khóa học để thu hút học viên" |

## UC-GV-13: Tạo bài viết blog

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Giảng viên tạo bài viết blog |
| **ID** | UC-GV-13 |
| **Tác nhân** | Giảng viên |
| **Mô tả tóm tắt** | Giảng viên tạo bài viết blog mới để chia sẻ kiến thức, kinh nghiệm với học viên và cộng đồng |
| **Tiền điều kiện** | - Giảng viên đã đăng nhập |
| **Hậu điều kiện** | - Bài viết đã được tạo và lưu<br>- Bài viết có thể ở trạng thái "draft" hoặc "published" |
| **Luồng sự kiện** | 1. Giảng viên truy cập trang "Blog" hoặc "Bài viết của tôi"<br>2. Giảng viên click "Tạo bài viết mới" hoặc "New Post"<br>3. Hệ thống hiển thị form tạo blog với các trường:<br>   - Tiêu đề (bắt buộc, 3-200 ký tự)<br>   - Nội dung (rich text editor, CKEditor hoặc tương tự)<br>   - Mô tả ngắn (excerpt, tùy chọn)<br>   - Upload ảnh đại diện (featured_image, tùy chọn)<br>   - Chọn danh mục blog (category_id, dropdown)<br>   - Tags (tùy chọn, có thể nhập nhiều tags phân cách bằng dấu phẩy)<br>   - Trạng thái: Lưu nháp (draft) hoặc Xuất bản ngay (published)<br>4. Giảng viên điền thông tin bài viết<br>5. Giảng viên upload ảnh đại diện (nếu có)<br>6. Giảng viên chọn trạng thái:<br>   - **Lưu nháp:** Bài viết không hiển thị công khai<br>   - **Xuất bản:** Bài viết hiển thị công khai ngay<br>7. Giảng viên click "Lưu" hoặc "Xuất bản"<br>8. Hệ thống validate thông tin:<br>   - Tiêu đề không rỗng, độ dài hợp lệ<br>   - Nội dung không rỗng<br>   - Danh mục phải tồn tại và active (nếu có)<br>9. Hệ thống upload ảnh đại diện vào MinIO (nếu có)<br>10. Hệ thống tạo slug tự động từ tiêu đề<br>11. Hệ thống kiểm tra slug đã tồn tại chưa (nếu có thì thêm số)<br>12. Hệ thống tính toán reading_time (ước tính thời gian đọc dựa trên độ dài nội dung)<br>13. Hệ thống tạo Blog record:<br>    - title, slug, content, excerpt<br>    - featured_image (URL từ MinIO)<br>    - status (draft hoặc published)<br>    - tags (array)<br>    - category_id<br>    - author_id = user_id của giảng viên<br>    - view_count = 0, reading_time<br>14. Hệ thống thông báo "Tạo bài viết thành công!"<br>15. Hệ thống chuyển hướng đến trang xem bài viết (nếu published) hoặc trang chỉnh sửa (nếu draft) |
| **Luồng thay thế** | **8a. Nội dung không hợp lệ:**<br>- Hệ thống hiển thị lỗi validation<br>- Giảng viên sửa lại và thử lại<br><br>**9a. File ảnh không hợp lệ:**<br>- Hệ thống thông báo "File ảnh không hợp lệ"<br>- Giảng viên upload lại<br><br>**11a. Slug đã tồn tại:**<br>- Hệ thống tự động tạo slug mới với số hoặc timestamp<br>- Hệ thống tiếp tục tạo bài viết |

## UC-GV-14: Chỉnh sửa bài viết blog

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Giảng viên chỉnh sửa bài viết blog |
| **ID** | UC-GV-14 |
| **Tác nhân** | Giảng viên |
| **Mô tả tóm tắt** | Giảng viên chỉnh sửa bài viết blog đã tạo (tiêu đề, nội dung, ảnh đại diện, danh mục, tags) |
| **Tiền điều kiện** | - Giảng viên đã đăng nhập<br>- Bài viết tồn tại và thuộc về giảng viên (author_id = user_id) |
| **Hậu điều kiện** | - Bài viết đã được cập nhật trong database<br>- Nếu có ảnh mới, ảnh cũ có thể được xóa khỏi MinIO |
| **Luồng sự kiện** | 1. Giảng viên truy cập trang "Bài viết của tôi"<br>2. Giảng viên click vào bài viết cần chỉnh sửa<br>3. Giảng viên click "Chỉnh sửa" hoặc "Edit"<br>4. Hệ thống kiểm tra quyền truy cập (author_id = user_id hoặc admin)<br>5. Hệ thống tải thông tin bài viết hiện tại<br>6. Hệ thống hiển thị form chỉnh sửa với nội dung đã điền sẵn<br>7. Giảng viên chỉnh sửa nội dung:<br>   - Tiêu đề, nội dung, mô tả ngắn<br>   - Upload ảnh mới (nếu muốn thay đổi)<br>   - Thay đổi danh mục, tags<br>   - Thay đổi trạng thái (draft ↔ published)<br>8. Giảng viên click "Lưu thay đổi"<br>9. Hệ thống validate thông tin<br>10. Nếu có ảnh mới:<br>    - Hệ thống upload ảnh mới vào MinIO<br>    - Hệ thống xóa ảnh cũ khỏi MinIO (nếu có)<br>11. Nếu tiêu đề thay đổi:<br>    - Hệ thống tạo slug mới từ tiêu đề<br>    - Hệ thống kiểm tra slug mới có trùng không<br>12. Hệ thống tính toán lại reading_time<br>13. Hệ thống cập nhật Blog record trong database<br>14. Hệ thống thông báo "Cập nhật bài viết thành công!"<br>15. Hệ thống chuyển hướng đến trang xem bài viết |
| **Luồng thay thế** | **4a. Bài viết không tồn tại:**<br>- Hệ thống hiển thị lỗi 404 "Bài viết không tìm thấy"<br><br>**4b. Bài viết không thuộc về giảng viên:**<br>- Hệ thống từ chối truy cập "Bạn không có quyền chỉnh sửa bài viết này"<br><br>**9a. Thông tin không hợp lệ:**<br>- Hệ thống hiển thị lỗi validation<br>- Giảng viên sửa lại và thử lại |

## UC-GV-15: Xóa bài viết blog

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Giảng viên xóa bài viết blog |
| **ID** | UC-GV-15 |
| **Tác nhân** | Giảng viên |
| **Mô tả tóm tắt** | Giảng viên xóa bài viết blog đã tạo khỏi hệ thống |
| **Tiền điều kiện** | - Giảng viên đã đăng nhập<br>- Bài viết tồn tại và thuộc về giảng viên |
| **Hậu điều kiện** | - Bài viết đã bị xóa khỏi hệ thống<br>- Ảnh đại diện đã được xóa khỏi MinIO (nếu có)<br>- Bình luận liên quan có thể bị xóa hoặc giữ lại (tùy cấu hình) |
| **Luồng sự kiện** | 1. Giảng viên truy cập trang "Bài viết của tôi"<br>2. Giảng viên click vào bài viết cần xóa<br>3. Giảng viên click "Xóa" hoặc "Delete"<br>4. Hệ thống kiểm tra quyền truy cập<br>5. Hệ thống đếm số lượng bình luận (Comment records với blog_id)<br>6. Hệ thống hiển thị cảnh báo và yêu cầu xác nhận:<br>   - "Bạn có chắc chắn muốn xóa bài viết này?"<br>   - Nếu có nhiều bình luận: "Bài viết này có X bình luận. Việc xóa sẽ xóa tất cả bình luận."<br>7. Giảng viên xác nhận xóa<br>8. Hệ thống thực hiện xóa:<br>   - Xóa ảnh đại diện khỏi MinIO (nếu có)<br>   - Xóa tất cả Comment records liên quan (hoặc giữ lại tùy cấu hình)<br>   - Xóa Blog record<br>9. Hệ thống thông báo "Xóa bài viết thành công!"<br>10. Hệ thống chuyển hướng về danh sách bài viết |
| **Luồng thay thế** | **5a. Bài viết có nhiều bình luận (>10):**<br>- Hệ thống cảnh báo mạnh hơn<br>- Hệ thống yêu cầu xác nhận lại<br>- Giảng viên có thể hủy hoặc xác nhận lại<br><br>**7a. Giảng viên hủy xóa:**<br>- Hệ thống không thực hiện xóa<br>- Hệ thống chuyển hướng về trang chi tiết bài viết |

## UC-GV-16: Xem đánh giá khóa học

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Giảng viên xem đánh giá khóa học |
| **ID** | UC-GV-16 |
| **Tác nhân** | Giảng viên |
| **Mô tả tóm tắt** | Giảng viên xem đánh giá và nhận xét từ học viên về khóa học để phân tích hiệu quả giảng dạy và cải thiện chất lượng |
| **Tiền điều kiện** | - Giảng viên đã đăng nhập<br>- Khóa học có đánh giá từ học viên |
| **Hậu điều kiện** | - Giảng viên đã xem danh sách đánh giá<br>- Giảng viên có thể phân tích phản hồi từ học viên |
| **Luồng sự kiện** | 1. Giảng viên truy cập trang quản lý khóa học<br>2. Giảng viên chọn khóa học<br>3. Giảng viên click "Đánh giá" hoặc "Reviews" hoặc "Ratings"<br>4. Hệ thống tải tất cả Rating records với course_id<br>5. Hệ thống join với User records để lấy thông tin học viên<br>6. Hệ thống tính toán:<br>   - Đánh giá trung bình (average_rating từ Course hoặc tính lại)<br>   - Tổng số đánh giá<br>   - Phân bổ đánh giá: số lượng mỗi mức sao (1-5)<br>7. Hệ thống hiển thị danh sách đánh giá:<br>   - **Tổng quan:**<br>     * Đánh giá trung bình (ví dụ: 4.5/5.0)<br>     * Tổng số đánh giá<br>     * Biểu đồ phân bổ đánh giá (bar chart hoặc pie chart)<br>   - **Danh sách đánh giá:**<br>     * Số sao (1-5) với icon ngôi sao<br>     * Nhận xét từ học viên (review text, nếu có)<br>     * Tên học viên (có thể ẩn danh hoặc công khai tùy cấu hình)<br>     * Ngày đánh giá (created_at)<br>     * Trạng thái xác thực (is_verified: học viên đã hoàn thành khóa học)<br>8. Giảng viên có thể:<br>   - Lọc theo số sao (1 sao, 2 sao, ..., 5 sao)<br>   - Sắp xếp theo ngày (mới nhất, cũ nhất)<br>   - Sắp xếp theo số sao (cao nhất, thấp nhất)<br>   - Tìm kiếm trong nhận xét<br>   - Xem chi tiết từng đánh giá<br>9. Hệ thống hỗ trợ phân trang nếu có nhiều đánh giá |
| **Luồng thay thế** | **3a. Không có đánh giá nào:**<br>- Hệ thống hiển thị "Chưa có đánh giá nào cho khóa học này"<br>- Hệ thống gợi ý "Khuyến khích học viên đánh giá sau khi hoàn thành khóa học" |

## UC-GV-17: Quản lý profile

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Giảng viên quản lý profile |
| **ID** | UC-GV-17 |
| **Tác nhân** | Giảng viên |
| **Mô tả tóm tắt** | Giảng viên xem và cập nhật thông tin cá nhân, avatar, và đổi mật khẩu |
| **Tiền điều kiện** | - Giảng viên đã đăng nhập |
| **Hậu điều kiện** | - Thông tin profile đã được cập nhật (nếu có thay đổi)<br>- Avatar mới đã được upload (nếu có) |
| **Luồng sự kiện** | 1. Giảng viên truy cập trang Profile hoặc từ menu<br>2. Hệ thống tải thông tin user hiện tại<br>3. Hệ thống hiển thị thông tin:<br>   - Họ tên (first_name, last_name)<br>   - Email (không thể thay đổi hoặc cần xác thực)<br>   - MSSV (student_id)<br>   - Avatar (hiện tại hoặc mặc định)<br>   - Vai trò (teacher/lecturer)<br>   - Ngày tham gia (created_at)<br>   - Số khóa học đã tạo (COUNT Course với instructor_id)<br>4. Giảng viên có thể thực hiện:<br>   **4a. Cập nhật thông tin:**<br>   - Chỉnh sửa họ tên, MSSV<br>   - Click "Lưu thay đổi"<br>   - Hệ thống validate và cập nhật User record<br><br>   **4b. Thay đổi avatar:**<br>   - Click "Thay đổi avatar" hoặc click vào avatar<br>   - Upload ảnh mới<br>   - Hệ thống validate ảnh (định dạng, kích thước)<br>   - Hệ thống upload ảnh vào MinIO hoặc thư mục uploads/avatars<br>   - Hệ thống xóa avatar cũ (nếu có)<br>   - Hệ thống cập nhật User.avatar_path<br><br>   **4c. Đổi mật khẩu:**<br>   - Click "Đổi mật khẩu"<br>   - Nhập mật khẩu cũ<br>   - Nhập mật khẩu mới<br>   - Nhập xác nhận mật khẩu mới<br>   - Click "Đổi mật khẩu"<br>   - Hệ thống validate:<br>     * Mật khẩu cũ phải đúng<br>     * Mật khẩu mới phải >= 6 ký tự<br>     * Mật khẩu mới và xác nhận phải khớp<br>   - Hệ thống hash mật khẩu mới bằng bcrypt<br>   - Hệ thống cập nhật User.password<br>5. Hệ thống thông báo "Cập nhật thành công!"<br>6. Hệ thống reload trang hoặc cập nhật thông tin hiển thị |
| **Luồng thay thế** | **4c. Mật khẩu cũ sai:**<br>- Hệ thống thông báo "Mật khẩu cũ không đúng"<br>- Giảng viên nhập lại mật khẩu cũ<br><br>**4c. Mật khẩu mới và xác nhận không khớp:**<br>- Hệ thống thông báo "Mật khẩu xác nhận không khớp"<br>- Giảng viên nhập lại<br><br>**4b. File không phải ảnh hoặc quá lớn:**<br>- Hệ thống từ chối và thông báo "File ảnh không hợp lệ"<br>- Giảng viên upload lại |

## UC-GV-18: Xem dashboard giảng viên

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Giảng viên xem dashboard |
| **ID** | UC-GV-18 |
| **Tác nhân** | Giảng viên |
| **Mô tả tóm tắt** | Giảng viên xem dashboard tổng quan về khóa học, học viên, và hoạt động của mình trên hệ thống |
| **Tiền điều kiện** | - Giảng viên đã đăng nhập |
| **Hậu điều kiện** | - Giảng viên đã xem dashboard tổng quan<br>- Giảng viên có thể click vào các khóa học để quản lý |
| **Luồng sự kiện** | 1. Giảng viên truy cập trang Dashboard hoặc sau khi đăng nhập<br>2. Hệ thống tải dữ liệu thống kê của giảng viên:<br>   - Tất cả Course records với instructor_id = user_id<br>   - Tất cả Enrollment records liên quan đến các khóa học<br>   - Tất cả Rating records cho các khóa học<br>3. Hệ thống tính toán và hiển thị:<br>   **3a. Thống kê tổng quan:**<br>   - Tổng số khóa học đã tạo (COUNT Course)<br>   - Số khóa học đã xuất bản (status = "published")<br>   - Số khóa học ở trạng thái draft (status = "draft")<br>   - Tổng số học viên đăng ký (SUM enrolled_count hoặc COUNT Enrollment)<br>   - Tổng số đánh giá nhận được (COUNT Rating)<br>   - Đánh giá trung bình (AVG average_rating)<br><br>   **3b. Khóa học gần đây:**<br>   - Danh sách khóa học được truy cập gần nhất (5-10 khóa học)<br>   - Với mỗi khóa học: tiêu đề, số học viên đăng ký, đánh giá trung bình, trạng thái<br><br>   **3c. Hoạt động:**<br>   - Lịch sử các hoạt động gần đây (tạo khóa học, thêm nội dung, xuất bản, etc.)<br>   - Có thể hiển thị theo timeline<br><br>   **3d. Biểu đồ:**<br>   - Biểu đồ số đăng ký theo thời gian (7 ngày, 30 ngày, 90 ngày)<br>   - Biểu đồ tiến độ trung bình của học viên<br>   - Biểu đồ đánh giá theo thời gian<br>4. Giảng viên có thể:<br>   - Click vào bất kỳ khóa học nào để quản lý<br>   - Xem thống kê chi tiết hơn<br>   - Export báo cáo<br>   - Lọc theo khoảng thời gian<br>5. Hệ thống tự động refresh dữ liệu định kỳ (nếu có tính năng real-time)

---

> **Lưu ý:** Các sơ đồ hoạt động và sơ đồ tuần tự đã được tách ra file riêng: `CHUONG-3-SO-DO-GIANG-VIEN.md`

---

**🏛️ Trường Đại học Công nghệ Thông tin**  
**🌍 Đại học Quốc gia TP. Hồ Chí Minh**