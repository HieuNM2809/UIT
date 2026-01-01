# Hướng dẫn tạo Google OAuth Credentials

## Bước 1: Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Đăng nhập bằng tài khoản Google của bạn
3. Click vào dropdown project ở trên cùng (hoặc tạo project mới)
4. Click **"New Project"** nếu chưa có project
5. Đặt tên project (ví dụ: "StudyMate OAuth")
6. Click **"Create"**

## Bước 2: Kích hoạt Google+ API

1. Vào **APIs & Services** > **Library**
2. Tìm kiếm "Google+ API" hoặc "People API"
3. Click vào **Google+ API**
4. Click **"Enable"** (nếu chưa enable)

**Lưu ý:** Google+ API đã deprecated, nhưng bạn có thể dùng **People API** thay thế. Tuy nhiên, OAuth 2.0 vẫn hoạt động với profile và email scope.

## Bước 3: Tạo OAuth 2.0 Client ID

1. Vào **APIs & Services** > **Credentials**
2. Click **"+ CREATE CREDENTIALS"** ở trên cùng
3. Chọn **"OAuth client ID"**

### Nếu lần đầu tiên:
- Bạn sẽ được yêu cầu cấu hình **OAuth consent screen**
- Chọn **"External"** (cho development) hoặc **"Internal"** (chỉ cho G Suite)
- Click **"Create"**

### Cấu hình OAuth consent screen:
1. **App name**: StudyMate (hoặc tên bạn muốn)
2. **User support email**: Email của bạn
3. **Developer contact information**: Email của bạn
4. Click **"Save and Continue"**
5. **Scopes**: Click **"Add or Remove Scopes"**
   - Chọn: `.../auth/userinfo.email` và `.../auth/userinfo.profile`
   - Click **"Update"** > **"Save and Continue"**
6. **Test users** (nếu cần): Thêm email test
7. Click **"Save and Continue"** > **"Back to Dashboard"**

### Tạo OAuth Client ID:
1. **Application type**: Chọn **"Web application"**
2. **Name**: StudyMate Web Client (hoặc tên bạn muốn)
3. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   https://yourdomain.com (nếu có)
   ```
4. **Authorized redirect URIs**:
   ```
   http://localhost:3000/auth/google/callback
   https://yourdomain.com/auth/google/callback (nếu có)
   ```
5. Click **"Create"**

## Bước 4: Lấy Credentials

Sau khi tạo, bạn sẽ thấy:
- **Client ID**: Copy giá trị này
- **Client secret**: Click **"Show"** và copy

## Bước 5: Thêm vào .env

Mở file `.env` và thêm:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
BASE_URL=http://localhost:3000
```

**Ví dụ:**
```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
BASE_URL=http://localhost:3000
```

## Bước 6: Test

1. Restart server: `npm run dev`
2. Truy cập: `http://localhost:3000/auth/login`
3. Click **"Đăng nhập với Google"**
4. Chọn tài khoản Google
5. Cho phép quyền truy cập
6. Bạn sẽ được redirect về ứng dụng và đăng nhập thành công!

## Lưu ý quan trọng

### Development (localhost):
- ✅ Miễn phí
- ✅ Không giới hạn
- ✅ Có thể test ngay

### Production:
- Cần thêm domain vào **Authorized JavaScript origins**
- Cần thêm callback URL production vào **Authorized redirect URIs**
- Có thể cần verify domain (tùy trường hợp)
- Vẫn **MIỄN PHÍ** cho OAuth authentication

### Security:
- **KHÔNG** commit file `.env` lên Git
- **KHÔNG** chia sẻ Client Secret
- Nếu Client Secret bị lộ, tạo lại ngay trong Google Cloud Console

## Troubleshooting

### Lỗi: "redirect_uri_mismatch"
- Kiểm tra **Authorized redirect URIs** trong Google Cloud Console
- Đảm bảo URL chính xác (không có trailing slash)
- Đảm bảo `GOOGLE_CALLBACK_URL` trong `.env` khớp với cấu hình

### Lỗi: "access_denied"
- User đã từ chối quyền truy cập
- Thử lại và chấp nhận quyền

### Lỗi: "invalid_client"
- Kiểm tra `GOOGLE_CLIENT_ID` và `GOOGLE_CLIENT_SECRET` trong `.env`
- Đảm bảo không có khoảng trắng thừa

### Button không hiển thị:
- Kiểm tra `GOOGLE_CLIENT_ID` và `GOOGLE_CLIENT_SECRET` đã được set trong `.env`
- Restart server sau khi thêm env variables

## Tài liệu tham khảo

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)

