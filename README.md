# 🎓 StudyMate - Ứng dụng học tập thông minh

**Đồ án tốt nghiệp**
- **Trường:** Đại học Công nghệ Thông tin - ĐHQG-HCM
- **Năm học:** 2024-2025
- **Giáo viên hướng dẫn:** ThS. Phạm Thế Sơn

## 👥 Nhóm phát triển

- **Nguyễn Minh Hiếu** - MSSV: 24410158
- **Lê Anh Kiệt** - MSSV: 24410183

## 📋 Mô tả dự án

StudyMate là ứng dụng học tập thông minh được phát triển bằng Node.js và Express, tích hợp công nghệ AI để hỗ trợ sinh viên trong quá trình học tập. Ứng dụng cung cấp các tính năng:

### ✨ Tính năng chính

- 🎯 **Quản lý khóa học**: Tạo, quản lý và theo dõi khóa học
- 👥 **Quản lý người dùng**: Hỗ trợ nhiều vai trò (sinh viên, giảng viên, admin)
- 🤖 **AI Chatbot**: Trợ lý học tập thông minh với OpenAI/Gemini
- 📊 **Thống kê & Báo cáo**: Theo dõi tiến độ học tập chi tiết
- 💬 **Thảo luận tương tác**: Diễn đàn học tập và Q&A
- 📱 **Responsive Design**: Tối ưu cho mọi thiết bị
- 🔒 **Bảo mật cao**: JWT authentication, rate limiting

### 🚀 Công nghệ sử dụng

**Backend:**
- Node.js + Express.js
- PostgreSQL (Database chính)
- Redis (Caching)
- Sequelize ORM
- JWT Authentication
- Winston Logger

**Frontend:**
- EJS Template Engine
- Tailwind CSS
- Vanilla JavaScript
- AJAX/Fetch API

**AI Integration:**
- OpenAI GPT-3.5/4
- Google Gemini
- Custom prompt engineering

**DevOps:**
- Docker & Docker Compose
- GitHub Actions
- PM2 Process Manager

## 📦 Cài đặt và chạy dự án

### 🖥️ **Kiến trúc triển khai**
- **App**: Chạy trực tiếp trên Windows (không Docker)
- **Database**: PostgreSQL + Redis chạy trong Docker containers
- **Ưu điểm**: Dễ debug, hot-reload nhanh, tiết kiệm tài nguyên

### Yêu cầu hệ thống

- **Node.js** >= 18.0.0 
- **Docker Desktop** (cho database)
- **NPM** >= 8.0.0
- **Windows** 10/11

### 🚀 **Cài đặt nhanh (Recommended)**

```batch
# Clone repository
git clone https://github.com/your-username/studymate.git
cd studymate

# Chạy setup tự động
scripts\setup.bat
```

Script tự động sẽ:
- ✅ Kiểm tra Node.js và Docker
- ✅ Cài đặt dependencies
- ✅ Tạo file .env
- ✅ Khởi động database containers  
- ✅ Test kết nối database

### 🔧 **Cài đặt thủ công**

#### 1. Clone repository
```bash
git clone https://github.com/your-username/studymate.git
cd studymate
```

#### 2. Cài đặt dependencies
```bash
npm install
```

#### 3. Cấu hình môi trường
```bash
# Windows
copy env.example .env

# Hoặc tạo thủ công file .env với nội dung:
```

File `.env`:
```env
# Database containers (Docker)
DB_HOST=localhost
DB_PORT=5432  
DB_NAME=studymate_dev
DB_USER=studymate
DB_PASS=studymate123

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis123

# App configuration
JWT_SECRET=your_super_secret_key_here
SESSION_SECRET=your_session_secret

# AI APIs (optional)
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
```

#### 4. Khởi động database containers
```bash
# Start containers
docker-compose up -d

# Check status
docker-compose ps

# View logs if needed
docker-compose logs postgres
docker-compose logs redis
```

#### 5. Chạy ứng dụng
```bash
# Development mode (với hot-reload)
npm run dev

# Production mode  
npm start
```

Ứng dụng chạy tại: **http://localhost:3000**

### 📊 **Quản lý Database**

```batch
# Khởi động databases
scripts\start-db.bat

# Dừng databases  
scripts\stop-db.bat

# Xem logs
docker-compose logs -f postgres
docker-compose logs -f redis
```

### 🔍 **Kết nối Database**

**PostgreSQL:**
- Host: `localhost:5432`
- Database: `studymate_dev`  
- Username: `studymate`
- Password: `studymate123`

**Redis:**
- Host: `localhost:6379`
- Password: `redis123`

### 🐳 **Chạy full Docker (Alternative)**

Nếu muốn chạy toàn bộ trong Docker:

```bash
# Uncomment app service trong docker-compose.yml
# Sau đó:
docker-compose -f docker-compose.full.yml up -d
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `GET /api/auth/me` - Thông tin người dùng hiện tại

### Courses
- `GET /api/courses` - Danh sách khóa học
- `POST /api/courses` - Tạo khóa học mới
- `GET /api/courses/:id` - Chi tiết khóa học
- `POST /api/courses/:id/enroll` - Đăng ký khóa học

### AI Features
- `POST /api/ai/chat` - Chat với AI
- `POST /api/ai/recommendations` - Gợi ý khóa học
- `POST /api/ai/analyze` - Phân tích học tập

### Statistics
- `GET /api/statistics/dashboard` - Thống kê tổng quan
- `GET /api/statistics/learning` - Phân tích học tập

## 🎨 Giao diện người dùng

### Trang chính
- `/` - Trang chủ
- `/courses` - Danh sách khóa học
- `/courses/:slug` - Chi tiết khóa học

### Người dùng
- `/auth/login` - Đăng nhập
- `/auth/register` - Đăng ký
- `/dashboard` - Bảng điều khiển
- `/profile` - Hồ sơ cá nhân

## 🛠️ **Troubleshooting**

### Database connection issues

```bash
# Check Docker containers
docker-compose ps

# Check logs
docker-compose logs postgres
docker-compose logs redis

# Restart containers
docker-compose restart

# Reset database (WARNING: Deletes data)
docker-compose down -v
docker-compose up -d
```

### Port conflicts
```bash
# Check what's using port 5432
netstat -ano | findstr :5432

# Check what's using port 6379  
netstat -ano | findstr :6379

# Kill process if needed
taskkill /PID <process_id> /F
```

### App won't start
```bash
# Clear node modules
rmdir /s node_modules
npm install

# Clear npm cache
npm cache clean --force

# Check Node version
node --version
```

## 🧪 Testing

```bash
# Chạy test
npm test

# Test với coverage
npm run test:coverage
```

## 🚀 Deployment

### PM2 (Recommended)
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Docker Production
```bash
docker build -t studymate:latest .
docker run -d -p 3000:3000 --env-file .env studymate:latest
```

## 📊 Monitoring & Logging

- **Logs**: Lưu trong thư mục `logs/`
- **Health Check**: `GET /health`
- **Metrics**: Tích hợp PM2 monitoring

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 📄 License

Dự án này thuộc về nhóm sinh viên UIT và được sử dụng cho mục đích giáo dục.

## 📞 Liên hệ

- **Email**: studymate@uit.edu.vn
- **GitHub**: [StudyMate Repository](https://github.com/your-username/studymate)

## 🙏 Acknowledgments

- ThS. Phạm Thế Sơn - Giáo viên hướng dẫn
- Trường Đại học Công nghệ Thông tin - ĐHQG-HCM
- Cộng đồng sinh viên UIT

---

**🏛️ Trường Đại học Công nghệ Thông tin**  
**🌍 Đại học Quốc gia TP. Hồ Chí Minh**  
**🇻🇳 Việt Nam - Độc Lập, Tự Do, Hạnh Phúc**

