# 🔐 Kiến Trúc Hệ Thống Xác Thực - StudyMate

**Ngày tạo:** 2026-01-02  
**Phiên bản:** 1.0.0

---

## 📋 Tổng Quan

Hệ thống xác thực của StudyMate hỗ trợ nhiều phương thức:
- **Email/Password Authentication** - Đăng nhập truyền thống
- **Google OAuth 2.0** - Đăng nhập bằng tài khoản Google
- **Email Verification** - Xác thực email bằng OTP
- **Password Reset** - Đặt lại mật khẩu qua email
- **Session & JWT** - Quản lý phiên đăng nhập

---

## 🏗️ 1. Component Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[🌐 Web Browser]
        LoginForm[📝 Login Form]
        RegisterForm[📝 Register Form]
        OAuthButton[🔵 Google OAuth Button]
    end

    subgraph "Route Layer"
        AuthRoutes[🔑 Auth Routes<br/>/auth/*]
        LoginRoute[POST /auth/login]
        RegisterRoute[POST /auth/register]  
        GoogleRoute[GET /auth/google]
        GoogleCallback[GET /auth/google/callback]
        ForgotPasswordRoute[POST /auth/forgot-password]
        ResetPasswordRoute[POST /auth/reset-password/:token]
        VerifyEmailRoute[POST /auth/verify-email]
    end

    subgraph "Controller Layer"
        AuthController[Auth Controller]
        LoginHandler[Login Handler]
        RegisterHandler[Register Handler]
        GoogleHandler[Google OAuth Handler]
        ForgotPasswordHandler[Forgot Password Handler]
        ResetPasswordHandler[Reset Password Handler]
        VerifyEmailHandler[Verify Email Handler]
    end

    subgraph "Service Layer"
        EmailService[📧 Email Service]
        PassportService[🔐 Passport.js]
        BcryptService[🔒 Bcrypt Hashing]
    end

    subgraph "Model Layer"
        UserModel[👤 User Model]
        EmailVerificationModel[📧 EmailVerification Model]
        PasswordResetTokenModel[🔑 PasswordResetToken Model]
    end

    subgraph "Storage Layer"
        PostgreSQL[(🗄️ PostgreSQL)]
        Redis[(⚡ Redis<br/>Session Store)]
    end

    subgraph "External Services"
        GoogleOAuth[🌐 Google OAuth API]
        SMTP[📧 SMTP Server]
    end

    Browser --> LoginForm
    Browser --> RegisterForm
    Browser --> OAuthButton

    LoginForm --> LoginRoute
    RegisterForm --> RegisterRoute
    OAuthButton --> GoogleRoute

    LoginRoute --> AuthController
    RegisterRoute --> AuthController
    GoogleRoute --> AuthController
    GoogleCallback --> AuthController
    ForgotPasswordRoute --> AuthController
    ResetPasswordRoute --> AuthController
    VerifyEmailRoute --> AuthController

    AuthController --> LoginHandler
    AuthController --> RegisterHandler
    AuthController --> GoogleHandler
    AuthController --> ForgotPasswordHandler
    AuthController --> ResetPasswordHandler
    AuthController --> VerifyEmailHandler

    LoginHandler --> UserModel
    RegisterHandler --> UserModel
    GoogleHandler --> PassportService
    ForgotPasswordHandler --> UserModel
    ResetPasswordHandler --> UserModel
    VerifyEmailHandler --> EmailVerificationModel

    UserModel --> PostgreSQL
    EmailVerificationModel --> PostgreSQL
    PasswordResetTokenModel --> PostgreSQL

    PassportService --> GoogleOAuth
    EmailService --> SMTP
    BcryptService --> UserModel

    AuthController --> Redis
    AuthController --> EmailService

    style AuthController fill:#4A90E2,stroke:#2E5C8A,stroke-width:3px,color:#fff
    style UserModel fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style PostgreSQL fill:#336791,stroke:#1A3A52,stroke-width:2px,color:#fff
    style Redis fill:#DC382D,stroke:#A0261E,stroke-width:2px,color:#fff
    style GoogleOAuth fill:#4285F4,stroke:#1A73E8,stroke-width:2px,color:#fff
```

---

## 🔄 2. Registration Flow Sequence

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Route
    participant Controller
    participant UserModel
    participant EmailVerification
    participant EmailService
    participant SMTP
    participant PostgreSQL

    User->>Browser: Điền form đăng ký
    Browser->>Route: POST /auth/register
    Route->>Controller: register()
    
    Controller->>UserModel: Check email exists
    UserModel->>PostgreSQL: SELECT * FROM users WHERE email = ?
    PostgreSQL-->>UserModel: Result
    UserModel-->>Controller: null (not exists)
    
    Controller->>UserModel: Check student_id exists (if provided)
    UserModel->>PostgreSQL: SELECT * FROM users WHERE student_id = ?
    PostgreSQL-->>UserModel: Result
    UserModel-->>Controller: null (not exists)
    
    Controller->>UserModel: Create user (is_active=false, email_verified=false)
    UserModel->>PostgreSQL: INSERT INTO users (...)
    Note over UserModel: Password hashed by beforeCreate hook
    PostgreSQL-->>UserModel: New user
    
    Controller->>EmailVerification: Generate OTP (6 digits)
    Controller->>EmailVerification: Create verification record
    EmailVerification->>PostgreSQL: INSERT INTO email_verifications
    PostgreSQL-->>EmailVerification: Verification record
    
    Controller->>EmailService: sendVerificationOTP(email, otp, name)
    EmailService->>SMTP: Send email with OTP
    SMTP-->>EmailService: Email sent
    EmailService-->>Controller: Success
    
    Controller->>Browser: Redirect to /auth/verify-email
    Browser->>User: Hiển thị form nhập OTP
    
    Note over User,PostgreSQL: User nhận email và nhập OTP
```

---

## 🔐 3. Login Flow Sequence

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Route
    participant Controller
    participant UserModel
    participant Session
    participant Redis
    participant PostgreSQL

    User->>Browser: Nhập email/password
    Browser->>Route: POST /auth/login
    Route->>Controller: login()
    
    Controller->>UserModel: findByEmail(email)
    UserModel->>PostgreSQL: SELECT * FROM users WHERE email = ?
    PostgreSQL-->>UserModel: User object
    UserModel-->>Controller: User
    
    alt User not found
        Controller-->>Browser: Error: Email hoặc mật khẩu không chính xác
    else User found
        Controller->>UserModel: validatePassword(password)
        UserModel->>UserModel: bcrypt.compare(password, user.password)
        UserModel-->>Controller: true/false
        
        alt Password invalid
            Controller-->>Browser: Error: Email hoặc mật khẩu không chính xác
        else Password valid
            alt Email not verified
                Controller->>EmailVerification: Check verification status
                Controller->>EmailService: Resend OTP
                Controller-->>Browser: Redirect to /auth/verify-email
            else Email verified
                Controller->>UserModel: Update last_login, login_count
                UserModel->>PostgreSQL: UPDATE users SET ...
                PostgreSQL-->>UserModel: Updated
                
                Controller->>Controller: Generate JWT token
                Controller->>Session: Set session.user = user.toSafeObject()
                Session->>Redis: Store session
                Redis-->>Session: Session stored
                
                Controller->>Browser: Set cookie (token)
                Controller->>Browser: Redirect to /dashboard
                Browser->>User: Hiển thị dashboard
            end
        end
    end
```

---

## 🌐 4. Google OAuth Flow Sequence

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Route
    participant Controller
    participant Passport
    participant GoogleOAuth
    participant UserModel
    participant Session
    participant PostgreSQL

    User->>Browser: Click "Đăng nhập với Google"
    Browser->>Route: GET /auth/google
    Route->>Controller: googleLogin()
    Controller->>Passport: authenticate('google')
    Passport->>GoogleOAuth: Redirect to Google
    GoogleOAuth->>User: Google login page
    User->>GoogleOAuth: Nhập credentials
    GoogleOAuth->>GoogleOAuth: Verify credentials
    GoogleOAuth->>Route: GET /auth/google/callback?code=...
    Route->>Controller: googleCallback()
    Controller->>Passport: authenticate('google', callback)
    Passport->>GoogleOAuth: Exchange code for token
    GoogleOAuth-->>Passport: Access token + profile
    Passport->>Passport: Strategy callback
    
    alt User exists by google_id
        Passport->>UserModel: findOne({ google_id })
        UserModel->>PostgreSQL: SELECT * FROM users WHERE google_id = ?
        PostgreSQL-->>UserModel: User
        UserModel-->>Passport: User found
    else User not found
        Passport->>UserModel: findByEmail(email)
        UserModel->>PostgreSQL: SELECT * FROM users WHERE email = ?
        PostgreSQL-->>UserModel: User or null
        
        alt User exists by email
            Passport->>UserModel: Update google_id
            UserModel->>PostgreSQL: UPDATE users SET google_id = ?
            PostgreSQL-->>UserModel: Updated
        else New user
            Passport->>UserModel: Create user with google_id
            UserModel->>PostgreSQL: INSERT INTO users (google_id, email, ...)
            Note over UserModel: No password for OAuth users
            PostgreSQL-->>UserModel: New user
        end
    end
    
    Passport-->>Controller: User object
    Controller->>UserModel: Update last_login, login_count
    UserModel->>PostgreSQL: UPDATE users SET ...
    Controller->>Session: Set session.user
    Session->>Redis: Store session
    Controller->>Browser: Set cookie (token)
    Controller->>Browser: Redirect to /dashboard
    Browser->>User: Hiển thị dashboard
```

---

## 📧 5. Email Verification Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Route
    participant Controller
    participant EmailVerification
    participant UserModel
    participant PostgreSQL

    User->>Browser: Nhập OTP từ email
    Browser->>Route: POST /auth/verify-email
    Route->>Controller: verifyEmail()
    
    Controller->>Controller: Validate OTP format (6 digits)
    
    Controller->>EmailVerification: findByUserId(userId)
    EmailVerification->>PostgreSQL: SELECT * FROM email_verifications WHERE user_id = ?
    PostgreSQL-->>EmailVerification: Verification record
    EmailVerification-->>Controller: Verification
    
    Controller->>EmailVerification: verifyOTP(otp_code)
    
    alt OTP invalid
        EmailVerification->>EmailVerification: Increment attempts
        alt Attempts >= 5
            Controller-->>Browser: Error: Vượt quá số lần thử
        else Attempts < 5
            Controller-->>Browser: Error: OTP không chính xác
        end
    else OTP valid
        alt OTP expired
            Controller-->>Browser: Error: OTP đã hết hạn
        else OTP valid and not expired
            Controller->>UserModel: Update user
            UserModel->>PostgreSQL: UPDATE users SET email_verified=true, is_active=true
            PostgreSQL-->>UserModel: Updated
            
            Controller->>EmailVerification: Mark as verified
            EmailVerification->>PostgreSQL: UPDATE email_verifications SET is_verified=true
            PostgreSQL-->>EmailVerification: Updated
            
            Controller->>Browser: Redirect to /auth/login
            Browser->>User: Hiển thị thông báo thành công
        end
    end
```

---

## 🔑 6. Password Reset Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Route
    participant Controller
    participant UserModel
    participant PasswordResetToken
    participant EmailService
    participant SMTP
    participant PostgreSQL

    User->>Browser: Nhập email
    Browser->>Route: POST /auth/forgot-password
    Route->>Controller: forgotPassword()
    
    Controller->>UserModel: findByEmail(email)
    UserModel->>PostgreSQL: SELECT * FROM users WHERE email = ?
    PostgreSQL-->>UserModel: User or null
    
    alt User not found
        Note over Controller: Security: Always return success
        Controller-->>Browser: Success message (generic)
    else User found
        Controller->>PasswordResetToken: Generate token
        Controller->>PasswordResetToken: Invalidate old tokens
        PasswordResetToken->>PostgreSQL: UPDATE password_reset_tokens SET used=true
        PostgreSQL-->>PasswordResetToken: Updated
        
        Controller->>PasswordResetToken: Create new token
        PasswordResetToken->>PostgreSQL: INSERT INTO password_reset_tokens
        PostgreSQL-->>PasswordResetToken: Token created
        
        Controller->>EmailService: sendPasswordResetEmail(email, token, resetUrl)
        EmailService->>SMTP: Send email with reset link
        SMTP-->>EmailService: Email sent
        EmailService-->>Controller: Success
        
        Controller-->>Browser: Success message (generic)
    end
    
    Note over User,PostgreSQL: User nhận email và click link
    
    User->>Browser: Click reset link
    Browser->>Route: GET /auth/reset-password/:token
    Route->>Controller: showResetPassword()
    Controller->>PasswordResetToken: findValidToken(token)
    PasswordResetToken->>PostgreSQL: SELECT * FROM password_reset_tokens WHERE token = ? AND used = false
    PostgreSQL-->>PasswordResetToken: Token or null
    
    alt Token invalid or expired
        Controller-->>Browser: Error: Link không hợp lệ
    else Token valid
        Controller-->>Browser: Hiển thị form đặt lại mật khẩu
        
        User->>Browser: Nhập mật khẩu mới
        Browser->>Route: POST /auth/reset-password/:token
        Route->>Controller: resetPassword()
        
        Controller->>PasswordResetToken: findValidToken(token)
        Controller->>UserModel: findByPk(userId)
        UserModel->>PostgreSQL: SELECT * FROM users WHERE id = ?
        PostgreSQL-->>UserModel: User
        
        Controller->>UserModel: Update password
        UserModel->>UserModel: Hash password (beforeUpdate hook)
        UserModel->>PostgreSQL: UPDATE users SET password = ?
        PostgreSQL-->>UserModel: Updated
        
        Controller->>PasswordResetToken: Mark token as used
        PasswordResetToken->>PostgreSQL: UPDATE password_reset_tokens SET used=true
        Controller->>PasswordResetToken: Invalidate all other tokens
        PasswordResetToken->>PostgreSQL: UPDATE password_reset_tokens SET used=true WHERE user_id = ?
        
        Controller->>EmailService: sendPasswordResetSuccessEmail(email)
        EmailService->>SMTP: Send confirmation email
        SMTP-->>EmailService: Email sent
        
        Controller->>Browser: Redirect to /auth/login
        Browser->>User: Hiển thị thông báo thành công
    end
```

---

## 🎭 7. Role-Based Access Control (RBAC)

```mermaid
graph TB
    subgraph "User Roles"
        Student[👨‍🎓 Student<br/>Default role]
        Teacher[👨‍🏫 Teacher<br/>Can create courses]
        Lecturer[👨‍🏫 Lecturer<br/>Can create courses]
        Admin[👨‍💼 Admin<br/>Full access]
        SystemAdmin[⚙️ System Admin<br/>System management]
    end

    subgraph "Permission Matrix"
        ViewCourses[📚 View Courses]
        EnrollCourses[✅ Enroll Courses]
        CreateCourses[➕ Create Courses]
        EditOwnCourses[✏️ Edit Own Courses]
        EditAllCourses[✏️ Edit All Courses]
        ManageUsers[👥 Manage Users]
        ManageSystem[⚙️ Manage System]
        AccessAdmin[🔐 Access Admin Panel]
    end

    Student --> ViewCourses
    Student --> EnrollCourses
    
    Teacher --> ViewCourses
    Teacher --> EnrollCourses
    Teacher --> CreateCourses
    Teacher --> EditOwnCourses
    
    Lecturer --> ViewCourses
    Lecturer --> EnrollCourses
    Lecturer --> CreateCourses
    Lecturer --> EditOwnCourses
    
    Admin --> ViewCourses
    Admin --> EnrollCourses
    Admin --> CreateCourses
    Admin --> EditAllCourses
    Admin --> ManageUsers
    Admin --> AccessAdmin
    
    SystemAdmin --> ViewCourses
    SystemAdmin --> EnrollCourses
    SystemAdmin --> CreateCourses
    SystemAdmin --> EditAllCourses
    SystemAdmin --> ManageUsers
    SystemAdmin --> ManageSystem
    SystemAdmin --> AccessAdmin

    style Student fill:#4A90E2,stroke:#2E5C8A,stroke-width:2px,color:#fff
    style Teacher fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style Lecturer fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style Admin fill:#FF6B6B,stroke:#CC5555,stroke-width:2px,color:#fff
    style SystemAdmin fill:#9B59B6,stroke:#7D3C98,stroke-width:2px,color:#fff
```

---

## 🔒 8. Security Mechanisms

```mermaid
graph TB
    subgraph "Password Security"
        Bcrypt[Bcrypt Hashing<br/>Salt rounds: 12]
        PasswordValidation[Password Validation<br/>Min length, complexity]
        PasswordHistory[Password History<br/>Prevent reuse]
    end

    subgraph "Session Security"
        HttpOnlyCookies[HttpOnly Cookies<br/>Prevent XSS]
        SecureCookies[Secure Cookies<br/>HTTPS only in production]
        SessionExpiry[Session Expiry<br/>24 hours default]
        SessionRegeneration[Session Regeneration<br/>On login]
    end

    subgraph "Token Security"
        JWTSecret[JWT Secret<br/>Strong random key]
        TokenExpiry[Token Expiry<br/>24h default, 7d with remember_me]
        TokenRefresh[Token Refresh<br/>On activity]
    end

    subgraph "Rate Limiting"
        LoginRateLimit[Login Rate Limit<br/>5 attempts per 15 min]
        RegisterRateLimit[Register Rate Limit<br/>3 per hour per IP]
        PasswordResetLimit[Password Reset Limit<br/>3 per hour per email]
    end

    subgraph "Email Security"
        OTPExpiry[OTP Expiry<br/>15 minutes]
        OTPAttempts[OTP Attempts<br/>Max 5 attempts]
        OTPFormat[OTP Format<br/>6 digits, numeric]
    end

    subgraph "Data Protection"
        InputSanitization[Input Sanitization<br/>XSS prevention]
        SQLInjectionPrevention[SQL Injection Prevention<br/>Sequelize parameterized queries]
        CSRFProtection[CSRF Protection<br/>CSRF tokens]
    end

    Bcrypt --> PasswordValidation
    PasswordValidation --> PasswordHistory
    
    HttpOnlyCookies --> SecureCookies
    SecureCookies --> SessionExpiry
    SessionExpiry --> SessionRegeneration
    
    JWTSecret --> TokenExpiry
    TokenExpiry --> TokenRefresh
    
    LoginRateLimit --> RegisterRateLimit
    RegisterRateLimit --> PasswordResetLimit
    
    OTPExpiry --> OTPAttempts
    OTPAttempts --> OTPFormat
    
    InputSanitization --> SQLInjectionPrevention
    SQLInjectionPrevention --> CSRFProtection

    style Bcrypt fill:#9B59B6,stroke:#7D3C98,stroke-width:2px,color:#fff
    style HttpOnlyCookies fill:#4A90E2,stroke:#2E5C8A,stroke-width:2px,color:#fff
    style JWTSecret fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style LoginRateLimit fill:#FF6B6B,stroke:#CC5555,stroke-width:2px,color:#fff
```

---

## 📊 9. Data Models

### User Model
```javascript
{
  id: UUID (Primary Key),
  student_id: String (Unique, Optional),
  email: String (Unique, Required),
  password: String (Hashed, Optional for OAuth),
  google_id: String (Unique, Optional),
  first_name: String (Required),
  last_name: String (Required),
  role: ENUM('student', 'teacher', 'lecturer', 'admin', 'system_admin'),
  is_active: Boolean (Default: true),
  email_verified: Boolean (Default: false),
  email_verified_at: Date (Optional),
  avatar: String (Optional),
  phone: String (Optional),
  last_login: Date (Optional),
  login_count: Integer (Default: 0),
  created_at: Date,
  updated_at: Date
}
```

### EmailVerification Model
```javascript
{
  id: UUID (Primary Key),
  user_id: UUID (Foreign Key -> users.id),
  email: String (Required),
  otp_code: String (6 digits),
  is_verified: Boolean (Default: false),
  attempts: Integer (Default: 0),
  expires_at: Date (15 minutes from creation),
  created_at: Date,
  updated_at: Date
}
```

### PasswordResetToken Model
```javascript
{
  id: UUID (Primary Key),
  user_id: UUID (Foreign Key -> users.id),
  token: String (Unique, Random token),
  used: Boolean (Default: false),
  expires_at: Date (1 hour from creation),
  created_at: Date,
  updated_at: Date
}
```

---

## 🔗 10. API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/auth/login` | Show login form | No |
| POST | `/auth/login` | Process login | No |
| GET | `/auth/register` | Show register form | No |
| POST | `/auth/register` | Process registration | No |
| GET | `/auth/google` | Initiate Google OAuth | No |
| GET | `/auth/google/callback` | Google OAuth callback | No |
| GET | `/auth/forgot-password` | Show forgot password form | No |
| POST | `/auth/forgot-password` | Request password reset | No |
| GET | `/auth/reset-password/:token` | Show reset password form | No |
| POST | `/auth/reset-password/:token` | Process password reset | No |
| GET | `/auth/verify-email` | Show email verification form | No |
| POST | `/auth/verify-email` | Verify email with OTP | No |
| POST | `/auth/resend-otp` | Resend OTP code | No |
| POST | `/auth/logout` | Logout user | Yes |

---

## 📝 Ghi Chú

### Security Best Practices
1. **Password Hashing**: Sử dụng bcrypt với 12 salt rounds
2. **Session Management**: HttpOnly cookies, secure flag trong production
3. **Rate Limiting**: Giới hạn số lần thử đăng nhập, đăng ký
4. **Email Verification**: Bắt buộc xác thực email trước khi kích hoạt tài khoản
5. **Token Expiry**: OTP hết hạn sau 15 phút, reset token sau 1 giờ
6. **Input Validation**: Validate và sanitize tất cả input từ user

### Error Handling
- Không tiết lộ thông tin chi tiết về lỗi (email không tồn tại, password sai)
- Logging tất cả authentication attempts để audit
- User-friendly error messages bằng tiếng Việt

### Performance Considerations
- Session storage trong Redis để scale horizontally
- JWT tokens cho API calls (stateless)
- Database indexes trên email, student_id, google_id

---

**Tác giả:** StudyMate Development Team  
**Cập nhật:** 2026-01-02

