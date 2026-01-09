# 🤖 AI Chatbot Interaction Flow

## Công nghệ
- **OpenAI GPT-3.5/4**: Chat chung
- **Google Gemini**: Course-specific advice
- **Socket.IO**: Real-time messaging

## Flow chi tiết

### Step 1-3: User Input
```javascript
// Frontend
socket.emit('chat:message', {
  conversationId: '...',
  message: 'Explain recursion in programming',
  timestamp: Date.now()
});
```

### Step 4-6: Server Processing
1. Socket.IO server nhận event
2. Authenticate socket session
3. Load conversation history (last 10 messages)

### Step 7-10: AI Processing

#### Build Context:
```javascript
const systemPrompt = `
You are a helpful learning assistant for StudyMate.
User info:
- Name: ${user.fullname}
- Current courses: ${enrolledCourses}
- Level: ${user.level}

Provide clear, educational responses.
`;

const messages = [
  {role: 'system', content: systemPrompt},
  ...conversationHistory,
  {role: 'user', content: userMessage}
];
```

#### Call AI API:
```javascript
// OpenAI
const response = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: messages,
  temperature: 0.7,
  max_tokens: 500
});

// Gemini
const model = genAI.getGenerativeModel({model: 'gemini-pro'});
const result = await model.generateContent(prompt);
```

### Step 11-13: Save to Database
```sql
INSERT INTO message (conversation_id, sender_type, content)
VALUES (?, 'user', ?), (?, 'ai', ?);

INSERT INTO ai_interaction (user_id, model_used, tokens_used)
VALUES (?, 'gpt-3.5-turbo', ?);
```

### Step 14-16: Real-time Response
```javascript
// Emit to user
socket.emit('chat:response', {
  messageId: '...',
  content: aiResponse,
  timestamp: Date.now()
});

// Frontend displays with markdown
renderMarkdown(aiResponse);
```

## Features
- ✨ Markdown support (code blocks, lists, links)
- 🎨 Syntax highlighting
- 📝 Conversation history
- ⚡ Real-time streaming
- 💾 Auto-save messages
- 🔄 Retry on error

## Rate Limiting
- Free users: 10 messages/hour
- Premium: 100 messages/hour
- Check Redis counter

## Error Handling
- API timeout (30s) → Fallback message
- Invalid key → System error notification
- Connection lost → Auto-reconnect
