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
 */
exports.userIdValidation = [
  param('userId')
    .isUUID()
    .withMessage('User ID không hợp lệ')
];

/**
 * Validation rules for conversationId parameter
 */
exports.conversationIdValidation = [
  param('conversationId')
    .isUUID()
    .withMessage('Conversation ID không hợp lệ')
];

