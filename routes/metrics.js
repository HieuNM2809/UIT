const express = require('express');
const metricsController = require('../controllers/metricsController');

const router = express.Router();

/**
 * @desc    Prometheus metrics endpoint
 * @route   GET /metrics
 * @access  Public (for Prometheus scraping)
 */
router.get('/', metricsController.getMetrics);

module.exports = router;

