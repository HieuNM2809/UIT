require('dotenv').config();

const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

// Import configurations
const { connectDB } = require('./config/database');
const { connectRedis } = require('./config/redis');
const { logger } = require('./config/logger');

// Import routes
const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const dashboardRoutes = require('./routes/dashboard');
const profileRoutes = require('./routes/profile');
const infoRoutes = require('./routes/info');
const adminRoutes = require('./routes/admin');
const chatRoutes = require('./routes/chat');
const commentRoutes = require('./routes/comments');
const blogRoutes = require('./routes/blogs');

// Import API routes
// const apiAuthRoutes = require('./routes/api/auth');
// const apiCoursesRoutes = require('./routes/api/courses');
// const apiUsersRoutes = require('./routes/api/users');
// const apiStatsRoutes = require('./routes/api/statistics');
// const apiAIRoutes = require('./routes/api/ai');

// Import middleware
const { authenticate, requireLogin, requireAdmin } = require('./middleware/auth');
const { errorHandler } = require('./middleware/errorHandler');

// Import API routes (for enrollment and other API endpoints)
const contentRoutes = require('./routes/content');
const statisticsRoutes = require('./routes/statistics');
const aiRoutes = require('./routes/ai');
const fileRoutes = require('./routes/files');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com", "https://cdn.ckeditor.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net", "https://cdn.ckeditor.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://unpkg.com", "https://cdn.tailwindcss.com", "https://cdn.ckeditor.com"],
      scriptSrcAttr: ["'unsafe-inline'"], // Allow inline event handlers
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://api.openai.com"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// Compression
app.use(compression());

// Logging
app.use(morgan('combined', {
  stream: { write: message => logger.info(message.trim()) }
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(methodOverride('_method'));

// Cookie and session
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'studymate-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// Flash messages
app.use(flash());

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Global variables for views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.warning = req.flash('warning');
  res.locals.info = req.flash('info');
  res.locals.currentYear = new Date().getFullYear();
  res.locals.appName = 'StudyMate';
  next();
});

// Routes
app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/courses', coursesRoutes);
app.use('/dashboard', requireLogin, dashboardRoutes);
app.use('/profile', requireLogin, profileRoutes);
app.use('/chat', chatRoutes);
app.use('/admin', requireLogin, requireAdmin, adminRoutes);

// Info routes (public)
app.use('/', infoRoutes);

// API Routes
app.use('/api/courses', authenticate, coursesRoutes);
app.use('/api/content', authenticate, contentRoutes);
app.use('/api/statistics', authenticate, statisticsRoutes);
app.use('/api/ai', authenticate, aiRoutes);
app.use('/api/files', authenticate, fileRoutes);
app.use('/comments', commentRoutes);
app.use('/blogs', blogRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).render('error', {
    title: 'Trang không tìm thấy',
    error: {
      status: 404,
      message: 'Trang bạn tìm kiếm không tồn tại',
      details: 'Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.'
    }
  });
});

// Error handler
app.use(errorHandler);

// Database initialization
const initializeApp = async () => {
  try {
    await connectDB();
    await connectRedis();
    
    console.log(`
╭─────────────────────────────────────────────────────╮
│                  🎓 StudyMate                      │
│            Ứng dụng học tập thông minh             │
│                                                     │
│  🏛️  Trường Đại học Công nghệ Thông tin           │
│  🌍  Đại học Quốc gia TP. Hồ Chí Minh             │
│                                                     │
│  🚀 Server: http://localhost:${PORT}                │
│  📊 Health: http://localhost:${PORT}/health         │
│                                                     │
│  👨‍💻 Phát triển bởi:                               │
│     • Nguyễn Minh Hiếu (24410158)                  │
│     • Lê Anh Kiệt (24410183)                       │
│  👨‍🏫 Giáo viên hướng dẫn: ThS. Phạm Thế Sơn      │
╰─────────────────────────────────────────────────────╯
    `);
    
  } catch (error) {
    console.error('Lỗi khởi tạo ứng dụng:', error);
    process.exit(1);
  }
};

// Start server
if (require.main === module) {
  initializeApp().then(() => {
    app.listen(PORT, () => {
      console.log(`🌟 StudyMate đang chạy tại http://localhost:${PORT}`);
    });
  });
}

module.exports = app;

