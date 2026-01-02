const express = require('express');
const { requireLogin } = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');
const { handleValidationErrorsAPI } = require('../middleware/validationHandler');

const router = express.Router();

/**
 * @desc    VietQR Callback (Webhook)
 * @route   POST /api/payments/vietqr/callback
 * @access  Public (Webhook)
 */
router.post('/vietqr/callback', paymentController.vietQRCallback);

/**
 * @desc    Check payment status (must be before /:id to avoid route conflict)
 * @route   GET /api/payments/:paymentId/status
 * @access  Private
 */
router.get('/:paymentId/status', requireLogin, paymentController.checkPaymentStatus);

/**
 * @desc    Show payment page
 * @route   GET /payments/:id
 * @access  Private
 */
router.get('/:id', requireLogin, paymentController.show);

module.exports = router;

