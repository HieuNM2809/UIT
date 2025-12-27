const express = require('express');
const { User, Course, Enrollment, ActivityLog } = require('../../models');
const { Op } = require('sequelize');

const router = express.Router();

/**
 * @desc    Get dashboard statistics (API)
 * @route   GET /api/statistics/dashboard
 * @access  Private
 */
router.get('/dashboard', async (req, res) => {
  try {
    const userRole = req.user.role;
    let stats = {};

    if (userRole === 'student') {
      // Student dashboard stats
      const enrolledCourses = await Enrollment.count({
        where: { user_id: req.user.id, status: 'active' }
      });

      const completedCourses = await Enrollment.count({
        where: { user_id: req.user.id, status: 'completed' }
      });

      const recentActivity = await ActivityLog.findAll({
        where: { user_id: req.user.id },
        order: [['created_at', 'DESC']],
        limit: 5
      });

      stats = {
        enrolled_courses: enrolledCourses,
        completed_courses: completedCourses,
        in_progress_courses: enrolledCourses - completedCourses,
        recent_activity: recentActivity
      };

    } else if (userRole === 'instructor') {
      // Instructor dashboard stats
      const totalCourses = await Course.count({
        where: { instructor_id: req.user.id }
      });

      const publishedCourses = await Course.count({
        where: { instructor_id: req.user.id, status: 'published' }
      });

      const totalStudents = await Course.sum('student_count', {
        where: { instructor_id: req.user.id }
      }) || 0;

      const recentEnrollments = await Enrollment.findAll({
        include: [
          {
            model: Course,
            as: 'course',
            where: { instructor_id: req.user.id },
            attributes: ['title']
          },
          {
            model: User,
            as: 'user',
            attributes: ['first_name', 'last_name']
          }
        ],
        order: [['enrolled_at', 'DESC']],
        limit: 5
      });

      stats = {
        total_courses: totalCourses,
        published_courses: publishedCourses,
        draft_courses: totalCourses - publishedCourses,
        total_students: totalStudents,
        recent_enrollments: recentEnrollments
      };

    } else if (['admin', 'system_admin'].includes(userRole)) {
      // Admin dashboard stats
      const totalUsers = await User.count();
      const activeUsers = await User.count({ where: { is_active: true } });
      const totalCourses = await Course.count();
      const publishedCourses = await Course.count({ where: { status: 'published' } });
      const totalEnrollments = await Enrollment.count();

      // Recent activity
      const recentUsers = await User.findAll({
        order: [['created_at', 'DESC']],
        limit: 5,
        attributes: ['id', 'first_name', 'last_name', 'email', 'role', 'created_at']
      });

      const recentCourses = await Course.findAll({
        include: [
          {
            model: User,
            as: 'instructor',
            attributes: ['first_name', 'last_name']
          }
        ],
        order: [['created_at', 'DESC']],
        limit: 5,
        attributes: ['id', 'title', 'status', 'created_at']
      });

      stats = {
        total_users: totalUsers,
        active_users: activeUsers,
        inactive_users: totalUsers - activeUsers,
        total_courses: totalCourses,
        published_courses: publishedCourses,
        draft_courses: totalCourses - publishedCourses,
        total_enrollments: totalEnrollments,
        recent_users: recentUsers,
        recent_courses: recentCourses
      };
    }

    res.json({
      success: true,
      message: 'Lấy thống kê dashboard thành công',
      data: {
        user_role: userRole,
        stats
      }
    });

  } catch (error) {
    console.error('API Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tải thống kê dashboard'
    });
  }
});

/**
 * @desc    Get system statistics (API) - Admin only
 * @route   GET /api/statistics/system
 * @access  Private (Admin)
 */
router.get('/system', async (req, res) => {
  try {
    // Check admin permission
    if (!['admin', 'system_admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền truy cập thống kê hệ thống'
      });
    }

    const { period = '30d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get statistics for the period
    const newUsers = await User.count({
      where: {
        created_at: {
          [Op.gte]: startDate
        }
      }
    });

    const newCourses = await Course.count({
      where: {
        created_at: {
          [Op.gte]: startDate
        }
      }
    });

    const newEnrollments = await Enrollment.count({
      where: {
        enrolled_at: {
          [Op.gte]: startDate
        }
      }
    });

    // User distribution by role
    const usersByRole = await User.findAll({
      attributes: [
        'role',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['role'],
      raw: true
    });

    // Course distribution by status
    const coursesByStatus = await Course.findAll({
      attributes: [
        'status',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // Most popular courses
    const popularCourses = await Course.findAll({
      order: [['student_count', 'DESC']],
      limit: 10,
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['first_name', 'last_name']
        }
      ],
      attributes: ['id', 'title', 'student_count', 'average_rating']
    });

    // Most active instructors
    const activeInstructors = await User.findAll({
      where: { role: 'instructor' },
      include: [
        {
          model: Course,
          as: 'courses',
          attributes: []
        }
      ],
      attributes: [
        'id',
        'first_name',
        'last_name',
        [require('sequelize').fn('COUNT', require('sequelize').col('courses.id')), 'course_count']
      ],
      group: ['User.id'],
      order: [[require('sequelize').literal('course_count'), 'DESC']],
      limit: 10,
      raw: true
    });

    res.json({
      success: true,
      message: 'Lấy thống kê hệ thống thành công',
      data: {
        period,
        date_range: {
          start: startDate,
          end: now
        },
        period_stats: {
          new_users: newUsers,
          new_courses: newCourses,
          new_enrollments: newEnrollments
        },
        distribution: {
          users_by_role: usersByRole,
          courses_by_status: coursesByStatus
        },
        rankings: {
          popular_courses: popularCourses,
          active_instructors: activeInstructors
        }
      }
    });

  } catch (error) {
    console.error('API System stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tải thống kê hệ thống'
    });
  }
});

/**
 * @desc    Get course statistics (API)
 * @route   GET /api/statistics/courses/:id
 * @access  Private
 */
router.get('/courses/:id', async (req, res) => {
  try {
    const courseId = req.params.id;
    
    const course = await Course.findByPk(courseId, {
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'first_name', 'last_name']
        }
      ]
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Khóa học không tìm thấy'
      });
    }

    // Check permission - only instructor or admin can view course stats
    if (course.instructor_id !== req.user.id && 
        !['admin', 'system_admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xem thống kê khóa học này'
      });
    }

    // Get enrollment statistics
    const totalEnrollments = await Enrollment.count({
      where: { course_id: courseId }
    });

    const activeEnrollments = await Enrollment.count({
      where: { course_id: courseId, status: 'active' }
    });

    const completedEnrollments = await Enrollment.count({
      where: { course_id: courseId, status: 'completed' }
    });

    // Recent enrollments
    const recentEnrollments = await Enrollment.findAll({
      where: { course_id: courseId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['first_name', 'last_name', 'avatar']
        }
      ],
      order: [['enrolled_at', 'DESC']],
      limit: 10
    });

    // Enrollment trends (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const enrollmentTrend = await Enrollment.findAll({
      where: {
        course_id: courseId,
        enrolled_at: {
          [Op.gte]: thirtyDaysAgo
        }
      },
      attributes: [
        [require('sequelize').fn('DATE', require('sequelize').col('enrolled_at')), 'date'],
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: [require('sequelize').fn('DATE', require('sequelize').col('enrolled_at'))],
      order: [[require('sequelize').fn('DATE', require('sequelize').col('enrolled_at')), 'ASC']],
      raw: true
    });

    res.json({
      success: true,
      message: 'Lấy thống kê khóa học thành công',
      data: {
        course: {
          id: course.id,
          title: course.title,
          instructor: course.instructor
        },
        enrollment_stats: {
          total: totalEnrollments,
          active: activeEnrollments,
          completed: completedEnrollments,
          completion_rate: totalEnrollments > 0 ? 
            ((completedEnrollments / totalEnrollments) * 100).toFixed(2) : 0
        },
        recent_enrollments: recentEnrollments,
        enrollment_trend: enrollmentTrend
      }
    });

  } catch (error) {
    console.error('API Course stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tải thống kê khóa học'
    });
  }
});

module.exports = router;
