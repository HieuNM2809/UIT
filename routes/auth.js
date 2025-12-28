const express = require('express');
const authController = require('../controllers/authController');
const { loginValidation, registerValidation } = require('../validators/authValidator');
const { handleValidationErrors } = require('../middleware/validationHandler');

const router = express.Router();

/**
 * @desc    Show login form
 * @route   GET /auth/login
 * @access  Public
 */
router.get('/login', authController.showLogin);

/**
 * @desc    Process login
 * @route   POST /auth/login
 * @access  Public
 */
router.post('/login', loginValidation, handleValidationErrors, authController.login);

/**
 * @desc    Show register form
 * @route   GET /auth/register
 * @access  Public
 */
router.get('/register', authController.showRegister);

/**
 * @desc    Process registration
 * @route   POST /auth/register
 * @access  Public
 */
router.post('/register', registerValidation, handleValidationErrors, authController.register);

/**
 * @desc    Logout
 * @route   GET /auth/logout
 * @access  Private
 */
router.get('/logout', authController.logout);

module.exports = router;