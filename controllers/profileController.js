const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');
const { User } = require('../models');

// Create avatars directory if it doesn't exist
const avatarsDir = path.join(__dirname, '../uploads/avatars');
const ensureAvatarsDir = async () => {
  try {
    await fs.access(avatarsDir);
  } catch {
    await fs.mkdir(avatarsDir, { recursive: true });
  }
};

// Multer configuration for avatar upload
const avatarStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await ensureAvatarsDir();
      console.log('Multer destination:', avatarsDir);
      cb(null, avatarsDir);
    } catch (error) {
      console.error('Error ensuring avatars directory:', error);
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename: avatar-userId-timestamp.ext
    const userId = req.session.user?.id || 'unknown';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${userId}-${uniqueSuffix}${ext}`);
  }
});

// File filter - only images
const avatarFileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)'), false);
  }
};

// Multer upload middleware for avatar
const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: avatarFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit for avatars
  }
}).single('avatar');

/**
 * Show user profile
 */
exports.index = async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user.id);
    res.locals.currentPath = '/profile';
    res.render('pages/profile/index', {
      title: 'Hồ sơ cá nhân',
      pageHeader: 'Hồ sơ cá nhân',
      pageDescription: 'Quản lý thông tin cá nhân và cài đặt tài khoản',
      user: user ? user.toSafeObject() : req.session.user
    });
  } catch (error) {
    console.error('Profile index error:', error);
    res.locals.currentPath = '/profile';
    res.render('pages/profile/index', {
      title: 'Hồ sơ cá nhân',
      pageHeader: 'Hồ sơ cá nhân',
      pageDescription: 'Quản lý thông tin cá nhân và cài đặt tài khoản',
      user: req.session.user
    });
  }
};

/**
 * Update profile
 */
exports.update = async (req, res) => {
  try {
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
};

/**
 * Change password
 */
exports.changePassword = async (req, res) => {
  try {
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
};

/**
 * Delete account
 */
exports.delete = async (req, res) => {
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
};

/**
 * Upload avatar
 */
exports.uploadAvatar = async (req, res) => {
  try {
    // Use multer middleware
    uploadAvatar(req, res, async (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            req.flash('error', 'Kích thước file quá lớn. Vui lòng chọn file nhỏ hơn 5MB');
          } else {
            req.flash('error', 'Lỗi khi upload file: ' + err.message);
          }
        } else {
          req.flash('error', err.message || 'Lỗi khi upload avatar');
        }
        return res.redirect('/profile');
      }

      if (!req.file) {
        req.flash('error', 'Vui lòng chọn file ảnh');
        return res.redirect('/profile');
      }

      try {
        const user = await User.findByPk(req.session.user.id);
        if (!user) {
          // Clean up uploaded file
          await fs.unlink(req.file.path);
          req.flash('error', 'Không tìm thấy người dùng');
          return res.redirect('/profile');
        }

        // Process and resize avatar
        const avatarPath = req.file.path;
        const fileExt = path.extname(avatarPath);
        const fileBaseName = path.basename(avatarPath, fileExt);
        let finalPath = path.join(path.dirname(avatarPath), `${fileBaseName}.jpg`);
        
        try {
          // Resize to 400x400 (square, cover mode) directly to final path
          await sharp(avatarPath)
            .resize(400, 400, { 
              fit: 'cover',
              position: 'center'
            })
            .jpeg({ quality: 85 })
            .toFile(finalPath);

          // Delete original file if it's different from final path
          if (avatarPath !== finalPath) {
            try {
              await fs.unlink(avatarPath);
            } catch (unlinkError) {
              console.error('Error deleting original file:', unlinkError);
            }
          }
        } catch (sharpError) {
          console.error('Sharp resize error:', sharpError);
          // If resize fails, use original file
          if (avatarPath !== finalPath) {
            try {
              // Copy original to final path if resize failed
              await fs.copyFile(avatarPath, finalPath);
              await fs.unlink(avatarPath);
            } catch (copyError) {
              console.error('Error copying file:', copyError);
              // Use original path if copy fails
              finalPath = avatarPath;
            }
          } else {
            finalPath = avatarPath;
          }

        }
        
        // Verify final file exists
        try {
          await fs.access(finalPath);
        } catch (accessError) {
          console.error('Final avatar file does not exist:', finalPath);
          throw new Error('Failed to create avatar file');
        }
        
        // Generate URL for avatar (ensure it starts with /)
        const avatarUrl = `/uploads/avatars/${path.basename(finalPath)}`;
        
        console.log('Avatar file saved at:', finalPath);
        console.log('Avatar URL:', avatarUrl);

        // Delete old avatar if exists
        if (user.avatar) {
          const oldAvatarPath = path.join(__dirname, '../', user.avatar.replace(/^\//, ''));
          try {
            await fs.unlink(oldAvatarPath);
          } catch (unlinkError) {
            // Ignore if old file doesn't exist
            console.log('Old avatar not found:', oldAvatarPath);
          }
        }

        // Update user avatar
        user.avatar = avatarUrl;
        await user.save();

        // Reload user from database to ensure we have the latest data
        await user.reload();

        // Update session with fresh user data
        req.session.user = user.toSafeObject();

        console.log('Avatar updated successfully:', avatarUrl);
        console.log('Session user avatar:', req.session.user.avatar);

        req.flash('success', 'Cập nhật avatar thành công!');
        res.redirect('/profile');

      } catch (error) {
        // Clean up uploaded file on error
        if (req.file && req.file.path) {
          try {
            await fs.unlink(req.file.path);
          } catch (unlinkError) {
            console.error('Error cleaning up file:', unlinkError);
          }
        }
        console.error('Avatar upload error:', error);
        req.flash('error', 'Lỗi khi xử lý avatar');
        res.redirect('/profile');
      }
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    req.flash('error', 'Lỗi khi upload avatar');
    res.redirect('/profile');
  }
};


