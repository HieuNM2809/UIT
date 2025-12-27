const express = require('express');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');

const router = express.Router();

/**
 * @desc    Show user profile
 * @route   GET /profile
 * @access  Private
 */
router.get('/', (req, res) => {
  res.locals.currentPath = '/profile';
  res.render('pages/profile/index', {
    title: 'Hồ sơ cá nhân',
    pageHeader: 'Hồ sơ cá nhân',
    pageDescription: 'Quản lý thông tin cá nhân và cài đặt tài khoản'
  });
});

/**
 * @desc    Update profile
 * @route   POST /profile/update
 * @access  Private
 */
router.post('/update',
  [
    body('first_name')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Họ phải từ 1-50 ký tự'),
    body('last_name')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Tên phải từ 1-50 ký tự'),
    body('phone')
      .optional()
      .trim()
      .matches(/^[+]?[\d\s\-()]+$/)
      .withMessage('Số điện thoại không hợp lệ')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.redirect('/profile');
      }

      const { first_name, last_name, phone, date_of_birth } = req.body;
      
      const user = await User.findByPk(req.session.user.id);
      if (!user) {
        req.flash('error', 'Không tìm thấy người dùng');
        return res.redirect('/profile');
      }

      // Update user info
      user.first_name = first_name.trim();
      user.last_name = last_name.trim();
      user.phone = phone ? phone.trim() : null;
      user.date_of_birth = date_of_birth || null;

      await user.save();

      // Update session
      req.session.user = user.toSafeObject();

      req.flash('success', 'Cập nhật hồ sơ thành công!');
      res.redirect('/profile');

    } catch (error) {
      console.error('Profile update error:', error);
      req.flash('error', 'Lỗi khi cập nhật hồ sơ');
      res.redirect('/profile');
    }
  }
);

/**
 * @desc    Change password
 * @route   POST /profile/change-password
 * @access  Private
 */
router.post('/change-password',
  [
    body('current_password')
      .notEmpty()
      .withMessage('Mật khẩu hiện tại là bắt buộc'),
    body('new_password')
      .isLength({ min: 6 })
      .withMessage('Mật khẩu mới phải có ít nhất 6 ký tự'),
    body('confirm_password')
      .custom((value, { req }) => {
        if (value !== req.body.new_password) {
          throw new Error('Xác nhận mật khẩu không khớp');
        }
        return true;
      })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.redirect('/profile');
      }

      const { current_password, new_password } = req.body;
      
      const user = await User.findByPk(req.session.user.id);
      if (!user) {
        req.flash('error', 'Không tìm thấy người dùng');
        return res.redirect('/profile');
      }

      // Verify current password
      const isValidPassword = await user.validatePassword(current_password);
      if (!isValidPassword) {
        req.flash('error', 'Mật khẩu hiện tại không chính xác');
        return res.redirect('/profile');
      }

      // Update password
      user.password = new_password;
      await user.save();

      req.flash('success', 'Đổi mật khẩu thành công!');
      res.redirect('/profile');

    } catch (error) {
      console.error('Password change error:', error);
      req.flash('error', 'Lỗi khi đổi mật khẩu');
      res.redirect('/profile');
    }
  }
);

/**
 * @desc    Delete account
 * @route   POST /profile/delete
 * @access  Private
 */
router.post('/delete', async (req, res) => {
  try {
    const { confirm_delete, password } = req.body;
    
    if (confirm_delete !== 'DELETE') {
      req.flash('error', 'Vui lòng nhập "DELETE" để xác nhận xóa tài khoản');
      return res.redirect('/profile');
    }

    const user = await User.findByPk(req.session.user.id);
    if (!user) {
      req.flash('error', 'Không tìm thấy người dùng');
      return res.redirect('/profile');
    }

    // Verify password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      req.flash('error', 'Mật khẩu không chính xác');
      return res.redirect('/profile');
    }

    // Soft delete - deactivate account
    user.is_active = false;
    await user.save();

    // Destroy session
    req.session.destroy();
    res.clearCookie('token');

    res.redirect('/?message=Tài khoản đã được xóa thành công');

  } catch (error) {
    console.error('Account deletion error:', error);
    req.flash('error', 'Lỗi khi xóa tài khoản');
    res.redirect('/profile');
  }
});

module.exports = router;

