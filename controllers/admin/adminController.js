const { Course, User, Category, Enrollment, sequelize } = require('../../models');
const { Op } = require('sequelize');

/**
 * Admin Dashboard
 */
exports.getDashboard = async (req, res) => {
  try {
    // Get statistics
    const totalCourses = await Course.count();
    const publishedCourses = await Course.count({ where: { status: 'published' } });
    const draftCourses = await Course.count({ where: { status: 'draft' } });
    const totalUsers = await User.count();
    const totalEnrollments = await Enrollment.count();
    
    // Count courses with ratings
    const coursesWithRatings = await Course.count({
      where: {
        average_rating: { [Op.ne]: null }
      }
    });
    const totalRatings = coursesWithRatings;

    // Get recent courses
    const recentCourses = await Course.findAll({
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['first_name', 'last_name']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['name']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: 10
    });

    res.locals.currentPath = '/admin';
    res.render('pages/admin/index', {
      title: 'Bảng điều khiển Admin',
      pageHeader: 'Bảng điều khiển Admin',
      stats: {
        totalCourses,
        publishedCourses,
        draftCourses,
        totalUsers,
        totalEnrollments,
        totalRatings
      },
      recentCourses
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).render('error', {
      title: 'Lỗi hệ thống',
      error: {
        status: 500,
        message: 'Đã xảy ra lỗi khi tải bảng điều khiển'
      }
    });
  }
};

/**
 * Statistics Dashboard
 */
exports.getStatistics = async (req, res) => {
  const { metrics } = require('../../middleware/metrics');
  const startTime = Date.now();
  
  try {
    // Overall Statistics
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { is_active: true } });
    const totalCourses = await Course.count();
    const publishedCourses = await Course.count({ where: { status: 'published' } });
    const totalEnrollments = await Enrollment.count();
    const activeEnrollments = await Enrollment.count({ where: { status: 'active' } });
    const completedEnrollments = await Enrollment.count({ where: { status: 'completed' } });
    const totalCategories = await Category.count({ where: { is_active: true } });

    // Update global metrics
    metrics.setGlobalTotalUsers(totalUsers);
    metrics.setGlobalTotalCourses(totalCourses);
    metrics.setGlobalTotalEnrollments(totalEnrollments);
    metrics.setGlobalActiveEnrollments(activeEnrollments);
    metrics.setGlobalCompletedEnrollments(completedEnrollments);

    // User Statistics by Role
    const usersByRole = await User.findAll({
      attributes: [
        'role',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['role'],
      raw: true
    });

    // Course Statistics by Status
    const coursesByStatus = await Course.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // Course Statistics by Level
    const coursesByLevel = await Course.findAll({
      attributes: [
        'level',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['level'],
      raw: true
    });

    // Enrollment Statistics by Status
    const enrollmentsByStatus = await Enrollment.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // Top Courses by Enrollment
    const topCourses = await Course.findAll({
      attributes: [
        'id',
        'title',
        'slug',
        'enrolled_count',
        'average_rating'
      ],
      order: [['enrolled_count', 'DESC']],
      limit: 10
    });

    // Recent Users (Last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = await User.count({
      where: {
        created_at: {
          [Op.gte]: thirtyDaysAgo
        }
      }
    });

    // Recent Courses (Last 30 days)
    const recentCourses = await Course.count({
      where: {
        created_at: {
          [Op.gte]: thirtyDaysAgo
        }
      }
    });

    // Recent Enrollments (Last 30 days)
    const recentEnrollments = await Enrollment.count({
      where: {
        enrolled_at: {
          [Op.gte]: thirtyDaysAgo
        }
      }
    });

    // Enrollment Growth (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const enrollmentsLast7Days = await Enrollment.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('enrolled_at')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        enrolled_at: {
          [Op.gte]: sevenDaysAgo
        }
      },
      group: [sequelize.fn('DATE', sequelize.col('enrolled_at'))],
      order: [[sequelize.fn('DATE', sequelize.col('enrolled_at')), 'ASC']],
      raw: true
    });

    // User Growth (Last 7 days)
    const usersLast7Days = await User.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        created_at: {
          [Op.gte]: sevenDaysAgo
        }
      },
      group: [sequelize.fn('DATE', sequelize.col('created_at'))],
      order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']],
      raw: true
    });

    // Courses by Category - Using raw query for better performance
    const coursesByCategory = await sequelize.query(`
      SELECT 
        c.id,
        c.name,
        COUNT(co.id)::integer as count
      FROM categories c
      LEFT JOIN courses co ON co.category_id = c.id
      WHERE c.is_active = true
      GROUP BY c.id, c.name
      ORDER BY count DESC
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    // Average Progress
    const avgProgress = await Enrollment.findAll({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('progress_percentage')), 'avg_progress']
      ],
      raw: true
    });

    res.locals.currentPath = '/admin/statistics';
    res.render('pages/admin/statistics/index', {
      title: 'Thống kê hệ thống',
      pageHeader: 'Thống kê hệ thống',
      stats: {
        totalUsers,
        activeUsers,
        totalCourses,
        publishedCourses,
        totalEnrollments,
        activeEnrollments,
        completedEnrollments,
        totalCategories,
        recentUsers,
        recentCourses,
        recentEnrollments,
        avgProgress: avgProgress[0]?.avg_progress || 0
      },
      usersByRole,
      coursesByStatus,
      coursesByLevel,
      enrollmentsByStatus,
      topCourses,
      enrollmentsLast7Days,
      usersLast7Days,
      coursesByCategory
    });
  } catch (error) {
    console.error('Admin statistics error:', error);
    res.status(500).render('error', {
      title: 'Lỗi hệ thống',
      error: {
        status: 500,
        message: 'Đã xảy ra lỗi khi tải thống kê'
      }
    });
  }
};

