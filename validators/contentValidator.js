const { body, param, query } = require('express-validator');

/**
 * Validation rules for getting content by course
 */
exports.getByCourseValidation = [
  query('include_drafts')
    .optional()
    .isBoolean()
    .withMessage('include_drafts must be boolean')
];

/**
 * Validation rules for creating content
 */
exports.createValidation = [
  body('course_id')
    .isUUID()
    .withMessage('Valid course ID is required'),
  body('title')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  body('content_type')
    .isIn(['lesson', 'video', 'document', 'quiz', 'assignment', 'discussion', 'resource', 'live_session'])
    .withMessage('Invalid content type'),
  body('content_format')
    .optional()
    .isIn(['text', 'html', 'markdown', 'video', 'audio', 'pdf', 'image', 'interactive'])
    .withMessage('Invalid content format'),
  body('order_index')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order index must be a non-negative integer'),
  body('estimated_duration')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Estimated duration must be a positive number')
];

/**
 * Validation rules for updating content
 */
exports.updateValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  body('content_type')
    .optional()
    .isIn(['lesson', 'video', 'document', 'quiz', 'assignment', 'discussion', 'resource', 'live_session'])
    .withMessage('Invalid content type'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived', ''])
    .withMessage('Invalid status')
];

/**
 * Validation rules for content ID parameter
 */
exports.contentIdValidation = [
  param('id')
    .isUUID()
    .withMessage('Content ID must be a valid UUID')
];

/**
 * Validation rules for course ID parameter
 */
exports.courseIdValidation = [
  param('courseId')
    .isUUID()
    .withMessage('Course ID must be a valid UUID')
];

/**
 * Validation rules for updating progress
 */
exports.updateProgressValidation = [
  body('progress_percentage')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Progress percentage must be between 0 and 100'),
  body('time_spent')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Time spent must be a positive integer'),
  body('last_position')
    .optional()
    .isObject()
    .withMessage('Last position must be an object')
];

