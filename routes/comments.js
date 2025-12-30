const express = require('express');
const commentController = require('../controllers/commentController');
const { 
  createCommentValidation,
  updateCommentValidation,
  commentIdValidation,
  courseSlugValidation,
  listCommentsValidation,
  reportCommentValidation,
  likeCommentValidation
} = require('../validators/commentValidator');
const { handleValidationErrors, handleValidationErrorsAPI } = require('../middleware/validationHandler');
const { requireLogin } = require('../middleware/auth');

const router = express.Router();

/**
 * @desc    Get comments for a course
 * @route   GET /comments/course/:slug
 * @access  Public
 */
router.get('/course/:slug', 
  listCommentsValidation, 
  handleValidationErrorsAPI, 
  commentController.list
);

/**
 * @desc    Create a new comment
 * @route   POST /comments
 * @access  Private (Login required)
 */
router.post('/', 
  requireLogin,
  createCommentValidation, 
  handleValidationErrorsAPI, 
  commentController.create
);

/**
 * @desc    Create a new comment for a specific course
 * @route   POST /comments/course/:slug
 * @access  Private (Login required)
 */
router.post('/course/:slug', 
  requireLogin,
  courseSlugValidation,
  createCommentValidation, 
  handleValidationErrorsAPI, 
  commentController.create
);

/**
 * @desc    Update a comment
 * @route   PUT /comments/:id
 * @access  Private (Author or Admin)
 */
router.put('/:id', 
  requireLogin,
  updateCommentValidation, 
  handleValidationErrorsAPI, 
  commentController.update
);

/**
 * @desc    Delete a comment (soft delete)
 * @route   DELETE /comments/:id
 * @access  Private (Author or Admin)
 */
router.delete('/:id', 
  requireLogin,
  commentIdValidation, 
  handleValidationErrorsAPI, 
  commentController.delete
);

/**
 * @desc    Like/Unlike a comment
 * @route   POST /comments/:id/like
 * @access  Private (Login required)
 */
router.post('/:id/like', 
  requireLogin,
  likeCommentValidation, 
  handleValidationErrorsAPI, 
  commentController.toggleLike
);

/**
 * @desc    Report a comment
 * @route   POST /comments/:id/report
 * @access  Private (Login required)
 */
router.post('/:id/report', 
  requireLogin,
  reportCommentValidation, 
  handleValidationErrorsAPI, 
  commentController.report
);

module.exports = router;
