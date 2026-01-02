# Gemini API Usage Guide

Hướng dẫn sử dụng Google Gemini API trong StudyMate project.

## Mục lục

1. [Cấu hình](#cấu-hình)
2. [Cấu trúc API Request](#cấu-trúc-api-request)
3. [Cấu trúc API Response](#cấu-trúc-api-response)
4. [Sử dụng trong Code](#sử-dụng-trong-code)
5. [Models Available](#models-available)
6. [Fallback Mechanism](#fallback-mechanism)
7. [Ví dụ](#ví-dụ)
8. [Troubleshooting](#troubleshooting)

---

## Cấu hình

### 1. Lấy API Key

1. Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Đăng nhập với tài khoản Google
3. Tạo API key mới
4. Copy API key

### 2. Cấu hình Environment Variables

Thêm vào file `.env`:

```env
# Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Gemini Models List (comma-separated, optional)
# Nếu không set, sẽ dùng danh sách mặc định
GEMINI_MODELS=gemma-3-27b-it,gemma-3-12b-it,gemini-3-flash,gemini-2.5-flash
```

### 3. Models Configuration

Có thể cấu hình danh sách models trong `.env`:

```env
GEMINI_MODELS=gemma-3-27b-it,gemma-3-12b-it,gemma-3-4b-it,gemma-3-2b-it,gemma-3-1b-it,gemini-3-flash,gemini-2.5-flash,gemini-2.5-flash-lite
```

**Lưu ý:** Models sẽ được thử theo thứ tự từ trái sang phải. Nếu model đầu tiên lỗi, hệ thống sẽ tự động thử model tiếp theo.

---

## Cấu trúc API Request

### Endpoint

```
POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={API_KEY}
```

### Request Body Structure

```json
{
  "contents": [
    {
      "role": "user",  // Optional: "user" hoặc "model"
      "parts": [
        {
          "text": "Câu hỏi hoặc nội dung cần xử lý"
        }
      ]
    }
  ]
}
```

### Giải thích các thành phần:

#### `contents` (Array)
- Mảng các đối tượng `Content`, đại diện cho lịch sử hội thoại
- Mỗi `Content` là một lượt tương tác (user hoặc model)
- Có thể gửi nhiều `Content` để tạo context/history

#### `parts` (Array trong mỗi Content)
- Mảng các đối tượng `Part`, chứa nội dung của `Content`
- Mỗi `Part` có thể là:
  - `{ text: "..." }` - Văn bản
  - `{ inline_data: { mime_type: "image/jpeg", data: "base64..." } }` - Hình ảnh
  - `{ file_data: { ... } }` - File đính kèm
- Một `Content` có thể có nhiều `parts` (ví dụ: text + image)

### Ví dụ Request

**Đơn giản (chỉ text):**
```json
{
  "contents": [{
    "parts": [{ "text": "Giải thích định luật 3 Newton một cách dễ hiểu." }]
  }]
}
```

**Với conversation history:**
```json
{
  "contents": [
    {
      "role": "user",
      "parts": [{ "text": "Xin chào" }]
    },
    {
      "role": "model",
      "parts": [{ "text": "Chào bạn! Tôi có thể giúp gì?" }]
    },
    {
      "role": "user",
      "parts": [{ "text": "Giải thích định luật 3 Newton" }]
    }
  ]
}
```

**Với text + image (multimodal):**
```json
{
  "contents": [{
    "parts": [
      { "text": "Mô tả hình ảnh này" },
      { 
        "inline_data": {
          "mime_type": "image/jpeg",
          "data": "base64_encoded_image_data"
        }
      }
    ]
  }]
}
```

---

## Cấu trúc API Response

### Response Structure

```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "Câu trả lời từ AI"
          }
        ],
        "role": "model"
      },
      "finishReason": "STOP",
      "index": 0,
      "safetyRatings": [...]
    }
  ],
  "promptFeedback": {...}
}
```

### Đọc Response trong Code

```javascript
// Extract response text
if (result.candidates && result.candidates[0] && result.candidates[0].content) {
  const content = result.candidates[0].content;
  if (content.parts && content.parts[0] && content.parts[0].text) {
    const responseText = content.parts[0].text;
    // Sử dụng responseText
  }
}
```

### Các trường quan trọng:

- `candidates[0].content.parts[0].text`: Nội dung phản hồi chính
- `candidates[0].finishReason`: Lý do kết thúc (`STOP`, `MAX_TOKENS`, `SAFETY`, etc.)
- `candidates[0].safetyRatings`: Đánh giá an toàn nội dung

---

## Sử dụng trong Code

### 1. Function `getGeminiModels()`

Lấy danh sách models từ environment variable:

```javascript
function getGeminiModels() {
  const envModels = process.env.GEMINI_MODELS;
  
  if (envModels && envModels.trim()) {
    return envModels.split(',').map(m => m.trim()).filter(m => m.length > 0);
  }
  
  // Default models list
  return [
    'gemma-3-27b-it',
    'gemini-3-flash',
    'gemini-2.5-flash',
    // ...
  ];
}
```

### 2. Gọi API với Fallback

```javascript
const models = getGeminiModels();
let lastError = null;
let successfulModel = null;
let response = null;

// Try each model in order
for (const model of models) {
  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;
    
    const requestData = JSON.stringify({
      contents: [{
        parts: [{ text: message }]
      }]
    });

    // Make API call
    const result = await makeHttpRequest(apiUrl, requestData);
    
    // Extract response
    if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
      response = result.candidates[0].content.parts[0].text;
      successfulModel = model;
      break; // Success, exit loop
    }
  } catch (error) {
    lastError = error;
    // Continue to next model
    continue;
  }
}
```

### 3. HTTP Request Implementation

```javascript
const https = require('https');

const result = await new Promise((resolve, reject) => {
  const url = new URL(apiUrl);
  const options = {
    hostname: url.hostname,
    port: 443,
    path: url.pathname + url.search,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestData)
    }
  };

  const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200) {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (parseError) {
          reject(new Error(`Failed to parse response: ${parseError.message}`));
        }
      } else {
        reject(new Error(`API returned status ${res.statusCode}: ${data}`));
      }
    });
  });

  req.on('error', (error) => {
    reject(error);
  });

  req.write(requestData);
  req.end();
});
```

---

## Models Available

### 1. Nhóm Gemini (Chat & Đa phương thức - Phổ biến nhất)

Dùng cho văn bản, hình ảnh, code.

- `gemini-3-flash` - Đời mới nhất
- `gemini-2.5-flash` - Bản ổn định
- `gemini-2.5-flash-lite` - Bản nhẹ/tiết kiệm

### 2. Nhóm Gemma 3 (Model mở)

**Lưu ý quan trọng:** Trong API, để chat được (hỏi-đáp), bạn thường phải thêm đuôi `-it` (Instruction Tuned). Nếu dùng tên gốc, nó chỉ là model hoàn thành câu (completion).

- `gemma-3-27b-it` (hoặc `gemma-3-27b`)
- `gemma-3-12b-it` (hoặc `gemma-3-12b`)
- `gemma-3-4b-it` (hoặc `gemma-3-4b`)
- `gemma-3-2b-it` (hoặc `gemma-3-2b`)
- `gemma-3-1b-it` (hoặc `gemma-3-1b`)

### 3. Nhóm Chuyên dụng (Âm thanh & Robotics)

Các model này thường có cách gọi API hoặc input/output đặc thù hơn:

- `gemini-2.5-flash-tts` - Chuyển văn bản thành giọng nói
- `gemini-2.5-flash-native-audio-dialog` - Hội thoại âm thanh thời gian thực
- `gemini-robotics-er-1.5-preview` - Dành cho Robotics/Nhận diện vật thể 3D

### Thứ tự ưu tiên mặc định

```env
GEMINI_MODELS=gemma-3-27b-it,gemma-3-12b-it,gemma-3-4b-it,gemma-3-2b-it,gemma-3-1b-it,gemini-3-flash,gemini-2.5-flash,gemini-2.5-flash-lite,gemini-2.5-flash-tts,gemini-2.5-flash-native-audio-dialog,gemini-robotics-er-1.5-preview
```

---

## Fallback Mechanism

Hệ thống tự động thử các models theo thứ tự nếu có lỗi:

1. **Thử model đầu tiên** trong danh sách
2. **Nếu lỗi**, tự động thử model tiếp theo
3. **Tiếp tục** cho đến khi tìm được model thành công
4. **Nếu tất cả đều lỗi**, trả về error message

### Ví dụ Flow:

```
User: "Giải thích định luật 3 Newton"

1. Thử gemma-3-27b-it → Lỗi (model không available)
2. Thử gemma-3-12b-it → Lỗi (quota exceeded)
3. Thử gemini-3-flash → Thành công ✅
4. Trả về response từ gemini-3-flash
```

### Logging

Mỗi lần thử model đều được log:

```javascript
applicationLogger.info(`Trying Gemini model: ${model}`, {
  type: 'test',
  operation: 'gemini_chat_try_model',
  model: model,
  message: message.substring(0, 50)
});
```

---

## Ví dụ

### Ví dụ 1: Test Chat đơn giản

```javascript
// POST /test/gemini-chat
{
  "message": "Giải thích định luật 3 Newton một cách dễ hiểu."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "Định luật 3 Newton (hay còn gọi là định luật tác dụng-phản tác dụng)...",
    "model": "gemini-3-flash",
    "modelsTried": ["gemma-3-27b-it", "gemini-3-flash"],
    "totalModels": 11
  }
}
```

### Ví dụ 2: Sử dụng trong Controller

```javascript
exports.testGeminiChat = async (req, res) => {
  const { message } = req.body;
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const models = getGeminiModels();

  for (const model of models) {
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;
      const requestData = JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      });

      const result = await makeHttpRequest(apiUrl, requestData);
      
      if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        return res.json({
          success: true,
          data: {
            response: result.candidates[0].content.parts[0].text,
            model: model
          }
        });
      }
    } catch (error) {
      // Try next model
      continue;
    }
  }

  return res.status(500).json({
    success: false,
    message: 'Tất cả models đều thất bại'
  });
};
```

### Ví dụ 3: Conversation với History

```javascript
const conversationHistory = [
  {
    role: "user",
    parts: [{ text: "Xin chào" }]
  },
  {
    role: "model",
    parts: [{ text: "Chào bạn! Tôi có thể giúp gì?" }]
  }
];

const requestData = JSON.stringify({
  contents: [
    ...conversationHistory,
    {
      role: "user",
      parts: [{ text: "Giải thích định luật 3 Newton" }]
    }
  ]
});
```

---

## Troubleshooting

### Lỗi 1: `GEMINI_API_KEY chưa được cấu hình`

**Nguyên nhân:** Chưa set environment variable `GEMINI_API_KEY`

**Giải pháp:**
1. Kiểm tra file `.env` có `GEMINI_API_KEY` chưa
2. Đảm bảo API key hợp lệ
3. Restart server sau khi thêm env variable

### Lỗi 2: `API returned status 400`

**Nguyên nhân:** Request body không đúng format

**Giải pháp:**
- Kiểm tra cấu trúc `contents` và `parts`
- Đảm bảo `text` field không rỗng
- Kiểm tra JSON format

### Lỗi 3: `API returned status 403`

**Nguyên nhân:** API key không hợp lệ hoặc không có quyền truy cập model

**Giải pháp:**
- Kiểm tra API key trong Google AI Studio
- Đảm bảo API key chưa bị revoke
- Kiểm tra quota/limits

### Lỗi 4: `API returned status 404`

**Nguyên nhân:** Model name không tồn tại hoặc không available

**Giải pháp:**
- Kiểm tra tên model có đúng không
- Xem danh sách models available trong [Google AI Studio](https://makersuite.google.com/app/apikey)
- Thử model khác trong danh sách

### Lỗi 5: `Tất cả models đều thất bại`

**Nguyên nhân:** 
- Tất cả models trong danh sách đều không available
- Network issues
- API key không hợp lệ

**Giải pháp:**
1. Kiểm tra network connection
2. Verify API key
3. Thử với model đơn giản hơn (ví dụ: `gemini-2.5-flash`)
4. Kiểm tra logs để xem lỗi cụ thể của từng model

### Lỗi 6: `No text found in response`

**Nguyên nhân:** Response structure không đúng hoặc model trả về empty response

**Giải pháp:**
- Kiểm tra response structure: `result.candidates[0].content.parts[0].text`
- Log full response để debug
- Thử với message khác

### Debug Tips

1. **Log full request/response:**
```javascript
console.log('Request:', requestData);
console.log('Response:', JSON.stringify(result, null, 2));
```

2. **Check model availability:**
```javascript
applicationLogger.info(`Trying model: ${model}`, { model, message });
```

3. **Test với curl:**
```bash
curl --location 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=YOUR_API_KEY' \
--header 'Content-Type: application/json' \
--data '{
  "contents": [{
    "parts":[{"text": "Hello"}]
  }]
}'
```

---

## Best Practices

1. **Luôn có fallback:** Sử dụng nhiều models để đảm bảo availability
2. **Logging:** Log mỗi lần thử model để debug
3. **Error handling:** Xử lý lỗi gracefully, không crash app
4. **Rate limiting:** Tránh gọi API quá nhiều lần
5. **API key security:** Không commit API key vào git
6. **Model selection:** Chọn model phù hợp với use case:
   - Chat thông thường: `gemini-2.5-flash`
   - Code generation: `gemini-3-flash`
   - Lightweight: `gemini-2.5-flash-lite`

---

## Tài liệu tham khảo

- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Gemini API Reference](https://ai.google.dev/api/rest)
- [Available Models](https://ai.google.dev/models/gemini)
- [Google AI Studio](https://makersuite.google.com/app/apikey)

---

## Test Page

Truy cập `/test/gemini-chat` để test Gemini API với giao diện web.

**Features:**
- Test các models với fallback tự động
- Hiển thị model thành công
- Xem số lượng models đã thử
- Real-time status updates

---

**Last Updated:** 2024
**Version:** 1.0

