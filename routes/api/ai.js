const express = require('express');
const { body, validationResult } = require('express-validator');
const OpenAI = require('openai');

const router = express.Router();

// Initialize OpenAI (if API key is available)
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

/**
 * @desc    AI Chatbot endpoint
 * @route   POST /api/ai/chat
 * @access  Private (authenticated users)
 */
router.post('/chat',
  [
    body('message')
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage('Tin nhắn phải từ 1-1000 ký tự')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: errors.array()
        });
      }

      const { message } = req.body;

      // If OpenAI is not configured, return a simple response
      if (!openai) {
        return res.json({
          success: true,
          data: {
            response: `Xin chào! Tôi là StudyMate AI. Hiện tại tôi đang ở chế độ demo và chưa thể xử lý câu hỏi phức tạp. 

Câu hỏi của bạn: "${message}"

Tôi có thể giúp bạn:
• Giải đáp thắc mắc về khóa học
• Đề xuất lộ trình học tập  
• Hỗ trợ làm bài tập
• Thống kê tiến độ học tập

Để sử dụng đầy đủ tính năng AI, vui lòng cấu hình API key cho OpenAI hoặc Gemini.`,
            model_used: 'demo',
            response_time: 100
          }
        });
      }

      // Get user context
      const userInfo = req.user ? {
        name: req.user.full_name || 'Bạn',
        role: req.user.role || 'student'
      } : { name: 'Bạn', role: 'student' };

      // System message for StudyMate AI
      const systemMessage = `Bạn là StudyMate AI, trợ lý học tập thông minh cho sinh viên Trường Đại học Công nghệ Thông tin, ĐHQG-HCM.

Thông tin người dùng:
- Tên: ${userInfo.name}
- Vai trò: ${userInfo.role}

Nhiệm vụ của bạn:
1. Hỗ trợ học tập và giải đáp thắc mắc
2. Đưa ra lời khuyên học tập cá nhân hóa  
3. Giúp làm bài tập và ôn thi
4. Đề xuất khóa học phù hợp
5. Động viên và khuyến khích học tập

Nguyên tắc:
- Trả lời bằng tiếng Việt
- Thân thiện, lịch sự và khuyến khích
- Cung cấp thông tin chính xác và hữu ích
- Nếu không biết, hãy thừa nhận và gợi ý cách tìm hiểu
- Tập trung vào giáo dục và học tập`;

      const startTime = Date.now();

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const responseTime = Date.now() - startTime;
      const aiResponse = completion.choices[0].message.content;

      // TODO: Save interaction to database
      console.log(`AI Chat - User: ${userInfo.name}, Message: ${message.substring(0, 50)}...`);

      res.json({
        success: true,
        data: {
          response: aiResponse,
          model_used: 'gpt-3.5-turbo',
          response_time: responseTime,
          tokens_used: completion.usage?.total_tokens || 0
        }
      });

    } catch (error) {
      console.error('AI Chat error:', error);

      // Return fallback response on error
      res.json({
        success: true,
        data: {
          response: `Xin lỗi, hiện tại tôi gặp một chút khó khăn trong việc xử lý yêu cầu. Đây là một số gợi ý về câu hỏi "${req.body.message}":

🎯 Nếu bạn cần hỗ trợ học tập:
- Hãy thử tìm kiếm trong khóa học có sẵn
- Tham gia thảo luận với các bạn cùng lớp  
- Liên hệ giảng viên để được hỗ trợ trực tiếp

📚 Nếu cần tài liệu học tập:
- Kiểm tra thư viện tài liệu trong khóa học
- Tìm kiếm trên internet với từ khóa phù hợp
- Hỏi bạn bè hoặc nhóm học tập

Vui lòng thử lại sau hoặc liên hệ hỗ trợ kỹ thuật nếu vấn đề vẫn tiếp tục.`,
          model_used: 'fallback',
          response_time: 0
        }
      });
    }
  }
);

/**
 * @desc    Get AI recommendations
 * @route   POST /api/ai/recommendations  
 * @access  Private
 */
router.post('/recommendations', async (req, res) => {
  try {
    // Simple mock recommendations for now
    const recommendations = [
      {
        id: 1,
        title: "Lập trình Web cơ bản",
        description: "Khóa học dành cho người mới bắt đầu",
        level: "beginner",
        duration: 120,
        rating: 4.5
      },
      {
        id: 2,
        title: "Cơ sở dữ liệu",  
        description: "Học về SQL và thiết kế database",
        level: "intermediate",
        duration: 90,
        rating: 4.7
      },
      {
        id: 3,
        title: "Trí tuệ nhân tạo",
        description: "Khám phá thế giới AI và Machine Learning",
        level: "advanced", 
        duration: 150,
        rating: 4.8
      }
    ];

    res.json({
      success: true,
      data: {
        recommendations,
        reason: `Được đề xuất dựa trên hồ sơ học tập và sở thích của ${req.user?.full_name || 'bạn'}`
      }
    });

  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo đề xuất'
    });
  }
});

/**
 * @desc    AI study analysis
 * @route   POST /api/ai/analyze
 * @access  Private
 */
router.post('/analyze', async (req, res) => {
  try {
    const { analysis_type } = req.body;

    // Mock analysis data
    const analysisResult = {
      progress: {
        overall_score: 78,
        strengths: ["Hoàn thành bài tập đúng hạn", "Tích cực tham gia thảo luận"],
        improvements: ["Cần cải thiện kỹ năng debug", "Tăng thời gian ôn tập lý thuyết"],
        recommendations: [
          "Dành 30 phút mỗi ngày để practice coding",
          "Tham gia thêm group study sessions",
          "Xem lại các video bài giảng đã bỏ lỡ"
        ]
      },
      performance: {
        quiz_average: 85,
        assignment_average: 76,
        participation: 92,
        trend: "improving"
      }
    };

    res.json({
      success: true,
      data: {
        analysis_type,
        results: analysisResult,
        ai_insights: `Dựa trên phân tích dữ liệu học tập, bạn đang có tiến bộ tốt với điểm trung bình ${analysisResult.performance.quiz_average}%. 

✅ Điểm mạnh: ${analysisResult.progress.strengths.join(', ')}

⚠️ Cần cải thiện: ${analysisResult.progress.improvements.join(', ')}

🎯 Khuyến nghị: ${analysisResult.progress.recommendations.join('. ')}`
      }
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi phân tích dữ liệu học tập'
    });
  }
});

module.exports = router;

