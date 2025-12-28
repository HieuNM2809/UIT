const { User } = require('../models');
const { generateToken } = require('../middleware/auth');

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

