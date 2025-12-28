const { body } = require('express-validator');

/**
 * Validation rules for AI chat
 */
exports.chatValidation = [
  body('message')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
  body('context')
    .optional()
    .isObject()
    .withMessage('Context must be an object'),
  body('session_id')
    .optional()
    .isString()
    .withMessage('Session ID must be a string')
];

/**
 * Validation rules for recommendations
 */
exports.recommendationsValidation = [
  body('preferences')
    .optional()
    .isObject()
    .withMessage('Preferences must be an object'),
  body('limit')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Limit must be between 1 and 20')
];

/**
 * Validation rules for analysis
 */
exports.analyzeValidation = [
  body('analysis_type')
    .isIn(['progress', 'performance', 'recommendations', 'study_plan'])
    .withMessage('Invalid analysis type'),
  body('course_id')
    .optional()
    .isUUID()
    .withMessage('Invalid course ID')
];

/**
 * Validation rules for rating
 */
exports.rateValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('feedback')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Feedback must be less than 500 characters')
];

