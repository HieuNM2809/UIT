const express = require('express');
const authController = require('../controllers/authController');
const { loginValidation, registerValidation } = require('../validators/authValidator');
const { forgotPasswordValidation, resetPasswordValidation } = require('../validators/passwordResetValidator');
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

/**
 * @desc    Show forgot password form
 * @route   GET /auth/forgot-password
 * @access  Public
 */
router.get('/forgot-password', authController.showForgotPassword);

/**
 * @desc    Process forgot password request
 * @route   POST /auth/forgot-password
 * @access  Public
 */
router.post('/forgot-password', forgotPasswordValidation, handleValidationErrors, authController.forgotPassword);

/**
 * @desc    Show reset password form
 * @route   GET /auth/reset-password/:token
 * @access  Public
 */
router.get('/reset-password/:token', authController.showResetPassword);

/**
 * @desc    Process reset password
 * @route   POST /auth/reset-password/:token
 * @access  Public
 */
router.post('/reset-password/:token', resetPasswordValidation, handleValidationErrors, authController.resetPassword);

/**
 * @desc    Show email verification form
 * @route   GET /auth/verify-email
 * @access  Public
 */
router.get('/verify-email', authController.showVerifyEmail);

/**
 * @desc    Process email verification with OTP
 * @route   POST /auth/verify-email
 * @access  Public
 */
router.post('/verify-email', authController.verifyEmail);

/**
 * @desc    Resend OTP code
 * @route   POST /auth/resend-otp
 * @access  Public
 */
router.post('/resend-otp', authController.resendOTP);

module.exports = router;