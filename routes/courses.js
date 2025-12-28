const express = require('express');
const courseController = require('../controllers/courseController');
const { listValidation, slugValidation } = require('../validators/courseValidator');
const { handleValidationErrors } = require('../middleware/validationHandler');

const router = express.Router();

/**
 * @desc    Show all courses
 * @route   GET /courses
 * @access  Public
 */
router.get('/', listValidation, handleValidationErrors, courseController.index);

/**
 * @desc    Show single course
 * @route   GET /courses/:slug
 * @access  Public
 */
router.get('/:slug', slugValidation, handleValidationErrors, courseController.show);

module.exports = router;