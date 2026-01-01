const express = require('express');
const blogController = require('../controllers/blogController');
const { 
  listValidation, 
  slugValidation, 
  blogIdValidation,
  createBlogValidation,
  updateBlogValidation
} = require('../validators/blogValidator');
const { handleValidationErrors, handleValidationErrorsAPI } = require('../middleware/validationHandler');
const { requireLogin } = require('../middleware/auth');

const router = express.Router();

/**
 * @desc    Show all blogs
 * @route   GET /blogs
 * @access  Public
 */
router.get('/', listValidation, handleValidationErrors, blogController.index);

/**
 * @desc    Show user's blogs
 * @route   GET /blogs/my-blogs
 * @access  Private (Login required)
 */
router.get('/my-blogs', requireLogin, blogController.myBlogs);

/**
 * @desc    Show create blog form
 * @route   GET /blogs/create
 * @access  Private (Login required)
 */
router.get('/create', requireLogin, blogController.create);

/**
 * @desc    Upload image for CKEditor
 * @route   POST /blogs/upload-image
 * @access  Private (Login required)
 */
router.post('/upload-image',
  requireLogin,
  blogController.uploadBlogImageForEditor,
  blogController.uploadImage
);

/**
 * @desc    Store new blog
 * @route   POST /blogs
 * @access  Private (Login required)
 */
router.post('/', 
  requireLogin,
  blogController.store
);

/**
 * @desc    Show edit blog form
 * @route   GET /blogs/:id/edit
 * @access  Private (Author or Admin)
 * @note    Must be before /:slug to avoid route conflicts
 */
router.get('/:id/edit', 
  requireLogin,
  blogIdValidation, 
  handleValidationErrors, 
  blogController.edit
);

/**
 * @desc    Update blog
 * @route   PUT /blogs/:id
 * @access  Private (Author or Admin)
 */
router.put('/:id', 
  requireLogin,
  blogIdValidation,
  handleValidationErrors, 
  blogController.update
);

/**
 * @desc    Update blog (POST with method override for multipart/form-data)
 * @route   POST /blogs/:id
 * @access  Private (Author or Admin)
 * @note    This route handles POST requests with _method=PUT for file uploads
 */
router.post('/:id', 
  requireLogin,
  blogIdValidation,
  handleValidationErrors, 
  blogController.update
);

/**
 * @desc    Archive blog
 * @route   POST /blogs/:id/archive
 * @access  Private (Author or Admin)
 */
router.post('/:id/archive',
  requireLogin,
  blogIdValidation,
  handleValidationErrors,
  blogController.archive
);

/**
 * @desc    Unarchive blog
 * @route   POST /blogs/:id/unarchive
 * @access  Private (Author or Admin)
 */
router.post('/:id/unarchive',
  requireLogin,
  blogIdValidation,
  handleValidationErrors,
  blogController.unarchive
);

/**
 * @desc    Delete blog
 * @route   DELETE /blogs/:id
 * @access  Private (Author or Admin)
 */
router.delete('/:id', 
  requireLogin,
  blogIdValidation, 
  handleValidationErrorsAPI, 
  blogController.destroy
);

/**
 * @desc    Show single blog
 * @route   GET /blogs/:slug
 * @access  Public
 * @note    Must be last to avoid matching /create or /:id/edit as a slug
 */
router.get('/:slug', slugValidation, handleValidationErrors, blogController.show);

module.exports = router;
