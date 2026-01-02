const express = require('express');
const testController = require('../controllers/testController');

const router = express.Router();

/**
 * @desc    Test logs endpoint
 * @route   GET /test/logs
 * @access  Public (for testing)
 */
router.get('/logs', testController.testLogs);

module.exports = router;

