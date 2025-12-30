const { body, param, query } = require('express-validator');

/**
 * Validation rules for blog listing
 */
exports.listValidation = [
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Từ khóa tìm kiếm phải ít hơn 100 ký tự'),
  query('category')
    .optional()
    .trim()
    .custom((value) => {
      if (!value || value === '') {
        return true;
      }
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(value)) {
        throw new Error('ID danh mục phải là UUID hợp lệ');
      }
      return true;
    }),
  query('tag')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Tag phải ít hơn 50 ký tự'),
  query('author')
    .optional()
    .trim()
    .isUUID()
    .withMessage('ID tác giả phải là UUID hợp lệ'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Trang phải là số nguyên dương')
];

/**
 * Validation rules for blog slug parameter
 */
exports.slugValidation = [
  param('slug')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Slug blog không hợp lệ')
];

/**
 * Validation rules for blog ID parameter
 */
exports.blogIdValidation = [
  param('id')
    .isUUID()
    .withMessage('ID blog phải là UUID hợp lệ')
];

/**
 * Validation rules for creating a blog
 */
exports.createBlogValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Tiêu đề không được để trống')
    .isLength({ min: 3, max: 200 })
    .withMessage('Tiêu đề phải từ 3 đến 200 ký tự'),
  body('content')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Nội dung không được để trống')
    .isLength({ min: 50 })
    .withMessage('Nội dung phải có ít nhất 50 ký tự'),
  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Tóm tắt không được vượt quá 500 ký tự'),
  body('featured_image')
    .optional()
    .trim()
    .isURL()
    .withMessage('URL hình ảnh không hợp lệ'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Trạng thái không hợp lệ'),
  body('tags')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            return parsed.every(tag => typeof tag === 'string' && tag.length <= 50);
          }
        } catch {
          const tags = value.split(',').map(t => t.trim()).filter(t => t);
          return tags.every(tag => tag.length <= 50);
        }
      }
      if (Array.isArray(value)) {
        return value.every(tag => typeof tag === 'string' && tag.length <= 50);
      }
      return false;
    })
    .withMessage('Tags phải là mảng các chuỗi, mỗi tag không quá 50 ký tự'),
  body('category_id')
    .optional()
    .trim()
    .custom((value) => {
      if (!value || value === '') {
        return true;
      }
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(value)) {
        throw new Error('ID danh mục phải là UUID hợp lệ');
      }
      return true;
    })
];

/**
 * Validation rules for updating a blog
 */
exports.updateBlogValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Tiêu đề không được để trống')
    .isLength({ min: 3, max: 200 })
    .withMessage('Tiêu đề phải từ 3 đến 200 ký tự'),
  body('content')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Nội dung không được để trống')
    .isLength({ min: 50 })
    .withMessage('Nội dung phải có ít nhất 50 ký tự'),
  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Tóm tắt không được vượt quá 500 ký tự'),
  body('featured_image')
    .optional()
    .trim()
    .isURL()
    .withMessage('URL hình ảnh không hợp lệ'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Trạng thái không hợp lệ'),
  body('tags')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            return parsed.every(tag => typeof tag === 'string' && tag.length <= 50);
          }
        } catch {
          const tags = value.split(',').map(t => t.trim()).filter(t => t);
          return tags.every(tag => tag.length <= 50);
        }
      }
      if (Array.isArray(value)) {
        return value.every(tag => typeof tag === 'string' && tag.length <= 50);
      }
      return false;
    })
    .withMessage('Tags phải là mảng các chuỗi, mỗi tag không quá 50 ký tự'),
  body('category_id')
    .optional()
    .trim()
    .custom((value) => {
      if (!value || value === '') {
        return true;
      }
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(value)) {
        throw new Error('ID danh mục phải là UUID hợp lệ');
      }
      return true;
    })
];
