# 💬 Kiến Trúc Hệ Thống Chat - StudyMate

**Ngày tạo:** 2026-01-02  
**Phiên bản:** 1.0.0

---

## 📋 Tổng Quan

Hệ thống chat real-time sử dụng **Socket.IO** cho phép:
- **User-to-User Chat** - Chat giữa các users
- **Real-time Messaging** - Gửi/nhận tin nhắn tức thời
- **Conversation Management** - Quản lý cuộc trò chuyện
- **Typing Indicators** - Hiển thị đang gõ
- **Read Receipts** - Đánh dấu đã đọc
- **Active Users Tracking** - Theo dõi users đang online

---

## 🏗️ 1. Component Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        ChatPage[💬 Chat Page]
        ConversationList[📋 Conversation List]
        MessageInput[✍️ Message Input]
        SocketClient[🔌 Socket.IO Client]
    end

    subgraph "Server Layer"
        SocketServer[🔌 Socket.IO Server]
        ChatSocketHandler[💬 Chat Socket Handler]
        SessionMiddleware[🔐 Session Middleware]
    end

    subgraph "Route Layer"
        ChatRoutes[💬 Chat Routes<br/>/chat/*]
        ConversationRoute[GET /chat/:userId]
        MessagesRoute[GET /chat/:conversationId/messages]
        SendMessageRoute[POST /chat/:conversationId/message]
        SearchUsersRoute[GET /chat/search/users]
    end

    subgraph "Controller Layer"
        ChatController[Chat Controller]
        ConversationHandler[Conversation Handler]
        MessageHandler[Message Handler]
    end

    subgraph "Model Layer"
        ConversationModel[💬 Conversation Model]
        MessageModel[📨 Message Model]
        UserModel[👤 User Model]
    end

    subgraph "Storage Layer"
        PostgreSQL[(🗄️ PostgreSQL)]
        Redis[(⚡ Redis<br/>Active Users)]
    end

    ChatPage --> SocketClient
    ConversationList --> ChatRoutes
    MessageInput --> SocketClient
    
    SocketClient <--> SocketServer
    SocketServer --> ChatSocketHandler
    SocketServer --> SessionMiddleware
    
    ChatRoutes --> ChatController
    ConversationRoute --> ChatController
    MessagesRoute --> ChatController
    SendMessageRoute --> ChatController
    SearchUsersRoute --> ChatController
    
    ChatController --> ConversationHandler
    ChatController --> MessageHandler
    
    ChatSocketHandler --> ConversationModel
    ChatSocketHandler --> MessageModel
    ChatSocketHandler --> UserModel
    ChatSocketHandler --> Redis
    
    ConversationModel --> PostgreSQL
    MessageModel --> PostgreSQL
    UserModel --> PostgreSQL

    style SocketServer fill:#4A90E2,stroke:#2E5C8A,stroke-width:3px,color:#fff
    style ChatSocketHandler fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style ConversationModel fill:#FF6B6B,stroke:#CC5555,stroke-width:2px,color:#fff
    style Redis fill:#DC382D,stroke:#A0261E,stroke-width:2px,color:#fff
```

---

## 🔌 2. Socket.IO Connection Flow

```mermaid
sequenceDiagram
    participant Client
    participant SocketServer
    participant SessionMiddleware
    participant ChatHandler
    participant Redis
    participant PostgreSQL

    Client->>SocketServer: io.connect()
    SocketServer->>SessionMiddleware: Extract session
    SessionMiddleware->>SessionMiddleware: Get session from request
    
    alt Session not found or no user
        SessionMiddleware-->>SocketServer: Error: Authentication failed
        SocketServer-->>Client: Connection rejected
    else Session found with user
        SessionMiddleware->>SessionMiddleware: Set socket.userId = session.user.id
        SessionMiddleware-->>SocketServer: Authentication success
        SocketServer->>ChatHandler: connection event
        ChatHandler->>ChatHandler: Record connection metrics
        
        ChatHandler->>Redis: Track active user
        Redis-->>ChatHandler: User tracked
        
        ChatHandler->>SocketServer: Emit 'connected'
        SocketServer-->>Client: 'connected' event
        
        Note over Client,PostgreSQL: User can now send/receive messages
    end
```

---

## 💬 3. Send Message Flow

```mermaid
sequenceDiagram
    participant User1
    participant Client1
    participant SocketServer
    participant ChatHandler
    participant ConversationModel
    participant MessageModel
    participant UserModel
    participant Client2
    participant User2
    participant PostgreSQL
    participant Redis

    User1->>Client1: Type message and send
    Client1->>SocketServer: emit('send_message', { conversationId, content })
    SocketServer->>ChatHandler: send_message event
    
    ChatHandler->>ChatHandler: Validate message data
    ChatHandler->>ConversationModel: Find conversation
    ConversationModel->>PostgreSQL: SELECT * FROM conversations WHERE id = ?
    PostgreSQL-->>ConversationModel: Conversation
    ConversationModel-->>ChatHandler: Conversation
    
    alt Conversation not found
        ChatHandler-->>SocketServer: Error: Conversation not found
        SocketServer-->>Client1: 'error' event
    else Conversation found
        alt User not in conversation
            ChatHandler-->>SocketServer: Error: Unauthorized
            SocketServer-->>Client1: 'error' event
        else User authorized
            ChatHandler->>MessageModel: Create message
            MessageModel->>PostgreSQL: INSERT INTO messages (conversation_id, sender_id, content)
            PostgreSQL-->>MessageModel: Message created
            MessageModel-->>ChatHandler: Message
            
            ChatHandler->>UserModel: Get sender info
            UserModel->>PostgreSQL: SELECT * FROM users WHERE id = ?
            PostgreSQL-->>UserModel: User
            UserModel-->>ChatHandler: Sender
            
            ChatHandler->>ConversationModel: Update conversation
            ConversationModel->>PostgreSQL: UPDATE conversations SET last_message_at=?, last_message_id=?, unread_count=?
            PostgreSQL-->>ConversationModel: Updated
            
            ChatHandler->>Redis: Update active users
            Redis-->>ChatHandler: Updated
            
            ChatHandler->>SocketServer: Emit to conversation room
            SocketServer->>SocketServer: io.to(`conversation:${conversationId}`).emit('new_message', messageData)
            SocketServer-->>Client1: 'new_message' event (sender)
            SocketServer-->>Client2: 'new_message' event (receiver)
            
            Client1->>User1: Display own message
            Client2->>User2: Display new message + notification
        end
    end
```

---

## 📋 4. Join Conversation Flow

```mermaid
sequenceDiagram
    participant User
    participant Client
    participant SocketServer
    participant ChatHandler
    participant ConversationModel
    participant Redis
    participant PostgreSQL

    User->>Client: Open conversation page
    Client->>SocketServer: emit('join_conversation', conversationId)
    SocketServer->>ChatHandler: join_conversation event
    
    ChatHandler->>ConversationModel: Find conversation
    ConversationModel->>PostgreSQL: SELECT * FROM conversations WHERE id = ?
    PostgreSQL-->>ConversationModel: Conversation
    ConversationModel-->>ChatHandler: Conversation
    
    alt Conversation not found
        ChatHandler-->>SocketServer: Error
        SocketServer-->>Client: 'error' event
    else Conversation found
        alt User not authorized
            ChatHandler-->>SocketServer: Error: Unauthorized
            SocketServer-->>Client: 'error' event
        else User authorized
            ChatHandler->>SocketServer: Join room
            SocketServer->>SocketServer: socket.join(`conversation:${conversationId}`)
            SocketServer->>SocketServer: socket.join(`user:${userId}`)
            
            ChatHandler->>Redis: Add user to conversation
            Redis->>Redis: SADD chat:active_users:${conversationId} ${userId}
            Redis->>Redis: SET chat:user_socket:${userId}:${conversationId} ${socketId}
            Redis-->>ChatHandler: User added
            
            ChatHandler->>SocketServer: Emit 'joined_conversation'
            SocketServer-->>Client: 'joined_conversation' event
            
            ChatHandler->>ChatHandler: Load and emit recent messages
            ChatHandler->>SocketServer: Emit 'messages_loaded'
            SocketServer-->>Client: 'messages_loaded' event with messages
        end
    end
```

---

## 👀 5. Mark Messages as Read Flow

```mermaid
sequenceDiagram
    participant User
    participant Client
    participant SocketServer
    participant ChatHandler
    participant ConversationModel
    participant MessageModel
    participant PostgreSQL

    User->>Client: View conversation
    Client->>SocketServer: emit('mark_read', conversationId)
    SocketServer->>ChatHandler: mark_read event
    
    ChatHandler->>ConversationModel: Find conversation
    ConversationModel->>PostgreSQL: SELECT * FROM conversations WHERE id = ?
    PostgreSQL-->>ConversationModel: Conversation
    ConversationModel-->>ChatHandler: Conversation
    
    ChatHandler->>ChatHandler: Determine which user's unread count
    alt User is user1
        ChatHandler->>ConversationModel: Reset user1_unread_count = 0
    else User is user2
        ChatHandler->>ConversationModel: Reset user2_unread_count = 0
    end
    
    ConversationModel->>PostgreSQL: UPDATE conversations SET user1_unread_count=0 OR user2_unread_count=0
    PostgreSQL-->>ConversationModel: Updated
    
    ChatHandler->>MessageModel: Mark messages as read
    MessageModel->>PostgreSQL: UPDATE messages SET read_at=? WHERE conversation_id=? AND sender_id!=? AND read_at IS NULL
    PostgreSQL-->>MessageModel: Updated
    
    ChatHandler->>SocketServer: Emit 'messages_read'
    SocketServer->>SocketServer: io.to(`conversation:${conversationId}`).emit('messages_read', { conversationId, userId })
    SocketServer-->>Client: 'messages_read' event
    
    Client->>User: Update UI (remove unread badge)
```

---

## ⌨️ 6. Typing Indicator Flow

```mermaid
sequenceDiagram
    participant User1
    participant Client1
    participant SocketServer
    participant ChatHandler
    participant Client2
    participant User2

    User1->>Client1: Start typing
    Client1->>SocketServer: emit('typing_start', { conversationId })
    SocketServer->>ChatHandler: typing_start event
    
    ChatHandler->>ChatHandler: Set typing timeout (3 seconds)
    ChatHandler->>SocketServer: Emit to other users
    SocketServer->>SocketServer: socket.to(`conversation:${conversationId}`).emit('user_typing', { userId, conversationId })
    SocketServer-->>Client2: 'user_typing' event
    Client2->>User2: Show typing indicator
    
    alt User1 stops typing (3 seconds)
        ChatHandler->>ChatHandler: Clear typing timeout
        ChatHandler->>SocketServer: Emit typing stop
        SocketServer->>SocketServer: socket.to(`conversation:${conversationId}`).emit('user_stopped_typing', { userId })
        SocketServer-->>Client2: 'user_stopped_typing' event
        Client2->>User2: Hide typing indicator
    else User1 sends message
        Client1->>SocketServer: emit('send_message', ...)
        Note over ChatHandler: Typing indicator automatically cleared
    end
```

---

## 🔍 7. Search Users Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Route
    participant Controller
    participant UserModel
    participant PostgreSQL

    User->>Browser: Type search query
    Browser->>Route: GET /chat/search/users?q=query
    Route->>Controller: searchUsers()
    
    Controller->>Controller: Validate query (min 2 characters)
    
    Controller->>UserModel: Search users
    UserModel->>PostgreSQL: SELECT * FROM users WHERE<br/>(first_name ILIKE ? OR last_name ILIKE ?<br/>OR email ILIKE ? OR student_id ILIKE ?)<br/>AND id != ? AND is_active = true<br/>LIMIT 10
    PostgreSQL-->>UserModel: Users array
    UserModel-->>Controller: Users
    
    Controller->>Controller: Format response (exclude current user)
    Controller-->>Browser: JSON { users: [...] }
    Browser->>User: Display search results
```

---

## 📊 8. Active Users Tracking

```mermaid
graph TB
    subgraph "Redis Keys"
        ActiveUsersKey[chat:active_users:${conversationId}<br/>SET of userIds]
        UserSocketKey[chat:user_socket:${userId}:${conversationId}<br/>socketId]
        SocketUserKey[chat:socket_user:${socketId}<br/>userId:conversationId]
    end

    subgraph "Operations"
        AddUser[Add User<br/>SADD, SET with TTL]
        RemoveUser[Remove User<br/>SREM, DEL]
        GetActiveUsers[Get Active Users<br/>SMEMBERS]
        Cleanup[Cleanup on Disconnect<br/>Remove all user keys]
    end

    subgraph "Events"
        Connection[Socket Connection]
        Disconnection[Socket Disconnection]
        JoinConversation[Join Conversation]
        LeaveConversation[Leave Conversation]
    end

    Connection --> AddUser
    Disconnection --> Cleanup
    JoinConversation --> AddUser
    LeaveConversation --> RemoveUser
    
    AddUser --> ActiveUsersKey
    AddUser --> UserSocketKey
    AddUser --> SocketUserKey
    
    RemoveUser --> ActiveUsersKey
    RemoveUser --> UserSocketKey
    RemoveUser --> SocketUserKey
    
    GetActiveUsers --> ActiveUsersKey

    style ActiveUsersKey fill:#DC382D,stroke:#A0261E,stroke-width:2px,color:#fff
    style AddUser fill:#10A37F,stroke:#0A7A5F,stroke-width:2px,color:#fff
    style RemoveUser fill:#E74C3C,stroke:#C0392B,stroke-width:2px,color:#fff
```

---

## 📊 9. Data Models

### Conversation Model
```javascript
{
  id: UUID (Primary Key),
  user1_id: UUID (Foreign Key -> users.id),
  user2_id: UUID (Foreign Key -> users.id),
  last_message_at: Date,
  last_message_id: UUID (Foreign Key -> messages.id),
  user1_unread_count: Integer (Default: 0),
  user2_unread_count: Integer (Default: 0),
  created_at: Date,
  updated_at: Date
}
```

### Message Model
```javascript
{
  id: UUID (Primary Key),
  conversation_id: UUID (Foreign Key -> conversations.id),
  sender_id: UUID (Foreign Key -> users.id),
  content: Text (Required),
  read_at: Date (Optional),
  created_at: Date,
  updated_at: Date
}
```

---

## 🔗 10. Socket.IO Events

### Client → Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `join_conversation` | `{ conversationId }` | Join a conversation room |
| `leave_conversation` | `{ conversationId }` | Leave a conversation room |
| `send_message` | `{ conversationId, content }` | Send a message |
| `mark_read` | `{ conversationId }` | Mark messages as read |
| `typing_start` | `{ conversationId }` | User started typing |
| `typing_stop` | `{ conversationId }` | User stopped typing |

### Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `connected` | `{ userId, socketId }` | Socket connected successfully |
| `new_message` | `{ id, conversationId, senderId, content, createdAt, sender }` | New message received |
| `messages_loaded` | `{ messages: [...] }` | Recent messages loaded |
| `messages_read` | `{ conversationId, userId }` | Messages marked as read |
| `user_typing` | `{ userId, conversationId }` | User is typing |
| `user_stopped_typing` | `{ userId, conversationId }` | User stopped typing |
| `conversation_updated` | `{ conversationId, lastMessage, unreadCount }` | Conversation updated |
| `error` | `{ message, code }` | Error occurred |

---

## 🔗 11. HTTP API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/chat` | Get all conversations | Yes |
| GET | `/chat/search/users?q=query` | Search users for chat | Yes |
| GET | `/chat/:userId` | Get or create conversation with user | Yes |
| GET | `/chat/:conversationId/messages` | Get messages for conversation | Yes |
| POST | `/chat/:conversationId/message` | Send message (HTTP fallback) | Yes |

---

## 📝 Ghi Chú

### Socket.IO Configuration
- **CORS**: Allow all origins with credentials
- **Session Middleware**: Share Express session with Socket.IO
- **Transports**: WebSocket with polling fallback
- **Room Management**: One room per conversation, one per user

### Redis Usage
- **Active Users**: Track users currently in conversations
- **Socket Mapping**: Map userId+conversationId to socketId
- **TTL**: 24 hours for all Redis keys
- **Fallback**: In-memory tracking if Redis unavailable

### Performance Considerations
- **Message Pagination**: Load messages in batches (50 per page)
- **Lazy Loading**: Load conversations on demand
- **Caching**: Cache user info in Redis
- **Connection Pooling**: Reuse database connections

### Security
- **Authentication**: Required for all socket connections
- **Authorization**: Users can only access their conversations
- **Input Validation**: Validate all message content
- **Rate Limiting**: Limit message sending rate

---

**Tác giả:** StudyMate Development Team  
**Cập nhật:** 2026-01-02

