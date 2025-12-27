const express = require('express');
const { Contact } = require('../models');
const router = express.Router();

/**
 * @desc    Show Help/Support page
 * @route   GET /help
 * @access  Public
 */
router.get('/help', (req, res) => {
  res.locals.currentPath = '/help';
  res.render('pages/info/help', {
    title: 'Trợ giúp',
    pageHeader: 'Trợ giúp & Hỗ trợ',
    pageDescription: 'Tìm câu trả lời cho các câu hỏi thường gặp và hướng dẫn sử dụng StudyMate'
  });
});

/**
 * @desc    Show Contact page
 * @route   GET /contact
 * @access  Public
 */
router.get('/contact', (req, res) => {
  res.locals.currentPath = '/contact';
  res.render('pages/info/contact', {
    title: 'Liên hệ',
    pageHeader: 'Liên hệ với chúng tôi',
    pageDescription: 'Gửi câu hỏi, góp ý hoặc báo cáo lỗi cho đội ngũ StudyMate'
  });
});

/**
 * @desc    Handle Contact form submission
 * @route   POST /contact
 * @access  Public
 */
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      req.flash('error', 'Vui lòng điền đầy đủ thông tin');
      return res.redirect('/contact');
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      req.flash('error', 'Email không hợp lệ');
      return res.redirect('/contact');
    }
    
    // Message length validation
    if (message.trim().length < 10) {
      req.flash('error', 'Nội dung tin nhắn phải có ít nhất 10 ký tự');
      return res.redirect('/contact');
    }
    
    if (message.trim().length > 5000) {
      req.flash('error', 'Nội dung tin nhắn không được vượt quá 5000 ký tự');
      return res.redirect('/contact');
    }
    
    // Determine priority based on subject
    let priority = 'medium';
    if (['bug_report', 'technical_support'].includes(subject)) {
      priority = 'high';
    } else if (subject === 'general_inquiry') {
      priority = 'low';
    }
    
    // Get user ID if logged in
    const user_id = req.session.user ? req.session.user.id : null;
    
    // Get IP address and user agent
    const ip_address = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0];
    const user_agent = req.headers['user-agent'] || null;
    
    // Save to database
    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject,
      message: message.trim(),
      status: 'pending',
      priority,
      user_id,
      ip_address,
      user_agent
    });
    
    // Log for admin notification (you can add email notification here)
    console.log('New contact form submission:', {
      id: contact.id,
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      priority: contact.priority
    });
    
    req.flash('success', 'Cảm ơn bạn đã liên hệ! Chúng tôi đã nhận được tin nhắn và sẽ phản hồi trong vòng 24 giờ.');
    res.redirect('/contact');
    
  } catch (error) {
    console.error('Contact form error:', error);
    
    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      const errorMessages = error.errors.map(e => e.message).join(', ');
      req.flash('error', `Dữ liệu không hợp lệ: ${errorMessages}`);
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      req.flash('error', 'Có lỗi xảy ra khi lưu dữ liệu. Vui lòng thử lại sau.');
    } else {
      req.flash('error', 'Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
    
    res.redirect('/contact');
  }
});

/**
 * @desc    Show Privacy Policy page
 * @route   GET /privacy
 * @access  Public
 */
router.get('/privacy', (req, res) => {
  res.locals.currentPath = '/privacy';
  res.render('pages/info/privacy', {
    title: 'Chính sách bảo mật',
    pageHeader: 'Chính sách bảo mật',
    pageDescription: 'Tìm hiểu cách StudyMate thu thập, sử dụng và bảo vệ thông tin của bạn'
  });
});

/**
 * @desc    Show Terms of Service page
 * @route   GET /terms
 * @access  Public
 */
router.get('/terms', (req, res) => {
  res.locals.currentPath = '/terms';
  res.render('pages/info/terms', {
    title: 'Điều khoản sử dụng',
    pageHeader: 'Điều khoản sử dụng',
    pageDescription: 'Điều khoản và điều kiện sử dụng nền tảng StudyMate'
  });
});

module.exports = router;
