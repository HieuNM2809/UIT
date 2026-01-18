# 3.2. Use Case Khóa học

## UC-03: Xem danh sách khóa học

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Học viên xem danh sách khóa học |
| **ID** | UC-03 |
| **Tác nhân** | Học viên |
| **Mô tả tóm tắt** | Học viên xem danh sách tất cả các khóa học có sẵn trong hệ thống với phân trang và thông tin cơ bản của từng khóa học |
| **Tiền điều kiện** | - Học viên đã đăng nhập<br>- Học viên đang ở trang danh sách khóa học |
| **Hậu điều kiện** | - Học viên đã xem danh sách khóa học<br>- Học viên có thể xem chi tiết hoặc đăng ký khóa học |
| **Luồng sự kiện** | 1. Học viên truy cập trang "Khóa học"<br>2. Hệ thống tải danh sách khóa học có trạng thái "published"<br>3. Hệ thống sắp xếp khóa học theo: số người đăng ký (giảm dần), đánh giá trung bình (giảm dần), ngày tạo (mới nhất)<br>4. Hệ thống hiển thị danh sách với phân trang (12 khóa học/trang)<br>5. Mỗi khóa học hiển thị:<br>   - Tiêu đề và mô tả ngắn<br>   - Hình ảnh đại diện<br>   - Tên giảng viên và avatar<br>   - Cấp độ (beginner, intermediate, advanced)<br>   - Giá khóa học<br>   - Số lượng người đã đăng ký<br>   - Đánh giá trung bình (sao)<br>6. Học viên có thể xem các trang tiếp theo bằng phân trang<br>7. Học viên có thể click vào khóa học để xem chi tiết |
| **Luồng thay thế** | **2a. Không có khóa học nào:**<br>- Hệ thống hiển thị thông báo "Chưa có khóa học nào"<br>- Hệ thống hiển thị gợi ý tìm kiếm hoặc liên hệ admin<br><br>**4a. Lỗi khi tải danh sách:**<br>- Hệ thống thông báo lỗi "Lỗi khi tải danh sách khóa học"<br>- Hệ thống chuyển hướng về trang chủ |

## UC-04: Tìm kiếm và lọc khóa học

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Học viên tìm kiếm và lọc khóa học |
| **ID** | UC-04 |
| **Tác nhân** | Học viên |
| **Mô tả tóm tắt** | Học viên tìm kiếm khóa học theo từ khóa, danh mục, hoặc cấp độ để tìm khóa học phù hợp với nhu cầu học tập |
| **Tiền điều kiện** | - Học viên đã đăng nhập<br>- Học viên đang ở trang danh sách khóa học |
| **Hậu điều kiện** | - Học viên đã xem kết quả tìm kiếm/lọc<br>- Hệ thống hiển thị danh sách khóa học phù hợp với tiêu chí |
| **Luồng sự kiện** | 1. Học viên truy cập trang danh sách khóa học<br>2. Học viên có thể:<br>   **2a. Tìm kiếm theo từ khóa:**<br>   - Nhập từ khóa vào ô tìm kiếm (tìm trong tiêu đề khóa học)<br>   - Hệ thống tìm kiếm không phân biệt hoa thường<br>   - Hệ thống hiển thị kết quả khóa học có tiêu đề chứa từ khóa<br><br>   **2b. Lọc theo danh mục:**<br>   - Chọn danh mục từ dropdown (ví dụ: Lập trình, Toán học, Tiếng Anh)<br>   - Hệ thống hiển thị chỉ các khóa học thuộc danh mục đã chọn<br><br>   **2c. Lọc theo cấp độ:**<br>   - Chọn cấp độ từ dropdown (Beginner, Intermediate, Advanced)<br>   - Hệ thống hiển thị chỉ các khóa học có cấp độ phù hợp<br><br>   **2d. Kết hợp nhiều bộ lọc:**<br>   - Học viên có thể kết hợp tìm kiếm + danh mục + cấp độ<br>   - Hệ thống áp dụng tất cả các điều kiện lọc<br>3. Hệ thống thực hiện tìm kiếm/lọc trong database<br>4. Hệ thống hiển thị kết quả với phân trang (12 khóa học/trang)<br>5. Hệ thống giữ nguyên các bộ lọc đã chọn trong URL<br>6. Học viên có thể xem chi tiết khóa học từ kết quả tìm kiếm |
| **Luồng thay thế** | **3a. Không tìm thấy kết quả:**<br>- Hệ thống hiển thị thông báo "Không tìm thấy khóa học phù hợp"<br>- Hệ thống gợi ý: thử từ khóa khác, bỏ bớt bộ lọc, hoặc xem tất cả khóa học<br><br>**2a. Từ khóa tìm kiếm quá ngắn:**<br>- Hệ thống có thể yêu cầu nhập ít nhất 2 ký tự<br>- Hệ thống hiển thị gợi ý từ khóa phổ biến |

## UC-05: Xem chi tiết khóa học

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Học viên xem chi tiết khóa học |
| **ID** | UC-05 |
| **Tác nhân** | Học viên |
| **Mô tả tóm tắt** | Học viên xem thông tin chi tiết đầy đủ của một khóa học bao gồm nội dung, đánh giá, và thống kê để quyết định đăng ký |
| **Tiền điều kiện** | - Học viên đã đăng nhập<br>- Khóa học tồn tại trong hệ thống<br>- Khóa học có trạng thái "published" |
| **Hậu điều kiện** | - Học viên đã xem chi tiết khóa học<br>- Học viên có đủ thông tin để quyết định đăng ký |
| **Luồng sự kiện** | 1. Học viên click vào một khóa học từ danh sách hoặc từ kết quả tìm kiếm<br>2. Hệ thống tải thông tin chi tiết khóa học<br>3. Hệ thống hiển thị trang chi tiết khóa học bao gồm:<br>   **3a. Thông tin cơ bản:**<br>   - Tiêu đề và mô tả đầy đủ<br>   - Hình ảnh đại diện<br>   - Tên giảng viên, avatar, và thông tin giảng viên<br>   - Danh mục và cấp độ<br>   - Giá khóa học (hoặc miễn phí)<br>   - Ngày tạo và cập nhật<br><br>   **3b. Nội dung khóa học:**<br>   - Danh sách các bài học/nội dung (chỉ hiển thị preview nếu chưa đăng ký)<br>   - Số lượng bài học tổng cộng<br>   - Thời lượng ước tính<br>   - Nếu đã đăng ký: hiển thị đầy đủ danh sách nội dung<br><br>   **3c. Đánh giá và bình luận:**<br>   - Đánh giá trung bình (sao) và số lượng đánh giá<br>   - Danh sách đánh giá từ học viên khác (phân trang)<br>   - Mỗi đánh giá hiển thị: tên học viên, số sao, nhận xét, ngày đánh giá<br><br>   **3d. Thống kê:**<br>   - Số lượng người đã đăng ký<br>   - Số lượng bài học<br>   - Tỷ lệ hoàn thành (nếu có)<br>4. Học viên có thể:<br>   - Xem preview nội dung (nếu có và chưa đăng ký)<br>   - Đọc đánh giá và bình luận từ học viên khác<br>   - Đăng ký khóa học (nếu chưa đăng ký)<br>   - Chuyển đến trang học (nếu đã đăng ký)<br>   - Quay lại danh sách khóa học |
| **Luồng thay thế** | **2a. Khóa học không tồn tại:**<br>- Hệ thống hiển thị lỗi 404 "Khóa học bạn tìm kiếm không tồn tại"<br>- Hệ thống gợi ý quay lại danh sách hoặc tìm kiếm khóa học khác<br><br>**2b. Khóa học chưa được publish:**<br>- Nếu học viên không phải admin/giảng viên: Hệ thống hiển thị lỗi "Khóa học chưa được công khai"<br>- Nếu học viên là admin/giảng viên: Hệ thống hiển thị khóa học với cảnh báo "Đang ở chế độ draft"<br><br>**3b. Khóa học chưa có nội dung:**<br>- Hệ thống hiển thị thông báo "Khóa học đang được cập nhật nội dung"<br>- Hệ thống vẫn cho phép đăng ký nhưng cảnh báo nội dung sẽ được bổ sung sau |

## Sơ đồ Hoạt động - Xem danh sách khóa học

```mermaid
flowchart TD
    Start([Bắt đầu]) --> CheckLogin{Đã đăng<br/>nhập?}
    CheckLogin -->|Không| RedirectLogin[Chuyển đến trang đăng nhập]
    RedirectLogin --> End1([Kết thúc])
    
    CheckLogin -->|Có| AccessPage[Truy cập trang Khóa học]
    AccessPage --> LoadCourses[Tải danh sách khóa học<br/>status: published]
    
    LoadCourses --> CheckCourses{Có khóa học<br/>nào?}
    CheckCourses -->|Không| ShowEmpty[Hiển thị: Chưa có khóa học nào]
    ShowEmpty --> End2([Kết thúc])
    
    CheckCourses -->|Có| SortCourses[Sắp xếp khóa học:<br/>1. Số người đăng ký<br/>2. Đánh giá trung bình<br/>3. Ngày tạo]
    SortCourses --> Paginate[Phân trang<br/>12 khóa học/trang]
    Paginate --> DisplayList[Hiển thị danh sách khóa học:<br/>- Tiêu đề, mô tả<br/>- Hình ảnh<br/>- Giảng viên<br/>- Cấp độ, giá<br/>- Số người đăng ký<br/>- Đánh giá trung bình]
    
    DisplayList --> UserAction{Học viên<br/>thực hiện?}
    UserAction -->|Click khóa học| ViewDetail[Xem chi tiết khóa học]
    UserAction -->|Xem trang tiếp| NextPage[Chuyển trang tiếp theo]
    UserAction -->|Tìm kiếm/Lọc| SearchFilter[Tìm kiếm/Lọc khóa học]
    UserAction -->|Không làm gì| End3([Kết thúc])
    
    NextPage --> LoadCourses
    SearchFilter --> LoadCourses
    ViewDetail --> End4([Kết thúc - Chuyển đến UC-05])
    
    style Start fill:#4A90E2,stroke:#2E5C8A,stroke-width:2px,color:#fff
    style End1 fill:#FF6B6B,stroke:#CC5555,stroke-width:2px,color:#fff
    style End2 fill:#FFA500,stroke:#CC8800,stroke-width:2px,color:#fff
    style End3 fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style End4 fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style DisplayList fill:#10A37F,stroke:#0A7A5F,stroke-width:2px
```

## Sơ đồ Hoạt động - Tìm kiếm và lọc khóa học

```mermaid
flowchart TD
    Start([Bắt đầu]) --> ShowFilters[Hiển thị form tìm kiếm/lọc:<br/>- Ô tìm kiếm<br/>- Dropdown danh mục<br/>- Dropdown cấp độ]
    ShowFilters --> UserInput{Học viên<br/>nhập tiêu chí}
    
    UserInput -->|Nhập từ khóa| EnterKeyword[Nhập từ khóa tìm kiếm]
    UserInput -->|Chọn danh mục| SelectCategory[Chọn danh mục]
    UserInput -->|Chọn cấp độ| SelectLevel[Chọn cấp độ]
    UserInput -->|Kết hợp| CombineFilters[Kết hợp nhiều bộ lọc]
    
    EnterKeyword --> ValidateKeyword{Từ khóa<br/>hợp lệ?}
    ValidateKeyword -->|Quá ngắn < 2 ký tự| ShowError1[Hiển thị: Vui lòng nhập ít nhất 2 ký tự]
    ShowError1 --> EnterKeyword
    
    ValidateKeyword -->|Hợp lệ| ApplyFilters[Áp dụng bộ lọc]
    SelectCategory --> ApplyFilters
    SelectLevel --> ApplyFilters
    CombineFilters --> ApplyFilters
    
    ApplyFilters --> SearchDB[Tìm kiếm trong database:<br/>- Tìm trong tiêu đề<br/>- Lọc theo danh mục<br/>- Lọc theo cấp độ<br/>- Chỉ khóa học published]
    
    SearchDB --> CheckResults{Có kết quả<br/>tìm thấy?}
    CheckResults -->|Không| ShowNoResults[Hiển thị: Không tìm thấy khóa học phù hợp]
    ShowNoResults --> ShowSuggestions[Gợi ý:<br/>- Thử từ khóa khác<br/>- Bỏ bớt bộ lọc<br/>- Xem tất cả khóa học]
    ShowSuggestions --> ShowFilters
    
    CheckResults -->|Có| DisplayResults[Hiển thị kết quả với phân trang]
    DisplayResults --> UserAction2{Học viên<br/>thực hiện?}
    
    UserAction2 -->|Xem chi tiết| ViewDetail[Xem chi tiết khóa học]
    UserAction2 -->|Thay đổi bộ lọc| ShowFilters
    UserAction2 -->|Xem trang tiếp| NextPage[Chuyển trang tiếp theo]
    UserAction2 -->|Xóa bộ lọc| ClearFilters[Xóa tất cả bộ lọc<br/>Hiển thị tất cả khóa học]
    
    NextPage --> SearchDB
    ClearFilters --> LoadAll[Hiển thị tất cả khóa học]
    LoadAll --> DisplayResults
    ViewDetail --> End1([Kết thúc - Chuyển đến UC-05])
    
    style Start fill:#4A90E2,stroke:#2E5C8A,stroke-width:2px,color:#fff
    style End1 fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style ShowNoResults fill:#FFA500,stroke:#CC8800,stroke-width:2px
    style DisplayResults fill:#10A37F,stroke:#0A7A5F,stroke-width:2px
```

## Sơ đồ Hoạt động - Xem chi tiết khóa học

```mermaid
flowchart TD
    Start([Bắt đầu]) --> ClickCourse[Học viên click vào khóa học<br/>từ danh sách hoặc tìm kiếm]
    ClickCourse --> LoadCourse[Tải thông tin khóa học]
    
    LoadCourse --> CheckExists{Khóa học<br/>tồn tại?}
    CheckExists -->|Không| Show404[Hiển thị lỗi 404:<br/>Khóa học không tồn tại]
    Show404 --> End1([Kết thúc])
    
    CheckExists -->|Có| CheckStatus{Khóa học<br/>đã published?}
    CheckStatus -->|Chưa| CheckRole{Học viên là<br/>admin/giảng viên?}
    CheckRole -->|Không| ShowDraftError[Hiển thị: Khóa học chưa được công khai]
    ShowDraftError --> End2([Kết thúc])
    
    CheckRole -->|Có| ShowDraftWarning[Hiển thị khóa học<br/>với cảnh báo: Draft]
    ShowDraftWarning --> DisplayInfo
    
    CheckStatus -->|Đã published| CheckEnrolled{Đã đăng ký<br/>khóa học?}
    CheckEnrolled -->|Chưa| DisplayInfo[Hiển thị thông tin chi tiết:<br/>- Thông tin cơ bản<br/>- Preview nội dung<br/>- Đánh giá và bình luận<br/>- Thống kê]
    CheckEnrolled -->|Đã đăng ký| DisplayFullInfo[Hiển thị thông tin đầy đủ:<br/>- Thông tin cơ bản<br/>- Toàn bộ nội dung<br/>- Đánh giá và bình luận<br/>- Thống kê]
    
    DisplayInfo --> UserAction{Học viên<br/>thực hiện?}
    DisplayFullInfo --> UserAction
    
    UserAction -->|Đăng ký khóa học| EnrollCourse[Chuyển đến UC-06:<br/>Đăng ký khóa học]
    UserAction -->|Xem nội dung| ViewContent[Chuyển đến UC-07:<br/>Học nội dung]
    UserAction -->|Đọc đánh giá| ScrollReviews[Cuộn đến phần đánh giá]
    UserAction -->|Quay lại| BackToList[Quay lại danh sách khóa học]
    UserAction -->|Không làm gì| End3([Kết thúc])
    
    ScrollReviews --> End3
    BackToList --> End3
    EnrollCourse --> End4([Kết thúc - Chuyển đến UC-06])
    ViewContent --> End5([Kết thúc - Chuyển đến UC-07])
    
    style Start fill:#4A90E2,stroke:#2E5C8A,stroke-width:2px,color:#fff
    style End1 fill:#FF6B6B,stroke:#CC5555,stroke-width:2px,color:#fff
    style End2 fill:#FF6B6B,stroke:#CC5555,stroke-width:2px,color:#fff
    style End3 fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style End4 fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style End5 fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style DisplayInfo fill:#10A37F,stroke:#0A7A5F,stroke-width:2px
    style DisplayFullInfo fill:#10A37F,stroke:#0A7A5F,stroke-width:2px
```

## Sơ đồ Tuần tự - Xem danh sách khóa học

```mermaid
sequenceDiagram
    participant HV as Học viên
    participant HT as Hệ thống

    HV->>HT: Truy cập trang Khóa học
    HT->>HT: Kiểm tra đăng nhập
    
    alt Chưa đăng nhập
        HT-->>HV: Chuyển hướng đến trang đăng nhập
    else Đã đăng nhập
        HT->>HT: Tải danh sách khóa học (status: published)
        
        alt Không có khóa học
            HT-->>HV: Hiển thị: Chưa có khóa học nào
        else Có khóa học
            HT->>HT: Sắp xếp khóa học (theo số đăng ký, đánh giá, ngày tạo)
            HT->>HT: Phân trang (12 khóa học/trang)
            HT-->>HV: Hiển thị danh sách khóa học với:<br/>- Tiêu đề, mô tả<br/>- Hình ảnh<br/>- Giảng viên<br/>- Cấp độ, giá<br/>- Số người đăng ký<br/>- Đánh giá trung bình
            
            HV->>HV: Xem danh sách
            
            alt Click vào khóa học
                HV->>HT: Click vào một khóa học
                HT-->>HV: Chuyển đến trang chi tiết (UC-05)
            else Xem trang tiếp theo
                HV->>HT: Click nút "Trang tiếp theo"
                HT->>HT: Tải trang tiếp theo
                HT-->>HV: Hiển thị danh sách trang tiếp theo
            else Tìm kiếm/Lọc
                HV->>HT: Nhập từ khóa hoặc chọn bộ lọc
                HT-->>HV: Hiển thị kết quả tìm kiếm/lọc
            end
        end
    end
```

## Sơ đồ Tuần tự - Tìm kiếm và lọc khóa học

```mermaid
sequenceDiagram
    participant HV as Học viên
    participant HT as Hệ thống

    HV->>HT: Truy cập trang danh sách khóa học
    HT-->>HV: Hiển thị form tìm kiếm/lọc
    
    HV->>HV: Chọn phương thức tìm kiếm/lọc
    
    alt Tìm kiếm theo từ khóa
        HV->>HT: Nhập từ khóa vào ô tìm kiếm
        HT->>HT: Kiểm tra từ khóa hợp lệ (>= 2 ký tự)
        
        alt Từ khóa quá ngắn
            HT-->>HV: Thông báo: Vui lòng nhập ít nhất 2 ký tự
        else Từ khóa hợp lệ
            HT->>HT: Tìm kiếm trong tiêu đề khóa học (không phân biệt hoa thường)
            HT->>HT: Lọc chỉ khóa học published
            HT-->>HV: Hiển thị kết quả tìm kiếm
        end
    else Lọc theo danh mục
        HV->>HT: Chọn danh mục từ dropdown
        HT->>HT: Lọc khóa học theo danh mục đã chọn
        HT->>HT: Lọc chỉ khóa học published
        HT-->>HV: Hiển thị kết quả lọc
    else Lọc theo cấp độ
        HV->>HT: Chọn cấp độ từ dropdown
        HT->>HT: Lọc khóa học theo cấp độ đã chọn
        HT->>HT: Lọc chỉ khóa học published
        HT-->>HV: Hiển thị kết quả lọc
    else Kết hợp nhiều bộ lọc
        HV->>HT: Nhập từ khóa + chọn danh mục + chọn cấp độ
        HT->>HT: Áp dụng tất cả các điều kiện lọc
        HT->>HT: Lọc chỉ khóa học published
        HT-->>HV: Hiển thị kết quả với tất cả bộ lọc
    end
    
    HT->>HT: Kiểm tra có kết quả không
    
    alt Không có kết quả
        HT-->>HV: Hiển thị: Không tìm thấy khóa học phù hợp
        HT-->>HV: Gợi ý: Thử từ khóa khác, bỏ bớt bộ lọc, hoặc xem tất cả
    else Có kết quả
        HT->>HT: Phân trang kết quả (12 khóa học/trang)
        HT-->>HV: Hiển thị danh sách kết quả với phân trang
        
        HV->>HV: Xem kết quả
        
        alt Click vào khóa học
            HV->>HT: Click vào một khóa học
            HT-->>HV: Chuyển đến trang chi tiết (UC-05)
        else Thay đổi bộ lọc
            HV->>HT: Thay đổi từ khóa hoặc bộ lọc
            Note over HT: Lặp lại quá trình tìm kiếm/lọc
        else Xóa bộ lọc
            HV->>HT: Click "Xóa bộ lọc"
            HT->>HT: Hiển thị tất cả khóa học
            HT-->>HV: Hiển thị danh sách đầy đủ
        end
    end
```

## Sơ đồ Tuần tự - Xem chi tiết khóa học

```mermaid
sequenceDiagram
    participant HV as Học viên
    participant HT as Hệ thống

    HV->>HT: Click vào khóa học từ danh sách
    HT->>HT: Tải thông tin khóa học
    
    alt Khóa học không tồn tại
        HT-->>HV: Hiển thị lỗi 404: Khóa học không tồn tại
        HT-->>HV: Gợi ý quay lại danh sách hoặc tìm kiếm khác
    else Khóa học tồn tại
        HT->>HT: Kiểm tra trạng thái khóa học
        
        alt Khóa học chưa published
            HT->>HT: Kiểm tra vai trò học viên
            
            alt Học viên không phải admin/giảng viên
                HT-->>HV: Hiển thị: Khóa học chưa được công khai
            else Học viên là admin/giảng viên
                HT-->>HV: Hiển thị khóa học với cảnh báo: Draft
            end
        else Khóa học đã published
            HT->>HT: Kiểm tra học viên đã đăng ký chưa
            
            alt Chưa đăng ký
                HT->>HT: Tải thông tin cơ bản + preview nội dung
                HT-->>HV: Hiển thị trang chi tiết:<br/>- Thông tin cơ bản<br/>- Preview nội dung (giới hạn)<br/>- Đánh giá và bình luận<br/>- Thống kê<br/>- Nút "Đăng ký khóa học"
                
                HV->>HV: Xem thông tin
                
                alt Click đăng ký
                    HV->>HT: Click "Đăng ký khóa học"
                    HT-->>HV: Chuyển đến UC-06: Đăng ký khóa học
                else Xem đánh giá
                    HV->>HT: Cuộn đến phần đánh giá
                    HT-->>HV: Hiển thị danh sách đánh giá (phân trang)
                else Quay lại
                    HV->>HT: Click "Quay lại"
                    HT-->>HV: Quay lại danh sách khóa học
                end
            else Đã đăng ký
                HT->>HT: Tải thông tin đầy đủ + toàn bộ nội dung
                HT-->>HV: Hiển thị trang chi tiết:<br/>- Thông tin cơ bản<br/>- Toàn bộ nội dung học tập<br/>- Đánh giá và bình luận<br/>- Thống kê<br/>- Nút "Bắt đầu học"
                
                HV->>HV: Xem thông tin
                
                alt Click bắt đầu học
                    HV->>HT: Click "Bắt đầu học"
                    HT-->>HV: Chuyển đến UC-07: Học nội dung khóa học
                else Xem đánh giá
                    HV->>HT: Cuộn đến phần đánh giá
                    HT-->>HV: Hiển thị danh sách đánh giá
                else Quay lại
                    HV->>HT: Click "Quay lại"
                    HT-->>HV: Quay lại danh sách khóa học
                end
            end
        end
    end
```

---

**🏛️ Trường Đại học Công nghệ Thông tin**  
**🌍 Đại học Quốc gia TP. Hồ Chí Minh**
