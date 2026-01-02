const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const { authenticate } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticate);

/**
 * Download certificate PDF
 * GET /certificates/:certificateId/download
 */
router.get('/:certificateId/download', certificateController.download);

/**
 * View certificate (inline)
 * GET /certificates/:certificateId/view
 */
router.get('/:certificateId/view', certificateController.view);

module.exports = router;

