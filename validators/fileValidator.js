const { body, param, query } = require('express-validator');

/**
 * Validation rules for uploading files
 */
exports.uploadValidation = [
  body('content_id')
    .optional()
    .isUUID()
    .withMessage('Invalid content ID'),
  body('is_public')
    .optional()
    .isBoolean()
    .withMessage('is_public must be boolean')
];

/**
 * Validation rules for file ID parameter
 */
exports.fileIdValidation = [
  param('id')
    .isUUID()
    .withMessage('File ID must be a valid UUID')
];

/**
 * Validation rules for updating file metadata
 */
exports.updateValidation = [
  body('original_name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Filename must be between 1 and 255 characters'),
  body('is_public')
    .optional()
    .isBoolean()
    .withMessage('is_public must be boolean')
];

/**
 * Validation rules for getting user's files
 */
exports.getMyFilesValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('file_type')
    .optional()
    .isIn(['image', 'video', 'audio', 'document', 'other'])
    .withMessage('Invalid file type')
];

