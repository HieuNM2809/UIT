const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { coursesValidation } = require('../validators/dashboardValidator');
const { handleValidationErrors } = require('../middleware/validationHandler');
const { requireLogin } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(requireLogin);

/**
 * @desc    Dashboard main page
 * @route   GET /dashboard
 * @access  Private
 */
router.get('/', dashboardController.index);

/**
 * @desc    My courses page
 * @route   GET /dashboard/courses
 * @access  Private
 */
router.get('/courses', coursesValidation, handleValidationErrors, dashboardController.courses);

/**
 * @desc    Progress & Statistics
 * @route   GET /dashboard/progress
 * @access  Private
 */
router.get('/progress', dashboardController.progress);

module.exports = router;
