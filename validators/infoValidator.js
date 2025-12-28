const { body } = require('express-validator');

/**
 * Validation rules for contact form submission
 */
exports.contactValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Tên là bắt buộc')
    .isLength({ min: 2, max: 100 })
    .withMessage('Tên phải từ 2-100 ký tự'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email là bắt buộc')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  body('subject')
    .notEmpty()
    .withMessage('Chủ đề là bắt buộc')
    .isIn(['general_inquiry', 'bug_report', 'technical_support', 'feature_request', 'other'])
    .withMessage('Chủ đề không hợp lệ'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Nội dung tin nhắn là bắt buộc')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Nội dung tin nhắn phải từ 10-5000 ký tự')
];

