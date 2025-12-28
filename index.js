require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Local imports
const { connectDB } = require('./config/database');
const { connectRedis } = require('./config/redis');
const { logger, morganLogger, applicationLogger } = require('./config/logger');

// Import middleware
const authMiddleware = require('./middleware/auth');
const { errorHandler } = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const contentRoutes = require('./routes/content');
const statisticsRoutes = require('./routes/statistics');
const aiRoutes = require('./routes/ai');
const fileRoutes = require('./routes/files');

// Create Express application
const app = express();

// Constants
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:5173'
    ];
    
    if (NODE_ENV === 'production') {
      allowedOrigins.push('https://studymate-app.com'); // Replace with your domain
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60 // 15 minutes in seconds
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

if (NODE_ENV === 'production') {
  app.use('/api/', limiter);
}

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'studymate-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// Morgan logging middleware
const morganFormat = NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, {
  stream: {
    write: (message) => morganLogger.http(message.trim())
  }
}));

// Static files middleware
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
    message: 'StudyMate API is running successfully'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware.authenticate, userRoutes);
app.use('/api/courses', authMiddleware.authenticate, courseRoutes);
app.use('/api/content', authMiddleware.authenticate, contentRoutes);
app.use('/api/statistics', authMiddleware.authenticate, statisticsRoutes);
app.use('/api/ai', authMiddleware.authenticate, aiRoutes);
app.use('/api/files', authMiddleware.authenticate, fileRoutes);

// Serve React frontend in production
if (NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = (signal) => {
  applicationLogger.system(`Received ${signal}. Starting graceful shutdown...`);
  
  server.close((err) => {
    if (err) {
      applicationLogger.error('Error during graceful shutdown', err);
      process.exit(1);
    }
    
    applicationLogger.system('HTTP server closed');
    process.exit(0);
  });
  
  // Force shutdown after 30 seconds
  setTimeout(() => {
    applicationLogger.error('Force shutdown');
    process.exit(1);
  }, 30000);
};

// Initialize application
const initializeApp = async () => {
  try {
    // Connect to databases
    await connectDB();
    await connectRedis();
    
    applicationLogger.system('✓ All database connections established');
    
    // Start server
    const server = app.listen(PORT, () => {
      applicationLogger.system(`
╭─────────────────────────────────────────────╮
│               StudyMate API                 │
│                                             │
│  🎓 Ứng dụng học tập thông minh            │
│  📚 University of Information Technology    │
│  🏛️  VNU-HCM                              │
│                                             │
│  🚀 Server: http://localhost:${PORT}        │
│  🌍 Environment: ${NODE_ENV}                │
│  📊 Health: http://localhost:${PORT}/health │
│                                             │
│  👨‍💻 Developers:                            │
│     • Nguyễn Minh Hiếu (24410158)          │
│     • Lê Anh Kiệt (24410183)               │
│  👨‍🏫 Supervisor: ThS. Phạm Thế Sơn          │
╰─────────────────────────────────────────────╯
      `);
    });
    
    // Handle graceful shutdown
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    return server;
    
  } catch (error) {
    applicationLogger.error('Failed to initialize application', error);
    process.exit(1);
  }
};

// Start the application
let server;
if (require.main === module) {
  initializeApp().then((s) => {
    server = s;
  });
}

module.exports = { app, initializeApp };
