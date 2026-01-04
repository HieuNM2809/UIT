const { User, Course, Enrollment } = require('../models');
const { metrics } = require('../middleware/metrics');
const { applicationLogger } = require('../config/logger');

/**
 * Prometheus Metrics Endpoint
 * GET /metrics
 * 
 * Refreshes metrics from database before returning Prometheus format metrics
 */
exports.getMetrics = async (req, res) => {
  try {
    // Refresh metrics from database before returning
    try {
      // Get global statistics from database
      const totalUsers = await User.count();
      const totalCourses = await Course.count();
      const totalEnrollments = await Enrollment.count();
      const activeEnrollments = await Enrollment.count({ where: { status: 'active' } });
      const completedEnrollments = await Enrollment.count({ where: { status: 'completed' } });
      
      // Update global metrics
      metrics.setGlobalTotalUsers(totalUsers);
      metrics.setGlobalTotalCourses(totalCourses);
      metrics.setGlobalTotalEnrollments(totalEnrollments);
      metrics.setGlobalActiveEnrollments(activeEnrollments);
      metrics.setGlobalCompletedEnrollments(completedEnrollments);
      
      // Update socket connections if Socket.IO is initialized
      try {
        // Get io instance from app (via getIO function)
        const { getIO } = require('../app');
        const io = getIO ? getIO() : null;
        if (io && io.sockets) {
          metrics.setSocketConnections(io.sockets.sockets.size);
        }
      } catch (ioError) {
        // Socket.IO might not be initialized yet, ignore
      }
    } catch (dbError) {
      // Log error but don't fail the metrics endpoint
      applicationLogger.error('Error refreshing metrics from database', dbError, {
        type: 'metrics',
        operation: 'refresh_from_database'
      });
    }
    
    res.set('Content-Type', 'text/plain');
    const metricsData = await metrics.getMetrics();
    res.send(metricsData);
  } catch (error) {
    applicationLogger.error('Error generating metrics', error, {
      type: 'metrics',
      operation: 'get_metrics'
    });
    res.status(500).send(`Error generating metrics: ${error.message}`);
  }
};

