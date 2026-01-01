const { User, PasswordResetToken, EmailVerification } = require('../models');
const { generateToken } = require('../middleware/auth');
const { sendPasswordResetEmail, sendPasswordResetSuccessEmail, sendVerificationOTP } = require('../services/emailService');

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
    pageDescription: 'Đăng nhập vào tài khoản StudyMate của bạn',
    googleAuthEnabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
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
      req.flash('error', 'Tài khoản đã bị vô hiệu hóa hoặc chưa được kích hoạt');
      return res.redirect('/auth/login');
    }

    // Check if email is verified
    if (!user.email_verified) {
      // Resend OTP if not verified
      const verification = await EmailVerification.findByUserId(user.id);
      if (verification && !verification.is_verified) {
        req.flash('error', 'Email chưa được xác nhận. Vui lòng kiểm tra email để lấy mã OTP.');
        req.session.pendingVerification = {
          user_id: user.id,
          email: user.email
        };
        return res.redirect('/auth/verify-email');
      } else {
        // Generate new OTP
        const otpCode = EmailVerification.generateOTP();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        
        await EmailVerification.create({
          user_id: user.id,
          email: user.email,
          otp_code: otpCode,
          expires_at: expiresAt
        });
        
        await sendVerificationOTP(user.email, otpCode, user.full_name);
        
        req.flash('error', 'Email chưa được xác nhận. Mã OTP mới đã được gửi đến email của bạn.');
        req.session.pendingVerification = {
          user_id: user.id,
          email: user.email
        };
        return res.redirect('/auth/verify-email');
      }
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

    // Create user (inactive until email verified)
    const user = await User.create({
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: email.toLowerCase(),
      password,
      student_id: student_id ? student_id.trim() : null,
      role: role && ['student', 'teacher', 'lecturer'].includes(role) ? role : 'student',
      is_active: false, // Will be activated after email verification
      email_verified: false
    });

    // Generate OTP
    const otpCode = EmailVerification.generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Invalidate old verification codes for this user
    await EmailVerification.update(
      { is_verified: true }, // Mark as used
      { where: { user_id: user.id, is_verified: false } }
    );

    // Create new verification record
    await EmailVerification.create({
      user_id: user.id,
      email: user.email,
      otp_code: otpCode,
      expires_at: expiresAt
    });

    // Send OTP email
    await sendVerificationOTP(user.email, otpCode, user.full_name);

    // Store user_id in session for verification step
    req.session.pendingVerification = {
      user_id: user.id,
      email: user.email
    };

    req.flash('success', 'Đăng ký thành công! Vui lòng kiểm tra email để lấy mã OTP xác nhận.');
    res.redirect('/auth/verify-email');

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

/**
 * Show email verification form
 */
exports.showVerifyEmail = async (req, res) => {
  try {
    const pendingVerification = req.session.pendingVerification;
    
    if (!pendingVerification || !pendingVerification.user_id) {
      req.flash('error', 'Không tìm thấy thông tin xác nhận. Vui lòng đăng ký lại.');
      return res.redirect('/auth/register');
    }

    // Check if already verified
    const user = await User.findByPk(pendingVerification.user_id);
    if (user && user.email_verified) {
      req.flash('success', 'Email đã được xác nhận. Bạn có thể đăng nhập ngay bây giờ.');
      delete req.session.pendingVerification;
      return res.redirect('/auth/login');
    }

    res.locals.currentPath = '/auth/verify-email';
    res.render('pages/auth/verify-email', {
      title: 'Xác nhận email',
      pageHeader: 'Xác nhận email',
      pageDescription: 'Nhập mã OTP đã được gửi đến email của bạn',
      email: pendingVerification.email,
      user_id: pendingVerification.user_id
    });
  } catch (error) {
    console.error('Show verify email error:', error);
    req.flash('error', 'Đã xảy ra lỗi. Vui lòng thử lại.');
    res.redirect('/auth/register');
  }
};

/**
 * Process email verification with OTP
 */
exports.verifyEmail = async (req, res) => {
  try {
    const { otp_code, user_id } = req.body;
    const pendingVerification = req.session.pendingVerification;

    if (!pendingVerification || !pendingVerification.user_id) {
      req.flash('error', 'Phiên xác nhận đã hết hạn. Vui lòng đăng ký lại.');
      return res.redirect('/auth/register');
    }

    // Validate OTP format
    if (!otp_code || !/^\d{6}$/.test(otp_code)) {
      req.flash('error', 'Mã OTP không hợp lệ. Vui lòng nhập 6 chữ số.');
      return res.redirect('/auth/verify-email');
    }

    // Find user
    const user = await User.findByPk(pendingVerification.user_id);
    if (!user) {
      req.flash('error', 'Người dùng không tồn tại.');
      delete req.session.pendingVerification;
      return res.redirect('/auth/register');
    }

    // Check if already verified
    if (user.email_verified) {
      req.flash('success', 'Email đã được xác nhận. Bạn có thể đăng nhập ngay bây giờ.');
      delete req.session.pendingVerification;
      return res.redirect('/auth/login');
    }

    // Find verification record
    const verification = await EmailVerification.findByUserId(user.id);
    
    if (!verification) {
      req.flash('error', 'Không tìm thấy mã xác nhận. Vui lòng yêu cầu gửi lại mã OTP.');
      return res.redirect('/auth/verify-email');
    }

    // Verify OTP
    const isValid = verification.verifyOTP(otp_code);
    await verification.save();

    if (!isValid) {
      if (verification.attempts >= 5) {
        req.flash('error', 'Bạn đã vượt quá số lần thử. Vui lòng yêu cầu gửi lại mã OTP.');
        return res.redirect('/auth/resend-otp');
      }
      
      if (new Date() >= verification.expires_at) {
        req.flash('error', 'Mã OTP đã hết hạn. Vui lòng yêu cầu gửi lại mã OTP.');
        return res.redirect('/auth/resend-otp');
      }
      
      req.flash('error', `Mã OTP không chính xác. Bạn còn ${5 - verification.attempts} lần thử.`);
      return res.redirect('/auth/verify-email');
    }

    // Activate user account
    user.email_verified = true;
    user.email_verified_at = new Date();
    user.is_active = true;
    await user.save();

    // Clear pending verification
    delete req.session.pendingVerification;

    req.flash('success', 'Email đã được xác nhận thành công! Bạn có thể đăng nhập ngay bây giờ.');
    res.redirect('/auth/login');

  } catch (error) {
    console.error('Verify email error:', error);
    req.flash('error', 'Đã xảy ra lỗi khi xác nhận email. Vui lòng thử lại.');
    res.redirect('/auth/verify-email');
  }
};

/**
 * Resend OTP code
 */
exports.resendOTP = async (req, res) => {
  try {
    const pendingVerification = req.session.pendingVerification;
    
    if (!pendingVerification || !pendingVerification.user_id) {
      req.flash('error', 'Không tìm thấy thông tin xác nhận. Vui lòng đăng ký lại.');
      return res.redirect('/auth/register');
    }

    const user = await User.findByPk(pendingVerification.user_id);
    if (!user) {
      req.flash('error', 'Người dùng không tồn tại.');
      delete req.session.pendingVerification;
      return res.redirect('/auth/register');
    }

    // Check if already verified
    if (user.email_verified) {
      req.flash('success', 'Email đã được xác nhận. Bạn có thể đăng nhập ngay bây giờ.');
      delete req.session.pendingVerification;
      return res.redirect('/auth/login');
    }

    // Generate new OTP
    const otpCode = EmailVerification.generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Invalidate old verification codes
    await EmailVerification.update(
      { is_verified: true },
      { where: { user_id: user.id, is_verified: false } }
    );

    // Create new verification record
    await EmailVerification.create({
      user_id: user.id,
      email: user.email,
      otp_code: otpCode,
      expires_at: expiresAt
    });

    // Send OTP email
    await sendVerificationOTP(user.email, otpCode, user.full_name);

    req.flash('success', 'Mã OTP mới đã được gửi đến email của bạn. Vui lòng kiểm tra.');
    res.redirect('/auth/verify-email');

  } catch (error) {
    console.error('Resend OTP error:', error);
    req.flash('error', 'Đã xảy ra lỗi khi gửi lại mã OTP. Vui lòng thử lại.');
    res.redirect('/auth/verify-email');
  }
};

/**
 * Initiate Google OAuth login
 */
exports.googleLogin = (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    req.flash('error', 'Đăng nhập Google chưa được cấu hình');
    return res.redirect('/auth/login');
  }
  
  const passport = require('../config/passport');
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })(req, res, next);
};

/**
 * Google OAuth callback
 */
exports.googleCallback = async (req, res, next) => {
  const passport = require('../config/passport');
  const { generateToken } = require('../middleware/auth');
  
  passport.authenticate('google', async (err, user, info) => {
    try {
      if (err) {
        console.error('Google OAuth error:', err);
        req.flash('error', 'Đã xảy ra lỗi khi đăng nhập với Google');
        return res.redirect('/auth/login');
      }

      if (!user) {
        req.flash('error', 'Không thể xác thực với Google');
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
      }, '7d');
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      req.flash('success', `Chào mừng ${user.full_name}!`);
      
      // Redirect to intended page or dashboard
      const redirectTo = req.session.redirectTo || '/dashboard';
      delete req.session.redirectTo;
      res.redirect(redirectTo);

    } catch (error) {
      console.error('Google callback error:', error);
      req.flash('error', 'Đã xảy ra lỗi khi đăng nhập');
      res.redirect('/auth/login');
    }
  })(req, res, next);
};

