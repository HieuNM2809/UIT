const { AIInteraction, Course, Progress, Content } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { applicationLogger } = require('../config/logger');
const { cacheUtils } = require('../config/redis');
const aiService = require('../services/aiService');
const geminiService = require('../services/geminiService');

/**
 * AI Chatbot for learning assistance
 */
exports.chat = async (req, res) => {
  const { message, context, session_id } = req.body;
  const startTime = Date.now();

  // Get user context
  const userContext = await aiService.getUserContext(req.user.id);

  // Build system message with context
  const systemMessage = `You are StudyMate AI, a helpful learning assistant for Vietnamese students. 
You help with studying, course recommendations, and learning guidance.

User Profile:
- Name: ${userContext?.user_profile?.name || 'Student'}
- Role: ${userContext?.user_profile?.role || 'student'}
- Current courses: ${userContext?.current_courses?.map(c => c.title).join(', ') || 'None'}

Please respond in Vietnamese and be encouraging and supportive. Keep responses concise and practical.`;

  const messages = [
    { role: "system", content: systemMessage },
    { role: "user", content: message }
  ];

  // Try OpenAI first, fallback to Gemini
  let aiResponse;
  try {
    const availableService = aiService.getAvailableAIService();
    if (availableService === 'openai') {
      aiResponse = await aiService.callOpenAI(messages);
    } else if (availableService === 'gemini') {
      const prompt = `${systemMessage}\n\nUser: ${message}\nAssistant:`;
      aiResponse = await aiService.callGemini(prompt);
    } else {
      throw new AppError('No AI service available', 503, 'AI_SERVICE_UNAVAILABLE');
    }
  } catch (error) {
    // Fallback to basic response
    aiResponse = {
      response: "Xin lỗi, tôi hiện tại không thể xử lý yêu cầu của bạn. Vui lòng thử lại sau.",
      tokens_used: 0,
      model: "fallback"
    };
  }

  const responseTime = Date.now() - startTime;

  // Save interaction to database
  await AIInteraction.create({
    user_id: req.user.id,
    interaction_type: 'chat',
    user_input: message,
    ai_response: aiResponse.response,
    model_used: aiResponse.model,
    tokens_used: aiResponse.tokens_used || 0,
    response_time: responseTime,
    context_data: {
      user_context: userContext,
      additional_context: context
    },
    session_id: session_id || `chat_${Date.now()}`
  });

  applicationLogger.ai(`Chat interaction by ${req.user.email}: ${message.substring(0, 50)}...`);

  res.json({
    success: true,
    data: {
      response: aiResponse.response,
      session_id: session_id || `chat_${Date.now()}`,
      response_time: responseTime,
      model_used: aiResponse.model
    }
  });
};

/**
 * Get personalized course recommendations
 */
exports.getRecommendations = async (req, res) => {
  const { preferences, limit = 10 } = req.body;

  // Check cache first
  const cacheKey = `recommendations_${req.user.id}_${JSON.stringify(preferences)}`;
  const cachedRecommendations = await cacheUtils.get(cacheKey);
  
  if (cachedRecommendations) {
    return res.json({
      success: true,
      data: {
        recommendations: cachedRecommendations,
        cached: true
      }
    });
  }

  // Get user context and available courses
  const userContext = await aiService.getUserContext(req.user.id);
  
  const availableCourses = await Course.findAll({
    where: { 
      status: 'published'
    },
    include: [
      {
        model: require('../models').User,
        as: 'instructor',
        attributes: ['first_name', 'last_name']
      }
    ],
    limit: 50,
    order: [['average_rating', 'DESC'], ['enrolled_count', 'DESC']]
  });

  // Simple recommendation algorithm (can be enhanced with ML)
  let recommendations = [];

  // Filter out already enrolled courses
  const enrolledCourseIds = userContext?.current_courses?.map(c => c.id) || [];
  const candidateCourses = availableCourses.filter(
    course => !enrolledCourseIds.includes(course.id)
  );

  // Basic scoring based on user preferences and profile
  candidateCourses.forEach(course => {
    let score = 0;
    
    // Base score from ratings and popularity
    score += (course.average_rating || 0) * 2;
    score += Math.min(course.enrolled_count / 100, 5); // Popularity bonus
    
    // Level matching
    if (userContext?.user_profile?.role === 'student') {
      if (course.level === 'beginner' || course.level === 'intermediate') {
        score += 3;
      }
    }
    
    // Free courses bonus for students
    if (course.price === 0) {
      score += 2;
    }
    
    // Featured courses bonus
    if (course.enrolled_count > 50) {
      score += 1;
    }

    recommendations.push({
      course,
      score,
      reason: `Được đề xuất dựa trên mức độ phù hợp (${score.toFixed(1)}/10)`
    });
  });

  // Sort by score and limit results
  recommendations.sort((a, b) => b.score - a.score);
  recommendations = recommendations.slice(0, limit);

  // Use AI to enhance recommendations if available
  const availableService = aiService.getAvailableAIService();
  if (availableService) {
    try {
      const courseList = recommendations.map(r => 
        `- ${r.course.title} (Level: ${r.course.level}, Rating: ${r.course.average_rating || 'N/A'})`
      ).join('\n');

      const prompt = `Based on this user profile and course list, provide brief Vietnamese explanations for why each course is recommended:

User: ${userContext?.user_profile?.name} (${userContext?.user_profile?.role})
Current courses: ${userContext?.current_courses?.map(c => c.title).join(', ') || 'None'}

Available courses:
${courseList}

Provide a brief reason for each course recommendation in Vietnamese.`;

      let aiResponse;
      if (availableService === 'openai') {
        aiResponse = await aiService.callOpenAI([{ role: "user", content: prompt }], 300);
      } else {
        aiResponse = await aiService.callGemini(prompt, 300);
      }

      // Parse AI response and enhance recommendations (simplified)
      const lines = aiResponse.response.split('\n').filter(line => line.trim());
      lines.forEach((line, index) => {
        if (recommendations[index] && line.includes('-')) {
          recommendations[index].ai_reason = line.replace(/^-\s*/, '').trim();
        }
      });

      // Save AI interaction
      await AIInteraction.create({
        user_id: req.user.id,
        interaction_type: 'recommendation',
        user_input: JSON.stringify({ preferences, user_context: userContext }),
        ai_response: aiResponse.response,
        model_used: aiResponse.model,
        tokens_used: aiResponse.tokens_used || 0,
        response_time: 0
      });

    } catch (error) {
      applicationLogger.error('Error enhancing recommendations with AI', error);
    }
  }

  // Cache recommendations for 1 hour
  await cacheUtils.set(cacheKey, recommendations, 3600);

  applicationLogger.ai(`Recommendations generated for ${req.user.email}`);

  res.json({
    success: true,
    data: {
      recommendations,
      cached: false,
      total: recommendations.length
    }
  });
};

/**
 * Analyze learning progress and provide insights
 */
exports.analyze = async (req, res) => {
  const { analysis_type, course_id } = req.body;

  // Get comprehensive user data
  const userContext = await aiService.getUserContext(req.user.id);

  let analysisData = {};

  if (course_id) {
    // Course-specific analysis
    const courseProgress = await Progress.findAll({
      where: { 
        user_id: req.user.id, 
        course_id: course_id 
      },
      include: [
        {
          model: Content,
          as: 'content',
          attributes: ['title', 'content_type', 'difficulty_level']
        }
      ]
    });

    analysisData.course_progress = courseProgress;
  } else {
    // Overall analysis
    analysisData.overall_stats = {
      total_courses: userContext?.current_courses?.length || 0,
      completed_contents: userContext?.recent_activity?.filter(a => a.status === 'completed').length || 0,
      avg_progress: userContext?.current_courses?.reduce((sum, c) => sum + c.progress, 0) / Math.max(userContext?.current_courses?.length, 1) || 0
    };
  }

  // Generate AI analysis
  let aiAnalysis = null;
  const availableService = aiService.getAvailableAIService();
  if (availableService) {
    try {
      const prompt = `Analyze this Vietnamese student's learning data and provide insights in Vietnamese:

Student: ${userContext?.user_profile?.name}
Analysis type: ${analysis_type}

Learning data: ${JSON.stringify(analysisData, null, 2)}

Provide specific insights about:
1. Strengths and areas for improvement
2. Learning patterns
3. Actionable recommendations
4. Study tips

Keep response practical and encouraging in Vietnamese.`;

      let aiResponse;
      if (availableService === 'openai') {
        aiResponse = await aiService.callOpenAI([{ role: "user", content: prompt }], 400);
      } else {
        aiResponse = await aiService.callGemini(prompt, 400);
      }

      aiAnalysis = aiResponse.response;

      // Save interaction
      await AIInteraction.create({
        user_id: req.user.id,
        interaction_type: 'analysis',
        user_input: JSON.stringify({ analysis_type, course_id }),
        ai_response: aiResponse.response,
        model_used: aiResponse.model,
        tokens_used: aiResponse.tokens_used || 0,
        response_time: 0,
        context_data: analysisData
      });

    } catch (error) {
      applicationLogger.error('Error generating AI analysis', error);
      aiAnalysis = "Không thể tạo phân tích AI lúc này. Vui lòng thử lại sau.";
    }
  }

  applicationLogger.ai(`Learning analysis generated for ${req.user.email}: ${analysis_type}`);

  res.json({
    success: true,
    data: {
      analysis_type,
      raw_data: analysisData,
      ai_insights: aiAnalysis,
      generated_at: new Date()
    }
  });
};

/**
 * Get AI interaction history
 */
exports.getHistory = async (req, res) => {
  const { type, limit = 20, page = 1 } = req.query;
  const offset = (page - 1) * limit;

  const whereClause = { user_id: req.user.id };
  if (type) whereClause.interaction_type = type;

  const { count, rows: interactions } = await AIInteraction.findAndCountAll({
    where: whereClause,
    order: [['created_at', 'DESC']],
    limit: parseInt(limit),
    offset: parseInt(offset),
    attributes: { exclude: ['context_data'] } // Exclude large context data
  });

  res.json({
    success: true,
    data: {
      interactions,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(count / limit),
        total_items: count,
        items_per_page: parseInt(limit)
      }
    }
  });
};

/**
 * Rate AI response
 */
exports.rate = async (req, res) => {
  const { rating, feedback } = req.body;

  const interaction = await AIInteraction.findOne({
    where: { 
      id: req.params.interactionId, 
      user_id: req.user.id 
    }
  });

  if (!interaction) {
    throw new AppError('AI interaction not found', 404, 'INTERACTION_NOT_FOUND');
  }

  interaction.rating = rating;
  if (feedback) {
    interaction.context_data = {
      ...interaction.context_data,
      user_feedback: feedback
    };
  }
  
  await interaction.save();

  applicationLogger.ai(`AI response rated: ${rating}/5 by ${req.user.email}`);

  res.json({
    success: true,
    message: 'Rating saved successfully'
  });
};

/**
 * Generate learning roadmap based on personalization
 */
exports.generateRoadmap = async (req, res) => {
  try {
    const {
      learningStyle,      // 'videos', 'exercises', 'reading'
      learningTime,       // 'morning', 'night'
      skillLevel,        // 'beginner', 'intermediate', 'advanced'
      courseDuration,    // '2-3', '4-6', '8+', or custom number
      topics             // Array of topic strings
    } = req.body;

    if (!topics || !Array.isArray(topics) || topics.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp ít nhất một chủ đề quan tâm'
      });
    }

    // Get user context
    const userContext = await aiService.getUserContext(req.user.id);

    // Build prompt for Gemini
    const topicsText = topics.join(', ');
    const durationText = courseDuration === '2-3' ? '2-3 tuần (Ngắn)' :
                        courseDuration === '4-6' ? '4-6 tuần (Trung bình)' :
                        courseDuration === '8+' ? '8+ tuần (Dài)' :
                        `${courseDuration} tuần`;

    const learningStyleText = learningStyle === 'videos' ? 'Video' :
                             learningStyle === 'exercises' ? 'Bài tập thực hành' :
                             learningStyle === 'reading' ? 'Đọc tài liệu' : 'Hỗn hợp';

    const learningTimeText = learningTime === 'morning' ? 'Buổi sáng' : 'Buổi tối';
    const skillLevelText = skillLevel === 'beginner' ? 'Người mới bắt đầu' :
                          skillLevel === 'intermediate' ? 'Trung cấp' :
                          skillLevel === 'advanced' ? 'Nâng cao' : 'Tất cả';

    const prompt = `Bạn là AI Roadmap chuyên tạo lộ trình học tập cho sinh viên Việt Nam.

Thông tin người học:
- Phong cách học: ${learningStyleText}
- Thời gian học tốt nhất: ${learningTimeText}
- Mức độ kỹ năng hiện tại: ${skillLevelText}
- Thời lượng khóa học mong muốn: ${durationText}
- Chủ đề quan tâm: ${topicsText}

${userContext?.user_profile ? `- Tên: ${userContext.user_profile.name}` : ''}
${userContext?.current_courses?.length > 0 ? `- Khóa học hiện tại: ${userContext.current_courses.map(c => c.title).join(', ')}` : ''}

Hãy tạo một lộ trình học tập chi tiết bằng tiếng Việt với các yêu cầu sau:

1. **Tổng quan lộ trình**: Mô tả ngắn gọn về lộ trình và mục tiêu học tập
2. **Cấu trúc khóa học**: Chia thành các tuần/mô-đun với:
   - Tên mô-đun
   - Mục tiêu học tập của mô-đun
   - Nội dung chi tiết (bài học, bài tập, dự án)
   - Thời gian ước tính cho mỗi mô-đun
3. **Tài nguyên học tập**: Gợi ý tài liệu, video, bài tập phù hợp với phong cách học ${learningStyleText}
4. **Dự án thực hành**: Các dự án để áp dụng kiến thức
5. **Đánh giá tiến độ**: Cách kiểm tra và đánh giá sự tiến bộ
6. **Lời khuyên học tập**: Mẹo học tập phù hợp với thời gian học ${learningTimeText}

Lộ trình phải:
- Phù hợp với mức độ ${skillLevelText}
- Có thể hoàn thành trong ${durationText}
- Tập trung vào các chủ đề: ${topicsText}
- Thực tế và có thể áp dụng ngay
- Được viết bằng tiếng Việt, dễ hiểu

Hãy format output dưới dạng markdown với các heading rõ ràng.`;

    applicationLogger.info('Generating roadmap with Gemini - Request', {
      type: 'ai',
      operation: 'generate_roadmap_request',
      userId: req.user.id,
      topics: topics.length,
      learningStyle,
      learningTime,
      skillLevel,
      courseDuration,
      topicsList: topics,
      promptLength: prompt.length,
      prompt: prompt.length > 1000 ? prompt.substring(0, 1000) + '...' : prompt
    });

    // Call Gemini with fallback
    const startTime = Date.now();
    let result = null;
    let responseTime = 0;
    
    try {
      result = await geminiService.callGeminiWithFallback(prompt);
      responseTime = Date.now() - startTime;
    } catch (geminiError) {
      responseTime = Date.now() - startTime;
      applicationLogger.error('Gemini API call failed in generateRoadmap', geminiError, {
        type: 'ai',
        operation: 'generate_roadmap_gemini_error',
        userId: req.user.id,
        responseTime: responseTime
      });
      throw geminiError; // Re-throw to be caught by outer catch
    }

    // Log response (always log, even if result is null/undefined)
    applicationLogger.info('Generating roadmap with Gemini - Response', {
      type: 'ai',
      operation: 'generate_roadmap_response',
      userId: req.user.id,
      model: result?.model || 'unknown',
      modelsTried: result?.modelsTried || [],
      responseLength: result?.response?.length || 0,
      responseTime: responseTime,
      response: result?.response 
        ? (result.response.length > 1000 ? result.response.substring(0, 1000) + '...' : result.response)
        : 'No response'
    });

    // Save interaction
    await AIInteraction.create({
      user_id: req.user.id,
      interaction_type: 'roadmap',
      user_input: JSON.stringify({
        learningStyle,
        learningTime,
        skillLevel,
        courseDuration,
        topics
      }),
      ai_response: result.response,
      model_used: result.model,
      tokens_used: 0,
      response_time: responseTime,
      context_data: {
        user_context: userContext,
        models_tried: result.modelsTried,
        prompt_length: prompt.length,
        response_length: result.response?.length || 0
      }
    });

    applicationLogger.ai(`Roadmap generated for ${req.user.email} using ${result.model}`);

    res.json({
      success: true,
      data: {
        roadmap: result.response,
        model: result.model,
        topics,
        personalization: {
          learningStyle,
          learningTime,
          skillLevel,
          courseDuration
        },
        generated_at: new Date()
      }
    });

  } catch (error) {
    applicationLogger.error('Error generating roadmap', error, {
      type: 'ai',
      operation: 'generate_roadmap',
      userId: req.user?.id
    });

    res.status(1000).json({
      success: false,
      message: 'Lỗi khi tạo lộ trình học tập. Vui lòng thử lại sau.'
    });
  }
};

/**
 * Roadmap page
 */
exports.roadmapPage = async (req, res) => {
  try {
    res.locals.currentPath = '/roadmap';
    res.render('pages/ai/roadmap', {
      title: 'Tạo lộ trình học tập',
      pageHeader: 'AI Roadmap - Knowledge Systematization',
      pageDescription: 'Tự động hóa hành trình học tập của bạn',
      user: req.session.user
    });
  } catch (error) {
    applicationLogger.error('Roadmap page error', error, {
      type: 'controller',
      operation: 'roadmapPage',
      userId: req.session.user?.id
    });
    req.flash('error', 'Lỗi khi tải trang tạo lộ trình');
    res.redirect('/dashboard');
  }
};

/**
 * Roadmap history page
 */
exports.roadmapHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const roadmaps = await AIInteraction.findAndCountAll({
      where: {
        user_id: req.user?.id || req.session.user?.id,
        interaction_type: 'roadmap'
      },
      order: [['created_at', 'DESC']],
      limit: limit,
      offset: offset
    });

    // Parse user_input to get topics and personalization data
    const roadmapsWithData = roadmaps.rows.map(roadmap => {
      let userInput = {};
      try {
        userInput = JSON.parse(roadmap.user_input);
      } catch (e) {
        // If parsing fails, use empty object
      }

      return {
        id: roadmap.id,
        topics: userInput.topics || [],
        learningStyle: userInput.learningStyle,
        skillLevel: userInput.skillLevel,
        courseDuration: userInput.courseDuration,
        modelUsed: roadmap.model_used,
        responseTime: roadmap.response_time,
        createdAt: roadmap.created_at,
        responsePreview: roadmap.ai_response 
          ? (roadmap.ai_response.length > 200 
              ? roadmap.ai_response.substring(0, 200) + '...' 
              : roadmap.ai_response)
          : ''
      };
    });

    res.locals.currentPath = '/roadmap/history';
    res.render('pages/ai/roadmap-history', {
      title: 'Lịch sử Roadmap',
      user: req.user || req.session.user,
      roadmaps: roadmapsWithData,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(roadmaps.count / limit),
        totalItems: roadmaps.count,
        hasNext: page < Math.ceil(roadmaps.count / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    applicationLogger.error('Error fetching roadmap history', error, {
      type: 'ai',
      operation: 'roadmap_history',
      userId: req.user?.id
    });

    req.flash('error', 'Có lỗi xảy ra khi tải lịch sử roadmap');
    res.redirect('/roadmap');
  }
};

/**
 * Roadmap detail page
 */
exports.roadmapDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const roadmap = await AIInteraction.findOne({
      where: {
        id: id,
        user_id: req.user?.id || req.session.user?.id,
        interaction_type: 'roadmap'
      }
    });

    if (!roadmap) {
      req.flash('error', 'Roadmap không tồn tại hoặc bạn không có quyền truy cập');
      return res.redirect('/roadmap/history');
    }

    // Parse user_input
    let userInput = {};
    try {
      userInput = JSON.parse(roadmap.user_input);
    } catch (e) {
      // If parsing fails, use empty object
    }

    // Parse context_data if available
    let contextData = {};
    if (roadmap.context_data) {
      contextData = roadmap.context_data;
    }

    res.locals.currentPath = '/roadmap';
    res.render('pages/ai/roadmap-detail', {
      title: 'Chi tiết Roadmap',
      user: req.user || req.session.user,
      roadmap: {
        id: roadmap.id,
        topics: userInput.topics || [],
        learningStyle: userInput.learningStyle,
        learningTime: userInput.learningTime,
        skillLevel: userInput.skillLevel,
        courseDuration: userInput.courseDuration,
        response: roadmap.ai_response,
        modelUsed: roadmap.model_used,
        modelsTried: contextData.models_tried || [],
        responseTime: roadmap.response_time,
        promptLength: contextData.prompt_length || 0,
        responseLength: contextData.response_length || roadmap.ai_response?.length || 0,
        createdAt: roadmap.created_at,
        updatedAt: roadmap.updated_at
      }
    });
  } catch (error) {
    applicationLogger.error('Error fetching roadmap detail', error, {
      type: 'ai',
      operation: 'roadmap_detail',
      userId: req.user?.id,
      roadmapId: req.params.id
    });

    req.flash('error', 'Có lỗi xảy ra khi tải chi tiết roadmap');
    res.redirect('/roadmap/history');
  }
};

