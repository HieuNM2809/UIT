const { body, param } = require('express-validator');

/**
 * Validation rules for forgot password
 */
exports.forgotPasswordValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email không được để trống')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail()
];

/**
 * Validation rules for reset password
 */
exports.resetPasswordValidation = [
  param('token')
    .trim()
    .notEmpty()
    .withMessage('Token không hợp lệ')
    .isLength({ min: 64, max: 64 })
    .withMessage('Token không hợp lệ'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Mật khẩu không được để trống')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('password_confirm')
    .trim()
    .notEmpty()
    .withMessage('Xác nhận mật khẩu không được để trống')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Mật khẩu xác nhận không khớp');
      }
      return true;
    })
];
