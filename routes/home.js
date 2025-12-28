const express = require('express');
const homeController = require('../controllers/homeController');

const router = express.Router();

/**
 * @desc    Homepage
 * @route   GET /
 * @access  Public
 */
router.get('/', homeController.index);

module.exports = router;
