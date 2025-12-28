const express = require('express');
const courseController = require('../controllers/courseController');
const { listValidation, slugValidation, courseIdValidation } = require('../validators/courseValidator');
const { handleValidationErrors, handleValidationErrorsAPI } = require('../middleware/validationHandler');
const { requireLogin } = require('../middleware/auth');

const router = express.Router();

/**
 * @desc    Show all courses
 * @route   GET /courses
 * @access  Public
 */
router.get('/', listValidation, handleValidationErrors, courseController.index);

/**
 * @desc    Enroll in course (API)
 * @route   POST /courses/enroll/:id
 * @access  Private
 * @note    Must be FIRST to avoid route conflicts with /:slug
 */
router.post('/enroll/:id', 
  courseIdValidation, 
  handleValidationErrorsAPI, 
  courseController.enroll
);

/**
 * @desc    Learn course (enrolled users only)
 * @route   GET /courses/:slug/learn
 * @access  Private (Enrolled users)
 * @note    Must be before /:slug to avoid route conflicts
 */
router.get('/:slug/learn', requireLogin, slugValidation, handleValidationErrors, courseController.learn);

/**
 * @desc    Show single course
 * @route   GET /courses/:slug
 * @access  Public
 * @note    Must be last to avoid matching /enroll or /learn as a slug
 */
router.get('/:slug', slugValidation, handleValidationErrors, courseController.show);

module.exports = router;