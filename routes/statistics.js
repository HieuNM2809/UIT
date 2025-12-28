const express = require('express');
const { authenticate } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const statisticsController = require('../controllers/statisticsController');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @desc    Get general statistics
 * @route   GET /api/statistics
 * @access  Private
 */
router.get('/', asyncHandler(statisticsController.getStatistics));

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/statistics/dashboard
 * @access  Private
 */
router.get('/dashboard', asyncHandler(statisticsController.getDashboard));

/**
 * @desc    Get learning reports/analytics
 * @route   GET /api/statistics/reports
 * @access  Private
 */
router.get('/reports', asyncHandler(statisticsController.getReports));

module.exports = router;

