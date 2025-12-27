const express = require('express');
const { body, validationResult } = require('express-validator');
const { User } = require('../../models');
const { generateToken } = require('../../middleware/auth');

const router = express.Router();

/**
 * @desc    API Login
 * @route   POST /api/auth/login
 * @access  Public
 */
router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: errors.array()
        });
      }

      const { email, password } = req.body;
      
      const user = await User.findByEmail(email);
      if (!user || !(await user.validatePassword(password))) {
        return res.status(401).json({
          success: false,
          message: 'Email hoặc mật khẩu không chính xác'
        });
      }

      if (!user.is_active) {
        return res.status(401).json({
          success: false,
          message: 'Tài khoản đã bị vô hiệu hóa'
        });
      }

      // Update last login
      user.last_login = new Date();
      user.login_count = (user.login_count || 0) + 1;
      await user.save();

      // Generate token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      res.json({
        success: true,
        message: 'Đăng nhập thành công',
        data: {
          user: user.toSafeObject(),
          token,
          expires_in: '24h'
        }
      });

    } catch (error) {
      console.error('API Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }
);

/**
 * @desc    Get current user info
 * @route   GET /api/auth/me
 * @access  Private
 */
router.get('/me', require('../../middleware/auth').authenticate, (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user.toSafeObject()
    }
  });
});

module.exports = router;

