const express = require('express');
const router = express.Router();

/**
 * @desc    Homepage
 * @route   GET /
 * @access  Public
 */
router.get('/', (req, res) => {
  res.locals.currentPath = '/';
  res.render('pages/home', {
    title: 'Trang chủ',
    fullWidth: true
  });
});

module.exports = router;

