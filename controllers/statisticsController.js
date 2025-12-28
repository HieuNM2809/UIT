const { User, Course, Enrollment, Category, sequelize } = require('../models');
const { Op } = require('sequelize');

/**
 * Get general statistics (for authenticated users)
 */
exports.getStatistics = async (req, res) => {
  try {
    const userId = req.user?.id || req.session?.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // User-specific statistics
    const userStats = {
      total_courses: await Enrollment.count({ where: { user_id: userId } }),
      active_courses: await Enrollment.count({ 
        where: { user_id: userId, status: 'active' } 
      }),
      completed_courses: await Enrollment.count({ 
        where: { user_id: userId, status: 'completed' } 
      }),
      total_time_spent: await Enrollment.sum('total_time_spent', {
        where: { user_id: userId }
      }) || 0
    };

    // Average progress
    const avgProgress = await Enrollment.findOne({
      where: { user_id: userId },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('progress_percentage')), 'avg_progress']
      ],
      raw: true
    });

    userStats.average_progress = Math.round(avgProgress?.avg_progress || 0);

    res.json({
      success: true,
      data: {
        user: userStats,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
};

/**
 * Get dashboard statistics
 */
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user?.id || req.session?.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Get user's enrollments with course info
    const enrollments = await Enrollment.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'slug', 'thumbnail', 'level'],
          required: false
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
      total_courses: await Enrollment.count({ where: { user_id: userId } }),
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
        [sequelize.fn('AVG', sequelize.col('progress_percentage')), 'avg_progress']
      ],
      raw: true
    });

    stats.average_progress = Math.round(avgProgress?.avg_progress || 0);

    res.json({
      success: true,
      data: {
        stats,
        recent_enrollments: enrollments,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Dashboard statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics'
    });
  }
};

/**
 * Get learning reports/analytics
 */
exports.getReports = async (req, res) => {
  try {
    const userId = req.user?.id || req.session?.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Get enrollment statistics by status
    const enrollmentStats = await Enrollment.findAll({
      where: { user_id: userId },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('AVG', sequelize.col('progress_percentage')), 'avg_progress'],
        [sequelize.fn('SUM', sequelize.col('total_time_spent')), 'total_time']
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
        [sequelize.fn('DATE', sequelize.col('updated_at')), 'date'],
        [sequelize.fn('SUM', sequelize.col('total_time_spent')), 'daily_time']
      ],
      group: [sequelize.fn('DATE', sequelize.col('updated_at'))],
      order: [[sequelize.fn('DATE', sequelize.col('updated_at')), 'ASC']],
      raw: true
    });

    res.json({
      success: true,
      data: {
        stats,
        timeline: timelineData,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reports'
    });
  }
};

