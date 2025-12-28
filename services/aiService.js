const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { User, Enrollment, Course, Progress, Content } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { applicationLogger } = require('../config/logger');

// Initialize AI clients
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

/**
 * Get user context for AI interactions
 */
exports.getUserContext = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Enrollment,
          as: 'enrollments',
          include: [
            {
              model: Course,
              as: 'course',
              attributes: ['id', 'title', 'level']
            }
          ],
          limit: 5
        },
        {
          model: Progress,
          as: 'progress',
          include: [
            {
              model: Content,
              as: 'content',
              attributes: ['id', 'title', 'content_type']
            }
          ],
          order: [['updated_at', 'DESC']],
          limit: 10
        }
      ]
    });

    return {
      user_profile: {
        name: user.full_name,
        role: user.role,
        learning_preferences: user.preferences
      },
      current_courses: user.enrollments?.map(e => ({
        id: e.course.id,
        title: e.course.title,
        level: e.course.level,
        progress: e.progress_percentage
      })) || [],
      recent_activity: user.progress?.map(p => ({
        content: p.content.title,
        type: p.content.content_type,
        status: p.status,
        progress: p.progress_percentage
      })) || []
    };
  } catch (error) {
    applicationLogger.error('Error getting user context for AI', error);
    return null;
  }
};

/**
 * Call OpenAI API
 */
exports.callOpenAI = async (messages, maxTokens = 500) => {
  if (!openai) {
    throw new AppError('OpenAI not configured', 500, 'AI_SERVICE_UNAVAILABLE');
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    return {
      response: completion.choices[0].message.content,
      tokens_used: completion.usage.total_tokens,
      model: "gpt-3.5-turbo"
    };
  } catch (error) {
    applicationLogger.error('OpenAI API error', error);
    throw new AppError('AI service temporarily unavailable', 503, 'AI_SERVICE_ERROR');
  }
};

/**
 * Call Gemini API
 */
exports.callGemini = async (prompt, maxTokens = 500) => {
  if (!genAI) {
    throw new AppError('Gemini not configured', 500, 'AI_SERVICE_UNAVAILABLE');
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;

    return {
      response: response.text(),
      tokens_used: null, // Gemini doesn't provide token count
      model: "gemini-pro"
    };
  } catch (error) {
    applicationLogger.error('Gemini API error', error);
    throw new AppError('AI service temporarily unavailable', 503, 'AI_SERVICE_ERROR');
  }
};

/**
 * Get available AI service
 */
exports.getAvailableAIService = () => {
  if (openai) return 'openai';
  if (genAI) return 'gemini';
  return null;
};

