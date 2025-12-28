const { query } = require('express-validator');

/**
 * Validation rules for courses listing
 */
exports.coursesValidation = [
  query('status')
    .optional()
    .isIn(['active', 'completed', 'paused', 'cancelled'])
    .withMessage('Invalid enrollment status'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
];

