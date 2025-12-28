const { query, param } = require('express-validator');

/**
 * Validation rules for course listing
 */
exports.listValidation = [
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search term must be less than 100 characters'),
  query('category')
    .optional()
    .trim()
    .custom((value) => {
      // Allow empty string (for "Tất cả" option)
      if (!value || value === '') {
        return true;
      }
      // If value exists, it must be a valid UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(value)) {
        throw new Error('Category ID must be a valid UUID');
      }
      return true;
    }),
  query('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced', 'expert', ''])
    .withMessage('Invalid level'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
];

/**
 * Validation rules for course slug parameter
 */
exports.slugValidation = [
  param('slug')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Invalid course slug')
];

