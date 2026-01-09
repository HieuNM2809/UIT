# 🤖 Kiến Trúc Dịch Vụ AI - StudyMate

**Ngày tạo:** 2026-01-02  
**Phiên bản:** 1.0.0

---

## 📋 Tổng Quan

Hệ thống AI tích hợp nhiều tính năng:
- **AI Chatbot** - Trợ lý học tập thông minh
- **Course Recommendations** - Gợi ý khóa học cá nhân hóa
- **Learning Analysis** - Phân tích tiến độ học tập
- **Learning Roadmap** - Tạo lộ trình học tập cá nhân hóa
- **Content Suggestions** - Gợi ý nội dung học tập

Hỗ trợ **OpenAI GPT** và **Google Gemini** với fallback mechanism.

---

## 🏗️ 1. Component Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        ChatInterface[💬 AI Chat Interface]
        RoadmapForm[🗺️ Roadmap Form]
        RecommendationPage[🎯 Recommendations Page]
        AnalysisPage[📈 Analysis Page]
    end

    subgraph "Route Layer"
        AIRoutes[🤖 AI Routes<br/>/api/ai/*]
        ChatRoute[POST /api/ai/chat]
        RecommendRoute[POST /api/ai/recommendations]
        AnalysisRoute[POST /api/ai/analyze]
        RoadmapRoute[POST /api/ai/roadmap]
        HistoryRoute[GET /api/ai/history]
    end

    subgraph "Controller Layer"
        AIController[AI Controller]
        ChatHandler[Chat Handler]
        RecommendHandler[Recommendation Handler]
        AnalysisHandler[Analysis Handler]
        RoadmapHandler[Roadmap Handler]
    end

    subgraph "Service Layer"
        AIService[AI Service]
        GeminiService[Gemini Service]
        OpenAIService[OpenAI Service]
        UserContextService[User Context Service]
        FallbackService[Fallback Handler]
    end

    subgraph "Model Layer"
        AIInteractionModel[AI Interaction Model]
        UserModel[👤 User Model]
        CourseModel[📚 Course Model]
        ProgressModel[📊 Progress Model]
        EnrollmentModel[✅ Enrollment Model]
    end

    subgraph "Storage Layer"
        PostgreSQL[(🗄️ PostgreSQL)]
        Redis[(⚡ Redis<br/>Response Cache)]
    end

    subgraph "External APIs"
        OpenAIAPI[🤖 OpenAI API<br/>GPT-3.5/4]
        GeminiAPI[🤖 Google Gemini<br/>Gemini Pro]
    end

    ChatInterface --> AIRoutes
    RoadmapForm --> AIRoutes
    RecommendationPage --> AIRoutes
    AnalysisPage --> AIRoutes

    AIRoutes --> AIController
    ChatRoute --> AIController
    RecommendRoute --> AIController
    AnalysisRoute --> AIController
    RoadmapRoute --> AIController
    HistoryRoute --> AIController

    AIController --> ChatHandler
    AIController --> RecommendHandler
    AIController --> AnalysisHandler
    AIController --> RoadmapHandler

    ChatHandler --> AIService
    RecommendHandler --> AIService
    AnalysisHandler --> AIService
    RoadmapHandler --> GeminiService

    AIService --> UserContextService
    AIService --> OpenAIService
    AIService --> GeminiService
    AIService --> FallbackService

    UserContextService --> UserModel
    UserContextService --> EnrollmentModel
    UserContextService --> ProgressModel
    UserContextService --> CourseModel

    OpenAIService --> OpenAIAPI
    GeminiService --> GeminiAPI

    AIController --> AIInteractionModel
    AIController --> Redis

    AIInteractionModel --> PostgreSQL
    UserModel --> PostgreSQL
    CourseModel --> PostgreSQL
    ProgressModel --> PostgreSQL
    EnrollmentModel --> PostgreSQL

    style AIService fill:#4A90E2,stroke:#2E5C8A,stroke-width:3px,color:#fff
    style GeminiService fill:#4285F4,stroke:#1A73E8,stroke-width:2px,color:#fff
    style OpenAIService fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style Redis fill:#DC382D,stroke:#A0261E,stroke-width:2px,color:#fff
```

---

## 💬 2. AI Chat Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant AIController
    participant AIService
    participant UserContextService
    participant OpenAIService
    participant GeminiService
    participant AIInteractionModel
    participant Redis
    participant PostgreSQL

    User->>Browser: Send message to AI
    Browser->>AIController: POST /api/ai/chat
    
    AIController->>AIService: Get user context
    AIService->>UserContextService: getUserContext(userId)
    UserContextService->>UserModel: Find user with enrollments and progress
    UserModel->>PostgreSQL: SELECT * FROM users WHERE id = ?<br/>INCLUDE enrollments, progress
    PostgreSQL-->>UserModel: User with context
    UserModel-->>UserContextService: User context
    UserContextService-->>AIService: Context data
    
    AIService->>AIService: Build system message with context
    AIService->>AIService: getAvailableAIService()
    
    alt OpenAI available
        AIService->>OpenAIService: callOpenAI(messages)
        OpenAIService->>OpenAIAPI: POST /v1/chat/completions
        OpenAIAPI-->>OpenAIService: { choices: [{ message: { content } }] }
        OpenAIService-->>AIService: AI response
    else Gemini available
        AIService->>GeminiService: callGemini(prompt)
        GeminiService->>GeminiAPI: POST /v1/models/gemini-pro:generateContent
        GeminiAPI-->>GeminiService: { response: { text() } }
        GeminiService-->>AIService: AI response
    else No service available
        AIService->>AIService: Fallback response
        AIService-->>AIService: Basic response
    end
    
    AIService->>AIInteractionModel: Save interaction
    AIInteractionModel->>PostgreSQL: INSERT INTO ai_interactions
    PostgreSQL-->>AIInteractionModel: Interaction saved
    
    AIController->>Redis: Cache response (optional)
    Redis-->>AIController: Cached
    
    AIController-->>Browser: { success: true, data: { response, session_id, model } }
    Browser->>User: Display AI response
```

---

## 🗺️ 3. Roadmap Generation Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant AIController
    participant GeminiService
    participant UserContextService
    participant GeminiAPI
    participant AIInteractionModel
    participant PostgreSQL

    User->>Browser: Fill roadmap form<br/>(topics, learningStyle, skillLevel, etc.)
    Browser->>AIController: POST /api/ai/roadmap
    
    AIController->>AIController: Validate input (topics required)
    
    AIController->>UserContextService: getUserContext(userId)
    UserContextService->>PostgreSQL: Get user data
    PostgreSQL-->>UserContextService: User context
    UserContextService-->>AIController: Context
    
    AIController->>AIController: Build detailed prompt<br/>(learning style, time, skill level, topics)
    
    AIController->>GeminiService: callGeminiWithFallback(prompt)
    GeminiService->>GeminiAPI: Try gemini-pro
    alt gemini-pro fails
        GeminiService->>GeminiAPI: Try gemini-pro-vision
        alt gemini-pro-vision fails
            GeminiService->>GeminiAPI: Try gemini-1.5-pro
            GeminiAPI-->>GeminiService: Response
        else gemini-pro-vision succeeds
            GeminiAPI-->>GeminiService: Response
        end
    else gemini-pro succeeds
        GeminiAPI-->>GeminiService: Response
    end
    
    GeminiService-->>AIController: { response, model, modelsTried }
    
    AIController->>AIInteractionModel: Save roadmap interaction
    AIInteractionModel->>PostgreSQL: INSERT INTO ai_interactions<br/>(interaction_type='roadmap', user_input, ai_response, model_used)
    PostgreSQL-->>AIInteractionModel: Saved
    
    AIController-->>Browser: { success: true, data: { roadmap, model, topics, personalization } }
    Browser->>User: Display generated roadmap
```

---

## 🎯 4. Course Recommendation Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant AIController
    participant AIService
    participant UserContextService
    participant CourseModel
    participant Redis
    participant PostgreSQL

    User->>Browser: Request recommendations
    Browser->>AIController: POST /api/ai/recommendations
    
    AIController->>Redis: Check cache
    Redis-->>AIController: Cached recommendations or null
    
    alt Cache hit
        AIController-->>Browser: Cached recommendations
    else Cache miss
        AIController->>AIService: Get user context
        AIService->>UserContextService: getUserContext(userId)
        UserContextService->>PostgreSQL: Get user enrollments and progress
        PostgreSQL-->>UserContextService: User data
        UserContextService-->>AIService: Context
        
        AIController->>CourseModel: Find available courses
        CourseModel->>PostgreSQL: SELECT * FROM courses WHERE status='published'<br/>ORDER BY average_rating DESC, enrolled_count DESC<br/>LIMIT 50
        PostgreSQL-->>CourseModel: Courses
        CourseModel-->>AIController: Courses
        
        AIController->>AIController: Filter out enrolled courses
        AIController->>AIController: Score courses<br/>(rating, popularity, level, price)
        AIController->>AIController: Sort by score
        AIController->>AIController: Limit to top N
        
        alt AI service available
            AIController->>AIService: Enhance with AI
            AIService->>OpenAIService: Generate reasons
            OpenAIService->>OpenAIAPI: Call API
            OpenAIAPI-->>OpenAIService: AI reasons
            OpenAIService-->>AIController: Enhanced recommendations
        end
        
        AIController->>Redis: Cache recommendations (TTL: 1 hour)
        Redis-->>AIController: Cached
        
        AIController-->>Browser: { success: true, data: { recommendations, cached: false } }
        Browser->>User: Display recommended courses
    end
```

---

## 📈 5. Learning Analysis Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant AIController
    participant AIService
    participant UserContextService
    participant ProgressModel
    participant ContentModel
    participant OpenAIService
    participant AIInteractionModel
    participant PostgreSQL

    User->>Browser: Request learning analysis
    Browser->>AIController: POST /api/ai/analyze<br/>{ analysis_type, course_id? }
    
    AIController->>AIService: Get user context
    AIService->>UserContextService: getUserContext(userId)
    UserContextService->>PostgreSQL: Get comprehensive user data
    PostgreSQL-->>UserContextService: User context
    UserContextService-->>AIController: Context
    
    alt Course-specific analysis
        AIController->>ProgressModel: Find course progress
        ProgressModel->>PostgreSQL: SELECT * FROM progress WHERE user_id=? AND course_id=?
        PostgreSQL-->>ProgressModel: Progress records
        ProgressModel-->>AIController: Progress data
        
        AIController->>ContentModel: Get content details
        ContentModel->>PostgreSQL: SELECT * FROM contents WHERE course_id=?
        PostgreSQL-->>ContentModel: Contents
        ContentModel-->>AIController: Contents
    else Overall analysis
        AIController->>AIController: Calculate overall stats<br/>(total courses, completed contents, avg progress)
    end
    
    AIController->>AIService: Generate AI analysis
    AIService->>AIService: Build analysis prompt
    AIService->>OpenAIService: callOpenAI(messages)
    OpenAIService->>OpenAIAPI: POST /v1/chat/completions
    OpenAIAPI-->>OpenAIService: Analysis response
    OpenAIService-->>AIController: AI insights
    
    AIController->>AIInteractionModel: Save analysis interaction
    AIInteractionModel->>PostgreSQL: INSERT INTO ai_interactions<br/>(interaction_type='analysis', context_data)
    PostgreSQL-->>AIInteractionModel: Saved
    
    AIController-->>Browser: { success: true, data: { analysis_type, raw_data, ai_insights } }
    Browser->>User: Display analysis with insights
```

---

## 🔄 6. AI Service Fallback Strategy

```mermaid
graph TB
    subgraph "Service Selection"
        CheckOpenAI{OpenAI<br/>Available?}
        CheckGemini{Gemini<br/>Available?}
        UseOpenAI[Use OpenAI]
        UseGemini[Use Gemini]
        UseFallback[Use Fallback]
    end

    subgraph "Fallback Chain"
        TryGeminiPro[Try Gemini Pro]
        TryGeminiProVision[Try Gemini Pro Vision]
        TryGemini15Pro[Try Gemini 1.5 Pro]
        Success[Success]
        Error[Error]
    end

    CheckOpenAI -->|Yes| UseOpenAI
    CheckOpenAI -->|No| CheckGemini
    CheckGemini -->|Yes| UseGemini
    CheckGemini -->|No| UseFallback

    UseGemini --> TryGeminiPro
    TryGeminiPro -->|Success| Success
    TryGeminiPro -->|Fail| TryGeminiProVision
    TryGeminiProVision -->|Success| Success
    TryGeminiProVision -->|Fail| TryGemini15Pro
    TryGemini15Pro -->|Success| Success
    TryGemini15Pro -->|Fail| Error

    style UseOpenAI fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style UseGemini fill:#4285F4,stroke:#1A73E8,stroke-width:2px,color:#fff
    style UseFallback fill:#E74C3C,stroke:#C0392B,stroke-width:2px,color:#fff
    style Success fill:#27AE60,stroke:#229954,stroke-width:2px,color:#fff
```

---

## 📊 7. User Context Building

```mermaid
graph TB
    subgraph "User Profile"
        UserInfo[User Info<br/>name, role, preferences]
    end

    subgraph "Learning Data"
        CurrentCourses[Current Courses<br/>title, level, progress]
        RecentActivity[Recent Activity<br/>content, type, status]
        ProgressStats[Progress Stats<br/>completed, in_progress]
    end

    subgraph "Context Assembly"
        BuildContext[Build Context Object]
        FormatContext[Format for AI Prompt]
    end

    UserInfo --> BuildContext
    CurrentCourses --> BuildContext
    RecentActivity --> BuildContext
    ProgressStats --> BuildContext
    
    BuildContext --> FormatContext
    FormatContext --> AIService

    style UserInfo fill:#4A90E2,stroke:#2E5C8A,stroke-width:2px,color:#fff
    style CurrentCourses fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style BuildContext fill:#FF6B6B,stroke:#CC5555,stroke-width:2px,color:#fff
```

---

## 📊 8. Data Models

### AIInteraction Model
```javascript
{
  id: UUID (Primary Key),
  user_id: UUID (Foreign Key -> users.id),
  interaction_type: ENUM('chat', 'recommendation', 'analysis', 'roadmap'),
  user_input: Text (Required),
  ai_response: Text (Required),
  model_used: String (e.g., 'gpt-3.5-turbo', 'gemini-pro'),
  tokens_used: Integer (Default: 0),
  response_time: Integer (milliseconds),
  rating: Integer (1-5, Optional),
  context_data: JSON (Optional),
  session_id: String (Optional),
  created_at: Date,
  updated_at: Date
}
```

---

## 🔗 9. API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/ai/chat` | Chat with AI | Yes |
| POST | `/api/ai/recommendations` | Get course recommendations | Yes |
| POST | `/api/ai/analyze` | Analyze learning progress | Yes |
| POST | `/api/ai/roadmap` | Generate learning roadmap | Yes |
| GET | `/api/ai/history` | Get AI interaction history | Yes |
| POST | `/api/ai/interactions/:id/rate` | Rate AI response | Yes |
| GET | `/roadmap` | Roadmap page | Yes |
| GET | `/roadmap/history` | Roadmap history page | Yes |
| GET | `/roadmap/:id` | Roadmap detail page | Yes |

---

## 📝 Ghi Chú

### AI Service Priority
1. **OpenAI GPT-3.5/4** - Primary service (if available)
2. **Google Gemini Pro** - Fallback service
3. **Gemini Pro Vision** - Secondary fallback
4. **Gemini 1.5 Pro** - Tertiary fallback
5. **Basic Fallback** - Simple responses if all fail

### Caching Strategy
- **Recommendations**: Cache for 1 hour per user
- **Analysis**: No caching (real-time data)
- **Chat**: No caching (conversational)
- **Roadmap**: No caching (personalized)

### Token Management
- **OpenAI**: Track prompt_tokens, completion_tokens, total_tokens
- **Gemini**: Estimate tokens (1 token ≈ 4 characters)
- **Logging**: All token usage logged to database

### Performance Optimization
- **Context Caching**: Cache user context for 5 minutes
- **Batch Requests**: Group multiple API calls when possible
- **Rate Limiting**: Limit AI requests per user
- **Response Streaming**: Support for streaming responses (future)

---

**Tác giả:** StudyMate Development Team  
**Cập nhật:** 2026-01-02

