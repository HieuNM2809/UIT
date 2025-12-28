const { body, param, query } = require('express-validator');

/**
 * Validation rules for creating course
 */
exports.createCourseValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Tiêu đề phải từ 3-255 ký tự'),
  body('instructor_id')
    .isUUID()
    .withMessage('Giảng viên không hợp lệ'),
  body('level')
    .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
    .withMessage('Độ khó không hợp lệ'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Giá phải là số dương'),
  body('status')
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Trạng thái không hợp lệ')
];

/**
 * Validation rules for updating course
 */
exports.updateCourseValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Tiêu đề phải từ 3-255 ký tự'),
  body('instructor_id')
    .isUUID()
    .withMessage('Giảng viên không hợp lệ'),
  body('level')
    .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
    .withMessage('Độ khó không hợp lệ'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Giá phải là số dương'),
  body('status')
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Trạng thái không hợp lệ')
];

/**
 * Validation rules for course ID parameter
 */
exports.courseIdValidation = [
  param('id')
    .isUUID()
    .withMessage('Course ID must be a valid UUID')
];

/**
 * Validation rules for course status update
 */
exports.courseStatusValidation = [
  body('status')
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Trạng thái không hợp lệ')
];

/**
 * Validation rules for creating category
 */
exports.createCategoryValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Tên danh mục phải từ 2-100 ký tự'),
  body('slug')
    .optional()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage('Slug không hợp lệ'),
  body('color')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Màu sắc phải là mã hex (ví dụ: #3B82F6)'),
  body('order_index')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Thứ tự phải là số nguyên dương')
];

/**
 * Validation rules for updating category
 */
exports.updateCategoryValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Tên danh mục phải từ 2-100 ký tự'),
  body('slug')
    .optional()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage('Slug không hợp lệ'),
  body('color')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Màu sắc phải là mã hex (ví dụ: #3B82F6)'),
  body('order_index')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Thứ tự phải là số nguyên dương')
];

/**
 * Validation rules for category ID parameter
 */
exports.categoryIdValidation = [
  param('id')
    .isUUID()
    .withMessage('Category ID must be a valid UUID')
];

/**
 * Validation rules for category status update
 */
exports.categoryStatusValidation = [
  body('is_active')
    .isIn(['true', 'false', true, false])
    .withMessage('Trạng thái không hợp lệ')
];

/**
 * Validation rules for deleting category
 */
exports.deleteCategoryValidation = [
  body('confirm_delete')
    .equals('DELETE')
    .withMessage('Vui lòng nhập "DELETE" để xác nhận xóa danh mục')
];

/**
 * Validation rules for user ID parameter
 */
exports.userIdValidation = [
  param('id')
    .isUUID()
    .withMessage('User ID must be a valid UUID')
];

/**
 * Validation rules for user status update
 */
exports.userStatusValidation = [
  body('is_active')
    .isIn(['true', 'false', true, false])
    .withMessage('Trạng thái không hợp lệ')
];

/**
 * Validation rules for user role update
 */
exports.userRoleValidation = [
  body('role')
    .isIn(['student', 'teacher', 'lecturer', 'admin', 'system_admin'])
    .withMessage('Vai trò không hợp lệ')
];

/**
 * Validation rules for deleting user
 */
exports.deleteUserValidation = [
  body('confirm_delete')
    .equals('DELETE')
    .withMessage('Vui lòng nhập "DELETE" để xác nhận xóa người dùng')
];

/**
 * Validation rules for contact ID parameter
 */
exports.contactIdValidation = [
  param('id')
    .isUUID()
    .withMessage('Contact ID must be a valid UUID')
];

/**
 * Validation rules for contact status update
 */
exports.contactStatusValidation = [
  body('status')
    .isIn(['pending', 'in_progress', 'resolved', 'closed'])
    .withMessage('Trạng thái không hợp lệ')
];

/**
 * Validation rules for contact priority update
 */
exports.contactPriorityValidation = [
  body('priority')
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Mức độ ưu tiên không hợp lệ')
];

/**
 * Validation rules for course listing filters
 */
exports.courseListValidation = [
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search term must be less than 100 characters'),
  query('status')
    .optional()
    .isIn(['draft', 'published', 'archived', ''])
    .withMessage('Invalid status'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
];

/**
 * Validation rules for user listing filters
 */
exports.userListValidation = [
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search term must be less than 100 characters'),
  query('role')
    .optional()
    .isIn(['student', 'teacher', 'lecturer', 'admin', 'system_admin', ''])
    .withMessage('Invalid role'),
  query('status')
    .optional()
    .isIn(['active', 'inactive', ''])
    .withMessage('Invalid status'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
];

/**
 * Validation rules for category listing filters
 */
exports.categoryListValidation = [
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search term must be less than 100 characters'),
  query('is_active')
    .optional()
    .isIn(['true', 'false', ''])
    .withMessage('Invalid status'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
];

/**
 * Validation rules for contact listing filters
 */
exports.contactListValidation = [
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search term must be less than 100 characters'),
  query('status')
    .optional()
    .isIn(['pending', 'in_progress', 'resolved', 'closed', ''])
    .withMessage('Invalid status'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
];

/**
 * Validation rules for enrollment ID parameter
 */
exports.enrollmentIdValidation = [
  param('id')
    .isUUID()
    .withMessage('Enrollment ID must be a valid UUID')
];

/**
 * Validation rules for enrollment status update
 */
exports.enrollmentStatusValidation = [
  body('status')
    .isIn(['pending', 'active', 'completed', 'dropped'])
    .withMessage('Trạng thái không hợp lệ')
];

/**
 * Validation rules for enrollment progress update
 */
exports.enrollmentProgressValidation = [
  body('progress_percentage')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Tiến độ phải là số từ 0 đến 100')
];

/**
 * Validation rules for deleting enrollment
 */
exports.deleteEnrollmentValidation = [
  body('confirm_delete')
    .equals('DELETE')
    .withMessage('Vui lòng nhập "DELETE" để xác nhận xóa đăng ký')
];

/**
 * Validation rules for enrollment listing filters
 */
exports.enrollmentListValidation = [
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search term must be less than 100 characters'),
  query('status')
    .optional()
    .isIn(['pending', 'active', 'completed', 'dropped', ''])
    .withMessage('Invalid status'),
  query('course_id')
    .optional()
    .custom((value) => {
      if (value === '' || value === null || value === undefined) {
        return true;
      }
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      return uuidRegex.test(value);
    })
    .withMessage('Course ID must be a valid UUID'),
  query('user_id')
    .optional()
    .custom((value) => {
      if (value === '' || value === null || value === undefined) {
        return true;
      }
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      return uuidRegex.test(value);
    })
    .withMessage('User ID must be a valid UUID'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
];

