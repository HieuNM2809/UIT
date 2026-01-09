# 🔐 User Authentication Flow

## Tổng quan
Hệ thống xác thực người dùng sử dụng JWT (JSON Web Token) và session management với Redis.

## Sơ đồ
Xem file: `06-user-authentication-flow.png`

## Flow đăng ký (Register)

### Bước 1-3: Input & Validation
1. User nhập thông tin: email, password, fullname, role
2. Frontend validate:
   - Email format hợp lệ
   - Password >= 8 ký tự
   - Fullname không rỗng
3. POST `/api/auth/register`

### Bước 4-5: Backend Processing
4. Express-validator kiểm tra:
   - Email chưa tồn tại
   - Password strength
   - Required fields
5. Hash password với bcrypt (salt rounds: 10)

### Bước 6-8: Database & Email
6. INSERT vào table USER
7. Gửi email verification
8. Return response: `{message: "Please verify email"}`

## Flow đăng nhập (Login)

### Bước 1-3: Credentials
1. User nhập email + password
2. Frontend validate format
3. POST `/api/auth/login`

### Bước 4-7: Verification
4. Query USER table by email
5. bcrypt.compare(password, hash)
6. Generate JWT token (expires: 7d)
7. Create session in Redis (TTL: 24h)

### Bước 8-10: Response
8. Return: `{token, user: {id, email, role, fullname}}`
9. Frontend lưu token vào localStorage
10. Redirect → `/dashboard`

## Security Features
- ✅ Password hashing (bcrypt)
- ✅ JWT authentication
- ✅ Redis session storage
- ✅ Email verification
- ✅ Rate limiting (5 attempts/15min)
- ✅ XSS protection

## Error Handling
- `400`: Validation failed
- `401`: Invalid credentials
- `409`: Email already exists
- `500`: Server error
