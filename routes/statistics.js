const express = require('express');
const { Op } = require('sequelize');

const { 
  User, 
  Course, 
  Enrollment, 
  Progress, 
  Content,
  Rating,
  ActivityLog,
  AIInteraction
} = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { AppError, asyncHandler } = require('../middleware/errorHandler');
const { applicationLogger } = require('../config/logger');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/statistics/dashboard
 * @access  Private
 */
router.get('/dashboard', asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Get user's enrollment statistics
  const enrollmentStats = await Enrollment.findAll({
    where: { user_id: userId },
    attributes: [
      'status',
      [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
      [require('sequelize').fn('AVG', require('sequelize').col('progress_percentage')), 'avg_progress'],
      [require('sequelize').fn('SUM', require('sequelize').col('total_time_spent')), 'total_time']
    ],
    group: ['status'],
    raw: true
  });

  // Get recent progress
  const recentProgress = await Progress.findAll({
    where: { user_id: userId },
    include: [
      {
        model: Content,
        as: 'content',
        attributes: ['id', 'title', 'content_type'],
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'title', 'thumbnail']
          }
        ]
      }
    ],
    order: [['updated_at', 'DESC']],
    limit: 10
  });

  // Get achievements/milestones
  const completedCourses = await Enrollment.count({
    where: { user_id: userId, status: 'completed' }
  });

  const totalTimeSpent = await Enrollment.sum('total_time_spent', {
    where: { user_id: userId }
  });

  const completedContents = await Progress.count({
    where: { user_id: userId, status: 'completed' }
  });

  // Get learning streak (simplified)
  const recentActivity = await Progress.findAll({
    where: {
      user_id: userId,
      updated_at: {
        [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
      }
    },
    attributes: [
      [require('sequelize').fn('DATE', require('sequelize').col('updated_at')), 'date'],
      [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'activity_count']
    ],
    group: [require('sequelize').fn('DATE', require('sequelize').col('updated_at'))],
    order: [[require('sequelize').fn('DATE', require('sequelize').col('updated_at')), 'DESC']],
    raw: true
  });

  const stats = {
    enrollments: enrollmentStats.reduce((acc, stat) => {
      acc[stat.status] = {
        count: parseInt(stat.count),
        avg_progress: parseFloat(stat.avg_progress) || 0,
        total_time: parseInt(stat.total_time) || 0
      };
      return acc;
    }, {}),
    achievements: {
      completed_courses: completedCourses || 0,
      total_time_spent: totalTimeSpent || 0,
      completed_contents: completedContents || 0,
      learning_days: recentActivity.length || 0
    },
    recent_progress: recentProgress.slice(0, 5),
    activity_chart: recentActivity.slice(0, 14) // Last 14 days
  };

  applicationLogger.api(`Dashboard stats accessed by ${req.user.email}`);

  res.json({
    success: true,
    data: { stats }
  });
}));

/**
 * @desc    Get learning analytics
 * @route   GET /api/statistics/learning
 * @access  Private
 */
router.get('/learning', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { period = '30' } = req.query; // days

  const daysAgo = parseInt(period);
  const startDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

  // Learning time trends
  const timeSpentTrend = await Progress.findAll({
    where: {
      user_id: userId,
      updated_at: { [Op.gte]: startDate }
    },
    attributes: [
      [require('sequelize').fn('DATE', require('sequelize').col('updated_at')), 'date'],
      [require('sequelize').fn('SUM', require('sequelize').col('time_spent')), 'total_time']
    ],
    group: [require('sequelize').fn('DATE', require('sequelize').col('updated_at'))],
    order: [[require('sequelize').fn('DATE', require('sequelize').col('updated_at')), 'ASC']],
    raw: true
  });

  // Content type distribution
  const contentTypeStats = await Progress.findAll({
    where: { user_id: userId },
    include: [
      {
        model: Content,
        as: 'content',
        attributes: ['content_type']
      }
    ],
    attributes: [
      [require('sequelize').fn('COUNT', require('sequelize').col('Progress.id')), 'count']
    ],
    group: ['content.content_type'],
    raw: true
  });

  // Difficulty level progress
  const difficultyStats = await Progress.findAll({
    where: { user_id: userId },
    include: [
      {
        model: Content,
        as: 'content',
        attributes: ['difficulty_level']
      }
    ],
    attributes: [
      [require('sequelize').fn('COUNT', require('sequelize').col('Progress.id')), 'count'],
      [require('sequelize').fn('AVG', require('sequelize').col('Progress.progress_percentage')), 'avg_progress']
    ],
    group: ['content.difficulty_level'],
    raw: true
  });

  const analytics = {
    time_spent_trend: timeSpentTrend,
    content_types: contentTypeStats.map(stat => ({
      type: stat['content.content_type'],
      count: parseInt(stat.count)
    })),
    difficulty_progress: difficultyStats.map(stat => ({
      difficulty: stat['content.difficulty_level'],
      count: parseInt(stat.count),
      avg_progress: parseFloat(stat.avg_progress) || 0
    }))
  };

  res.json({
    success: true,
    data: { analytics }
  });
}));

/**
 * @desc    Get admin statistics (Admin only)
 * @route   GET /api/statistics/admin
 * @access  Private/Admin
 */
router.get('/admin',
  authorize('admin', 'system_admin'),
  asyncHandler(async (req, res) => {
    // Overall platform statistics
    const totalUsers = await User.count({ where: { is_active: true } });
    const totalCourses = await Course.count({ where: { status: 'published' } });
    const totalEnrollments = await Enrollment.count();
    const totalContent = await Content.count({ where: { status: 'published' } });

    // User registrations trend (last 30 days)
    const registrationTrend = await User.findAll({
      where: {
        created_at: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      },
      attributes: [
        [require('sequelize').fn('DATE', require('sequelize').col('created_at')), 'date'],
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: [require('sequelize').fn('DATE', require('sequelize').col('created_at'))],
      order: [[require('sequelize').fn('DATE', require('sequelize').col('created_at')), 'ASC']],
      raw: true
    });

    // Enrollment trends
    const enrollmentTrend = await Enrollment.findAll({
      where: {
        created_at: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      },
      attributes: [
        [require('sequelize').fn('DATE', require('sequelize').col('created_at')), 'date'],
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: [require('sequelize').fn('DATE', require('sequelize').col('created_at'))],
      order: [[require('sequelize').fn('DATE', require('sequelize').col('created_at')), 'ASC']],
      raw: true
    });

    // Popular courses
    const popularCourses = await Course.findAll({
      order: [['enrolled_count', 'DESC'], ['average_rating', 'DESC']],
      limit: 10,
      attributes: ['id', 'title', 'enrolled_count', 'average_rating', 'rating_count'],
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['first_name', 'last_name']
        }
      ]
    });

    // User role distribution
    const userRoleStats = await User.findAll({
      where: { is_active: true },
      attributes: [
        'role',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['role'],
      raw: true
    });

    // AI interaction statistics
    const aiStats = await AIInteraction.findAll({
      attributes: [
        'interaction_type',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
        [require('sequelize').fn('AVG', require('sequelize').col('tokens_used')), 'avg_tokens']
      ],
      group: ['interaction_type'],
      raw: true
    });

    const adminStats = {
      overview: {
        total_users: totalUsers,
        total_courses: totalCourses,
        total_enrollments: totalEnrollments,
        total_content: totalContent
      },
      trends: {
        user_registrations: registrationTrend,
        enrollments: enrollmentTrend
      },
      popular_courses: popularCourses,
      user_roles: userRoleStats.reduce((acc, stat) => {
        acc[stat.role] = parseInt(stat.count);
        return acc;
      }, {}),
      ai_usage: aiStats.reduce((acc, stat) => {
        acc[stat.interaction_type] = {
          count: parseInt(stat.count),
          avg_tokens: parseInt(stat.avg_tokens) || 0
        };
        return acc;
      }, {})
    };

    applicationLogger.api(`Admin statistics accessed by ${req.user.email}`);

    res.json({
      success: true,
      data: { stats: adminStats }
    });
  })
);

/**
 * @desc    Get course statistics (Instructor or Admin)
 * @route   GET /api/statistics/course/:id
 * @access  Private
 */
router.get('/course/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);

  if (!course) {
    throw new AppError('Course not found', 404, 'COURSE_NOT_FOUND');
  }

  // Check permissions
  if (course.instructor_id !== req.user.id && !req.user.isAdmin()) {
    throw new AppError('Not authorized to view course statistics', 403, 'NOT_AUTHORIZED');
  }

  // Enrollment statistics
  const enrollmentStats = await Enrollment.findAll({
    where: { course_id: course.id },
    attributes: [
      'status',
      [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
      [require('sequelize').fn('AVG', require('sequelize').col('progress_percentage')), 'avg_progress']
    ],
    group: ['status'],
    raw: true
  });

  // Content engagement
  const contentEngagement = await Content.findAll({
    where: { course_id: course.id },
    attributes: [
      'id',
      'title',
      'content_type',
      'view_count',
      'completion_count'
    ],
    order: [['view_count', 'DESC']],
    limit: 10
  });

  // Rating distribution
  const ratingDistribution = await Rating.findAll({
    where: { course_id: course.id },
    attributes: [
      'rating',
      [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
    ],
    group: ['rating'],
    order: [['rating', 'ASC']],
    raw: true
  });

  // Recent reviews
  const recentReviews = await Rating.findAll({
    where: { course_id: course.id },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['first_name', 'last_name']
      }
    ],
    order: [['created_at', 'DESC']],
    limit: 5
  });

  // Progress over time
  const progressTrend = await Progress.findAll({
    where: { course_id: course.id },
    attributes: [
      [require('sequelize').fn('DATE', require('sequelize').col('updated_at')), 'date'],
      [require('sequelize').fn('COUNT', require('sequelize').literal("CASE WHEN status = 'completed' THEN 1 END")), 'completions'],
      [require('sequelize').fn('AVG', require('sequelize').col('progress_percentage')), 'avg_progress']
    ],
    group: [require('sequelize').fn('DATE', require('sequelize').col('updated_at'))],
    order: [[require('sequelize').fn('DATE', require('sequelize').col('updated_at')), 'DESC']],
    limit: 30,
    raw: true
  });

  const courseStats = {
    enrollments: enrollmentStats.reduce((acc, stat) => {
      acc[stat.status] = {
        count: parseInt(stat.count),
        avg_progress: parseFloat(stat.avg_progress) || 0
      };
      return acc;
    }, {}),
    content_engagement: contentEngagement,
    rating_distribution: ratingDistribution.reduce((acc, stat) => {
      acc[stat.rating] = parseInt(stat.count);
      return acc;
    }, {}),
    recent_reviews: recentReviews,
    progress_trend: progressTrend
  };

  res.json({
    success: true,
    data: { stats: courseStats }
  });
}));

/**
 * @desc    Export statistics report
 * @route   GET /api/statistics/export
 * @access  Private/Admin
 */
router.get('/export',
  authorize('admin', 'system_admin'),
  asyncHandler(async (req, res) => {
    const { format = 'json', period = '30' } = req.query;

    const daysAgo = parseInt(period);
    const startDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    // Comprehensive statistics
    const reportData = {
      generated_at: new Date(),
      period: `${period} days`,
      summary: {
        total_users: await User.count({ where: { is_active: true } }),
        total_courses: await Course.count({ where: { status: 'published' } }),
        total_enrollments: await Enrollment.count(),
        active_enrollments: await Enrollment.count({ where: { status: 'active' } })
      },
      user_activity: await ActivityLog.findAll({
        where: { created_at: { [Op.gte]: startDate } },
        attributes: [
          'action',
          [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
        ],
        group: ['action'],
        raw: true
      }),
      course_performance: await Course.findAll({
        attributes: [
          'id',
          'title',
          'enrolled_count',
          'completed_count',
          'average_rating'
        ],
        order: [['enrolled_count', 'DESC']],
        limit: 20
      })
    };

    applicationLogger.api(`Statistics report exported by ${req.user.email}`);

    if (format === 'csv') {
      // TODO: Implement CSV export
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=statistics-report.csv');
      return res.send('CSV export not yet implemented');
    }

    res.json({
      success: true,
      data: { report: reportData }
    });
  })
);

module.exports = router;
