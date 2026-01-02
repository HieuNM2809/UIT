const { body, param } = require('express-validator');

/**
 * Validation rules for sending a message
 */
exports.sendMessageValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Nội dung tin nhắn phải từ 1-2000 ký tự')
];

/**
 * Validation rules for userId parameter
 * Allows UUID or 'ai' for AI conversation
 */
exports.userIdValidation = [
  param('userId')
    .custom((value) => {
      // Allow UUID format or 'ai'
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(value) || value === 'ai') {
        return true;
      }
      throw new Error('User ID không hợp lệ');
    })
];

/**
 * Validation rules for conversationId parameter
 */
exports.conversationIdValidation = [
  param('conversationId')
    .isUUID()
    .withMessage('Conversation ID không hợp lệ')
];

