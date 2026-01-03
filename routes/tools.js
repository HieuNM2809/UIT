const express = require('express');
const toolsController = require('../controllers/toolsController');

const router = express.Router();

/**
 * @desc    Show Tools page - List all available tools
 * @route   GET /tools
 * @access  Public (or require login if needed)
 */
router.get('/', toolsController.index);

module.exports = router;

