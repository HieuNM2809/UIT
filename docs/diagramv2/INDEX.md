# 📚 StudyMate - Feature Flow Documentation

## 🗂️ Danh sách tài liệu

### Sơ đồ tổng quan
1. **System Architecture** - `01-system-architecture-overview.png`
2. **Feature Map** - `02-feature-architecture-map.png`
3. **Technology Stack** - `03-technology-stack-diagram.png` ⚠️ (See `TECH-STACK-COMPLETE.md` for full info)
4. **Data Flow** - `04-data-flow-diagram.png`
5. **Database Schema** - `05-database-schema-overview.png`

### Tài liệu chi tiết công nghệ
- 💻 [**Complete Tech Stack**](./TECH-STACK-COMPLETE.md) ⭐ - Đầy đủ nhất, bao gồm Vault & Kibana

### Sơ đồ chi tiết từng chức năng
6. **User Authentication** - `06-user-authentication-flow.png`

### Tài liệu chi tiết (Markdown)
- 🔐 [**FEATURE-01**: Authentication](./FEATURE-01-Authentication.md)
- 📚 [**FEATURE-02**: Course Enrollment](./FEATURE-02-CourseEnrollment.md)
- 🤖 [**FEATURE-03**: AI Chatbot](./FEATURE-03-AI-Chatbot.md)
- 📝 [**FEATURE-04**: Quiz & Assessment](./FEATURE-04-Quiz-Assessment.md)
- 💳 [**FEATURE-05**: Payment & Certificate](./FEATURE-05-Payment-Certificate.md)

## 📖 Hướng dẫn đọc

### Cho Developer
1. Đọc System Architecture để hiểu overview
2. Đọc Database Schema để hiểu data model
3. Đọc từng FEATURE-XX để implement

### Cho Thuyết trình
1. System Architecture (Slide overview)
2. Feature Map (Giới thiệu tính năng)
3. Chọn 2-3 FEATURE quan trọng để demo flow

### Infrastructure & DevOps
- 🔐 [**INFRASTRUCTURE**: Vault & Kibana](./INFRASTRUCTURE-Vault-Kibana.md)
  - HashiCorp Vault (Secret Management)
  - Kibana (Log Visualization & Analytics)
  - ELK Stack Integration

## 🎯 Tính năng chưa có tài liệu chi tiết

Cần bổ sung:
- Content Upload & Progress Tracking
- Discussion & Comments System
- Notification System
- Admin Dashboard & Analytics
- Real-time Chat (Socket.IO)
- Monitoring với Prometheus & Grafana
- CI/CD Pipeline

---
**Ngày cập nhật:** 09/01/2026  
**Version:** 2.1 (Added Vault & Kibana)
