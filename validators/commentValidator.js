const { body, param, query } = require('express-validator');

/**
 * Validation rules for creating a comment
 */
exports.createCommentValidation = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Nội dung bình luận không được để trống')
    .isLength({ min: 1, max: 5000 })
    .withMessage('Nội dung bình luận phải từ 1 đến 5000 ký tự'),
  body('course_id')
    .optional()
    .isUUID()
    .withMessage('ID khóa học phải là UUID hợp lệ'),
  body('parent_id')
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true;
      }
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(value)) {
        throw new Error('ID bình luận cha phải là UUID hợp lệ');
      }
      return true;
    })
];

/**
 * Validation rules for updating a comment
 */
exports.updateCommentValidation = [
  param('id')
    .isUUID()
    .withMessage('ID bình luận phải là UUID hợp lệ'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Nội dung bình luận không được để trống')
    .isLength({ min: 1, max: 5000 })
    .withMessage('Nội dung bình luận phải từ 1 đến 5000 ký tự')
];

/**
 * Validation rules for comment ID parameter
 */
exports.commentIdValidation = [
  param('id')
    .isUUID()
    .withMessage('ID bình luận phải là UUID hợp lệ')
];

/**
 * Validation rules for course slug parameter
 */
exports.courseSlugValidation = [
  param('slug')
    .trim()
    .notEmpty()
    .withMessage('Slug khóa học không được để trống')
    .isLength({ min: 1, max: 255 })
    .withMessage('Slug khóa học không hợp lệ')
];

/**
 * Validation rules for listing comments
 */
exports.listCommentsValidation = [
  param('slug')
    .trim()
    .notEmpty()
    .withMessage('Slug khóa học không được để trống'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Trang phải là số nguyên dương'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Số lượng bình luận mỗi trang phải từ 1 đến 50'),
  query('sort')
    .optional()
    .isIn(['newest', 'oldest', 'most_liked'])
    .withMessage('Cách sắp xếp không hợp lệ')
];

/**
 * Validation rules for reporting a comment
 */
exports.reportCommentValidation = [
  param('id')
    .isUUID()
    .withMessage('ID bình luận phải là UUID hợp lệ'),
  body('reason')
    .trim()
    .notEmpty()
    .withMessage('Lý do báo cáo không được để trống')
    .isLength({ min: 5, max: 500 })
    .withMessage('Lý do báo cáo phải từ 5 đến 500 ký tự')
];

/**
 * Validation rules for liking/unliking a comment
 */
exports.likeCommentValidation = [
  param('id')
    .isUUID()
    .withMessage('ID bình luận phải là UUID hợp lệ')
];
