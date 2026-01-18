# 3.4. Use Case Tương tác và Quản lý

## UC-11: Tạo lộ trình học tập với AI

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Học viên tạo lộ trình học tập với AI |
| **ID** | UC-11 |
| **Tác nhân** | Học viên |
| **Mô tả tóm tắt** | Học viên yêu cầu AI tạo lộ trình học tập tùy chỉnh dựa trên mục tiêu, phong cách học, và chủ đề quan tâm để có kế hoạch học tập cá nhân hóa |
| **Tiền điều kiện** | - Học viên đã đăng nhập<br>- Dịch vụ AI (Google Gemini) đang hoạt động |
| **Hậu điều kiện** | - Học viên đã có lộ trình học tập được tạo bởi AI<br>- Lộ trình được lưu trong lịch sử tương tác AI<br>- Học viên có thể lưu hoặc chia sẻ lộ trình |
| **Luồng sự kiện** | 1. Học viên truy cập trang "Tạo lộ trình học tập"<br>2. Học viên điền thông tin vào form:<br>   - **Phong cách học:** Chọn một hoặc nhiều (videos, exercises, reading)<br>   - **Thời gian học tốt nhất:** Chọn (morning, afternoon, night)<br>   - **Mức độ kỹ năng hiện tại:** Chọn (beginner, intermediate, advanced)<br>   - **Thời lượng khóa học mong muốn:** Nhập số tuần hoặc chọn (2-3 tuần, 4-6 tuần, 8+ tuần)<br>   - **Chủ đề quan tâm:** Nhập danh sách chủ đề (ví dụ: JavaScript, Python, Database)<br>3. Học viên click "Tạo lộ trình"<br>4. Hệ thống lấy ngữ cảnh người dùng:<br>   - Khóa học hiện tại đang học<br>   - Tiến độ của từng khóa học<br>   - Tên và vai trò học viên<br>5. Hệ thống xây dựng prompt chi tiết cho AI với:<br>   - Thông tin người học (từ form và ngữ cảnh)<br>   - Yêu cầu format output (markdown với heading rõ ràng)<br>   - Các phần cần có trong lộ trình<br>6. Hệ thống gửi yêu cầu đến Google Gemini API (với fallback các model khác)<br>7. AI tạo lộ trình học tập chi tiết bao gồm:<br>   - **Tổng quan lộ trình:** Mô tả ngắn gọn về lộ trình và mục tiêu học tập<br>   - **Cấu trúc khóa học:** Chia thành các tuần/mô-đun với:<br>     * Tên mô-đun<br>     * Mục tiêu học tập của mô-đun<br>     * Nội dung chi tiết (bài học, bài tập, dự án)<br>     * Thời gian ước tính cho mỗi mô-đun<br>   - **Tài nguyên học tập:** Gợi ý tài liệu, video, bài tập phù hợp<br>   - **Dự án thực hành:** Các dự án để áp dụng kiến thức<br>   - **Đánh giá tiến độ:** Cách kiểm tra và đánh giá sự tiến bộ<br>   - **Lời khuyên học tập:** Mẹo học tập phù hợp với thời gian học<br>8. Hệ thống lưu lịch sử tương tác AI (interaction_type: 'roadmap')<br>9. Hệ thống hiển thị lộ trình đã tạo dưới dạng markdown<br>10. Học viên có thể:<br>    - Đọc và xem lộ trình<br>    - Lưu lộ trình (tùy chọn)<br>    - Chia sẻ lộ trình (tùy chọn)<br>    - Tạo lộ trình mới với thông tin khác |
| **Luồng thay thế** | **2a. Thiếu thông tin bắt buộc (chủ đề quan tâm):**<br>- Hệ thống yêu cầu nhập ít nhất một chủ đề<br>- Hệ thống hiển thị lỗi validation<br><br>**6a. AI service không khả dụng:**<br>- Hệ thống thử các model Gemini khác (gemini-pro-vision, gemini-1.5-pro)<br>- Nếu tất cả đều thất bại: Hệ thống thông báo "Lỗi khi tạo lộ trình học tập. Vui lòng thử lại sau."<br>- Hệ thống ghi log lỗi để theo dõi<br><br>**7a. AI tạo lộ trình không phù hợp hoặc quá ngắn:**<br>- Học viên có thể tạo lại lộ trình với thông tin chi tiết hơn<br>- Hệ thống có thể gợi ý điều chỉnh các thông tin đầu vào |

## UC-12: Chat với người dùng khác

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Học viên chat với người dùng khác |
| **ID** | UC-12 |
| **Tác nhân** | Học viên |
| **Mô tả tóm tắt** | Học viên tìm kiếm và chat real-time với người dùng khác trong hệ thống thông qua Socket.IO để trao đổi, hỏi đáp về học tập |
| **Tiền điều kiện** | - Học viên đã đăng nhập<br>- Socket.IO server đang hoạt động |
| **Hậu điều kiện** | - Tin nhắn đã được gửi và lưu vào hệ thống<br>- Người nhận đã nhận tin nhắn real-time<br>- Conversation đã được tạo hoặc cập nhật |
| **Luồng sự kiện** | 1. Học viên truy cập trang Chat<br>2. Hệ thống hiển thị danh sách các cuộc trò chuyện gần đây (sắp xếp theo last_message_at)<br>3. Học viên có thể:<br>   **3a. Tìm kiếm người dùng để bắt đầu chat mới:**<br>   - Học viên nhập tên, email, hoặc MSSV vào ô tìm kiếm (tối thiểu 2 ký tự)<br>   - Hệ thống tìm kiếm người dùng (không phân biệt hoa thường, tìm trong first_name, last_name, email, student_id)<br>   - Hệ thống hiển thị danh sách người dùng (limit 10, loại trừ chính học viên)<br>   - Học viên click vào một người dùng để bắt đầu chat<br><br>   **3b. Tiếp tục cuộc trò chuyện:**<br>   - Học viên click vào một cuộc trò chuyện từ danh sách<br>   - Hệ thống tải lịch sử tin nhắn (limit 100 tin nhắn gần nhất)<br>4. Hệ thống tạo hoặc lấy conversation giữa hai người dùng:<br>   - Kiểm tra conversation đã tồn tại chưa (theo user1_id và user2_id)<br>   - Nếu chưa có: Tạo conversation mới<br>   - Nếu đã có: Lấy conversation hiện tại<br>5. Hệ thống hiển thị lịch sử tin nhắn (sắp xếp theo thời gian tăng dần)<br>6. Hệ thống đánh dấu tin nhắn là đã đọc và reset unread_count<br>7. Học viên nhập tin nhắn vào ô chat<br>8. Học viên gửi tin nhắn (Enter hoặc click nút gửi)<br>9. Hệ thống gửi tin nhắn qua Socket.IO real-time đến người nhận<br>10. Hệ thống lưu tin nhắn vào database (Message model)<br>11. Hệ thống cập nhật conversation (last_message_at, last_message_id, unread_count)<br>12. Người nhận nhận tin nhắn ngay lập tức qua Socket.IO (nếu đang online)<br>13. Hệ thống tự động scroll đến tin nhắn mới nhất trong giao diện |
| **Luồng thay thế** | **3a. Không tìm thấy người dùng:**<br>- Hệ thống hiển thị thông báo "Không tìm thấy người dùng"<br>- Hệ thống gợi ý thử từ khóa khác hoặc kiểm tra lại thông tin<br><br>**3a. Từ khóa tìm kiếm quá ngắn (< 2 ký tự):**<br>- Hệ thống không thực hiện tìm kiếm<br>- Hệ thống hiển thị gợi ý "Nhập ít nhất 2 ký tự để tìm kiếm"<br><br>**4a. Học viên cố gắng chat với chính mình:**<br>- Hệ thống thông báo "Bạn không thể chat với chính mình"<br>- Hệ thống chuyển hướng về trang chat<br><br>**12a. Người nhận không online:**<br>- Tin nhắn vẫn được lưu vào database<br>- Người nhận sẽ thấy tin nhắn khi đăng nhập lại<br>- Conversation sẽ hiển thị unread_count > 0 |

## UC-13: Xem và quản lý profile

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Học viên xem và quản lý profile |
| **ID** | UC-13 |
| **Tác nhân** | Học viên |
| **Mô tả tóm tắt** | Học viên xem và cập nhật thông tin cá nhân, avatar, và đổi mật khẩu để quản lý tài khoản của mình |
| **Tiền điều kiện** | - Học viên đã đăng nhập |
| **Hậu điều kiện** | - Thông tin profile đã được cập nhật<br>- Avatar mới đã được lưu và hiển thị<br>- Mật khẩu mới đã được hash và lưu (nếu đổi mật khẩu) |
| **Luồng sự kiện** | 1. Học viên truy cập trang Profile<br>2. Hệ thống hiển thị thông tin hiện tại:<br>   - Họ tên (first_name, last_name)<br>   - Email (chỉ hiển thị, không thể chỉnh sửa)<br>   - MSSV (student_id)<br>   - Avatar (hình ảnh hoặc initials nếu chưa có)<br>   - Vai trò (role)<br>   - Ngày tham gia (created_at)<br>3. Học viên có thể thực hiện các thao tác:<br>   **3a. Cập nhật thông tin cá nhân:**<br>   - Học viên chỉnh sửa họ tên, MSSV trong form<br>   - Học viên click "Lưu thay đổi"<br>   - Hệ thống validate thông tin (tên không được rỗng, MSSV format hợp lệ nếu có)<br>   - Hệ thống cập nhật thông tin trong database<br>   - Hệ thống thông báo "Cập nhật thành công"<br><br>   **3b. Thay đổi avatar:**<br>   - Học viên click "Thay đổi avatar" hoặc click vào avatar hiện tại<br>   - Học viên chọn file ảnh từ máy tính<br>   - Hệ thống kiểm tra file là ảnh (jpg, png, gif, webp)<br>   - Hệ thống kiểm tra kích thước file (ví dụ: tối đa 5MB)<br>   - Hệ thống resize và optimize ảnh (ví dụ: 200x200px)<br>   - Hệ thống lưu avatar vào thư mục uploads/avatars<br>   - Hệ thống cập nhật đường dẫn avatar trong database<br>   - Hệ thống hiển thị avatar mới ngay lập tức<br>   - Hệ thống thông báo "Đổi avatar thành công"<br><br>   **3c. Đổi mật khẩu:**<br>   - Học viên click "Đổi mật khẩu"<br>   - Học viên nhập mật khẩu cũ<br>   - Học viên nhập mật khẩu mới (và xác nhận mật khẩu mới)<br>   - Hệ thống validate:<br>     * Mật khẩu cũ không được rỗng<br>     * Mật khẩu mới phải đủ mạnh (ví dụ: tối thiểu 8 ký tự)<br>     * Mật khẩu mới và xác nhận phải khớp<br>   - Hệ thống xác thực mật khẩu cũ bằng bcrypt<br>   - Nếu đúng: Hệ thống hash mật khẩu mới bằng bcrypt<br>   - Hệ thống lưu mật khẩu mới vào database<br>   - Hệ thống thông báo "Đổi mật khẩu thành công"<br>   - Hệ thống có thể yêu cầu đăng nhập lại |
| **Luồng thay thế** | **3a. Thông tin không hợp lệ:**<br>- Hệ thống hiển thị lỗi validation (ví dụ: "Tên không được để trống")<br>- Học viên sửa lại và thử lại<br><br>**3b. File không phải ảnh:**<br>- Hệ thống từ chối và thông báo "Vui lòng chọn file ảnh hợp lệ (jpg, png, gif, webp)"<br>- Học viên chọn file khác<br><br>**3b. File quá lớn:**<br>- Hệ thống thông báo "File quá lớn, vui lòng chọn file nhỏ hơn 5MB"<br>- Học viên chọn file nhỏ hơn hoặc nén ảnh<br><br>**3c. Mật khẩu cũ sai:**<br>- Hệ thống thông báo "Mật khẩu cũ không đúng"<br>- Học viên nhập lại mật khẩu cũ<br><br>**3c. Mật khẩu mới không đủ mạnh:**<br>- Hệ thống thông báo "Mật khẩu mới phải có ít nhất 8 ký tự"<br>- Học viên nhập mật khẩu mới mạnh hơn<br><br>**3c. Mật khẩu mới và xác nhận không khớp:**<br>- Hệ thống thông báo "Mật khẩu xác nhận không khớp"<br>- Học viên nhập lại |

## UC-14: Xem blog và bình luận

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Học viên xem blog và bình luận |
| **ID** | UC-14 |
| **Tác nhân** | Học viên |
| **Mô tả tóm tắt** | Học viên xem các bài blog về kiến thức và tham gia bình luận, trao đổi với người dùng khác về nội dung blog |
| **Tiền điều kiện** | - Học viên đã đăng nhập<br>- Blog có trạng thái "published" |
| **Hậu điều kiện** | - Học viên đã xem blog<br>- Bình luận đã được lưu và hiển thị (nếu học viên đã bình luận)<br>- View count của blog đã được tăng |
| **Luồng sự kiện** | 1. Học viên truy cập trang Blog<br>2. Hệ thống hiển thị danh sách bài blog với phân trang (sắp xếp theo ngày đăng giảm dần)<br>3. Mỗi blog hiển thị: tiêu đề, mô tả ngắn, hình ảnh, tác giả, ngày đăng, số lượt xem<br>4. Học viên click vào một bài blog để xem chi tiết<br>5. Hệ thống tải thông tin blog và tăng view_count<br>6. Hệ thống hiển thị trang chi tiết blog bao gồm:<br>   - **Nội dung bài blog:** Tiêu đề, nội dung đầy đủ (markdown/HTML), hình ảnh<br>   - **Thông tin tác giả:** Tên, avatar, ngày đăng<br>   - **Danh sách bình luận:**<br>     * Bình luận gốc (parent_id = null) với phân trang (5 bình luận/trang)<br>     * Bình luận trả lời (replies) cho mỗi bình luận gốc<br>     * Mỗi bình luận hiển thị: tên người dùng, avatar, nội dung, ngày đăng, số lượt thích<br>     * Sắp xếp: mới nhất (mặc định), cũ nhất, nhiều lượt thích nhất<br>7. Học viên có thể:<br>   **7a. Đọc bình luận:**<br>   - Cuộn xuống phần bình luận<br>   - Xem các bình luận gốc và trả lời<br>   - Click "Xem thêm" để tải thêm bình luận (phân trang)<br><br>   **7b. Viết bình luận mới:**<br>   - Học viên nhập nội dung bình luận vào ô textarea<br>   - Học viên click "Gửi bình luận"<br>   - Hệ thống validate: nội dung không được rỗng, tối đa 5000 ký tự<br>   - Hệ thống lưu bình luận vào database (status: 'active', parent_id: null)<br>   - Hệ thống hiển thị bình luận ngay lập tức trong danh sách<br>   - Tác giả bài blog nhận notification (nếu có hệ thống notification)<br><br>   **7c. Trả lời bình luận:**<br>   - Học viên click "Trả lời" trên một bình luận gốc<br>   - Hệ thống hiển thị form trả lời<br>   - Học viên nhập nội dung trả lời<br>   - Học viên click "Gửi trả lời"<br>   - Hệ thống lưu bình luận với parent_id = id của bình luận gốc<br>   - Hệ thống hiển thị trả lời ngay dưới bình luận gốc<br>   - Người viết bình luận gốc nhận notification (nếu có) |
| **Luồng thay thế** | **4a. Blog không tồn tại hoặc chưa published:**<br>- Hệ thống hiển thị lỗi 404 "Bài viết bạn tìm kiếm không tồn tại"<br>- Hệ thống gợi ý quay lại danh sách blog<br><br>**7b. Nội dung bình luận rỗng hoặc quá dài:**<br>- Hệ thống thông báo "Nội dung bình luận không được để trống" hoặc "Bình luận không được vượt quá 5000 ký tự"<br>- Học viên sửa lại nội dung<br><br>**7c. Cố gắng trả lời bình luận con (nested reply):**<br>- Hệ thống không cho phép (chỉ cho phép 1 cấp: bình luận gốc → trả lời)<br>- Hệ thống thông báo "Không thể trả lời bình luận con"<br><br>**6a. Không có bình luận nào:**<br>- Hệ thống hiển thị "Chưa có bình luận nào. Hãy là người đầu tiên bình luận!" |

## UC-15: Tạo và quản lý ghi chú cá nhân

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Học viên tạo và quản lý ghi chú cá nhân |
| **ID** | UC-15 |
| **Tác nhân** | Học viên |
| **Mô tả tóm tắt** | Học viên tạo, xem, chỉnh sửa, và xóa ghi chú cá nhân cho từng nội dung học tập để ghi nhớ kiến thức quan trọng |
| **Tiền điều kiện** | - Học viên đã đăng nhập<br>- Học viên đã đăng ký khóa học (nếu ghi chú liên quan đến nội dung khóa học) |
| **Hậu điều kiện** | - Ghi chú đã được tạo, cập nhật hoặc xóa<br>- Ghi chú được liên kết với nội dung học tập cụ thể |
| **Luồng sự kiện** | 1. Học viên truy cập trang học nội dung khóa học hoặc trang "Ghi chú cá nhân"<br>2. Học viên có thể thực hiện các thao tác:<br>   **2a. Tạo ghi chú mới:**<br>   - Học viên click "Thêm ghi chú" hoặc "Ghi chú cá nhân" trên trang học nội dung<br>   - Hệ thống hiển thị form ghi chú (textarea)<br>   - Học viên nhập nội dung ghi chú (tối đa 10000 ký tự, có thể để trống)<br>   - Học viên có thể đánh dấu "Ghim" (is_pinned) để ưu tiên hiển thị<br>   - Học viên click "Lưu ghi chú"<br>   - Hệ thống kiểm tra ghi chú đã tồn tại cho nội dung này chưa<br>   - Nếu chưa: Hệ thống tạo ghi chú mới (liên kết với content_id và course_id)<br>   - Nếu đã có: Hệ thống cập nhật ghi chú hiện tại<br>   - Hệ thống lưu ghi chú vào database<br>   - Hệ thống hiển thị ghi chú đã lưu<br><br>   **2b. Xem danh sách ghi chú:**<br>   - Học viên truy cập trang "Ghi chú cá nhân"<br>   - Hệ thống tải tất cả ghi chú của học viên<br>   - Hệ thống hiển thị danh sách ghi chú với:<br>     * Tiêu đề nội dung liên quan<br>     * Tên khóa học<br>     * Nội dung ghi chú (preview hoặc đầy đủ)<br>     * Ngày tạo/cập nhật<br>     * Trạng thái ghim<br>   - Học viên có thể lọc theo khóa học<br>   - Học viên có thể sắp xếp theo: mới nhất, cũ nhất, đã ghim<br><br>   **2c. Chỉnh sửa ghi chú:**<br>   - Học viên click vào một ghi chú từ danh sách hoặc trên trang học<br>   - Hệ thống hiển thị form chỉnh sửa với nội dung hiện tại<br>   - Học viên chỉnh sửa nội dung hoặc thay đổi trạng thái ghim<br>   - Học viên click "Lưu thay đổi"<br>   - Hệ thống validate: nội dung không vượt quá 10000 ký tự<br>   - Hệ thống cập nhật ghi chú trong database<br>   - Hệ thống cập nhật updated_at<br>   - Hệ thống thông báo "Cập nhật ghi chú thành công"<br><br>   **2d. Xóa ghi chú:**<br>   - Học viên click nút "Xóa" trên một ghi chú<br>   - Hệ thống xác nhận "Bạn có chắc chắn muốn xóa ghi chú này?"<br>   - Học viên xác nhận<br>   - Hệ thống xóa ghi chú khỏi database<br>   - Hệ thống thông báo "Xóa ghi chú thành công"<br>   - Hệ thống cập nhật danh sách ghi chú |
| **Luồng thay thế** | **2a. Nội dung ghi chú quá dài (> 10000 ký tự):**<br>- Hệ thống thông báo "Ghi chú không được vượt quá 10000 ký tự"<br>- Học viên rút ngắn nội dung<br><br>**2c. Ghi chú không tồn tại hoặc không thuộc về học viên:**<br>- Hệ thống thông báo "Ghi chú không tồn tại" hoặc "Bạn không có quyền chỉnh sửa ghi chú này"<br>- Hệ thống trả về lỗi 404 hoặc 403<br><br>**2d. Học viên hủy xóa:**<br>- Hệ thống không thực hiện xóa<br>- Hệ thống đóng dialog xác nhận |

## Sơ đồ Hoạt động - Tạo lộ trình học tập với AI

```mermaid
flowchart TD
    Start([Bắt đầu]) --> AccessPage[Truy cập trang<br/>Tạo lộ trình học tập]
    AccessPage --> ShowForm[Hiển thị form:<br/>- Phong cách học<br/>- Thời gian học<br/>- Mức độ kỹ năng<br/>- Thời lượng<br/>- Chủ đề quan tâm]
    ShowForm --> FillForm[Học viên điền thông tin]
    FillForm --> ValidateForm{Kiểm tra<br/>hợp lệ?}
    
    ValidateForm -->|Thiếu chủ đề| ShowError1[Hiển thị: Vui lòng nhập<br/>ít nhất một chủ đề]
    ShowError1 --> FillForm
    
    ValidateForm -->|Hợp lệ| SubmitForm[Học viên click<br/>Tạo lộ trình]
    SubmitForm --> GetUserContext[Lấy ngữ cảnh người dùng:<br/>- Khóa học hiện tại<br/>- Tiến độ]
    GetUserContext --> BuildPrompt[Xây dựng prompt chi tiết<br/>cho AI với thông tin người học]
    BuildPrompt --> CallGemini[Gọi Google Gemini API<br/>với fallback models]
    
    CallGemini --> CheckResponse{Response<br/>thành công?}
    CheckResponse -->|Không| TryFallback[Thử model khác:<br/>gemini-pro-vision<br/>gemini-1.5-pro]
    TryFallback --> CheckResponse
    
    CheckResponse -->|Tất cả thất bại| ShowError2[Hiển thị: Lỗi khi tạo lộ trình<br/>Vui lòng thử lại sau]
    ShowError2 --> End1([Kết thúc])
    
    CheckResponse -->|Thành công| SaveInteraction[Lưu lịch sử tương tác AI<br/>interaction_type: roadmap]
    SaveInteraction --> DisplayRoadmap[Hiển thị lộ trình<br/>dưới dạng markdown]
    DisplayRoadmap --> UserAction{Học viên<br/>thực hiện?}
    
    UserAction -->|Lưu lộ trình| SaveRoadmap[Lưu lộ trình<br/>tùy chọn]
    UserAction -->|Chia sẻ| ShareRoadmap[Chia sẻ lộ trình<br/>tùy chọn]
    UserAction -->|Tạo mới| ShowForm
    UserAction -->|Xem xong| End2([Kết thúc])
    
    SaveRoadmap --> End2
    ShareRoadmap --> End2
    
    style Start fill:#4A90E2,stroke:#2E5C8A,stroke-width:2px,color:#fff
    style End1 fill:#FF6B6B,stroke:#CC5555,stroke-width:2px,color:#fff
    style End2 fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style CallGemini fill:#FF6B6B,stroke:#CC5555,stroke-width:2px
    style DisplayRoadmap fill:#10A37F,stroke:#0A7A5F,stroke-width:2px
```

## Sơ đồ Hoạt động - Chat với người dùng khác

```mermaid
flowchart TD
    Start([Bắt đầu]) --> AccessChat[Truy cập trang Chat]
    AccessChat --> LoadConversations[Tải danh sách cuộc trò chuyện<br/>gần đây]
    LoadConversations --> ShowConversations[Hiển thị danh sách<br/>sắp xếp theo last_message_at]
    
    ShowConversations --> UserAction{Học viên<br/>thực hiện?}
    
    UserAction -->|Tìm kiếm người dùng| SearchUsers[Nhập từ khóa<br/>tên/email/MSSV]
    UserAction -->|Click cuộc trò chuyện| SelectConversation[Chọn cuộc trò chuyện]
    
    SearchUsers --> ValidateSearch{Từ khóa<br/>>= 2 ký tự?}
    ValidateSearch -->|Không| ShowError1[Hiển thị: Nhập ít nhất<br/>2 ký tự]
    ValidateSearch -->|Có| SearchDB[Tìm kiếm trong database<br/>first_name, last_name, email, student_id]
    
    SearchDB --> CheckResults{Có kết quả?}
    CheckResults -->|Không| ShowError2[Hiển thị: Không tìm thấy<br/>người dùng]
    CheckResults -->|Có| ShowUserList[Hiển thị danh sách<br/>người dùng limit 10]
    ShowUserList --> SelectUser[Click vào người dùng]
    
    SelectUser --> CheckSelf{Có phải<br/>chính mình?}
    CheckSelf -->|Có| ShowError3[Hiển thị: Không thể chat<br/>với chính mình]
    CheckSelf -->|Không| GetOrCreateConversation[Tạo hoặc lấy<br/>conversation]
    
    SelectConversation --> GetOrCreateConversation
    GetOrCreateConversation --> LoadMessages[Tải lịch sử tin nhắn<br/>limit 100]
    LoadMessages --> MarkRead[Đánh dấu tin nhắn đã đọc<br/>Reset unread_count]
    MarkRead --> ShowMessages[Hiển thị tin nhắn<br/>sắp xếp theo thời gian]
    
    ShowMessages --> TypeMessage[Học viên nhập tin nhắn]
    TypeMessage --> SendMessage[Gửi tin nhắn]
    SendMessage --> SendSocket[Gửi qua Socket.IO<br/>real-time]
    SendSocket --> SaveMessage[Lưu tin nhắn vào database]
    SaveMessage --> UpdateConversation[Cập nhật conversation:<br/>last_message_at<br/>last_message_id<br/>unread_count]
    UpdateConversation --> CheckOnline{Người nhận<br/>đang online?}
    
    CheckOnline -->|Có| ReceiveRealTime[Người nhận nhận<br/>tin nhắn ngay lập tức]
    CheckOnline -->|Không| StoreMessage[Lưu tin nhắn<br/>người nhận xem sau]
    
    ReceiveRealTime --> AutoScroll[Tự động scroll<br/>đến tin nhắn mới]
    StoreMessage --> AutoScroll
    AutoScroll --> End([Kết thúc])
    
    style Start fill:#4A90E2,stroke:#2E5C8A,stroke-width:2px,color:#fff
    style End fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style SendSocket fill:#9B59B6,stroke:#7D3C98,stroke-width:2px
    style ReceiveRealTime fill:#10A37F,stroke:#0A7A5F,stroke-width:2px
```

## Sơ đồ Hoạt động - Xem và quản lý profile

```mermaid
flowchart TD
    Start([Bắt đầu]) --> AccessProfile[Truy cập trang Profile]
    AccessProfile --> LoadProfile[Tải thông tin profile]
    LoadProfile --> DisplayProfile[Hiển thị thông tin:<br/>- Họ tên, email, MSSV<br/>- Avatar<br/>- Vai trò, ngày tham gia]
    
    DisplayProfile --> UserAction{Học viên<br/>thực hiện?}
    
    UserAction -->|Cập nhật thông tin| EditInfo[Chỉnh sửa họ tên, MSSV]
    UserAction -->|Thay đổi avatar| ChangeAvatar[Click thay đổi avatar]
    UserAction -->|Đổi mật khẩu| ChangePassword[Click đổi mật khẩu]
    
    EditInfo --> ValidateInfo{Kiểm tra<br/>hợp lệ?}
    ValidateInfo -->|Không| ShowError1[Hiển thị lỗi validation]
    ValidateInfo -->|Có| UpdateInfo[Cập nhật thông tin<br/>trong database]
    UpdateInfo --> ShowSuccess1[Thông báo: Cập nhật thành công]
    
    ChangeAvatar --> SelectFile[Chọn file ảnh]
    SelectFile --> CheckFile{Kiểm tra file?}
    CheckFile -->|Không phải ảnh| ShowError2[Hiển thị: Vui lòng chọn<br/>file ảnh hợp lệ]
    CheckFile -->|Quá lớn| ShowError3[Hiển thị: File quá lớn<br/>tối đa 5MB]
    CheckFile -->|Hợp lệ| ResizeImage[Resize và optimize ảnh<br/>200x200px]
    ResizeImage --> SaveAvatar[Lưu avatar vào<br/>uploads/avatars]
    SaveAvatar --> UpdateAvatarDB[Cập nhật đường dẫn<br/>avatar trong database]
    UpdateAvatarDB --> ShowSuccess2[Thông báo: Đổi avatar thành công]
    
    ChangePassword --> EnterOldPass[Nhập mật khẩu cũ]
    EnterOldPass --> EnterNewPass[Nhập mật khẩu mới<br/>và xác nhận]
    EnterNewPass --> ValidatePassword{Kiểm tra<br/>hợp lệ?}
    ValidatePassword -->|Mật khẩu cũ sai| ShowError4[Hiển thị: Mật khẩu cũ<br/>không đúng]
    ValidatePassword -->|Mật khẩu mới yếu| ShowError5[Hiển thị: Mật khẩu mới<br/>phải >= 8 ký tự]
    ValidatePassword -->|Xác nhận không khớp| ShowError6[Hiển thị: Mật khẩu xác nhận<br/>không khớp]
    ValidatePassword -->|Hợp lệ| VerifyOldPass[Xác thực mật khẩu cũ<br/>bằng bcrypt]
    VerifyOldPass --> HashNewPass[Hash mật khẩu mới<br/>bằng bcrypt]
    HashNewPass --> UpdatePasswordDB[Lưu mật khẩu mới<br/>vào database]
    UpdatePasswordDB --> ShowSuccess3[Thông báo: Đổi mật khẩu thành công]
    
    ShowSuccess1 --> End([Kết thúc])
    ShowSuccess2 --> End
    ShowSuccess3 --> End
    ShowError1 --> DisplayProfile
    ShowError2 --> DisplayProfile
    ShowError3 --> DisplayProfile
    ShowError4 --> DisplayProfile
    ShowError5 --> DisplayProfile
    ShowError6 --> DisplayProfile
    
    style Start fill:#4A90E2,stroke:#2E5C8A,stroke-width:2px,color:#fff
    style End fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style UpdateInfo fill:#10A37F,stroke:#0A7A5F,stroke-width:2px
    style SaveAvatar fill:#10A37F,stroke:#0A7A5F,stroke-width:2px
    style UpdatePasswordDB fill:#10A37F,stroke:#0A7A5F,stroke-width:2px
```

## Sơ đồ Hoạt động - Xem blog và bình luận

```mermaid
flowchart TD
    Start([Bắt đầu]) --> AccessBlog[Truy cập trang Blog]
    AccessBlog --> LoadBlogs[Tải danh sách blog<br/>với phân trang]
    LoadBlogs --> DisplayBlogList[Hiển thị danh sách:<br/>- Tiêu đề, mô tả<br/>- Hình ảnh, tác giả<br/>- Ngày đăng, lượt xem]
    
    DisplayBlogList --> ClickBlog[Click vào một blog]
    ClickBlog --> LoadBlogDetail[Tải thông tin blog<br/>Tăng view_count]
    LoadBlogDetail --> CheckPublished{Blog đã<br/>published?}
    
    CheckPublished -->|Không| Show404[Hiển thị lỗi 404]
    CheckPublished -->|Có| DisplayBlog[Hiển thị blog:<br/>- Nội dung đầy đủ<br/>- Tác giả, ngày đăng<br/>- Danh sách bình luận]
    
    DisplayBlog --> UserAction{Học viên<br/>thực hiện?}
    
    UserAction -->|Đọc bình luận| ScrollComments[Cuộn đến phần<br/>bình luận]
    UserAction -->|Viết bình luận| WriteComment[Nhập nội dung<br/>bình luận]
    UserAction -->|Trả lời bình luận| ReplyComment[Click Trả lời<br/>trên bình luận gốc]
    
    ScrollComments --> LoadComments[Tải bình luận<br/>với phân trang 5/trang]
    LoadComments --> DisplayComments[Hiển thị bình luận:<br/>- Bình luận gốc<br/>- Trả lời cho mỗi bình luận]
    
    WriteComment --> ValidateComment1{Nội dung<br/>hợp lệ?}
    ValidateComment1 -->|Rỗng hoặc > 5000 ký tự| ShowError1[Hiển thị lỗi validation]
    ValidateComment1 -->|Hợp lệ| SaveComment1[Lưu bình luận<br/>parent_id: null]
    SaveComment1 --> ShowComment1[Hiển thị bình luận<br/>ngay lập tức]
    ShowComment1 --> NotifyAuthor1[Gửi notification<br/>cho tác giả blog]
    
    ReplyComment --> WriteReply[Nhập nội dung<br/>trả lời]
    WriteReply --> CheckParent{Bình luận gốc<br/>hay con?}
    CheckParent -->|Bình luận con| ShowError2[Hiển thị: Không thể<br/>trả lời bình luận con]
    CheckParent -->|Bình luận gốc| ValidateReply{Nội dung<br/>hợp lệ?}
    ValidateReply -->|Không| ShowError3[Hiển thị lỗi validation]
    ValidateReply -->|Có| SaveReply[Lưu bình luận<br/>parent_id = id gốc]
    SaveReply --> ShowReply[Hiển thị trả lời<br/>dưới bình luận gốc]
    ShowReply --> NotifyAuthor2[Gửi notification<br/>cho người viết bình luận gốc]
    
    Show404 --> End1([Kết thúc])
    DisplayComments --> End2([Kết thúc])
    ShowComment1 --> End2
    ShowReply --> End2
    NotifyAuthor1 --> End2
    NotifyAuthor2 --> End2
    
    style Start fill:#4A90E2,stroke:#2E5C8A,stroke-width:2px,color:#fff
    style End1 fill:#FF6B6B,stroke:#CC5555,stroke-width:2px,color:#fff
    style End2 fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style SaveComment1 fill:#10A37F,stroke:#0A7A5F,stroke-width:2px
    style SaveReply fill:#10A37F,stroke:#0A7A5F,stroke-width:2px
```

## Sơ đồ Hoạt động - Tạo và quản lý ghi chú cá nhân

```mermaid
flowchart TD
    Start([Bắt đầu]) --> AccessNotes[Truy cập trang học<br/>hoặc Ghi chú cá nhân]
    AccessNotes --> UserAction{Học viên<br/>thực hiện?}
    
    UserAction -->|Tạo ghi chú| CreateNote[Click Thêm ghi chú]
    UserAction -->|Xem danh sách| ViewList[Truy cập trang<br/>Ghi chú cá nhân]
    UserAction -->|Chỉnh sửa| EditNote[Click vào ghi chú]
    UserAction -->|Xóa| DeleteNote[Click nút Xóa]
    
    CreateNote --> ShowForm[Hiển thị form ghi chú]
    ShowForm --> FillNote[Nhập nội dung ghi chú<br/>tối đa 10000 ký tự]
    FillNote --> TogglePin{Đánh dấu<br/>Ghim?}
    TogglePin -->|Có| SetPinned[is_pinned = true]
    TogglePin -->|Không| SetPinned[is_pinned = false]
    SetPinned --> SaveNote[Click Lưu ghi chú]
    SaveNote --> CheckExists{Ghi chú đã<br/>tồn tại?}
    CheckExists -->|Chưa| CreateNew[Tạo ghi chú mới<br/>liên kết content_id, course_id]
    CheckExists -->|Đã có| UpdateExisting[Cập nhật ghi chú<br/>hiện tại]
    CreateNew --> SaveDB[Lưu vào database]
    UpdateExisting --> SaveDB
    SaveDB --> ShowSaved[Hiển thị ghi chú đã lưu]
    
    ViewList --> LoadAllNotes[Tải tất cả ghi chú<br/>của học viên]
    LoadAllNotes --> FilterNotes{Lọc theo<br/>khóa học?}
    FilterNotes -->|Có| ApplyFilter[Áp dụng bộ lọc]
    FilterNotes -->|Không| DisplayList[Hiển thị danh sách:<br/>- Nội dung preview<br/>- Khóa học, nội dung liên quan<br/>- Ngày tạo/cập nhật<br/>- Trạng thái ghim]
    ApplyFilter --> DisplayList
    
    EditNote --> LoadNote[Tải nội dung ghi chú]
    LoadNote --> CheckOwnership{Ghi chú thuộc<br/>về học viên?}
    CheckOwnership -->|Không| ShowError1[Hiển thị: Không có quyền<br/>chỉnh sửa]
    CheckOwnership -->|Có| ShowEditForm[Hiển thị form<br/>chỉnh sửa]
    ShowEditForm --> EditContent[Chỉnh sửa nội dung<br/>hoặc thay đổi ghim]
    EditContent --> ValidateEdit{Nội dung<br/><= 10000 ký tự?}
    ValidateEdit -->|Không| ShowError2[Hiển thị: Vượt quá<br/>10000 ký tự]
    ValidateEdit -->|Có| UpdateNote[Cập nhật ghi chú<br/>trong database]
    UpdateNote --> UpdateTimestamp[Cập nhật updated_at]
    UpdateTimestamp --> ShowSuccess1[Thông báo: Cập nhật<br/>thành công]
    
    DeleteNote --> ConfirmDelete{Xác nhận<br/>xóa?}
    ConfirmDelete -->|Hủy| CancelDelete[Hủy xóa]
    ConfirmDelete -->|Xác nhận| DeleteDB[Xóa ghi chú<br/>khỏi database]
    DeleteDB --> UpdateList[Cập nhật danh sách]
    UpdateList --> ShowSuccess2[Thông báo: Xóa<br/>thành công]
    
    ShowSaved --> End([Kết thúc])
    DisplayList --> End
    ShowSuccess1 --> End
    ShowSuccess2 --> End
    ShowError1 --> End
    ShowError2 --> End
    CancelDelete --> End
    
    style Start fill:#4A90E2,stroke:#2E5C8A,stroke-width:2px,color:#fff
    style End fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style CreateNew fill:#10A37F,stroke:#0A7A5F,stroke-width:2px
    style UpdateNote fill:#10A37F,stroke:#0A7A5F,stroke-width:2px
    style DeleteDB fill:#FF6B6B,stroke:#CC5555,stroke-width:2px
```

## Sơ đồ Tuần tự - Tạo lộ trình học tập với AI

```mermaid
sequenceDiagram
    participant HV as Học viên
    participant HT as Hệ thống
    participant Gemini as Google Gemini API

    HV->>HT: Truy cập trang Tạo lộ trình học tập
    HT-->>HV: Hiển thị form với các trường:<br/>- Phong cách học<br/>- Thời gian học<br/>- Mức độ kỹ năng<br/>- Thời lượng<br/>- Chủ đề quan tâm
    
    HV->>HT: Điền thông tin và click "Tạo lộ trình"
    HT->>HT: Kiểm tra validation (chủ đề bắt buộc)
    
    alt Thiếu chủ đề
        HT-->>HV: Thông báo: Vui lòng nhập ít nhất một chủ đề
    else Thông tin hợp lệ
        HT->>HT: Lấy ngữ cảnh người dùng (khóa học, tiến độ)
        HT->>HT: Xây dựng prompt chi tiết cho AI
        
        HT->>Gemini: Gọi API với prompt (thử gemini-pro)
        
        alt Gemini API thành công
            Gemini-->>HT: Trả về lộ trình học tập (markdown)
            HT->>HT: Lưu lịch sử tương tác AI (interaction_type: roadmap)
            HT-->>HV: Hiển thị lộ trình đã tạo
        else Gemini API thất bại
            HT->>Gemini: Thử model khác (gemini-pro-vision)
            
            alt Thành công với model khác
                Gemini-->>HT: Trả về lộ trình
                HT->>HT: Lưu lịch sử
                HT-->>HV: Hiển thị lộ trình
            else Tất cả models thất bại
                HT-->>HV: Thông báo: Lỗi khi tạo lộ trình, vui lòng thử lại sau
            end
        end
        
        HV->>HV: Xem lộ trình
        
        alt Lưu hoặc chia sẻ
            HV->>HT: Click "Lưu" hoặc "Chia sẻ"
            HT->>HT: Lưu hoặc chia sẻ lộ trình (tùy chọn)
        end
    end
```

## Sơ đồ Tuần tự - Chat với người dùng khác

```mermaid
sequenceDiagram
    participant HV1 as Học viên 1
    participant HT as Hệ thống
    participant Socket as Socket.IO
    participant HV2 as Học viên 2

    HV1->>HT: Truy cập trang Chat
    HT->>HT: Tải danh sách cuộc trò chuyện gần đây
    HT-->>HV1: Hiển thị danh sách cuộc trò chuyện
    
    alt Tìm kiếm người dùng mới
        HV1->>HT: Nhập từ khóa tìm kiếm (tên/email/MSSV)
        HT->>HT: Tìm kiếm người dùng (>= 2 ký tự)
        
        alt Không tìm thấy
            HT-->>HV1: Thông báo: Không tìm thấy người dùng
        else Tìm thấy
            HT-->>HV1: Hiển thị danh sách người dùng
            HV1->>HT: Click vào một người dùng
            HT->>HT: Kiểm tra không phải chính mình
            HT->>HT: Tạo hoặc lấy conversation
        end
    else Chọn cuộc trò chuyện có sẵn
        HV1->>HT: Click vào cuộc trò chuyện
        HT->>HT: Lấy conversation hiện tại
    end
    
    HT->>HT: Tải lịch sử tin nhắn (limit 100)
    HT->>HT: Đánh dấu tin nhắn đã đọc, reset unread_count
    HT-->>HV1: Hiển thị lịch sử tin nhắn
    
    HV1->>HT: Nhập và gửi tin nhắn
    HT->>Socket: Gửi tin nhắn qua Socket.IO
    HT->>HT: Lưu tin nhắn vào database
    HT->>HT: Cập nhật conversation (last_message_at, unread_count)
    
    alt Học viên 2 đang online
        Socket->>HV2: Gửi tin nhắn real-time
        HV2->>HV2: Nhận và hiển thị tin nhắn ngay lập tức
    else Học viên 2 không online
        Note over HT: Tin nhắn được lưu, HV2 sẽ thấy khi đăng nhập lại
    end
    
    HT-->>HV1: Tự động scroll đến tin nhắn mới nhất
```

## Sơ đồ Tuần tự - Xem và quản lý profile

```mermaid
sequenceDiagram
    participant HV as Học viên
    participant HT as Hệ thống

    HV->>HT: Truy cập trang Profile
    HT->>HT: Tải thông tin profile
    HT-->>HV: Hiển thị thông tin: họ tên, email, MSSV, avatar, vai trò
    
    alt Cập nhật thông tin
        HV->>HT: Chỉnh sửa họ tên, MSSV
        HV->>HT: Click "Lưu thay đổi"
        HT->>HT: Validate thông tin
        HT->>HT: Cập nhật trong database
        HT-->>HV: Thông báo: Cập nhật thành công
    else Thay đổi avatar
        HV->>HT: Chọn file ảnh
        HT->>HT: Kiểm tra file (loại, kích thước)
        
        alt File không hợp lệ
            HT-->>HV: Thông báo lỗi: File không hợp lệ hoặc quá lớn
        else File hợp lệ
            HT->>HT: Resize và optimize ảnh (200x200px)
            HT->>HT: Lưu vào uploads/avatars
            HT->>HT: Cập nhật đường dẫn avatar trong database
            HT-->>HV: Thông báo: Đổi avatar thành công
            HT-->>HV: Hiển thị avatar mới
        end
    else Đổi mật khẩu
        HV->>HT: Nhập mật khẩu cũ và mật khẩu mới
        HT->>HT: Validate (mật khẩu mới >= 8 ký tự, xác nhận khớp)
        
        alt Validation thất bại
            HT-->>HV: Thông báo lỗi validation
        else Validation thành công
            HT->>HT: Xác thực mật khẩu cũ bằng bcrypt
            
            alt Mật khẩu cũ sai
                HT-->>HV: Thông báo: Mật khẩu cũ không đúng
            else Mật khẩu cũ đúng
                HT->>HT: Hash mật khẩu mới bằng bcrypt
                HT->>HT: Lưu mật khẩu mới vào database
                HT-->>HV: Thông báo: Đổi mật khẩu thành công
            end
        end
    end
```

## Sơ đồ Tuần tự - Xem blog và bình luận

```mermaid
sequenceDiagram
    participant HV as Học viên
    participant HT as Hệ thống

    HV->>HT: Truy cập trang Blog
    HT->>HT: Tải danh sách blog với phân trang
    HT-->>HV: Hiển thị danh sách blog
    
    HV->>HT: Click vào một blog
    HT->>HT: Tải thông tin blog và tăng view_count
    HT->>HT: Kiểm tra blog đã published
    
    alt Blog chưa published
        HT-->>HV: Hiển thị lỗi 404
    else Blog đã published
        HT->>HT: Tải bình luận (phân trang 5/trang)
        HT-->>HV: Hiển thị blog chi tiết với bình luận
        
        HV->>HV: Xem blog và bình luận
        
        alt Viết bình luận mới
            HV->>HT: Nhập nội dung và gửi bình luận
            HT->>HT: Validate (không rỗng, <= 5000 ký tự)
            
            alt Validation thất bại
                HT-->>HV: Thông báo lỗi validation
            else Validation thành công
                HT->>HT: Lưu bình luận (parent_id: null)
                HT-->>HV: Hiển thị bình luận ngay lập tức
                HT->>HT: Gửi notification cho tác giả blog (nếu có)
            end
        else Trả lời bình luận
            HV->>HT: Click "Trả lời" trên bình luận gốc
            HT-->>HV: Hiển thị form trả lời
            HV->>HT: Nhập nội dung và gửi trả lời
            HT->>HT: Kiểm tra bình luận gốc (không phải bình luận con)
            
            alt Là bình luận con
                HT-->>HV: Thông báo: Không thể trả lời bình luận con
            else Là bình luận gốc
                HT->>HT: Validate nội dung
                HT->>HT: Lưu bình luận (parent_id = id bình luận gốc)
                HT-->>HV: Hiển thị trả lời dưới bình luận gốc
                HT->>HT: Gửi notification cho người viết bình luận gốc
            end
        end
    end
```

## Sơ đồ Tuần tự - Tạo và quản lý ghi chú cá nhân

```mermaid
sequenceDiagram
    participant HV as Học viên
    participant HT as Hệ thống

    HV->>HT: Truy cập trang học nội dung hoặc Ghi chú cá nhân
    
    alt Tạo ghi chú mới
        HV->>HT: Click "Thêm ghi chú"
        HT-->>HV: Hiển thị form ghi chú
        HV->>HT: Nhập nội dung (tối đa 10000 ký tự) và đánh dấu ghim
        HV->>HT: Click "Lưu ghi chú"
        HT->>HT: Kiểm tra ghi chú đã tồn tại cho nội dung này
        
        alt Ghi chú chưa tồn tại
            HT->>HT: Tạo ghi chú mới (liên kết content_id, course_id)
        else Ghi chú đã tồn tại
            HT->>HT: Cập nhật ghi chú hiện tại
        end
        
        HT->>HT: Lưu vào database
        HT-->>HV: Hiển thị ghi chú đã lưu
    else Xem danh sách ghi chú
        HV->>HT: Truy cập trang Ghi chú cá nhân
        HT->>HT: Tải tất cả ghi chú của học viên
        
        alt Lọc theo khóa học
            HV->>HT: Chọn khóa học từ bộ lọc
            HT->>HT: Áp dụng bộ lọc
        end
        
        HT-->>HV: Hiển thị danh sách ghi chú với thông tin đầy đủ
    else Chỉnh sửa ghi chú
        HV->>HT: Click vào một ghi chú
        HT->>HT: Tải nội dung ghi chú
        HT->>HT: Kiểm tra quyền sở hữu
        
        alt Không có quyền
            HT-->>HV: Thông báo: Không có quyền chỉnh sửa
        else Có quyền
            HT-->>HV: Hiển thị form chỉnh sửa
            HV->>HT: Chỉnh sửa nội dung hoặc thay đổi ghim
            HV->>HT: Click "Lưu thay đổi"
            HT->>HT: Validate (<= 10000 ký tự)
            HT->>HT: Cập nhật ghi chú trong database
            HT->>HT: Cập nhật updated_at
            HT-->>HV: Thông báo: Cập nhật thành công
        end
    else Xóa ghi chú
        HV->>HT: Click nút "Xóa"
        HT-->>HV: Hiển thị dialog xác nhận
        
        alt Học viên xác nhận
            HV->>HT: Xác nhận xóa
            HT->>HT: Xóa ghi chú khỏi database
            HT->>HT: Cập nhật danh sách
            HT-->>HV: Thông báo: Xóa thành công
        else Học viên hủy
            HT-->>HV: Đóng dialog, không xóa
        end
    end
```

---

**🏛️ Trường Đại học Công nghệ Thông tin**  
**🌍 Đại học Quốc gia TP. Hồ Chí Minh**
