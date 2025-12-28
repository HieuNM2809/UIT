const express = require('express');
const { requireLogin } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validationHandler');
const profileController = require('../controllers/profileController');
const {
  updateValidation,
  changePasswordValidation,
  deleteAccountValidation
} = require('../validators/profileValidator');

const router = express.Router();

// All routes require authentication
router.use(requireLogin);

/**
 * @desc    Show user profile
 * @route   GET /profile
 * @access  Private
 */
router.get('/', profileController.index);

/**
 * @desc    Update profile
 * @route   POST /profile/update
 * @access  Private
 */
router.post('/update',
  updateValidation,
  handleValidationErrors,
  profileController.update
);

/**
 * @desc    Change password
 * @route   POST /profile/change-password
 * @access  Private
 */
router.post('/change-password',
  changePasswordValidation,
  handleValidationErrors,
  profileController.changePassword
);

/**
 * @desc    Delete account
 * @route   POST /profile/delete
 * @access  Private
 */
router.post('/delete',
  deleteAccountValidation,
  handleValidationErrors,
  profileController.delete
);

/**
 * @desc    Upload avatar
 * @route   POST /profile/upload-avatar
 * @access  Private
 */
router.post('/upload-avatar', profileController.uploadAvatar);

module.exports = router;
