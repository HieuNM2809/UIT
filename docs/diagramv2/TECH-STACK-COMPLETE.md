# 💻 StudyMate - Complete Technology Stack

> **Version:** 2.1 (Updated with Vault & Kibana)  
> **Date:** 09/01/2026

---

## 🎨 FRONTEND

### Core Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **EJS Templates** | 3.1.9 | Server-side rendering |
| **Tailwind CSS** | 3.x | Utility-first CSS framework |
| **Vanilla JavaScript** | ES6+ | Client-side logic |
| **AJAX/Fetch API** | Native | Async HTTP requests |

### Real-time & Interactive
| Technology | Version | Purpose |
|------------|---------|---------|
| **Socket.IO Client** | 4.7.4 | Real-time bidirectional communication |
| **Markdown Renderer** | - | Display formatted content |

### Design
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Progressive Enhancement** - Works without JS
- ✅ **Accessibility** - WCAG 2.1 compliant

---

## ⚙️ BACKEND

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18.x+ | Runtime environment |
| **Express.js** | 4.18.2 | Web application framework |
| **Sequelize ORM** | 6.35.0 | Object-relational mapping |

### Authentication & Security
| Technology | Version | Purpose |
|------------|---------|---------|
| **Passport.js** | 0.7.0 | Authentication middleware |
| **passport-local** | 1.0.0 | Username/password strategy |
| **passport-jwt** | 4.0.1 | JWT authentication |
| **passport-google-oauth20** | 2.0.0 | Google OAuth integration |
| **JWT (jsonwebtoken)** | 9.0.2 | Token generation/verification |
| **bcryptjs** | 2.4.3 | Password hashing |

### File Handling
| Technology | Version | Purpose |
|------------|---------|---------|
| **Multer** | 1.4.5-lts.1 | File upload middleware |
| **Sharp** | 0.32.6 | Image processing |
| **pdf-lib** | 1.17.1 | PDF generation/manipulation |
| **ExcelJS** | 4.4.0 | Excel file handling |
| **csv-parser** | 3.0.0 | CSV parsing |
| **csv-writer** | 1.6.0 | CSV generation |

### Real-time Communication
| Technology | Version | Purpose |
|------------|---------|---------|
| **Socket.IO** | 4.7.4 | WebSocket server |

### Utilities
| Technology | Version | Purpose |
|------------|---------|---------|
| **slugify** | 1.6.6 | URL-friendly strings |
| **compression** | 1.7.4 | Response compression |
| **method-override** | 3.0.0 | HTTP method override |
| **cookie-parser** | 1.4.6 | Cookie parsing |
| **express-session** | 1.17.3 | Session management |
| **connect-flash** | 0.1.1 | Flash messages |

---

## 🗄️ DATABASE & STORAGE

### Primary Database
| Technology | Version | Purpose |
|------------|---------|---------|
| **PostgreSQL** | 14.x | Main relational database |
| **pg** | 8.11.3 | PostgreSQL client |
| **Sequelize** | 6.35.0 | ORM for PostgreSQL |

**Features:**
- ACID transactions
- Foreign key constraints
- Full-text search
- JSON/JSONB support
- 32 models/tables

### Caching & Sessions
| Technology | Version | Purpose |
|------------|---------|---------|
| **Redis** | 7.x | In-memory cache & session store |
| **redis (client)** | 4.6.10 | Redis Node.js client |

**Use Cases:**
- Session storage
- API response caching
- Rate limiting counters
- Pub/Sub messaging
- Vault secret caching

### Search Engine
| Technology | Version | Purpose |
|------------|---------|---------|
| **Elasticsearch** | 8.11.0 | Full-text search & analytics |
| **@elastic/elasticsearch** | 8.19.1 | ES Node.js client |

**Use Cases:**
- Course search
- Content indexing
- Log aggregation
- Analytics queries

### Object Storage
| Technology | Version | Purpose |
|------------|---------|---------|
| **MinIO** | Latest | S3-compatible object storage |
| **minio (client)** | 7.1.3 | MinIO Node.js client |

**Stored Objects:**
- User avatars
- Course thumbnails
- Video files
- Documents (PDF, DOCX)
- Certificates
- Generated reports

---

## 🤖 AI & EXTERNAL SERVICES

### AI Services
| Technology | Version | Purpose |
|------------|---------|---------|
| **OpenAI GPT** | 3.5/4 | General chatbot & Q&A |
| **openai** | 4.20.1 | OpenAI API client |
| **Google Gemini AI** | Pro | Course-specific assistance |
| **@google/generative-ai** | 0.2.1 | Gemini API client |

**AI Features:**
- Smart chatbot
- Course recommendations
- Learning analytics
- Content suggestions
- Study plan generation

### Email Service
| Technology | Version | Purpose |
|------------|---------|---------|
| **Nodemailer** | 7.0.12 | Email sending |

**Email Types:**
- Welcome emails
- Email verification
- Password reset
- Course enrollment confirmation
- Certificate delivery
- Payment receipts

### Payment Integration
| Technology | Version | Purpose |
|------------|---------|---------|
| **VietQR** | API | QR code payment |
| **axios** | 1.6.2 | HTTP client for APIs |

**Payment Flow:**
- QR code generation
- Bank webhook handling
- Transaction verification
- Payment status tracking

### Document Generation
| Technology | Version | Purpose |
|------------|---------|---------|
| **pdf-lib** | 1.17.1 | Certificate PDF generation |

---

## 🚀 DEVOPS & MONITORING

### Containerization
| Technology | Version | Purpose |
|------------|---------|---------|
| **Docker** | 24.x | Container platform |
| **Docker Compose** | 2.x | Multi-container orchestration |

**Containers:**
- PostgreSQL database
- Redis cache
- Elasticsearch
- Kibana dashboard
- HashiCorp Vault
- MinIO storage
- Prometheus
- Grafana

### Process Management
| Technology | Version | Purpose |
|------------|---------|---------|
| **PM2** | Latest | Production process manager |

**Features:**
- Auto-restart on crash
- Load balancing
- Log management
- Monitoring dashboard
- Zero-downtime reload

### Metrics & Monitoring
| Technology | Version | Purpose |
|------------|---------|---------|
| **Prometheus** | Latest | Metrics collection |
| **prom-client** | 15.1.3 | Prometheus client |
| **Grafana** | Latest | Metrics visualization |

**Monitored Metrics:**
- HTTP request count/duration
- API endpoint performance
- Database query times
- Cache hit/miss rates
- Active users
- Memory/CPU usage
- Error rates

### Logging
| Technology | Version | Purpose |
|------------|---------|---------|
| **Winston** | 3.11.0 | Logging framework |
| **winston-elasticsearch** | 0.11.0 | ES transport for logs |
| **Morgan** | 1.10.0 | HTTP request logging |

**Log Destinations:**
- Console (development)
- Files (error.log, combined.log)
- Elasticsearch (searchable logs)
- Kibana (visualization)

### 🆕 Log Visualization & Analytics
| Technology | Version | Purpose |
|------------|---------|---------|
| **Kibana** | 8.11.0 | Log visualization & dashboards |
| **Elasticsearch** | 8.11.0 | Log storage & search |

**Kibana Dashboards:**
- Application overview
- Error monitoring
- User activity tracking
- Performance metrics
- Real-time alerts

### Code Quality
| Technology | Version | Purpose |
|------------|---------|---------|
| **SonarQube** | Latest | Code quality analysis |

**Checks:**
- Code smells
- Bugs & vulnerabilities
- Code coverage
- Duplications
- Security hotspots

### CI/CD
| Technology | Version | Purpose |
|------------|---------|---------|
| **GitHub Actions** | - | Automated workflows |

**Workflows:**
- Automated testing
- Code linting
- Build & deploy
- Security scanning

### Scheduled Tasks
| Technology | Version | Purpose |
|------------|---------|---------|
| **node-cron** | 3.0.3 | Cron jobs in Node.js |

**Scheduled Tasks:**
- Database cleanup
- Certificate generation
- Report generation
- Cache invalidation
- Notification sending

---

## 🔐 SECURITY & SECRETS MANAGEMENT

### 🆕 Secret Management
| Technology | Version | Purpose |
|------------|---------|---------|
| **HashiCorp Vault** | Latest | Centralized secret storage |

**Managed Secrets:**
- Database passwords
- API keys (OpenAI, Gemini)
- JWT secrets
- SMTP credentials
- Payment API keys
- OAuth client secrets

**Features:**
- Encryption at rest/transit
- Access policies
- Audit logging
- Secret rotation
- TTL-based secrets
- Redis caching

### Security Middleware
| Technology | Version | Purpose |
|------------|---------|---------|
| **Helmet.js** | 7.1.0 | HTTP security headers |
| **CORS** | 2.8.5 | Cross-origin resource sharing |
| **express-rate-limit** | 7.1.5 | Rate limiting |

### Input Validation
| Technology | Version | Purpose |
|------------|---------|---------|
| **express-validator** | 7.0.1 | Request validation |
| **Joi** | 17.11.0 | Schema validation |

**Protection Against:**
- ✅ XSS (Cross-site scripting)
- ✅ SQL Injection (via ORM)
- ✅ CSRF (CSRF tokens)
- ✅ Brute force (rate limiting)
- ✅ Clickjacking (X-Frame-Options)
- ✅ MIME sniffing (X-Content-Type-Options)

---

## 🧪 TESTING

### Testing Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **Jest** | 29.7.0 | Unit & integration testing |
| **Supertest** | 6.3.3 | HTTP assertion testing |

---

## 📦 DEVELOPMENT TOOLS

| Technology | Version | Purpose |
|------------|---------|---------|
| **Nodemon** | 3.0.2 | Auto-restart on file changes |
| **Concurrently** | 8.2.2 | Run multiple commands |
| **sequelize-cli** | 6.6.2 | Database migrations |
| **dotenv** | 16.3.1 | Environment variables |

---

## 🌐 COMPLETE STACK SUMMARY

### Architecture Layers

```
┌─────────────────────────────────────────────────────┐
│                     CLIENT                          │
│  Web Browser, Mobile, Desktop Apps                  │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                   FRONTEND                          │
│  EJS, Tailwind CSS, Vanilla JS, Socket.IO Client   │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                   BACKEND                           │
│  Node.js, Express, Passport, JWT, Socket.IO        │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│              DATA & STORAGE LAYER                   │
│  PostgreSQL, Redis, Elasticsearch, MinIO           │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│              EXTERNAL SERVICES                      │
│  OpenAI, Gemini, VietQR, Email                     │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│         INFRASTRUCTURE & MONITORING                 │
│  Docker, PM2, Prometheus, Grafana                  │
│  Vault, Kibana, Elasticsearch, Winston             │
└─────────────────────────────────────────────────────┘
```

---

## 📊 Statistics

- **Total NPM Packages:** 40+ dependencies
- **Total Services:** 12+ (DB, Redis, ES, MinIO, Vault, Kibana, etc.)
- **Docker Containers:** 8+ containers
- **API Endpoints:** 50+ routes
- **Database Tables:** 32 models
- **Supported File Types:** Images, PDF, Video, Documents, Excel, CSV
- **AI Integrations:** 2 (OpenAI, Gemini)
- **Security Layers:** 6+ (Helmet, CORS, Rate Limit, Vault, etc.)

---

## 🔄 Version History

- **v2.1** (09/01/2026): Added Vault & Kibana
- **v2.0** (09/01/2026): Complete technology documentation
- **v1.0**: Initial stack

---

**📝 Note:** This is the complete and accurate technology stack. The image `03-technology-stack-diagram.png` will be updated when image generation quota is available.
