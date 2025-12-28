const express = require('express');
const infoController = require('../controllers/infoController');
const { contactValidation } = require('../validators/infoValidator');
const { handleValidationErrors } = require('../middleware/validationHandler');

const router = express.Router();

/**
 * @desc    Show Help/Support page
 * @route   GET /help
 * @access  Public
 */
router.get('/help', infoController.help);

/**
 * @desc    Show Contact page
 * @route   GET /contact
 * @access  Public
 */
router.get('/contact', infoController.showContact);

/**
 * @desc    Handle Contact form submission
 * @route   POST /contact
 * @access  Public
 */
router.post('/contact', contactValidation, handleValidationErrors, infoController.submitContact);

/**
 * @desc    Show Privacy Policy page
 * @route   GET /privacy
 * @access  Public
 */
router.get('/privacy', infoController.privacy);

/**
 * @desc    Show Terms of Service page
 * @route   GET /terms
 * @access  Public
 */
router.get('/terms', infoController.terms);

module.exports = router;
