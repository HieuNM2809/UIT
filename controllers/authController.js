const { User, PasswordResetToken } = require('../models');
const { generateToken } = require('../middleware/auth');
const { sendPasswordResetEmail, sendPasswordResetSuccessEmail } = require('../services/emailService');

/**
 * Show login form
 */
exports.showLogin = (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  
  res.locals.currentPath = '/auth/login';
  res.render('pages/auth/login', {
    title: 'Đăng nhập',
    pageHeader: 'Đăng nhập',
    pageDescription: 'Đăng nhập vào tài khoản StudyMate của bạn'
  });
};

/**
 * Process login
 */
exports.login = async (req, res) => {
  try {
    const { email, password, remember_me } = req.body;

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      req.flash('error', 'Email hoặc mật khẩu không chính xác');
      return res.redirect('/auth/login');
    }

    // Check password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      req.flash('error', 'Email hoặc mật khẩu không chính xác');
      return res.redirect('/auth/login');
    }

    // Check if user is active
    if (!user.is_active) {
      req.flash('error', 'Tài khoản đã bị vô hiệu hóa');
      return res.redirect('/auth/login');
    }

    // Update last login
    user.last_login = new Date();
    user.login_count = (user.login_count || 0) + 1;
    await user.save();

    // Set session
    req.session.user = user.toSafeObject();
    
    // Set cookie for API calls
    const token = generateToken({ 
      userId: user.id, 
      email: user.email, 
      role: user.role 
    }, remember_me ? '7d' : '24h');
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: remember_me ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
    });

    req.flash('success', `Chào mừng ${user.full_name}!`);
    
    // Redirect to intended page or dashboard
    const redirectTo = req.session.redirectTo || '/dashboard';
    delete req.session.redirectTo;
    res.redirect(redirectTo);

  } catch (error) {
    console.error('Login error:', error);
    req.flash('error', 'Đã xảy ra lỗi khi đăng nhập');
    res.redirect('/auth/login');
  }
};

/**
 * Show register form
 */
exports.showRegister = (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  
  res.locals.currentPath = '/auth/register';
  res.render('pages/auth/register', {
    title: 'Đăng ký',
    pageHeader: 'Đăng ký tài khoản',
    pageDescription: 'Tạo tài khoản StudyMate mới'
  });
};

/**
 * Process registration
 */
exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, password, student_id, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      req.flash('error', 'Email này đã được sử dụng');
      return res.redirect('/auth/register');
    }

    // Check student ID if provided
    if (student_id) {
      const existingStudent = await User.findOne({ where: { student_id } });
      if (existingStudent) {
        req.flash('error', 'MSSV này đã được sử dụng');
        return res.redirect('/auth/register');
      }
    }

    // Create user
    const user = await User.create({
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: email.toLowerCase(),
      password,
      student_id: student_id ? student_id.trim() : null,
      role: role && ['student', 'teacher', 'lecturer'].includes(role) ? role : 'student',
      is_active: true
    });

    req.flash('success', 'Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
    res.redirect('/auth/login');

  } catch (error) {
    console.error('Registration error:', error);
    req.flash('error', 'Đã xảy ra lỗi khi đăng ký');
    res.redirect('/auth/register');
  }
};

/**
 * Logout
 */
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.clearCookie('token');
    res.redirect('/?message=Đã đăng xuất thành công');
  });
};

/**
 * Show forgot password form
 */
exports.showForgotPassword = (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  
  res.locals.currentPath = '/auth/forgot-password';
  res.render('pages/auth/forgot-password', {
    title: 'Quên mật khẩu',
    pageHeader: 'Quên mật khẩu',
    pageDescription: 'Nhập email của bạn để nhận link đặt lại mật khẩu'
  });
};

/**
 * Process forgot password request
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findByEmail(email);
    
    // Always return success message (security best practice - don't reveal if email exists)
    if (!user) {
      req.flash('success', 'Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu trong vài phút.');
      return res.redirect('/auth/login');
    }

    // Check if user is active
    if (!user.is_active) {
      req.flash('success', 'Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu trong vài phút.');
      return res.redirect('/auth/login');
    }

    // Generate reset token
    const token = PasswordResetToken.generateToken();
    
    // Invalidate old tokens for this user
    await PasswordResetToken.update(
      { used: true },
      { where: { user_id: user.id, used: false } }
    );

    // Create new reset token
    const resetToken = await PasswordResetToken.create({
      user_id: user.id,
      token: token,
      expires_at: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    });

    // Generate reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/auth/reset-password/${token}`;

    // Send email (will log to console if email fails)
    const emailResult = await sendPasswordResetEmail(user.email, token, resetUrl);
    
    // Log if email failed but don't fail the request
    if (!emailResult.success) {
      console.warn('Email sending failed, but reset token created. Check console for reset link.');
    }

    req.flash('success', 'Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu trong vài phút.');
    res.redirect('/auth/login');

  } catch (error) {
    console.error('Forgot password error:', error);
    req.flash('error', 'Đã xảy ra lỗi. Vui lòng thử lại sau.');
    res.redirect('/auth/forgot-password');
  }
};

/**
 * Show reset password form
 */
exports.showResetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    // Find valid token
    const resetToken = await PasswordResetToken.findValidToken(token);

    if (!resetToken || !resetToken.isValid()) {
      req.flash('error', 'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.');
      return res.redirect('/auth/forgot-password');
    }

    res.locals.currentPath = '/auth/reset-password';
    res.render('pages/auth/reset-password', {
      title: 'Đặt lại mật khẩu',
      pageHeader: 'Đặt lại mật khẩu',
      pageDescription: 'Nhập mật khẩu mới cho tài khoản của bạn',
      token: token
    });

  } catch (error) {
    console.error('Show reset password error:', error);
    req.flash('error', 'Đã xảy ra lỗi. Vui lòng thử lại.');
    res.redirect('/auth/forgot-password');
  }
};

/**
 * Process reset password
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find valid token
    const resetToken = await PasswordResetToken.findValidToken(token);

    if (!resetToken || !resetToken.isValid()) {
      req.flash('error', 'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.');
      return res.redirect('/auth/forgot-password');
    }

    // Get user
    const user = await User.findByPk(resetToken.user_id);
    if (!user) {
      req.flash('error', 'Người dùng không tồn tại.');
      return res.redirect('/auth/forgot-password');
    }

    // Update user password (User model hook will hash it automatically)
    user.password = password;
    await user.save();

    // Mark token as used
    resetToken.used = true;
    await resetToken.save();

    // Invalidate all other tokens for this user
    await PasswordResetToken.update(
      { used: true },
      { where: { user_id: user.id, used: false } }
    );

    // Send success email
    await sendPasswordResetSuccessEmail(user.email);

    req.flash('success', 'Mật khẩu đã được đặt lại thành công! Bạn có thể đăng nhập ngay bây giờ.');
    res.redirect('/auth/login');

  } catch (error) {
    console.error('Reset password error:', error);
    req.flash('error', 'Đã xảy ra lỗi khi đặt lại mật khẩu. Vui lòng thử lại.');
    res.redirect('/auth/forgot-password');
  }
};

