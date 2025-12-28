const express = require('express');
const { authenticate } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { handleValidationErrorsAPI } = require('../middleware/validationHandler');
const aiController = require('../controllers/aiController');
const {
  chatValidation,
  recommendationsValidation,
  analyzeValidation,
  rateValidation
} = require('../validators/aiValidator');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @desc    AI Chatbot for learning assistance
 * @route   POST /api/ai/chat
 * @access  Private
 */
router.post('/chat', chatValidation, handleValidationErrorsAPI, asyncHandler(aiController.chat));

/**
 * @desc    Get personalized course recommendations
 * @route   POST /api/ai/recommendations
 * @access  Private
 */
router.post('/recommendations',
  recommendationsValidation,
  handleValidationErrorsAPI,
  asyncHandler(aiController.getRecommendations)
);

/**
 * @desc    Analyze learning progress and provide insights
 * @route   POST /api/ai/analyze
 * @access  Private
 */
router.post('/analyze',
  analyzeValidation,
  handleValidationErrorsAPI,
  asyncHandler(aiController.analyze)
);

/**
 * @desc    Get AI interaction history
 * @route   GET /api/ai/history
 * @access  Private
 */
router.get('/history', asyncHandler(aiController.getHistory));

/**
 * @desc    Rate AI response
 * @route   POST /api/ai/rate/:interactionId
 * @access  Private
 */
router.post('/rate/:interactionId',
  rateValidation,
  handleValidationErrorsAPI,
  asyncHandler(aiController.rate)
);

module.exports = router;
