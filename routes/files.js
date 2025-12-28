const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { handleValidationErrorsAPI } = require('../middleware/validationHandler');
const fileController = require('../controllers/fileController');
const {
  uploadValidation,
  fileIdValidation,
  updateValidation,
  getMyFilesValidation
} = require('../validators/fileValidator');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @desc    Upload files
 * @route   POST /api/files/upload
 * @access  Private
 */
router.post('/upload',
  fileController.upload.array('files', 10),
  uploadValidation,
  handleValidationErrorsAPI,
  asyncHandler(fileController.uploadFiles)
);

/**
 * @desc    Get file statistics (Admin only)
 * @route   GET /api/files/admin/stats
 * @access  Private/Admin
 */
router.get('/admin/stats',
  authorize('admin', 'system_admin'),
  asyncHandler(fileController.getStats)
);

/**
 * @desc    Get user's uploaded files
 * @route   GET /api/files/my-files
 * @access  Private
 */
router.get('/my-files',
  getMyFilesValidation,
  handleValidationErrorsAPI,
  asyncHandler(fileController.getMyFiles)
);

/**
 * @desc    Get file by ID
 * @route   GET /api/files/:id
 * @access  Private
 */
router.get('/:id',
  fileIdValidation,
  handleValidationErrorsAPI,
  asyncHandler(fileController.show)
);

/**
 * @desc    Update file metadata
 * @route   PUT /api/files/:id
 * @access  Private (Owner or Admin)
 */
router.put('/:id',
  fileIdValidation,
  updateValidation,
  handleValidationErrorsAPI,
  asyncHandler(fileController.update)
);

/**
 * @desc    Delete file
 * @route   DELETE /api/files/:id
 * @access  Private (Owner or Admin)
 */
router.delete('/:id',
  fileIdValidation,
  handleValidationErrorsAPI,
  asyncHandler(fileController.delete)
);

/**
 * @desc    Get file statistics (Admin only)
 * @route   GET /api/files/admin/stats
 * @access  Private/Admin
 */
router.get('/admin/stats',
  authorize('admin', 'system_admin'),
  asyncHandler(fileController.getStats)
);

module.exports = router;
