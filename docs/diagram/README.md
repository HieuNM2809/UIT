# 📊 StudyMate Architecture Diagrams

Thư mục này chứa các sơ đồ kiến trúc tổng quan của dự án StudyMate AI.

## 📁 Files

- **`architecture-overview.md`** - Sơ đồ kiến trúc tổng quan bao gồm:
  - Kiến trúc tổng quan hệ thống
  - Kiến trúc chức năng (Functional Architecture)
  - Technology Stack Architecture
  - Request Flow Architecture
  - Data Flow Architecture
  - Security Architecture
  - Monitoring & Observability Architecture
  - AI Service Integration Architecture

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

### 1. Kiến Trúc Tổng Quan Hệ Thống
Mô tả toàn bộ hệ thống từ Client Layer đến Infrastructure, bao gồm:
- Các thành phần chính
- Kết nối giữa các services
- Ports và protocols

### 2. Kiến Trúc Chức Năng
Mô tả các module chức năng và mối quan hệ:
- User Management
- Course Management
- AI Features
- Communication
- Payment & Commerce
- Analytics & Reporting

### 3. Technology Stack Architecture
Chi tiết về công nghệ sử dụng:
- Frontend technologies
- Backend framework
- Database systems
- External APIs
- Security tools
- Monitoring tools

### 4. Request Flow Architecture
Luồng xử lý request từ client đến database:
- Middleware chain
- Controller processing
- Service layer
- Caching mechanism

### 5. Data Flow Architecture
Luồng dữ liệu trong hệ thống:
- Input sources
- Processing layer
- Storage layer
- Output destinations

### 6. Security Architecture
Kiến trúc bảo mật:
- Authentication mechanisms
- Authorization layers
- Security middleware
- Data protection

### 7. Monitoring & Observability Architecture
Hệ thống giám sát và quan sát:
- Metrics collection
- Logging system
- Activity tracking
- Visualization dashboards

### 8. AI Service Integration Architecture
Tích hợp AI services:
- AI endpoints
- Service layer
- Context management
- External AI APIs
- Caching strategy

## 🔄 Cập Nhật Sơ Đồ

Khi có thay đổi về kiến trúc, vui lòng:
1. Cập nhật sơ đồ tương ứng trong `architecture-overview.md`
2. Cập nhật ngày "Cập nhật lần cuối" ở đầu file
3. Ghi chú thay đổi trong commit message

## 📝 Best Practices

1. **Giữ sơ đồ đơn giản:** Tránh quá nhiều chi tiết trong một sơ đồ
2. **Sử dụng màu sắc nhất quán:** Mỗi loại component có màu riêng
3. **Thêm ghi chú:** Giải thích các phần phức tạp
4. **Cập nhật thường xuyên:** Đảm bảo sơ đồ phản ánh đúng code hiện tại

## 🛠️ Tools

- **Mermaid.js** - Diagram syntax
- **VS Code** - Editor với Mermaid preview
- **GitHub** - Auto-render Mermaid diagrams

---

**Tác giả:** StudyMate Development Team  
**Cập nhật:** 2026-01-02

