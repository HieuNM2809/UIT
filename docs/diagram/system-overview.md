# 🏗️ Tổng Quan Kiến Trúc Hệ Thống - StudyMate

**Ngày tạo:** 2026-01-02  
**Phiên bản:** 1.0.0

---

## 📋 Tổng Quan

StudyMate là nền tảng học tập thông minh được xây dựng với kiến trúc MVC, sử dụng Node.js/Express, PostgreSQL, Redis, và tích hợp nhiều dịch vụ bên ngoài.

---

## 🏗️ 1. System Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[🌐 Web Browser]
        Mobile[📱 Mobile App]
    end

    subgraph "Application Layer - Node.js/Express"
        App[📦 StudyMate App<br/>Port: 3000]
        
        subgraph "Middleware Stack"
            Helmet[🔒 Helmet Security]
            CORS[🌐 CORS]
            BodyParser[📝 Body Parser]
            Session[🍪 Session Management]
            Passport[🔐 Passport Auth]
            AuthMW[🔐 Auth Middleware]
            ValidMW[✅ Validation]
            LogMW[📝 Activity Logger]
            MetricsMW[📊 Metrics]
            ErrorMW[⚠️ Error Handler]
        end
        
        subgraph "Route Layer"
            AuthRoute[🔑 Auth Routes]
            CourseRoute[📚 Course Routes]
            AIRoute[🤖 AI Routes]
            ChatRoute[💬 Chat Routes]
            AdminRoute[👨‍💼 Admin Routes]
            APIRoute[🔌 API Routes]
        end
        
        subgraph "Controller Layer"
            AuthCtrl[Auth Controller]
            CourseCtrl[Course Controller]
            AICtrl[AI Controller]
            ChatCtrl[Chat Controller]
            AdminCtrl[Admin Controller]
        end
        
        subgraph "Service Layer"
            AIService[🤖 AI Service]
            EmailService[📧 Email Service]
            MinIOService[📦 MinIO Service]
            VietQRService[💳 VietQR Service]
            CertService[🎓 Certificate Service]
            ElasticService[📊 Elasticsearch Service]
        end
    end

    subgraph "Data Layer"
        PostgreSQL[(🗄️ PostgreSQL<br/>Port: 5432)]
        Redis[(⚡ Redis Cache<br/>Port: 6379)]
    end

    subgraph "External Services"
        OpenAI[🤖 OpenAI API]
        Gemini[🤖 Google Gemini API]
        SMTP[📧 SMTP Server]
        VietQR[💳 VietQR API]
        GoogleOAuth[🌐 Google OAuth]
    end

    subgraph "Infrastructure - Docker"
        MinIO[📦 MinIO<br/>Port: 9000/9001]
        Elasticsearch[📊 Elasticsearch<br/>Port: 9200]
        Kibana[📈 Kibana<br/>Port: 5601]
        Prometheus[📊 Prometheus<br/>Port: 9090]
        Grafana[📈 Grafana<br/>Port: 3001]
        Kafka[📨 Kafka<br/>Port: 9092]
        SonarQube[🔍 SonarQube<br/>Port: 9002]
        Vault[🔐 HashiCorp Vault<br/>Port: 8200]
    end

    Browser --> App
    Mobile --> App
    
    App --> Helmet
    App --> CORS
    App --> BodyParser
    App --> Session
    App --> Passport
    App --> AuthMW
    App --> ValidMW
    App --> LogMW
    App --> MetricsMW
    App --> ErrorMW
    
    AuthMW --> AuthRoute
    ValidMW --> CourseRoute
    LogMW --> AIRoute
    MetricsMW --> ChatRoute
    ErrorMW --> AdminRoute
    
    AuthRoute --> AuthCtrl
    CourseRoute --> CourseCtrl
    AIRoute --> AICtrl
    ChatRoute --> ChatCtrl
    AdminRoute --> AdminCtrl
    
    AuthCtrl --> PostgreSQL
    CourseCtrl --> PostgreSQL
    AICtrl --> AIService
    ChatCtrl --> PostgreSQL
    
    AIService --> OpenAI
    AIService --> Gemini
    AIService --> Redis
    
    EmailService --> SMTP
    VietQRService --> VietQR
    CertService --> MinIO
    ElasticService --> Elasticsearch
    
    App --> PostgreSQL
    App --> Redis
    App --> MinIO
    App --> Elasticsearch
    
    LogMW --> ElasticService
    MetricsMW --> Prometheus
    
    Prometheus --> Grafana
    Elasticsearch --> Kibana
    
    Passport --> GoogleOAuth
    
    style App fill:#4A90E2,stroke:#2E5C8A,stroke-width:3px,color:#fff
    style PostgreSQL fill:#336791,stroke:#1A3A52,stroke-width:2px,color:#fff
    style Redis fill:#DC382D,stroke:#A0261E,stroke-width:2px,color:#fff
    style MinIO fill:#FFD700,stroke:#B8860B,stroke-width:2px
    style Elasticsearch fill:#005571,stroke:#003D52,stroke-width:2px,color:#fff
    style OpenAI fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style Gemini fill:#4285F4,stroke:#1A73E8,stroke-width:2px,color:#fff
```

---

## 🔄 2. Request Flow Architecture

```mermaid
sequenceDiagram
    participant Client
    participant Middleware
    participant Route
    participant Controller
    participant Service
    participant Model
    participant Database
    participant ExternalAPI
    participant Cache

    Client->>Middleware: HTTP Request
    Middleware->>Middleware: Helmet Security
    Middleware->>Middleware: CORS Check
    Middleware->>Middleware: Body Parsing
    Middleware->>Middleware: Session Check
    Middleware->>Middleware: Auth Check
    Middleware->>Middleware: Validation
    Middleware->>Middleware: Activity Logging
    Middleware->>Route: Validated Request
    
    Route->>Controller: Route Handler
    Controller->>Cache: Check Cache
    alt Cache Hit
        Cache-->>Controller: Cached Data
        Controller-->>Client: Response
    else Cache Miss
        Controller->>Service: Business Logic
        Service->>Model: Data Operation
        Model->>Database: SQL Query
        Database-->>Model: Result
        Model-->>Service: Data Object
        Service->>ExternalAPI: External Call (if needed)
        ExternalAPI-->>Service: API Response
        Service-->>Controller: Processed Data
        Controller->>Cache: Store in Cache
        Controller-->>Client: Response
    end
    
    Note over Middleware: Metrics Collection
    Note over Controller: Error Handling
    Note over Service: Logging to Elasticsearch
```

---

## 📦 3. Technology Stack

```mermaid
graph LR
    subgraph "Frontend"
        EJS[EJS Templates]
        Tailwind[Tailwind CSS]
        VanillaJS[Vanilla JavaScript]
        SocketIO[Socket.IO Client]
    end

    subgraph "Backend"
        NodeJS[Node.js v18+]
        Express[Express.js]
        Sequelize[Sequelize ORM]
        Passport[Passport.js]
        SocketIOServer[Socket.IO Server]
    end

    subgraph "Database"
        PostgreSQL[(PostgreSQL 15)]
        Redis[(Redis 7)]
    end

    subgraph "Storage"
        MinIO[MinIO]
        FileSystem[Local FS]
    end

    subgraph "AI"
        OpenAI[OpenAI GPT]
        Gemini[Google Gemini]
    end

    subgraph "Monitoring"
        Prometheus[Prometheus]
        Grafana[Grafana]
        Elasticsearch[Elasticsearch]
        Kibana[Kibana]
    end

    EJS --> Express
    Tailwind --> EJS
    VanillaJS --> Express
    SocketIO --> SocketIOServer
    
    Express --> NodeJS
    Sequelize --> PostgreSQL
    Express --> Redis
    Express --> MinIO
    
    Express --> OpenAI
    Express --> Gemini
    
    Express --> Prometheus
    Express --> Elasticsearch
    
    Prometheus --> Grafana
    Elasticsearch --> Kibana

    style NodeJS fill:#339933,stroke:#1F5F1F,stroke-width:3px,color:#fff
    style Express fill:#000000,stroke:#000000,stroke-width:2px,color:#fff
    style PostgreSQL fill:#336791,stroke:#1A3A52,stroke-width:2px,color:#fff
    style Redis fill:#DC382D,stroke:#A0261E,stroke-width:2px,color:#fff
```

---

## 🎯 4. Feature Modules

```mermaid
graph TB
    subgraph "Core Features"
        Auth[🔐 Authentication]
        Courses[📚 Course Management]
        Content[📄 Content Management]
        Enrollment[✅ Enrollment System]
    end

    subgraph "AI Features"
        AIChat[💬 AI Chatbot]
        Recommend[🎯 Recommendations]
        Analysis[📈 Learning Analysis]
        Roadmap[🗺️ Learning Roadmap]
    end

    subgraph "Communication"
        Chat[💬 User Chat]
        Comments[💭 Comments]
        Blog[📝 Blog]
    end

    subgraph "Commerce"
        Payment[💳 Payment]
        Certificates[🎓 Certificates]
    end

    subgraph "Admin"
        UserMgmt[👥 User Management]
        CourseMgmt[📚 Course Management]
        SystemMgmt[⚙️ System Management]
    end

    Auth --> Courses
    Courses --> Content
    Content --> Enrollment
    Enrollment --> Payment
    Enrollment --> Certificates
    
    Auth --> AIChat
    Enrollment --> Recommend
    Enrollment --> Analysis
    Analysis --> Roadmap
    
    Auth --> Chat
    Courses --> Comments
    Courses --> Blog
    
    Auth --> UserMgmt
    Courses --> CourseMgmt
    SystemMgmt --> UserMgmt

    style Auth fill:#4A90E2,stroke:#2E5C8A,stroke-width:2px,color:#fff
    style Courses fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style AIChat fill:#FF6B6B,stroke:#CC5555,stroke-width:2px,color:#fff
    style Payment fill:#FFD700,stroke:#B8860B,stroke-width:2px
```

---

## 📊 5. Ports Summary

| Service | Port | Description |
|---------|------|-------------|
| Application | 3000 | Main application server |
| PostgreSQL | 5432 | Primary database |
| Redis | 6379 | Cache and session store |
| MinIO API | 9000 | Object storage API |
| MinIO Console | 9001 | MinIO admin console |
| Elasticsearch | 9200 | Log storage |
| Kibana | 5601 | Log visualization |
| Prometheus | 9090 | Metrics collection |
| Grafana | 3001 | Metrics visualization |
| Kafka | 9092 | Message queue |
| Zookeeper | 2181 | Kafka coordination |
| Kafka UI | 8080 | Kafka management UI |
| SonarQube | 9002 | Code quality analysis |
| Vault | 8200 | Secrets management |

---

## 🔗 6. Key Design Patterns

1. **MVC Pattern**: Routes → Controllers → Models
2. **Service Layer**: Business logic separation
3. **Middleware Chain**: Request processing pipeline
4. **Repository Pattern**: Data access abstraction
5. **Strategy Pattern**: AI service fallback mechanism
6. **Observer Pattern**: Socket.IO event handling

---

## 📝 7. File Structure

```
studymate/
├── app.js                 # Main application entry
├── index.js              # Alternative entry point
├── config/               # Configuration files
│   ├── database.js       # Database config
│   ├── logger.js         # Logging config
│   ├── passport.js       # Passport config
│   └── redis.js          # Redis config
├── controllers/          # Business logic (MVC)
│   ├── admin/           # Admin controllers
│   ├── authController.js
│   ├── courseController.js
│   ├── aiController.js
│   └── chatController.js
├── routes/              # Route definitions
│   ├── auth.js
│   ├── courses.js
│   ├── ai.js
│   └── chat.js
├── models/              # Sequelize models
│   ├── User.js
│   ├── Course.js
│   ├── Enrollment.js
│   └── ...
├── services/            # External services
│   ├── aiService.js
│   ├── emailService.js
│   ├── vietQRService.js
│   └── ...
├── middleware/          # Express middleware
│   ├── auth.js
│   ├── errorHandler.js
│   ├── activityLogger.js
│   └── metrics.js
├── views/               # EJS templates
│   ├── layouts/
│   ├── pages/
│   └── partials/
└── public/              # Static assets
    ├── css/
    ├── js/
    └── images/
```

---

## 🚀 8. Deployment Architecture

```mermaid
graph TB
    subgraph "Development"
        DevApp[Node.js App<br/>Windows Host]
        DevDB[(PostgreSQL<br/>Docker)]
        DevRedis[(Redis<br/>Docker)]
    end

    subgraph "Production"
        ProdApp[Node.js App<br/>PM2 Cluster]
        ProdDB[(PostgreSQL<br/>Docker/Managed)]
        ProdRedis[(Redis<br/>Docker/Managed)]
        LoadBalancer[Load Balancer]
    end

    subgraph "Infrastructure"
        Docker[Docker Compose]
        Monitoring[Monitoring Stack]
        Backup[Backup System]
    end

    DevApp --> DevDB
    DevApp --> DevRedis
    
    LoadBalancer --> ProdApp
    ProdApp --> ProdDB
    ProdApp --> ProdRedis
    
    Docker --> DevDB
    Docker --> DevRedis
    Docker --> Monitoring
    
    Monitoring --> Backup

    style DevApp fill:#4A90E2,stroke:#2E5C8A,stroke-width:2px,color:#fff
    style ProdApp fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style Docker fill:#0DB7ED,stroke:#0A9BC7,stroke-width:2px,color:#fff
```

---

## 📝 Ghi Chú

### Scalability Considerations
- **Horizontal Scaling**: PM2 cluster mode for multiple processes
- **Database Pooling**: Connection pooling for PostgreSQL
- **Redis Caching**: Reduce database load
- **Stateless Auth**: JWT tokens for API calls
- **Message Queue**: Kafka for async processing

### Security Measures
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevent abuse
- **Input Validation**: Sanitize all inputs
- **SQL Injection Prevention**: Sequelize parameterized queries
- **XSS Prevention**: Escape user content

### Performance Optimization
- **Caching**: Redis for frequently accessed data
- **Database Indexes**: Optimize queries
- **Lazy Loading**: Load content on demand
- **Asset Optimization**: Minify CSS/JS
- **CDN**: Static assets via CDN (production)

---

**Tác giả:** StudyMate Development Team  
**Cập nhật:** 2026-01-02

