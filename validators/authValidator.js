const { body } = require('express-validator');

/**
 * Validation rules for login
 */
exports.loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email không hợp lệ'),
  body('password')
    .notEmpty()
    .withMessage('Mật khẩu là bắt buộc')
];

/**
 * Validation rules for registration
 */
exports.registerValidation = [
  body('first_name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Họ phải từ 1-50 ký tự'),
  body('last_name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Tên phải từ 1-50 ký tự'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email không hợp lệ'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('confirm_password')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Xác nhận mật khẩu không khớp');
      }
      return true;
    }),
  body('student_id')
    .optional()
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('MSSV không hợp lệ')
];

