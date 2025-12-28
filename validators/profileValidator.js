const { body } = require('express-validator');

/**
 * Validation rules for updating profile
 */
exports.updateValidation = [
  body('first_name')
    .trim()
    .notEmpty()
    .withMessage('Họ là bắt buộc')
    .isLength({ min: 1, max: 50 })
    .withMessage('Họ phải từ 1-50 ký tự'),
  body('last_name')
    .trim()
    .notEmpty()
    .withMessage('Tên là bắt buộc')
    .isLength({ min: 1, max: 50 })
    .withMessage('Tên phải từ 1-50 ký tự'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[+]?[\d\s\-()]+$/)
    .withMessage('Số điện thoại không hợp lệ'),
  body('date_of_birth')
    .optional()
    .isISO8601()
    .withMessage('Ngày sinh không hợp lệ')
];

/**
 * Validation rules for changing password
 */
exports.changePasswordValidation = [
  body('current_password')
    .notEmpty()
    .withMessage('Mật khẩu hiện tại là bắt buộc'),
  body('new_password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu mới phải có ít nhất 6 ký tự'),
  body('confirm_password')
    .notEmpty()
    .withMessage('Xác nhận mật khẩu là bắt buộc')
    .custom((value, { req }) => {
      if (value !== req.body.new_password) {
        throw new Error('Xác nhận mật khẩu không khớp');
      }
      return true;
    })
];

/**
 * Validation rules for deleting account
 */
exports.deleteAccountValidation = [
  body('confirm_delete')
    .equals('DELETE')
    .withMessage('Vui lòng nhập "DELETE" để xác nhận xóa tài khoản'),
  body('password')
    .notEmpty()
    .withMessage('Mật khẩu là bắt buộc để xác nhận xóa tài khoản')
];

