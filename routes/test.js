const express = require('express');
const testController = require('../controllers/testController');

const router = express.Router();

/**
 * @desc    Test index page - list all test features
 * @route   GET /test
 * @access  Public (for testing)
 */
router.get('/', testController.index);

/**
 * @desc    Test logs endpoint
 * @route   GET /test/logs
 * @access  Public (for testing)
 */
router.get('/logs', testController.testLogs);

/**
 * @desc    Test Gemini chat page
 * @route   GET /test/gemini-chat
 * @access  Public (for testing)
 */
router.get('/gemini-chat', testController.geminiChatPage);

/**
 * @desc    Test Gemini API call
 * @route   POST /test/gemini-chat
 * @access  Public (for testing)
 */
router.post('/gemini-chat', testController.testGeminiChat);

/**
 * @desc    Test Prometheus metrics
 * @route   GET /test/metrics
 * @access  Public (for testing)
 */
router.get('/metrics', testController.testMetrics);

module.exports = router;

