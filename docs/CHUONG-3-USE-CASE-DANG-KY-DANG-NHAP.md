# 3.1. Use Case Đăng ký và Đăng nhập

## UC-01: Đăng ký tài khoản

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Học viên đăng ký tài khoản |
| **ID** | UC-01 |
| **Tác nhân** | Học viên (chưa có tài khoản) |
| **Mô tả tóm tắt** | Học viên đăng ký tài khoản mới trên hệ thống StudyMate bằng cách điền thông tin cá nhân và xác thực email |
| **Tiền điều kiện** | - Học viên chưa có tài khoản trong hệ thống<br>- Học viên có email hợp lệ<br>- Học viên đang ở trang đăng ký |
| **Hậu điều kiện** | - Học viên có tài khoản mới trong hệ thống<br>- Tài khoản đã được kích hoạt sau khi xác thực email<br>- Học viên có thể đăng nhập vào hệ thống |
| **Luồng sự kiện** | 1. Học viên truy cập trang đăng ký<br>2. Học viên điền thông tin: email, mật khẩu, họ tên, MSSV<br>3. Hệ thống kiểm tra email đã tồn tại chưa<br>4. Hệ thống kiểm tra tính hợp lệ của thông tin (email format, password strength)<br>5. Hệ thống hash mật khẩu bằng bcrypt<br>6. Hệ thống tạo tài khoản mới với role mặc định là 'student'<br>7. Hệ thống tạo email verification token<br>8. Hệ thống gửi email xác thực chứa link kích hoạt<br>9. Học viên mở email và click link xác thực<br>10. Hệ thống xác thực token và kích hoạt tài khoản<br>11. Hệ thống thông báo đăng ký thành công |
| **Luồng thay thế** | **3a. Email đã tồn tại:**<br>- Hệ thống thông báo lỗi "Email đã được sử dụng"<br>- Hệ thống yêu cầu học viên đăng nhập hoặc sử dụng chức năng quên mật khẩu<br><br>**4a. Thông tin không hợp lệ:**<br>- Hệ thống hiển thị lỗi validation (email không đúng format, mật khẩu quá yếu)<br>- Học viên sửa lại thông tin và thử lại<br><br>**8a. Email xác thực không được gửi:**<br>- Học viên có thể yêu cầu gửi lại email xác thực<br>- Hệ thống tạo token mới và gửi lại email<br><br>**10a. Token hết hạn hoặc không hợp lệ:**<br>- Hệ thống thông báo lỗi "Link xác thực không hợp lệ hoặc đã hết hạn"<br>- Học viên có thể yêu cầu gửi lại email xác thực |

## UC-02: Đăng nhập hệ thống

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên UC sử dụng** | Học viên đăng nhập |
| **ID** | UC-02 |
| **Tác nhân** | Học viên |
| **Mô tả tóm tắt** | Học viên đăng nhập vào hệ thống StudyMate bằng email/mật khẩu hoặc Google OAuth để sử dụng các chức năng và học khóa học |
| **Tiền điều kiện** | - Học viên đã có tài khoản trong hệ thống<br>- Tài khoản đã được xác thực email<br>- Học viên đang ở trang đăng nhập |
| **Hậu điều kiện** | - Học viên đã đăng nhập thành công<br>- Hệ thống đã tạo session và JWT token<br>- Học viên có thể truy cập các chức năng của hệ thống |
| **Luồng sự kiện** | **Phương thức 1: Đăng nhập bằng email/mật khẩu**<br>1. Học viên truy cập trang đăng nhập<br>2. Học viên nhập email và mật khẩu vào form<br>3. Hệ thống kiểm tra email có tồn tại trong database<br>4. Hệ thống so sánh mật khẩu đã hash với mật khẩu trong database<br>5. Hệ thống kiểm tra tài khoản đã được kích hoạt (email_verified = true)<br>6. Hệ thống tạo session trong Redis<br>7. Hệ thống tạo JWT token cho API authentication<br>8. Hệ thống cập nhật last_login và increment login_count<br>9. Hệ thống chuyển hướng đến dashboard<br><br>**Phương thức 2: Đăng nhập bằng Google OAuth**<br>1. Học viên click nút "Đăng nhập với Google"<br>2. Hệ thống chuyển hướng đến Google OAuth consent screen<br>3. Học viên chọn tài khoản Google và xác nhận quyền truy cập<br>4. Google trả về authorization code<br>5. Hệ thống đổi authorization code lấy access token<br>6. Hệ thống lấy thông tin người dùng từ Google API<br>7. Hệ thống kiểm tra google_id đã tồn tại trong database<br>8. Nếu chưa có: Hệ thống tạo tài khoản mới với google_id<br>9. Nếu đã có: Hệ thống cập nhật thông tin từ Google<br>10. Hệ thống tạo session và JWT token<br>11. Hệ thống chuyển hướng đến dashboard |
| **Luồng thay thế** | **3a. Email không tồn tại:**<br>- Hệ thống thông báo lỗi "Email hoặc mật khẩu không đúng" (không tiết lộ email có tồn tại hay không vì lý do bảo mật)<br>- Học viên kiểm tra lại thông tin và thử lại<br><br>**4a. Mật khẩu sai:**<br>- Hệ thống thông báo lỗi "Email hoặc mật khẩu không đúng"<br>- Hệ thống có thể tăng số lần thử đăng nhập sai<br>- Sau nhiều lần sai, hệ thống có thể khóa tài khoản tạm thời<br><br>**5a. Tài khoản chưa xác thực email:**<br>- Hệ thống thông báo "Vui lòng xác thực email trước khi đăng nhập"<br>- Hệ thống cung cấp link để gửi lại email xác thực<br><br>**5b. Tài khoản bị khóa (is_active = false):**<br>- Hệ thống thông báo "Tài khoản của bạn đã bị khóa"<br>- Học viên cần liên hệ quản trị viên<br><br>**7a. Google OAuth bị từ chối:**<br>- Hệ thống chuyển hướng về trang đăng nhập<br>- Hệ thống thông báo "Đăng nhập bằng Google bị hủy" |

## Sơ đồ Hoạt động - Đăng ký tài khoản

```mermaid
flowchart TD
    Start([Bắt đầu]) --> ShowForm[Hiển thị form đăng ký]
    ShowForm --> FillInfo[Học viên điền thông tin:<br/>email, password, họ tên, MSSV]
    FillInfo --> Validate{Kiểm tra<br/>hợp lệ?}
    
    Validate -->|Không hợp lệ| ShowError1[Hiển thị lỗi validation]
    ShowError1 --> FillInfo
    
    Validate -->|Hợp lệ| CheckEmail{Email đã<br/>tồn tại?}
    CheckEmail -->|Có| ShowError2[Hiển thị: Email đã được sử dụng]
    ShowError2 --> ShowOptions[Hiển thị: Đăng nhập hoặc Quên mật khẩu]
    ShowOptions --> End1([Kết thúc])
    
    CheckEmail -->|Chưa| HashPassword[Hash mật khẩu<br/>bằng bcrypt]
    HashPassword --> CreateUser[Tạo User record<br/>role: student<br/>email_verified: false]
    CreateUser --> CreateToken[Tạo EmailVerification token<br/>OTP code 6 chữ số]
    CreateToken --> SendEmail[Gửi email xác thực<br/>chứa OTP code]
    SendEmail --> CheckEmailSent{Email<br/>đã gửi?}
    
    CheckEmailSent -->|Không| ShowError3[Hiển thị: Lỗi gửi email]
    ShowError3 --> OfferResend[Cung cấp nút<br/>Gửi lại email]
    OfferResend --> CreateToken
    
    CheckEmailSent -->|Có| ShowSuccess1[Hiển thị: Đăng ký thành công<br/>Vui lòng kiểm tra email]
    ShowSuccess1 --> WaitVerification[Chờ học viên xác thực email]
    
    WaitVerification --> OpenEmail[Học viên mở email]
    OpenEmail --> EnterOTP[Học viên nhập OTP code]
    EnterOTP --> VerifyOTP{Hệ thống<br/>xác thực OTP?}
    
    VerifyOTP -->|Sai| ShowError4[Hiển thị: OTP không đúng]
    ShowError4 --> CheckAttempts{Số lần thử<br/>< 3?}
    CheckAttempts -->|Có| EnterOTP
    CheckAttempts -->|Không| ShowError5[Hiển thị: Đã vượt quá số lần thử<br/>Vui lòng yêu cầu OTP mới]
    ShowError5 --> OfferResend
    
    VerifyOTP -->|Đúng| UpdateUser[Cập nhật User:<br/>email_verified = true<br/>email_verified_at = now]
    UpdateUser --> MarkTokenUsed[Đánh dấu token đã sử dụng]
    MarkTokenUsed --> ShowSuccess2[Hiển thị: Xác thực thành công]
    ShowSuccess2 --> RedirectLogin[Chuyển hướng đến trang đăng nhập]
    RedirectLogin --> End2([Kết thúc])
    
    style Start fill:#4A90E2,stroke:#2E5C8A,stroke-width:2px,color:#fff
    style End1 fill:#FF6B6B,stroke:#CC5555,stroke-width:2px,color:#fff
    style End2 fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style CreateUser fill:#10A37F,stroke:#0A7A5F,stroke-width:2px
    style SendEmail fill:#FFA500,stroke:#CC8800,stroke-width:2px
    style UpdateUser fill:#10A37F,stroke:#0A7A5F,stroke-width:2px
```

## Sơ đồ Hoạt động - Đăng nhập hệ thống

```mermaid
flowchart TD
    Start([Bắt đầu]) --> ShowForm[Hiển thị form đăng nhập]
    ShowForm --> ChooseMethod{Chọn phương thức<br/>đăng nhập}
    
    ChooseMethod -->|Email/Password| EnterEmailPass[Nhập email và mật khẩu]
    ChooseMethod -->|Google OAuth| ClickGoogle[Click "Đăng nhập với Google"]
    
    EnterEmailPass --> SubmitForm[Gửi form đăng nhập]
    SubmitForm --> ValidateEmail{Email có<br/>tồn tại?}
    
    ValidateEmail -->|Không| ShowError1[Hiển thị: Email hoặc mật khẩu không đúng]
    ShowError1 --> EnterEmailPass
    
    ValidateEmail -->|Có| CheckPassword{Mật khẩu<br/>đúng?}
    CheckPassword -->|Sai| ShowError2[Hiển thị: Email hoặc mật khẩu không đúng]
    ShowError2 --> CheckAttempts{Số lần thử<br/>< 5?}
    CheckAttempts -->|Có| EnterEmailPass
    CheckAttempts -->|Không| LockAccount[Khóa tài khoản tạm thời]
    LockAccount --> End1([Kết thúc])
    
    CheckPassword -->|Đúng| CheckVerified{Email đã<br/>xác thực?}
    CheckVerified -->|Chưa| ShowError3[Hiển thị: Vui lòng xác thực email trước]
    ShowError3 --> OfferResend[Hiển thị link: Gửi lại email xác thực]
    OfferResend --> End2([Kết thúc])
    
    CheckVerified -->|Đã| CheckActive{Tài khoản<br/>đang hoạt động?}
    CheckActive -->|Không| ShowError4[Hiển thị: Tài khoản đã bị khóa]
    ShowError4 --> End3([Kết thúc])
    
    CheckActive -->|Có| CreateSession[Tạo phiên đăng nhập]
    CreateSession --> UpdateLogin[Cập nhật thông tin đăng nhập]
    UpdateLogin --> RedirectDashboard[Chuyển hướng đến Dashboard]
    RedirectDashboard --> End4([Kết thúc - Đăng nhập thành công])
    
    ClickGoogle --> RedirectGoogle[Chuyển hướng đến Google OAuth]
    RedirectGoogle --> GoogleConsent[Google hiển thị màn hình xác nhận]
    GoogleConsent --> UserConfirm{Học viên<br/>xác nhận?}
    
    UserConfirm -->|Từ chối| ShowError5[Hiển thị: Đăng nhập bằng Google bị hủy]
    ShowError5 --> ShowForm
    
    UserConfirm -->|Xác nhận| GetGoogleInfo[Lấy thông tin từ Google]
    GetGoogleInfo --> CheckGoogleAccount{Tài khoản Google<br/>đã liên kết?}
    
    CheckGoogleAccount -->|Chưa| CreateNewAccount[Tạo tài khoản mới<br/>với Google ID]
    CreateNewAccount --> CreateSession
    
    CheckGoogleAccount -->|Đã có| UpdateGoogleInfo[Cập nhật thông tin từ Google]
    UpdateGoogleInfo --> CreateSession
    
    style Start fill:#4A90E2,stroke:#2E5C8A,stroke-width:2px,color:#fff
    style End1 fill:#FF6B6B,stroke:#CC5555,stroke-width:2px,color:#fff
    style End2 fill:#FF6B6B,stroke:#CC5555,stroke-width:2px,color:#fff
    style End3 fill:#FF6B6B,stroke:#CC5555,stroke-width:2px,color:#fff
    style End4 fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style CreateSession fill:#10A37F,stroke:#0A7A5F,stroke-width:2px
    style CreateNewAccount fill:#10A37F,stroke:#0A7A5F,stroke-width:2px
    style RedirectGoogle fill:#FFA500,stroke:#CC8800,stroke-width:2px
```

## Sơ đồ Tuần tự - Đăng ký tài khoản

```mermaid
sequenceDiagram
    participant HV as Học viên
    participant HT as Hệ thống
    participant Email as Email Service

    HV->>HT: Truy cập trang đăng ký
    HT-->>HV: Hiển thị form đăng ký
    
    HV->>HT: Điền thông tin (email, mật khẩu, họ tên, MSSV)
    HV->>HT: Gửi form đăng ký
    
    HT->>HT: Kiểm tra tính hợp lệ của thông tin
    
    alt Thông tin không hợp lệ
        HT-->>HV: Hiển thị lỗi validation
        HV->>HT: Sửa lại thông tin
    else Thông tin hợp lệ
        HT->>HT: Kiểm tra email đã tồn tại
        
        alt Email đã tồn tại
            HT-->>HV: Thông báo: Email đã được sử dụng
            HT-->>HV: Gợi ý: Đăng nhập hoặc Quên mật khẩu
        else Email chưa tồn tại
            HT->>HT: Tạo tài khoản mới
            HT->>HT: Tạo mã OTP xác thực
            HT->>Email: Gửi email chứa mã OTP
            Email-->>HT: Email đã gửi
            HT-->>HV: Thông báo: Đăng ký thành công, vui lòng kiểm tra email
            
            Note over HV,Email: Học viên mở email và lấy mã OTP
            
            HV->>HT: Nhập mã OTP
            HT->>HT: Xác thực mã OTP
            
            alt Mã OTP đúng
                HT->>HT: Kích hoạt tài khoản
                HT-->>HV: Thông báo: Xác thực thành công
                HT-->>HV: Chuyển hướng đến trang đăng nhập
            else Mã OTP sai hoặc hết hạn
                HT-->>HV: Thông báo: Mã OTP không đúng hoặc đã hết hạn
                HT-->>HV: Gợi ý: Yêu cầu gửi lại mã OTP
            end
        end
    end
```

## Sơ đồ Tuần tự - Đăng nhập hệ thống

```mermaid
sequenceDiagram
    participant HV as Học viên
    participant HT as Hệ thống
    participant Google as Google OAuth

    HV->>HT: Truy cập trang đăng nhập
    HT-->>HV: Hiển thị form đăng nhập
    
    alt Phương thức 1: Đăng nhập bằng Email/Password
        HV->>HT: Nhập email và mật khẩu
        HV->>HT: Gửi form đăng nhập
        
        HT->>HT: Kiểm tra email có tồn tại
        
        alt Email không tồn tại
            HT-->>HV: Thông báo: Email hoặc mật khẩu không đúng
        else Email tồn tại
            HT->>HT: Kiểm tra mật khẩu
            
            alt Mật khẩu sai
                HT-->>HV: Thông báo: Email hoặc mật khẩu không đúng
            else Mật khẩu đúng
                HT->>HT: Kiểm tra email đã xác thực
                
                alt Email chưa xác thực
                    HT-->>HV: Thông báo: Vui lòng xác thực email trước
                    HT-->>HV: Gợi ý: Gửi lại email xác thực
                else Email đã xác thực
                    HT->>HT: Kiểm tra tài khoản đang hoạt động
                    
                    alt Tài khoản bị khóa
                        HT-->>HV: Thông báo: Tài khoản đã bị khóa
                    else Tài khoản hoạt động
                        HT->>HT: Tạo phiên đăng nhập
                        HT->>HT: Cập nhật thông tin đăng nhập
                        HT-->>HV: Chuyển hướng đến Dashboard
                        HT-->>HV: Hiển thị trang Dashboard
                    end
                end
            end
        end
    else Phương thức 2: Đăng nhập bằng Google OAuth
        HV->>HT: Click "Đăng nhập với Google"
        HT->>Google: Chuyển hướng đến Google OAuth
        Google-->>HV: Hiển thị màn hình xác nhận
        
        alt Học viên từ chối
            Google-->>HT: Hủy đăng nhập
            HT-->>HV: Thông báo: Đăng nhập bằng Google bị hủy
            HT-->>HV: Quay lại trang đăng nhập
        else Học viên xác nhận
            Google->>HT: Trả về thông tin người dùng
            HT->>HT: Kiểm tra tài khoản Google đã liên kết
            
            alt Tài khoản chưa liên kết
                HT->>HT: Tạo tài khoản mới với Google ID
                HT->>HT: Tự động xác thực email
            else Tài khoản đã liên kết
                HT->>HT: Cập nhật thông tin từ Google
            end
            
            HT->>HT: Tạo phiên đăng nhập
            HT-->>HV: Chuyển hướng đến Dashboard
            HT-->>HV: Hiển thị trang Dashboard
        end
    end
```

---

**🏛️ Trường Đại học Công nghệ Thông tin**  
**🌍 Đại học Quốc gia TP. Hồ Chí Minh**
