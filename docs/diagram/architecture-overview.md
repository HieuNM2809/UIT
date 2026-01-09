# 🏗️ Sơ Đồ Kiến Trúc Tổng Quan - StudyMate AI

**Ngày tạo:** 2026-01-02  
**Phiên bản:** 1.0.0

---

## 📊 1. Kiến Trúc Tổng Quan Hệ Thống

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[🌐 Web Browser]
        Mobile[📱 Mobile App]
    end

    subgraph "Application Layer - Node.js/Express"
        App[📦 StudyMate App<br/>Port: 3000]
        
        subgraph "Middleware"
            AuthMW[🔐 Auth Middleware]
            ValidMW[✅ Validation]
            LogMW[📝 Activity Logger]
            MetricsMW[📊 Metrics]
            ErrorMW[⚠️ Error Handler]
        end
        
        subgraph "Routes"
            AuthRoute[🔑 Auth Routes]
            CourseRoute[📚 Course Routes]
            AIRoute[🤖 AI Routes]
            ChatRoute[💬 Chat Routes]
            AdminRoute[👨‍💼 Admin Routes]
            APIRoute[🔌 API Routes]
        end
        
        subgraph "Controllers"
            AuthCtrl[Auth Controller]
            CourseCtrl[Course Controller]
            AICtrl[AI Controller]
            ChatCtrl[Chat Controller]
            AdminCtrl[Admin Controller]
        end
        
        subgraph "Services"
            AIService[🤖 AI Service<br/>OpenAI/Gemini]
            EmailService[📧 Email Service]
            MinIOService[📦 MinIO Service]
            VietQRService[💳 VietQR Service]
            CertService[🎓 Certificate Service]
            ElasticService[📊 Elasticsearch Service]
            VaultService[🔐 Vault Service]
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
    end

    subgraph "Infrastructure - Docker"
        subgraph "Storage"
            MinIO[📦 MinIO<br/>Port: 9000/9001]
        end
        
        subgraph "Monitoring & Logging"
            Elasticsearch[📊 Elasticsearch<br/>Port: 9200]
            Kibana[📈 Kibana<br/>Port: 5601]
            Prometheus[📊 Prometheus<br/>Port: 9090]
            Grafana[📈 Grafana<br/>Port: 3001]
        end
        
        subgraph "Message Queue"
            Kafka[📨 Kafka<br/>Port: 9092]
            Zookeeper[🐘 Zookeeper<br/>Port: 2181]
            KafkaUI[📊 Kafka UI<br/>Port: 8080]
        end
        
        subgraph "DevOps Tools"
            SonarQube[🔍 SonarQube<br/>Port: 9002]
            Vault[🔐 HashiCorp Vault<br/>Port: 8200]
        end
    end

    Browser --> App
    Mobile --> App
    
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
    
    App -.-> Kafka
    Kafka --> Zookeeper
    
    style App fill:#4A90E2,stroke:#2E5C8A,stroke-width:3px,color:#fff
    style PostgreSQL fill:#336791,stroke:#1A3A52,stroke-width:2px,color:#fff
    style Redis fill:#DC382D,stroke:#A0261E,stroke-width:2px,color:#fff
    style MinIO fill:#FFD700,stroke:#B8860B,stroke-width:2px
    style Elasticsearch fill:#005571,stroke:#003D52,stroke-width:2px,color:#fff
    style OpenAI fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style Gemini fill:#4285F4,stroke:#1A73E8,stroke-width:2px,color:#fff
```

---

## 🎯 2. Kiến Trúc Chức Năng (Functional Architecture)

```mermaid
graph TB
    subgraph "User Management"
        Auth[🔐 Authentication]
        Reg[📝 Registration]
        Profile[👤 Profile Management]
        Roles[🎭 Role Management<br/>Student/Teacher/Admin]
    end

    subgraph "Course Management"
        CourseCRUD[📚 Course CRUD]
        Content[📄 Content Management]
        Enrollment[✅ Enrollment System]
        Progress[📊 Progress Tracking]
        Rating[⭐ Rating & Reviews]
        Cert[🎓 Certificate Generation]
    end

    subgraph "AI Features"
        AIChat[💬 AI Chatbot]
        Recommend[🎯 Course Recommendations]
        Analysis[📈 Learning Analysis]
        Roadmap[🗺️ Learning Roadmap]
    end

    subgraph "Communication"
        Chat[💬 User-to-User Chat]
        Comments[💭 Comments & Discussions]
        Blog[📝 Blog System]
        Notifications[🔔 Notifications]
    end

    subgraph "Payment & Commerce"
        Payment[💳 Payment Processing]
        VietQR[📱 VietQR Integration]
        Orders[🛒 Order Management]
    end

    subgraph "Content & Media"
        FileUpload[📤 File Upload]
        MinIO[📦 Object Storage]
        Images[🖼️ Image Processing]
        Videos[🎥 Video Management]
    end

    subgraph "Analytics & Reporting"
        Stats[📊 Statistics]
        Metrics[📈 Metrics Collection]
        Reports[📋 Reports Generation]
        Dashboard[📊 Admin Dashboard]
    end

    subgraph "Admin Features"
        UserMgmt[👥 User Management]
        CourseMgmt[📚 Course Management]
        SystemMgmt[⚙️ System Management]
        Logs[📝 Activity Logs]
    end

    Auth --> Profile
    Auth --> Roles
    Reg --> Auth
    
    CourseCRUD --> Content
    CourseCRUD --> Enrollment
    Enrollment --> Progress
    Progress --> Rating
    Progress --> Cert
    
    AIChat --> Recommend
    AIChat --> Analysis
    Analysis --> Roadmap
    
    Chat --> Notifications
    Comments --> Notifications
    Blog --> Notifications
    
    Enrollment --> Payment
    Payment --> VietQR
    Payment --> Orders
    
    Content --> FileUpload
    FileUpload --> MinIO
    FileUpload --> Images
    FileUpload --> Videos
    
    Progress --> Stats
    Enrollment --> Stats
    Stats --> Metrics
    Metrics --> Reports
    Reports --> Dashboard
    
    UserMgmt --> Auth
    CourseMgmt --> CourseCRUD
    SystemMgmt --> Logs
    
    style Auth fill:#4A90E2,stroke:#2E5C8A,stroke-width:2px,color:#fff
    style CourseCRUD fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style AIChat fill:#FF6B6B,stroke:#CC5555,stroke-width:2px,color:#fff
    style Payment fill:#FFD700,stroke:#B8860B,stroke-width:2px
    style Dashboard fill:#9B59B6,stroke:#7D3C98,stroke-width:2px,color:#fff
```

---

## 🔧 3. Technology Stack Architecture

```mermaid
graph LR
    subgraph "Frontend Layer"
        EJS[EJS Templates]
        Tailwind[Tailwind CSS]
        VanillaJS[Vanilla JavaScript]
        SocketIOClient[Socket.IO Client]
    end

    subgraph "Backend Framework"
        NodeJS[Node.js v18+]
        Express[Express.js]
        Passport[Passport.js]
        SocketIO[Socket.IO Server]
    end

    subgraph "Data Persistence"
        Sequelize[Sequelize ORM]
        PostgreSQL[(PostgreSQL 15)]
        Redis[(Redis 7)]
    end

    subgraph "External APIs"
        OpenAIAPI[OpenAI GPT-3.5/4]
        GeminiAPI[Google Gemini]
        VietQRAPI[VietQR API]
        SMTPAPI[SMTP Server]
    end

    subgraph "Storage & Media"
        MinIOStorage[MinIO Object Storage]
        FileSystem[Local File System]
        Sharp[Sharp Image Processing]
    end

    subgraph "Security & Auth"
        JWT[JWT Tokens]
        Bcrypt[Bcrypt Password Hashing]
        Helmet[Helmet Security]
        CORS[CORS Middleware]
        RateLimit[Rate Limiting]
    end

    subgraph "Logging & Monitoring"
        Winston[Winston Logger]
        Elasticsearch[Elasticsearch]
        Kibana[Kibana]
        Prometheus[Prometheus]
        Grafana[Grafana]
    end

    subgraph "DevOps & Tools"
        Docker[Docker & Docker Compose]
        PM2[PM2 Process Manager]
        SonarQube[SonarQube]
        Kafka[Apache Kafka]
        Vault[HashiCorp Vault]
    end

    EJS --> Express
    Tailwind --> EJS
    VanillaJS --> Express
    SocketIOClient --> SocketIO
    
    Express --> NodeJS
    Passport --> Express
    SocketIO --> NodeJS
    
    Express --> Sequelize
    Sequelize --> PostgreSQL
    Express --> Redis
    
    Express --> OpenAIAPI
    Express --> GeminiAPI
    Express --> VietQRAPI
    Express --> SMTPAPI
    
    Express --> MinIOStorage
    Express --> FileSystem
    Express --> Sharp
    
    Express --> JWT
    Express --> Bcrypt
    Express --> Helmet
    Express --> CORS
    Express --> RateLimit
    
    Express --> Winston
    Winston --> Elasticsearch
    Elasticsearch --> Kibana
    Express --> Prometheus
    Prometheus --> Grafana
    
    NodeJS --> Docker
    NodeJS --> PM2
    Express --> SonarQube
    Express --> Kafka
    Express --> Vault
    
    style NodeJS fill:#339933,stroke:#1F5F1F,stroke-width:3px,color:#fff
    style Express fill:#000000,stroke:#000000,stroke-width:2px,color:#fff
    style PostgreSQL fill:#336791,stroke:#1A3A52,stroke-width:2px,color:#fff
    style Redis fill:#DC382D,stroke:#A0261E,stroke-width:2px,color:#fff
    style OpenAIAPI fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style GeminiAPI fill:#4285F4,stroke:#1A73E8,stroke-width:2px,color:#fff
```

---

## 🔄 4. Request Flow Architecture

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

## 📦 5. Data Flow Architecture

```mermaid
graph TD
    subgraph "Input Sources"
        UserInput[👤 User Input]
        APIInput[🔌 API Requests]
        FileUpload[📤 File Uploads]
        Webhook[🔔 Webhooks]
    end

    subgraph "Processing Layer"
        Validation[✅ Input Validation]
        Sanitization[🧹 Data Sanitization]
        Transformation[🔄 Data Transformation]
        BusinessLogic[💼 Business Logic]
    end

    subgraph "Storage Layer"
        PostgreSQL[(🗄️ PostgreSQL<br/>Primary Database)]
        Redis[(⚡ Redis<br/>Cache & Sessions)]
        MinIO[📦 MinIO<br/>Object Storage]
        FileSystem[📁 File System<br/>Local Storage]
    end

    subgraph "Output Destinations"
        UserView[👁️ User Interface]
        APIResponse[📡 API Response]
        Email[📧 Email Notifications]
        Logs[📝 Activity Logs]
        Metrics[📊 Metrics]
    end

    UserInput --> Validation
    APIInput --> Validation
    FileUpload --> Validation
    Webhook --> Validation
    
    Validation --> Sanitization
    Sanitization --> Transformation
    Transformation --> BusinessLogic
    
    BusinessLogic --> PostgreSQL
    BusinessLogic --> Redis
    BusinessLogic --> MinIO
    BusinessLogic --> FileSystem
    
    PostgreSQL --> UserView
    PostgreSQL --> APIResponse
    Redis --> UserView
    Redis --> APIResponse
    MinIO --> UserView
    MinIO --> APIResponse
    
    BusinessLogic --> Email
    BusinessLogic --> Logs
    BusinessLogic --> Metrics
    
    style PostgreSQL fill:#336791,stroke:#1A3A52,stroke-width:2px,color:#fff
    style Redis fill:#DC382D,stroke:#A0261E,stroke-width:2px,color:#fff
    style MinIO fill:#FFD700,stroke:#B8860B,stroke-width:2px
    style BusinessLogic fill:#4A90E2,stroke:#2E5C8A,stroke-width:3px,color:#fff
```

---

## 🔐 6. Security Architecture

```mermaid
graph TB
    subgraph "Authentication Layer"
        Login[🔑 Login]
        OAuth[🌐 OAuth 2.0<br/>Google]
        JWT[JWT Tokens]
        Session[Session Management]
    end

    subgraph "Authorization Layer"
        RBAC[Role-Based Access Control]
        Permissions[Permission Checks]
        Middleware[Auth Middleware]
    end

    subgraph "Security Middleware"
        Helmet[Helmet Security Headers]
        CORS[CORS Policy]
        RateLimit[Rate Limiting]
        CSRF[CSRF Protection]
        XSS[XSS Prevention]
        SQLInjection[SQL Injection Prevention]
    end

    subgraph "Data Protection"
        Bcrypt[Password Hashing<br/>Bcrypt]
        Encryption[Data Encryption]
        HTTPS[HTTPS/TLS]
        Secrets[Secrets Management<br/>Vault]
    end

    subgraph "Monitoring & Auditing"
        ActivityLogs[Activity Logging]
        SecurityLogs[Security Event Logs]
        AuditTrail[Audit Trail]
    end

    Login --> JWT
    OAuth --> JWT
    JWT --> Session
    
    Session --> RBAC
    RBAC --> Permissions
    Permissions --> Middleware
    
    Middleware --> Helmet
    Middleware --> CORS
    Middleware --> RateLimit
    Middleware --> CSRF
    Middleware --> XSS
    Middleware --> SQLInjection
    
    Login --> Bcrypt
    Bcrypt --> Encryption
    Encryption --> HTTPS
    HTTPS --> Secrets
    
    Middleware --> ActivityLogs
    SecurityLogs --> AuditTrail
    
    style Login fill:#4A90E2,stroke:#2E5C8A,stroke-width:2px,color:#fff
    style RBAC fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style Helmet fill:#FF6B6B,stroke:#CC5555,stroke-width:2px,color:#fff
    style Bcrypt fill:#9B59B6,stroke:#7D3C98,stroke-width:2px,color:#fff
```

---

## 📊 7. Monitoring & Observability Architecture

```mermaid
graph TB
    subgraph "Application Layer"
        App[📦 StudyMate App]
        MetricsMW[Metrics Middleware]
        Logger[Application Logger]
    end

    subgraph "Metrics Collection"
        Prometheus[📊 Prometheus<br/>Metrics Collection]
        CustomMetrics[Custom Metrics<br/>Prom Client]
    end

    subgraph "Logging System"
        Winston[Winston Logger]
        Elasticsearch[📊 Elasticsearch<br/>Log Storage]
        Kibana[📈 Kibana<br/>Log Visualization]
    end

    subgraph "Activity Tracking"
        ActivityLogger[Activity Logger]
        ElasticService[Elasticsearch Service]
    end

    subgraph "Visualization"
        Grafana[📈 Grafana<br/>Metrics Dashboard]
        KibanaDash[Kibana Dashboards]
    end

    subgraph "Alerting"
        PrometheusAlerts[Prometheus Alerts]
        GrafanaAlerts[Grafana Alerts]
    end

    App --> MetricsMW
    App --> Logger
    App --> ActivityLogger
    
    MetricsMW --> Prometheus
    MetricsMW --> CustomMetrics
    
    Logger --> Winston
    Winston --> Elasticsearch
    Elasticsearch --> Kibana
    
    ActivityLogger --> ElasticService
    ElasticService --> Elasticsearch
    
    Prometheus --> Grafana
    CustomMetrics --> Grafana
    
    Prometheus --> PrometheusAlerts
    Grafana --> GrafanaAlerts
    
    style Prometheus fill:#E6522C,stroke:#B8411F,stroke-width:2px,color:#fff
    style Grafana fill:#F46800,stroke:#C35200,stroke-width:2px,color:#fff
    style Elasticsearch fill:#005571,stroke:#003D52,stroke-width:2px,color:#fff
    style Kibana fill:#005571,stroke:#003D52,stroke-width:2px,color:#fff
```

---

## 🔄 8. AI Service Integration Architecture

```mermaid
graph TB
    subgraph "AI Controller"
        AIController[AI Controller]
        ChatEndpoint[Chat Endpoint]
        RecommendEndpoint[Recommendation Endpoint]
        AnalysisEndpoint[Analysis Endpoint]
        RoadmapEndpoint[Roadmap Endpoint]
    end

    subgraph "AI Service Layer"
        AIService[AI Service]
        GeminiService[Gemini Service]
        OpenAIService[OpenAI Service]
        Fallback[Fallback Handler]
    end

    subgraph "Context Management"
        UserContext[User Context Builder]
        CourseContext[Course Context]
        ProgressContext[Progress Context]
    end

    subgraph "External AI APIs"
        OpenAIAPI[🤖 OpenAI API<br/>GPT-3.5/4]
        GeminiAPI[🤖 Google Gemini<br/>Gemini Pro]
    end

    subgraph "Caching & Optimization"
        RedisCache[Redis Cache]
        ResponseCache[Response Caching]
    end

    subgraph "Interaction Storage"
        AIInteraction[AI Interaction Model]
        PostgreSQL[(PostgreSQL)]
    end

    ChatEndpoint --> AIController
    RecommendEndpoint --> AIController
    AnalysisEndpoint --> AIController
    RoadmapEndpoint --> AIController
    
    AIController --> AIService
    AIService --> UserContext
    UserContext --> CourseContext
    UserContext --> ProgressContext
    
    AIService --> GeminiService
    AIService --> OpenAIService
    AIService --> Fallback
    
    GeminiService --> GeminiAPI
    OpenAIService --> OpenAIAPI
    Fallback --> GeminiAPI
    
    AIService --> RedisCache
    RedisCache --> ResponseCache
    
    AIController --> AIInteraction
    AIInteraction --> PostgreSQL
    
    style OpenAIAPI fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style GeminiAPI fill:#4285F4,stroke:#1A73E8,stroke-width:2px,color:#fff
    style AIService fill:#FF6B6B,stroke:#CC5555,stroke-width:2px,color:#fff
    style RedisCache fill:#DC382D,stroke:#A0261E,stroke-width:2px,color:#fff
```

---

## 📝 Ghi Chú

### Ports Summary
- **Application:** 3000
- **PostgreSQL:** 5432
- **Redis:** 6379
- **MinIO:** 9000 (API), 9001 (Console)
- **Elasticsearch:** 9200
- **Kibana:** 5601
- **Prometheus:** 9090
- **Grafana:** 3001
- **Kafka:** 9092
- **Zookeeper:** 2181
- **Kafka UI:** 8080
- **SonarQube:** 9002
- **Vault:** 8200

### Key Design Patterns
1. **MVC Pattern:** Routes → Controllers → Models
2. **Service Layer:** Business logic separation
3. **Middleware Chain:** Request processing pipeline
4. **Repository Pattern:** Data access abstraction
5. **Strategy Pattern:** AI service fallback mechanism

### Scalability Considerations
- Horizontal scaling with PM2 cluster mode
- Database connection pooling
- Redis caching for performance
- Message queue (Kafka) for async processing
- Stateless authentication (JWT)

---

**Tác giả:** StudyMate Development Team  
**Cập nhật:** 2026-01-02

