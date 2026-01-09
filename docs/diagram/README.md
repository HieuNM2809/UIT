# 📊 StudyMate Architecture Diagrams

Thư mục này chứa các sơ đồ kiến trúc chi tiết của dự án StudyMate AI, được tổ chức theo từng tính năng.

## 📁 Files

### Tổng Quan
- **`system-overview.md`** - Tổng quan kiến trúc hệ thống, technology stack, và deployment

### Tính Năng Chính
- **`authentication-architecture.md`** - Kiến trúc hệ thống xác thực (Login, Register, OAuth, Password Reset)
- **`course-management-architecture.md`** - Kiến trúc quản lý khóa học (Enrollment, Progress, Rating, Certificates)
- **`payment-system-architecture.md`** - Kiến trúc hệ thống thanh toán (VietQR integration, Payment flow)
- **`chat-system-architecture.md`** - Kiến trúc hệ thống chat real-time (Socket.IO, Conversations, Messages)
- **`ai-services-architecture.md`** - Kiến trúc dịch vụ AI (Chatbot, Recommendations, Analysis, Roadmap)

### Hạ Tầng
- **`monitoring-architecture.md`** - Kiến trúc giám sát và quan sát (Prometheus, Grafana, Elasticsearch, Kibana)

## 🎨 Cách Xem Sơ Đồ

### Option 1: GitHub/GitLab
Các sơ đồ Mermaid sẽ tự động render trên GitHub/GitLab khi xem file markdown.

### Option 2: VS Code
1. Cài đặt extension **"Markdown Preview Mermaid Support"**
2. Mở file `.md` và preview (Ctrl+Shift+V)

### Option 3: Mermaid Live Editor
1. Truy cập: https://mermaid.live/
2. Copy nội dung code block mermaid từ file
3. Paste vào editor để xem và export

### Option 4: Công cụ khác
- **Obsidian** - Hỗ trợ Mermaid natively
- **Typora** - Markdown editor với Mermaid support
- **Notion** - Hỗ trợ Mermaid diagrams

## 📋 Mô Tả Các Sơ Đồ

### 1. System Overview
- Kiến trúc tổng quan hệ thống
- Technology stack
- Request flow
- Feature modules
- Deployment architecture

### 2. Authentication Architecture
- Component architecture
- Registration flow
- Login flow (Email/Password, Google OAuth)
- Email verification flow
- Password reset flow
- Role-based access control (RBAC)
- Security mechanisms

### 3. Course Management Architecture
- Component architecture
- Course enrollment flow (Free/Paid)
- Learning flow
- Complete course flow
- Rating & review flow
- Progress tracking
- Certificate generation

### 4. Payment System Architecture
- Component architecture
- Payment creation flow
- Payment page flow
- Payment processing flow
- Payment status check
- Enrollment approval flow
- Payment states diagram

### 5. Chat System Architecture
- Component architecture
- Socket.IO connection flow
- Send message flow
- Join conversation flow
- Mark messages as read
- Typing indicator
- Active users tracking

### 6. AI Services Architecture
- Component architecture
- AI chat flow
- Roadmap generation flow
- Course recommendation flow
- Learning analysis flow
- AI service fallback strategy
- User context building

### 7. Monitoring Architecture
- Component architecture
- Metrics collection flow
- Logging flow
- Activity logging flow
- Metrics types
- Dashboard structure
- Alerting flow

## 🔄 Cập Nhật Sơ Đồ

Khi có thay đổi về kiến trúc, vui lòng:
1. Cập nhật sơ đồ tương ứng trong file tương ứng
2. Cập nhật ngày "Cập nhật lần cuối" ở đầu file
3. Ghi chú thay đổi trong commit message

## 📝 Best Practices

1. **Giữ sơ đồ đơn giản**: Tránh quá nhiều chi tiết trong một sơ đồ
2. **Sử dụng màu sắc nhất quán**: Mỗi loại component có màu riêng
3. **Thêm ghi chú**: Giải thích các phần phức tạp
4. **Cập nhật thường xuyên**: Đảm bảo sơ đồ phản ánh đúng code hiện tại
5. **Sequence diagrams**: Sử dụng cho flows phức tạp
6. **Component diagrams**: Sử dụng cho architecture overview

## 🛠️ Tools

- **Mermaid.js** - Diagram syntax
- **VS Code** - Editor với Mermaid preview
- **GitHub** - Auto-render Mermaid diagrams
- **Mermaid Live Editor** - Online editor và exporter

## 📚 Tài Liệu Tham Khảo

- [Mermaid Documentation](https://mermaid.js.org/)
- [Mermaid Live Editor](https://mermaid.live/)
- [StudyMate Functional Report](../FUNCTIONAL-REPORT.md)

---

**Tác giả:** StudyMate Development Team  
**Cập nhật:** 2026-01-02

