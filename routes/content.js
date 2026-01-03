const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { handleValidationErrorsAPI } = require('../middleware/validationHandler');
const contentController = require('../controllers/contentController');
const {
  getByCourseValidation,
  createValidation,
  updateValidation,
  contentIdValidation,
  courseIdValidation,
  updateProgressValidation
} = require('../validators/contentValidator');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @desc    Get content by course
 * @route   GET /api/content/course/:courseId
 * @access  Private
 */
router.get('/course/:courseId',
  courseIdValidation,
  getByCourseValidation,
  handleValidationErrorsAPI,
  asyncHandler(contentController.getByCourse)
);

/**
 * @desc    Create new content
 * @route   POST /api/content
 * @access  Private/Teacher
 */
router.post('/',
  authorize('teacher', 'lecturer', 'admin', 'system_admin'),
  createValidation,
  handleValidationErrorsAPI,
  asyncHandler(contentController.create)
);

/**
 * @desc    Get content by ID
 * @route   GET /api/content/:id
 * @access  Private
 */
router.get('/:id',
  contentIdValidation,
  handleValidationErrorsAPI,
  asyncHandler(contentController.show)
);

/**
 * @desc    Update content
 * @route   PUT /api/content/:id
 * @access  Private (Instructor or Admin)
 */
router.put('/:id',
  contentIdValidation,
  updateValidation,
  handleValidationErrorsAPI,
  asyncHandler(contentController.update)
);

/**
 * @desc    Delete content
 * @route   DELETE /api/content/:id
 * @access  Private (Instructor or Admin)
 */
router.delete('/:id',
  contentIdValidation,
  handleValidationErrorsAPI,
  asyncHandler(contentController.delete)
);

/**
 * @desc    Mark content as completed
 * @route   POST /api/content/:id/complete
 * @access  Private
 */
router.post('/:id/complete',
  contentIdValidation,
  handleValidationErrorsAPI,
  asyncHandler(contentController.complete)
);

/**
 * @desc    Update content progress
 * @route   POST /api/content/:id/progress
 * @access  Private
 */
router.post('/:id/progress',
  contentIdValidation,
  updateProgressValidation,
  handleValidationErrorsAPI,
  asyncHandler(contentController.updateProgress)
);

/**
 * @desc    Generate additional knowledge for content using AI
 * @route   POST /api/content/:id/generate-knowledge
 * @access  Private
 */
router.post('/:id/generate-knowledge',
  contentIdValidation,
  handleValidationErrorsAPI,
  asyncHandler(contentController.generateAdditionalKnowledge)
);

/**
 * @desc    Get saved AI suggestion for content
 * @route   GET /api/content/:id/ai-suggestion
 * @access  Private
 */
router.get('/:id/ai-suggestion',
  contentIdValidation,
  handleValidationErrorsAPI,
  asyncHandler(contentController.getAISuggestion)
);

module.exports = router;
