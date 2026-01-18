# 3.5. Use Case Cuối cùng

## UC-16: Xem chứng chỉ hoàn thành

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Học viên xem chứng chỉ hoàn thành |
| **ID** | UC-16 |
| **Tác nhân** | Học viên |
| **Mô tả tóm tắt** | Học viên xem và tải xuống chứng chỉ PDF khi đã hoàn thành khóa học (progress = 100%) |
| **Tiền điều kiện** | - Học viên đã đăng nhập<br>- Học viên đã hoàn thành khóa học (enrollment status = "completed", progress_percentage = 100%)<br>- Chứng chỉ đã được tạo tự động khi hoàn thành khóa học |
| **Hậu điều kiện** | - Học viên đã xem hoặc tải xuống chứng chỉ<br>- View count của chứng chỉ có thể được tăng (nếu có tracking) |
| **Luồng sự kiện** | 1. Học viên truy cập trang "Chứng chỉ" hoặc từ trang khóa học đã hoàn thành<br>2. Hệ thống tải danh sách chứng chỉ của học viên (liên kết với user_id)<br>3. Hệ thống hiển thị danh sách chứng chỉ với:<br>   - Tên khóa học<br>   - Hình ảnh khóa học (thumbnail)<br>   - Ngày hoàn thành (issued_at)<br>   - Số chứng chỉ (certificate_number)<br>4. Học viên click vào một chứng chỉ để xem chi tiết<br>5. Hệ thống tải thông tin chi tiết chứng chỉ:<br>   - Tên khóa học đầy đủ<br>   - Tên học viên<br>   - Tên giảng viên<br>   - Ngày cấp chứng chỉ (issued_at)<br>   - Số chứng chỉ (certificate_number)<br>   - Đường dẫn PDF (pdf_path)<br>6. Hệ thống kiểm tra file PDF có tồn tại không<br>7. **Nếu PDF tồn tại:**<br>   7a. Hệ thống hiển thị preview chứng chỉ hoặc thông tin chứng chỉ<br>   7b. Học viên có thể click "Tải xuống" để tải file PDF<br>   7c. Hệ thống trả về file PDF để tải xuống<br><br>8. **Nếu PDF không tồn tại (file bị mất):**<br>   8a. Hệ thống tự động tạo lại PDF chứng chỉ<br>   8b. Hệ thống lưu PDF mới vào thư mục uploads/certificates<br>   8c. Hệ thống cập nhật pdf_path trong database<br>   8d. Hệ thống hiển thị và cho phép tải xuống |
| **Luồng thay thế** | **2a. Không có chứng chỉ nào:**<br>- Hệ thống hiển thị thông báo "Bạn chưa có chứng chỉ nào"<br>- Hệ thống gợi ý "Hoàn thành khóa học để nhận chứng chỉ"<br>- Hệ thống hiển thị danh sách khóa học đang học<br><br>**5a. Chứng chỉ không tồn tại trong database:**<br>- Hệ thống hiển thị lỗi 404 "Chứng chỉ không tồn tại"<br>- Hệ thống gợi ý quay lại danh sách chứng chỉ<br><br>**7c. Lỗi khi tải xuống PDF:**<br>- Hệ thống thông báo "Lỗi khi tải xuống chứng chỉ"<br>- Hệ thống gợi ý thử lại hoặc liên hệ hỗ trợ |

## UC-17: Xem thống kê học tập chi tiết

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Học viên xem thống kê học tập chi tiết |
| **ID** | UC-17 |
| **Tác nhân** | Học viên |
| **Mô tả tóm tắt** | Học viên xem thống kê chi tiết về quá trình học tập của mình bao gồm tổng quan, theo khóa học, và theo thời gian để đánh giá tiến độ học tập |
| **Tiền điều kiện** | - Học viên đã đăng nhập<br>- Học viên đã có hoạt động học tập (đã đăng ký ít nhất một khóa học) |
| **Hậu điều kiện** | - Học viên đã xem thống kê học tập chi tiết<br>- Học viên có thể đã export thống kê (nếu có chức năng) |
| **Luồng sự kiện** | 1. Học viên truy cập trang "Thống kê" hoặc "Tiến độ học tập"<br>2. Hệ thống tải dữ liệu học tập của học viên<br>3. Hệ thống tính toán và hiển thị các thống kê:<br>   **3a. Thống kê tổng quan:**<br>   - Tổng số khóa học đã đăng ký (tất cả enrollments)<br>   - Số khóa học đang học (status = "active")<br>   - Số khóa học đã hoàn thành (status = "completed")<br>   - Tổng thời gian học tập (tính từ total_time_spent trong Enrollment, đơn vị: giờ/phút)<br>   - Tiến độ trung bình (% trung bình của tất cả enrollments)<br><br>   **3b. Thống kê theo khóa học:**<br>   - Danh sách từng khóa học với:<br>     * Tên khóa học<br>     * Tiến độ (progress_percentage)<br>     * Thời gian học (total_time_spent)<br>     * Số bài học đã hoàn thành (tính từ Progress records với status = "completed")<br>     * Trạng thái (active, completed, dropped)<br>     * Ngày đăng ký và ngày hoàn thành (nếu có)<br><br>   **3c. Thống kê theo thời gian:**<br>   - Biểu đồ thời gian học theo ngày (30 ngày gần nhất)<br>   - Dữ liệu: ngày và tổng thời gian học trong ngày đó<br>   - Xu hướng học tập (tăng/giảm theo thời gian)<br>   - Có thể xem theo: ngày, tuần, tháng<br>4. Hệ thống hiển thị các biểu đồ và bảng thống kê<br>5. Học viên có thể:<br>   - Xem chi tiết từng khóa học<br>   - Xem biểu đồ thời gian học<br>   - Export thống kê dạng CSV hoặc PDF (nếu có chức năng)<br>   - Lọc theo khoảng thời gian |
| **Luồng thay thế** | **2a. Học viên chưa có hoạt động học tập:**<br>- Hệ thống hiển thị thông báo "Bạn chưa có hoạt động học tập nào"<br>- Hệ thống gợi ý "Khám phá khóa học" hoặc "Xem danh sách khóa học"<br><br>**3c. Không có dữ liệu trong 30 ngày gần nhất:**<br>- Hệ thống hiển thị "Chưa có dữ liệu trong 30 ngày gần nhất"<br>- Hệ thống có thể mở rộng khoảng thời gian hoặc hiển thị thông báo khuyến khích học tập |

## UC-18: Đánh giá khóa học

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Học viên đánh giá khóa học |
| **ID** | UC-18 |
| **Tác nhân** | Học viên |
| **Mô tả tóm tắt** | Học viên đánh giá và để lại nhận xét cho khóa học đã học để giúp học viên khác và cải thiện chất lượng khóa học |
| **Tiền điều kiện** | - Học viên đã đăng nhập<br>- Học viên đã đăng ký khóa học<br>- Học viên đã hoàn thành khóa học (status = "completed") hoặc đã học một phần (tùy chính sách) |
| **Hậu điều kiện** | - Đánh giá đã được lưu vào database<br>- Rating trung bình của khóa học đã được cập nhật<br>- Đánh giá được hiển thị công khai trên trang chi tiết khóa học |
| **Luồng sự kiện** | 1. Học viên truy cập trang chi tiết khóa học đã đăng ký<br>2. Học viên click "Đánh giá khóa học" hoặc "Viết đánh giá"<br>3. Hệ thống kiểm tra học viên đã đánh giá chưa<br>4. **Nếu chưa đánh giá:**<br>   4a. Hệ thống hiển thị form đánh giá<br>   4b. Học viên chọn số sao (1-5 sao) bằng cách click vào các ngôi sao<br>   4c. Học viên viết nhận xét (tùy chọn, có thể để trống)<br>   4d. Học viên click "Gửi đánh giá"<br>   4e. Hệ thống validate:<br>       - Rating phải từ 1 đến 5<br>       - Review không vượt quá độ dài tối đa (nếu có)<br>   4f. Hệ thống tạo Rating record mới:<br>       - user_id, course_id<br>       - rating (1-5)<br>       - review (text, có thể null)<br>       - is_verified = true (vì học viên đã hoàn thành khóa học)<br>   4g. Hệ thống tính lại rating trung bình của khóa học:<br>       - Lấy tất cả ratings của khóa học<br>       - Tính trung bình: tổng rating / số lượng ratings<br>       - Làm tròn đến 2 chữ số thập phân<br>   4h. Hệ thống cập nhật course.average_rating<br>   4i. Hệ thống thông báo "Cảm ơn bạn đã đánh giá khóa học!"<br>   4j. Hệ thống reload trang để hiển thị đánh giá mới<br><br>5. **Nếu đã đánh giá:**<br>   5a. Hệ thống hiển thị form với đánh giá hiện tại (số sao và nhận xét)<br>   5b. Học viên có thể chỉnh sửa đánh giá<br>   5c. Học viên click "Cập nhật đánh giá"<br>   5d. Hệ thống cập nhật Rating record hiện tại<br>   5e. Hệ thống tính lại và cập nhật average_rating<br>   5f. Hệ thống thông báo "Đánh giá đã được cập nhật!" |
| **Luồng thay thế** | **3a. Học viên chưa hoàn thành khóa học:**<br>- Hệ thống thông báo "Bạn cần hoàn thành khóa học trước khi đánh giá"<br>- Hệ thống gợi ý "Tiếp tục học để hoàn thành khóa học"<br><br>**4e. Rating không hợp lệ:**<br>- Hệ thống thông báo "Vui lòng chọn số sao đánh giá" hoặc "Đánh giá phải từ 1 đến 5 sao"<br>- Học viên chọn lại số sao<br><br>**4e. Review quá dài:**<br>- Hệ thống thông báo "Nhận xét quá dài, vui lòng rút ngắn"<br>- Học viên rút ngắn nhận xét |

## UC-19: Quên mật khẩu và đặt lại

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Học viên quên mật khẩu và đặt lại |
| **ID** | UC-19 |
| **Tác nhân** | Học viên |
| **Mô tả tóm tắt** | Học viên yêu cầu đặt lại mật khẩu khi quên mật khẩu thông qua email xác thực và token bảo mật |
| **Tiền điều kiện** | - Học viên có tài khoản trong hệ thống<br>- Học viên có email đã được xác thực (email_verified = true) |
| **Hậu điều kiện** | - Mật khẩu đã được đặt lại thành công<br>- Token reset đã được vô hiệu hóa<br>- Học viên có thể đăng nhập với mật khẩu mới |
| **Luồng sự kiện** | 1. Học viên truy cập trang đăng nhập<br>2. Học viên click "Quên mật khẩu?" hoặc "Đặt lại mật khẩu"<br>3. Hệ thống chuyển hướng đến trang "Quên mật khẩu"<br>4. Học viên nhập email vào form<br>5. Học viên click "Gửi link đặt lại mật khẩu"<br>6. Hệ thống validate email (format hợp lệ)<br>7. Hệ thống kiểm tra email có tồn tại trong database không<br>8. **Nếu email tồn tại và tài khoản active:**<br>   8a. Hệ thống tạo token reset mật khẩu (64 ký tự hex, random)<br>   8b. Hệ thống vô hiệu hóa tất cả token cũ của user (set used = true)<br>   8c. Hệ thống tạo PasswordResetToken record:<br>       - user_id<br>       - token (64 ký tự hex)<br>       - expires_at (1 giờ từ bây giờ)<br>       - used = false<br>   8d. Hệ thống tạo reset URL: {protocol}://{host}/auth/reset-password/{token}<br>   8e. Hệ thống gửi email chứa link reset mật khẩu đến email của học viên<br>   8f. Hệ thống hiển thị thông báo thành công (generic, không tiết lộ email có tồn tại hay không)<br><br>9. **Nếu email không tồn tại hoặc tài khoản không active:**<br>   9a. Hệ thống vẫn hiển thị thông báo thành công (bảo mật, không tiết lộ thông tin)<br><br>10. Học viên mở email và click link reset mật khẩu<br>11. Hệ thống xác thực token:<br>    - Kiểm tra token có tồn tại trong database<br>    - Kiểm tra token chưa được sử dụng (used = false)<br>    - Kiểm tra token chưa hết hạn (expires_at > now)<br>12. **Nếu token hợp lệ:**<br>    12a. Hệ thống hiển thị form đặt lại mật khẩu<br>    12b. Học viên nhập mật khẩu mới<br>    12c. Học viên nhập xác nhận mật khẩu mới<br>    12d. Học viên click "Đặt lại mật khẩu"<br>    12e. Hệ thống validate:<br>        - Mật khẩu không được rỗng<br>        - Mật khẩu phải có ít nhất 6 ký tự (hoặc độ dài tối thiểu khác)<br>        - Mật khẩu mới và xác nhận phải khớp<br>    12f. Hệ thống hash mật khẩu mới bằng bcrypt<br>    12g. Hệ thống cập nhật user.password với mật khẩu mới đã hash<br>    12h. Hệ thống đánh dấu token đã sử dụng (used = true)<br>    12i. Hệ thống vô hiệu hóa tất cả token khác của user (set used = true)<br>    12j. Hệ thống gửi email thông báo "Mật khẩu đã được đặt lại thành công"<br>    12k. Hệ thống thông báo "Mật khẩu đã được đặt lại thành công! Bạn có thể đăng nhập ngay bây giờ."<br>    12l. Hệ thống chuyển hướng đến trang đăng nhập<br><br>13. **Nếu token không hợp lệ hoặc hết hạn:**<br>    13a. Hệ thống thông báo "Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn."<br>    13b. Hệ thống gợi ý "Vui lòng yêu cầu lại link đặt lại mật khẩu"<br>    13c. Hệ thống chuyển hướng đến trang "Quên mật khẩu" |
| **Luồng thay thế** | **6a. Email không hợp lệ:**<br>- Hệ thống thông báo "Email không hợp lệ"<br>- Học viên nhập lại email đúng format<br><br>**8e. Email không được gửi (lỗi SMTP):**<br>- Hệ thống vẫn tạo token và lưu vào database<br>- Hệ thống ghi log lỗi để theo dõi<br>- Hệ thống có thể hiển thị token trong console (development) hoặc thông báo liên hệ hỗ trợ<br><br>**12e. Mật khẩu mới không hợp lệ:**<br>- Hệ thống thông báo lỗi validation cụ thể<br>- Học viên sửa lại mật khẩu<br><br>**12e. Mật khẩu mới và xác nhận không khớp:**<br>- Hệ thống thông báo "Mật khẩu xác nhận không khớp"<br>- Học viên nhập lại<br><br>**13a. Token đã được sử dụng:**<br>- Hệ thống thông báo "Link đặt lại mật khẩu đã được sử dụng"<br>- Hệ thống yêu cầu yêu cầu lại link mới |

## Sơ đồ Hoạt động - Xem chứng chỉ hoàn thành

```mermaid
flowchart TD
    Start([Bắt đầu]) --> AccessCertificates[Truy cập trang Chứng chỉ<br/>hoặc từ khóa học đã hoàn thành]
    AccessCertificates --> LoadCertificates[Tải danh sách chứng chỉ<br/>của học viên]
    
    LoadCertificates --> CheckCertificates{Có chứng chỉ<br/>nào?}
    CheckCertificates -->|Không| ShowEmpty[Hiển thị: Chưa có chứng chỉ nào<br/>Gợi ý: Hoàn thành khóa học]
    ShowEmpty --> End1([Kết thúc])
    
    CheckCertificates -->|Có| DisplayList[Hiển thị danh sách:<br/>- Tên khóa học<br/>- Hình ảnh<br/>- Ngày hoàn thành<br/>- Số chứng chỉ]
    DisplayList --> ClickCertificate[Click vào một chứng chỉ]
    ClickCertificate --> LoadDetail[Tải thông tin chi tiết]
    LoadDetail --> CheckPDF{File PDF<br/>tồn tại?}
    
    CheckPDF -->|Không| RegeneratePDF[Tự động tạo lại PDF<br/>chứng chỉ]
    RegeneratePDF --> SavePDF[Lưu PDF mới<br/>vào uploads/certificates]
    SavePDF --> UpdatePath[Cập nhật pdf_path<br/>trong database]
    UpdatePath --> DisplayCertificate[Hiển thị thông tin<br/>chứng chỉ]
    
    CheckPDF -->|Có| DisplayCertificate
    DisplayCertificate --> UserAction{Học viên<br/>thực hiện?}
    
    UserAction -->|Tải xuống| DownloadPDF[Tải file PDF]
    DownloadPDF --> CheckDownload{Download<br/>thành công?}
    CheckDownload -->|Không| ShowError[Hiển thị: Lỗi khi tải xuống<br/>Gợi ý: Thử lại hoặc liên hệ hỗ trợ]
    CheckDownload -->|Có| End2([Kết thúc - Đã tải xuống])
    
    UserAction -->|Xem xong| End3([Kết thúc])
    ShowError --> End4([Kết thúc])
    
    style Start fill:#4A90E2,stroke:#2E5C8A,stroke-width:2px,color:#fff
    style End1 fill:#FFA500,stroke:#CC8800,stroke-width:2px,color:#fff
    style End2 fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style End3 fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style End4 fill:#FF6B6B,stroke:#CC5555,stroke-width:2px,color:#fff
    style RegeneratePDF fill:#FFA500,stroke:#CC8800,stroke-width:2px
    style DownloadPDF fill:#10A37F,stroke:#0A7A5F,stroke-width:2px
```

## Sơ đồ Hoạt động - Xem thống kê học tập chi tiết

```mermaid
flowchart TD
    Start([Bắt đầu]) --> AccessStats[Truy cập trang Thống kê<br/>hoặc Tiến độ học tập]
    AccessStats --> LoadData[Tải dữ liệu học tập:<br/>- Enrollments<br/>- Progress<br/>- Timeline data]
    
    LoadData --> CheckActivity{Có hoạt động<br/>học tập?}
    CheckActivity -->|Không| ShowEmpty[Hiển thị: Chưa có hoạt động<br/>Gợi ý: Khám phá khóa học]
    ShowEmpty --> End1([Kết thúc])
    
    CheckActivity -->|Có| CalculateOverview[Tính toán thống kê tổng quan:<br/>- Tổng số khóa học<br/>- Đang học / Đã hoàn thành<br/>- Tổng thời gian học<br/>- Tiến độ trung bình]
    CalculateOverview --> CalculateByCourse[Tính toán theo khóa học:<br/>- Tiến độ từng khóa<br/>- Thời gian học<br/>- Số bài đã hoàn thành]
    CalculateByCourse --> CalculateTimeline[Tính toán theo thời gian:<br/>- 30 ngày gần nhất<br/>- Thời gian học theo ngày<br/>- Xu hướng học tập]
    
    CalculateTimeline --> CheckTimelineData{Có dữ liệu<br/>30 ngày?}
    CheckTimelineData -->|Không| ShowNoTimeline[Hiển thị: Chưa có dữ liệu<br/>30 ngày gần nhất]
    CheckTimelineData -->|Có| DisplayCharts[Hiển thị biểu đồ<br/>thời gian học]
    
    DisplayCharts --> DisplayStats[Hiển thị thống kê:<br/>- Tổng quan<br/>- Theo khóa học<br/>- Theo thời gian]
    ShowNoTimeline --> DisplayStats
    
    DisplayStats --> UserAction{Học viên<br/>thực hiện?}
    
    UserAction -->|Xem chi tiết khóa học| ViewCourseDetail[Chuyển đến UC-05:<br/>Xem chi tiết khóa học]
    UserAction -->|Export CSV/PDF| ExportStats[Export thống kê<br/>dạng CSV hoặc PDF]
    UserAction -->|Lọc theo thời gian| FilterTime[Lọc theo khoảng<br/>thời gian]
    UserAction -->|Xem xong| End2([Kết thúc])
    
    ViewCourseDetail --> End3([Kết thúc])
    ExportStats --> End4([Kết thúc])
    FilterTime --> CalculateTimeline
    
    style Start fill:#4A90E2,stroke:#2E5C8A,stroke-width:2px,color:#fff
    style End1 fill:#FFA500,stroke:#CC8800,stroke-width:2px,color:#fff
    style End2 fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style End3 fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style End4 fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style DisplayStats fill:#10A37F,stroke:#0A7A5F,stroke-width:2px
    style DisplayCharts fill:#9B59B6,stroke:#7D3C98,stroke-width:2px
```

## Sơ đồ Hoạt động - Đánh giá khóa học

```mermaid
flowchart TD
    Start([Bắt đầu]) --> AccessCourse[Truy cập trang chi tiết<br/>khóa học đã đăng ký]
    AccessCourse --> ClickRate[Click Đánh giá khóa học]
    ClickRate --> CheckCompleted{Đã hoàn thành<br/>khóa học?}
    
    CheckCompleted -->|Chưa| ShowError1[Hiển thị: Cần hoàn thành<br/>khóa học trước khi đánh giá]
    ShowError1 --> End1([Kết thúc])
    
    CheckCompleted -->|Có| CheckRated{Đã đánh giá<br/>chưa?}
    
    CheckRated -->|Chưa| ShowForm[Hiển thị form đánh giá mới]
    CheckRated -->|Đã đánh giá| ShowEditForm[Hiển thị form với<br/>đánh giá hiện tại]
    
    ShowForm --> SelectStars[Chọn số sao 1-5]
    ShowEditForm --> SelectStars
    SelectStars --> WriteReview[Viết nhận xét<br/>tùy chọn]
    WriteReview --> SubmitRating[Click Gửi/Cập nhật đánh giá]
    
    SubmitRating --> ValidateRating{Kiểm tra<br/>hợp lệ?}
    ValidateRating -->|Rating không hợp lệ| ShowError2[Hiển thị: Vui lòng chọn<br/>số sao đánh giá]
    ShowError2 --> SelectStars
    
    ValidateRating -->|Review quá dài| ShowError3[Hiển thị: Nhận xét quá dài]
    ShowError3 --> WriteReview
    
    ValidateRating -->|Hợp lệ| CheckNew{Đánh giá<br/>mới hay cập nhật?}
    
    CheckNew -->|Mới| CreateRating[Tạo Rating record mới:<br/>user_id, course_id, rating, review<br/>is_verified = true]
    CheckNew -->|Cập nhật| UpdateRating[Cập nhật Rating record<br/>hiện tại]
    
    CreateRating --> CalculateAverage[Tính lại rating trung bình:<br/>AVG tất cả ratings của khóa học]
    UpdateRating --> CalculateAverage
    
    CalculateAverage --> UpdateCourse[Cập nhật course.average_rating]
    UpdateCourse --> ShowSuccess[Thông báo: Cảm ơn đã đánh giá<br/>hoặc Đánh giá đã được cập nhật]
    ShowSuccess --> ReloadPage[Reload trang để hiển thị<br/>đánh giá mới]
    ReloadPage --> End2([Kết thúc])
    
    style Start fill:#4A90E2,stroke:#2E5C8A,stroke-width:2px,color:#fff
    style End1 fill:#FF6B6B,stroke:#CC5555,stroke-width:2px,color:#fff
    style End2 fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style CreateRating fill:#10A37F,stroke:#0A7A5F,stroke-width:2px
    style UpdateRating fill:#10A37F,stroke:#0A7A5F,stroke-width:2px
    style CalculateAverage fill:#9B59B6,stroke:#7D3C98,stroke-width:2px
```

## Sơ đồ Hoạt động - Quên mật khẩu và đặt lại

```mermaid
flowchart TD
    Start([Bắt đầu]) --> AccessLogin[Truy cập trang đăng nhập]
    AccessLogin --> ClickForgot[Click Quên mật khẩu?]
    ClickForgot --> ShowForgotForm[Hiển thị form<br/>Quên mật khẩu]
    ShowForgotForm --> EnterEmail[Nhập email]
    EnterEmail --> SubmitEmail[Click Gửi link đặt lại]
    
    SubmitEmail --> ValidateEmail{Email<br/>hợp lệ?}
    ValidateEmail -->|Không| ShowError1[Hiển thị: Email không hợp lệ]
    ShowError1 --> EnterEmail
    
    ValidateEmail -->|Có| CheckExists{Email có<br/>tồn tại?}
    CheckExists -->|Không| ShowSuccess1[Hiển thị: Nếu email tồn tại,<br/>bạn sẽ nhận link trong vài phút<br/>Bảo mật: không tiết lộ]
    CheckExists -->|Có| CheckActive{Tài khoản<br/>đang active?}
    
    CheckActive -->|Không| ShowSuccess1
    CheckActive -->|Có| InvalidateOldTokens[Vô hiệu hóa token cũ<br/>của user]
    InvalidateOldTokens --> GenerateToken[Tạo token reset mật khẩu<br/>64 ký tự hex random]
    GenerateToken --> CreateTokenRecord[Tạo PasswordResetToken:<br/>user_id, token, expires_at 1 giờ<br/>used = false]
    CreateTokenRecord --> BuildResetURL[Tạo reset URL:<br/>/auth/reset-password/{token}]
    BuildResetURL --> SendEmail[Gửi email chứa link reset]
    SendEmail --> CheckEmailSent{Email<br/>đã gửi?}
    
    CheckEmailSent -->|Không| LogError[Ghi log lỗi<br/>Token vẫn được tạo]
    CheckEmailSent -->|Có| ShowSuccess1
    LogError --> ShowSuccess1
    
    ShowSuccess1 --> WaitEmail[Chờ học viên mở email]
    WaitEmail --> ClickLink[Học viên click link<br/>trong email]
    ClickLink --> ValidateToken{Xác thực token:<br/>- Tồn tại?<br/>- Chưa dùng?<br/>- Chưa hết hạn?}
    
    ValidateToken -->|Không hợp lệ| ShowError2[Hiển thị: Link không hợp lệ<br/>hoặc đã hết hạn]
    ShowError2 --> OfferResend[Gợi ý: Yêu cầu lại link]
    OfferResend --> ShowForgotForm
    
    ValidateToken -->|Hợp lệ| ShowResetForm[Hiển thị form<br/>Đặt lại mật khẩu]
    ShowResetForm --> EnterNewPass[Nhập mật khẩu mới]
    EnterNewPass --> EnterConfirm[Nhập xác nhận mật khẩu]
    EnterConfirm --> SubmitReset[Click Đặt lại mật khẩu]
    
    SubmitReset --> ValidatePassword{Kiểm tra<br/>hợp lệ?}
    ValidatePassword -->|Mật khẩu rỗng| ShowError3[Hiển thị: Mật khẩu không được<br/>để trống]
    ValidatePassword -->|Mật khẩu < 6 ký tự| ShowError4[Hiển thị: Mật khẩu phải<br/>>= 6 ký tự]
    ValidatePassword -->|Xác nhận không khớp| ShowError5[Hiển thị: Mật khẩu xác nhận<br/>không khớp]
    
    ShowError3 --> EnterNewPass
    ShowError4 --> EnterNewPass
    ShowError5 --> EnterConfirm
    
    ValidatePassword -->|Hợp lệ| HashPassword[Hash mật khẩu mới<br/>bằng bcrypt]
    HashPassword --> UpdatePassword[Cập nhật user.password<br/>với mật khẩu mới]
    UpdatePassword --> MarkTokenUsed[Đánh dấu token<br/>used = true]
    MarkTokenUsed --> InvalidateOtherTokens[Vô hiệu hóa tất cả<br/>token khác của user]
    InvalidateOtherTokens --> SendSuccessEmail[Gửi email: Mật khẩu<br/>đã được đặt lại thành công]
    SendSuccessEmail --> ShowSuccess2[Thông báo: Mật khẩu đã được<br/>đặt lại thành công]
    ShowSuccess2 --> RedirectLogin[Chuyển hướng đến<br/>trang đăng nhập]
    RedirectLogin --> End([Kết thúc])
    
    style Start fill:#4A90E2,stroke:#2E5C8A,stroke-width:2px,color:#fff
    style End fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style GenerateToken fill:#9B59B6,stroke:#7D3C98,stroke-width:2px
    style SendEmail fill:#FFA500,stroke:#CC8800,stroke-width:2px
    style HashPassword fill:#10A37F,stroke:#0A7A5F,stroke-width:2px
    style UpdatePassword fill:#10A37F,stroke:#0A7A5F,stroke-width:2px
```

## Sơ đồ Tuần tự - Xem chứng chỉ hoàn thành

```mermaid
sequenceDiagram
    participant HV as Học viên
    participant HT as Hệ thống

    HV->>HT: Truy cập trang Chứng chỉ hoặc từ khóa học
    HT->>HT: Tải danh sách chứng chỉ của học viên
    
    alt Không có chứng chỉ
        HT-->>HV: Hiển thị: Chưa có chứng chỉ nào
        HT-->>HV: Gợi ý: Hoàn thành khóa học để nhận chứng chỉ
    else Có chứng chỉ
        HT-->>HV: Hiển thị danh sách chứng chỉ với:<br/>- Tên khóa học<br/>- Hình ảnh<br/>- Ngày hoàn thành<br/>- Số chứng chỉ
        
        HV->>HT: Click vào một chứng chỉ
        HT->>HT: Tải thông tin chi tiết chứng chỉ
        HT->>HT: Kiểm tra file PDF có tồn tại
        
        alt PDF không tồn tại
            HT->>HT: Tự động tạo lại PDF chứng chỉ
            HT->>HT: Lưu PDF vào uploads/certificates
            HT->>HT: Cập nhật pdf_path trong database
        end
        
        HT-->>HV: Hiển thị thông tin chứng chỉ:<br/>- Tên khóa học<br/>- Tên học viên, giảng viên<br/>- Ngày cấp, số chứng chỉ<br/>- Nút "Tải xuống"
        
        HV->>HT: Click "Tải xuống"
        HT->>HT: Trả về file PDF
        
        alt Download thành công
            HT-->>HV: File PDF được tải xuống
        else Download thất bại
            HT-->>HV: Thông báo: Lỗi khi tải xuống, thử lại hoặc liên hệ hỗ trợ
        end
    end
```

## Sơ đồ Tuần tự - Xem thống kê học tập chi tiết

```mermaid
sequenceDiagram
    participant HV as Học viên
    participant HT as Hệ thống

    HV->>HT: Truy cập trang Thống kê hoặc Tiến độ học tập
    HT->>HT: Tải dữ liệu học tập (enrollments, progress)
    
    alt Chưa có hoạt động học tập
        HT-->>HV: Hiển thị: Chưa có hoạt động học tập
        HT-->>HV: Gợi ý: Khám phá khóa học
    else Có hoạt động học tập
        HT->>HT: Tính toán thống kê tổng quan:<br/>- Tổng số khóa học<br/>- Đang học / Đã hoàn thành<br/>- Tổng thời gian học<br/>- Tiến độ trung bình
        HT->>HT: Tính toán theo khóa học:<br/>- Tiến độ từng khóa<br/>- Thời gian học<br/>- Số bài đã hoàn thành
        HT->>HT: Tính toán theo thời gian:<br/>- 30 ngày gần nhất<br/>- Thời gian học theo ngày
        
        alt Không có dữ liệu 30 ngày
            HT-->>HV: Hiển thị: Chưa có dữ liệu 30 ngày gần nhất
        else Có dữ liệu
            HT->>HT: Tạo biểu đồ thời gian học
        end
        
        HT-->>HV: Hiển thị thống kê:<br/>- Tổng quan<br/>- Theo khóa học (bảng)<br/>- Theo thời gian (biểu đồ)
        
        HV->>HV: Xem thống kê
        
        alt Click xem chi tiết khóa học
            HV->>HT: Click vào một khóa học
            HT-->>HV: Chuyển đến UC-05: Xem chi tiết khóa học
        else Export thống kê
            HV->>HT: Click "Export CSV" hoặc "Export PDF"
            HT->>HT: Tạo file CSV/PDF
            HT-->>HV: Trả về file để tải xuống
        else Lọc theo thời gian
            HV->>HT: Chọn khoảng thời gian
            HT->>HT: Tính toán lại thống kê theo khoảng thời gian
            HT-->>HV: Hiển thị thống kê đã lọc
        end
    end
```

## Sơ đồ Tuần tự - Đánh giá khóa học

```mermaid
sequenceDiagram
    participant HV as Học viên
    participant HT as Hệ thống

    HV->>HT: Truy cập trang chi tiết khóa học đã đăng ký
    HV->>HT: Click "Đánh giá khóa học"
    HT->>HT: Kiểm tra học viên đã hoàn thành khóa học
    
    alt Chưa hoàn thành
        HT-->>HV: Thông báo: Cần hoàn thành khóa học trước khi đánh giá
    else Đã hoàn thành
        HT->>HT: Kiểm tra học viên đã đánh giá chưa
        
        alt Chưa đánh giá
            HT-->>HV: Hiển thị form đánh giá mới
        else Đã đánh giá
            HT->>HT: Tải đánh giá hiện tại
            HT-->>HV: Hiển thị form với đánh giá hiện tại (cho phép chỉnh sửa)
        end
        
        HV->>HT: Chọn số sao (1-5) và viết nhận xét (tùy chọn)
        HV->>HT: Click "Gửi đánh giá" hoặc "Cập nhật đánh giá"
        HT->>HT: Validate (rating 1-5, review không quá dài)
        
        alt Validation thất bại
            HT-->>HV: Thông báo lỗi validation
        else Validation thành công
            alt Đánh giá mới
                HT->>HT: Tạo Rating record mới (is_verified = true)
            else Cập nhật đánh giá
                HT->>HT: Cập nhật Rating record hiện tại
            end
            
            HT->>HT: Tính lại rating trung bình:<br/>AVG(tất cả ratings của khóa học)
            HT->>HT: Cập nhật course.average_rating
            HT-->>HV: Thông báo: Cảm ơn đã đánh giá hoặc Đánh giá đã được cập nhật
            HT-->>HV: Reload trang để hiển thị đánh giá mới
        end
    end
```

## Sơ đồ Tuần tự - Quên mật khẩu và đặt lại

```mermaid
sequenceDiagram
    participant HV as Học viên
    participant HT as Hệ thống
    participant Email as Email Service

    HV->>HT: Truy cập trang đăng nhập
    HV->>HT: Click "Quên mật khẩu?"
    HT-->>HV: Hiển thị form Quên mật khẩu
    
    HV->>HT: Nhập email và click "Gửi link đặt lại"
    HT->>HT: Validate email format
    
    alt Email không hợp lệ
        HT-->>HV: Thông báo: Email không hợp lệ
    else Email hợp lệ
        HT->>HT: Kiểm tra email có tồn tại trong database
        
        alt Email không tồn tại hoặc tài khoản không active
            Note over HT: Bảo mật: Không tiết lộ email có tồn tại
            HT-->>HV: Thông báo: Nếu email tồn tại, bạn sẽ nhận link trong vài phút
        else Email tồn tại và tài khoản active
            HT->>HT: Vô hiệu hóa tất cả token cũ của user
            HT->>HT: Tạo token reset mật khẩu (64 ký tự hex)
            HT->>HT: Tạo PasswordResetToken record (expires_at: 1 giờ)
            HT->>HT: Tạo reset URL: /auth/reset-password/{token}
            HT->>Email: Gửi email chứa link reset
            Email-->>HT: Email đã gửi (hoặc lỗi)
            HT-->>HV: Thông báo: Nếu email tồn tại, bạn sẽ nhận link trong vài phút
            
            Note over HV,Email: Học viên mở email và click link
            
            HV->>HT: Click link reset trong email
            HT->>HT: Xác thực token (tồn tại, chưa dùng, chưa hết hạn)
            
            alt Token không hợp lệ hoặc hết hạn
                HT-->>HV: Thông báo: Link không hợp lệ hoặc đã hết hạn
                HT-->>HV: Gợi ý: Yêu cầu lại link reset
            else Token hợp lệ
                HT-->>HV: Hiển thị form Đặt lại mật khẩu
                
                HV->>HT: Nhập mật khẩu mới và xác nhận
                HV->>HT: Click "Đặt lại mật khẩu"
                HT->>HT: Validate (mật khẩu >= 6 ký tự, xác nhận khớp)
                
                alt Validation thất bại
                    HT-->>HV: Thông báo lỗi validation
                else Validation thành công
                    HT->>HT: Hash mật khẩu mới bằng bcrypt
                    HT->>HT: Cập nhật user.password
                    HT->>HT: Đánh dấu token used = true
                    HT->>HT: Vô hiệu hóa tất cả token khác của user
                    HT->>Email: Gửi email: Mật khẩu đã được đặt lại thành công
                    HT-->>HV: Thông báo: Mật khẩu đã được đặt lại thành công
                    HT-->>HV: Chuyển hướng đến trang đăng nhập
                end
            end
        end
    end
```

---

**🏛️ Trường Đại học Công nghệ Thông tin**  
**🌍 Đại học Quốc gia TP. Hồ Chí Minh**
