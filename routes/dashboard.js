const express = require('express');
const { User, Course, Enrollment, Progress, sequelize } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

/**
 * @desc    Dashboard main page
 * @route   GET /dashboard
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.session.user.id;

    // Get user's enrollments with course info
    const enrollments = await Enrollment.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'slug', 'thumbnail', 'level'],
          required: false // Left join to handle cases where course might be deleted
        }
      ],
      order: [
        [sequelize.literal('CASE WHEN "last_accessed" IS NULL THEN 0 ELSE 1 END'), 'DESC'],
        ['last_accessed', 'DESC NULLS LAST'],
        ['enrolled_at', 'DESC']
      ],
      limit: 6
    });

    // Get statistics
    const stats = {
      total_courses: await Enrollment.count({
        where: { user_id: userId }
      }),
      active_courses: await Enrollment.count({
        where: { user_id: userId, status: 'active' }
      }),
      completed_courses: await Enrollment.count({
        where: { user_id: userId, status: 'completed' }
      }),
      total_time: await Enrollment.sum('total_time_spent', {
        where: { user_id: userId }
      }) || 0
    };

    // Calculate average progress
    const avgProgress = await Enrollment.findOne({
      where: { user_id: userId },
      attributes: [
        [require('sequelize').fn('AVG', require('sequelize').col('progress_percentage')), 'avg_progress']
      ],
      raw: true
    });

    stats.average_progress = Math.round(avgProgress?.avg_progress || 0);

    // Get recent activity from ActivityLog if available, otherwise use sample data
    let recentActivity = [];
    try {
      const { ActivityLog } = require('../models');
      const activities = await ActivityLog.findAll({
        where: { user_id: userId },
        order: [['created_at', 'DESC']],
        limit: 5
      });
      
      recentActivity = activities.map(activity => ({
        type: activity.activity_type || 'general',
        title: activity.description || 'Hoạt động học tập',
        course: activity.course_name || 'Khóa học',
        time: activity.created_at || new Date(),
        icon: activity.activity_type === 'completed' ? 'check-circle' : 
              activity.activity_type === 'enrolled' ? 'academic-cap' : 'clipboard-check'
      }));
    } catch (err) {
      // Fallback to sample data if ActivityLog doesn't exist
      console.log('ActivityLog not available, using sample data');
    }

    // Use sample data if no activities found
    if (recentActivity.length === 0) {
      recentActivity = [
        {
          type: 'completed',
          title: 'Hoàn thành bài học "JavaScript Basics"',
          course: 'Lập trình Web',
          time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          icon: 'check-circle'
        },
        {
          type: 'enrolled',
          title: 'Đăng ký khóa học "Cơ sở dữ liệu"',
          course: 'Database Management',
          time: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          icon: 'academic-cap'
        },
        {
          type: 'quiz',
          title: 'Điểm quiz: 8.5/10',
          course: 'Thuật toán',
          time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          icon: 'clipboard-check'
        }
      ];
    }

    // Get recommended courses (simple logic)
    const enrolledCourseIds = enrollments.length > 0 
      ? enrollments.map(e => e.course?.id || e.course_id).filter(Boolean)
      : [];
    
    const recommendedWhere = {
      status: 'published',
      is_public: true
    };
    
    if (enrolledCourseIds.length > 0) {
      recommendedWhere.id = { [Op.notIn]: enrolledCourseIds };
    }
    
    let recommendedCourses = await Course.findAll({
      where: recommendedWhere,
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['first_name', 'last_name'],
          required: false
        }
      ],
      order: [['enrolled_count', 'DESC'], ['average_rating', 'DESC']],
      limit: 4
    });

    // If no recommended courses, create sample data for demonstration
    if (recommendedCourses.length === 0) {
      const sampleInstructors = await User.findAll({
        where: { role: 'instructor' },
        limit: 4,
        attributes: ['id', 'first_name', 'last_name']
      });

      recommendedCourses = [
        {
          id: 'sample-1',
          title: 'Lập trình Web với React',
          slug: 'lap-trinh-web-react',
          thumbnail: null,
          level: 'intermediate',
          enrolled_count: 150,
          average_rating: 4.5,
          instructor: sampleInstructors[0] || { first_name: 'Giảng viên', last_name: 'UIT' }
        },
        {
          id: 'sample-2',
          title: 'Cơ sở dữ liệu nâng cao',
          slug: 'co-so-du-lieu-nang-cao',
          thumbnail: null,
          level: 'advanced',
          enrolled_count: 120,
          average_rating: 4.7,
          instructor: sampleInstructors[1] || { first_name: 'Giảng viên', last_name: 'UIT' }
        },
        {
          id: 'sample-3',
          title: 'Machine Learning cơ bản',
          slug: 'machine-learning-co-ban',
          thumbnail: null,
          level: 'beginner',
          enrolled_count: 200,
          average_rating: 4.6,
          instructor: sampleInstructors[2] || { first_name: 'Giảng viên', last_name: 'UIT' }
        },
        {
          id: 'sample-4',
          title: 'An toàn thông tin',
          slug: 'an-toan-thong-tin',
          thumbnail: null,
          level: 'intermediate',
          enrolled_count: 90,
          average_rating: 4.4,
          instructor: sampleInstructors[3] || { first_name: 'Giảng viên', last_name: 'UIT' }
        }
      ];
    }

    res.locals.currentPath = '/dashboard';
    res.render('pages/dashboard/index', {
      title: 'Bảng điều khiển',
      pageHeader: `Chào mừng, ${req.session.user.full_name}!`,
      pageDescription: 'Tổng quan về quá trình học tập của bạn',
      stats,
      enrollments,
      recentActivity,
      recommendedCourses,
      scripts: ['/js/dashboard.js']
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    req.flash('error', 'Lỗi khi tải bảng điều khiển');
    res.redirect('/');
  }
});

/**
 * @desc    My courses page
 * @route   GET /dashboard/courses
 * @access  Private
 */
router.get('/courses', async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { status, page = 1 } = req.query;
    const limit = 12;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = { user_id: userId };
    if (status) {
      whereClause.status = status;
    }

    const { count, rows: enrollments } = await Enrollment.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'slug', 'thumbnail', 'level', 'duration_hours', 'average_rating']
        }
      ],
      order: [['last_accessed', 'DESC'], ['enrolled_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.locals.currentPath = '/dashboard/courses';
    res.render('pages/dashboard/courses', {
      title: 'Khóa học của tôi',
      pageHeader: 'Khóa học của tôi',
      pageDescription: 'Quản lý các khóa học bạn đã đăng ký',
      enrollments,
      currentFilter: status,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(count / limit),
        total_items: count,
        has_prev: page > 1,
        has_next: page < Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Dashboard courses error:', error);
    req.flash('error', 'Lỗi khi tải danh sách khóa học');
    res.redirect('/dashboard');
  }
});

/**
 * @desc    Progress & Statistics
 * @route   GET /dashboard/progress
 * @access  Private
 */
router.get('/progress', async (req, res) => {
  try {
    const userId = req.session.user.id;

    // Get detailed stats
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

    // Format stats
    const stats = enrollmentStats.reduce((acc, stat) => {
      acc[stat.status] = {
        count: parseInt(stat.count),
        avg_progress: Math.round(stat.avg_progress || 0),
        total_time: parseInt(stat.total_time || 0)
      };
      return acc;
    }, {});

    // Get learning timeline (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const timelineData = await Enrollment.findAll({
      where: {
        user_id: userId,
        updated_at: { [Op.gte]: thirtyDaysAgo }
      },
      attributes: [
        [require('sequelize').fn('DATE', require('sequelize').col('updated_at')), 'date'],
        [require('sequelize').fn('SUM', require('sequelize').col('total_time_spent')), 'daily_time']
      ],
      group: [require('sequelize').fn('DATE', require('sequelize').col('updated_at'))],
      order: [[require('sequelize').fn('DATE', require('sequelize').col('updated_at')), 'ASC']],
      raw: true
    });

    res.locals.currentPath = '/dashboard/progress';
    res.render('pages/dashboard/progress', {
      title: 'Tiến độ học tập',
      pageHeader: 'Tiến độ học tập',
      pageDescription: 'Thống kê chi tiết về quá trình học tập của bạn',
      stats,
      timelineData,
      scripts: ['/js/charts.js']
    });

  } catch (error) {
    console.error('Dashboard progress error:', error);
    req.flash('error', 'Lỗi khi tải thống kê tiến độ');
    res.redirect('/dashboard');
  }
});

module.exports = router;

