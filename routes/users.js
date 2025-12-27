const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { Op } = require('sequelize');

const { User, Course, Enrollment, Progress, ActivityLog } = require('../models');
const { authenticate, authorize, ownerOrAdmin } = require('../middleware/auth');
const { AppError, asyncHandler } = require('../middleware/errorHandler');
const { applicationLogger } = require('../config/logger');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Helper function to check validation errors
const checkValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/users
 * @access  Private/Admin
 */
router.get('/', 
  authorize('admin', 'system_admin'),
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('search')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('Search term too long'),
    query('role')
      .optional()
      .isIn(['student', 'teacher', 'lecturer', 'admin', 'system_admin'])
      .withMessage('Invalid role'),
    query('status')
      .optional()
      .isIn(['active', 'inactive', 'suspended', 'pending'])
      .withMessage('Invalid status')
  ],
  checkValidationErrors,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const { search, role, status, sort_by, sort_order } = req.query;

    // Build where clause
    const whereClause = {};
    
    if (search) {
      whereClause[Op.or] = [
        { first_name: { [Op.iLike]: `%${search}%` } },
        { last_name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { student_id: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (role) whereClause.role = role;
    if (status) whereClause.status = status;

    // Build order clause
    const orderClause = [];
    if (sort_by && ['created_at', 'last_login', 'login_count', 'first_name', 'last_name'].includes(sort_by)) {
      const order = sort_order === 'asc' ? 'ASC' : 'DESC';
      orderClause.push([sort_by, order]);
    } else {
      orderClause.push(['created_at', 'DESC']);
    }

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password', 'verification_token', 'reset_password_token'] },
      order: orderClause,
      limit,
      offset,
      distinct: true
    });

    applicationLogger.api(`Admin ${req.user.email} fetched users list`);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(count / limit),
          total_items: count,
          items_per_page: limit,
          has_next: page < Math.ceil(count / limit),
          has_prev: page > 1
        }
      }
    });
  })
);

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private (Own profile or Admin)
 */
router.get('/:id', 
  ownerOrAdmin(),
  asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password', 'verification_token', 'reset_password_token'] },
      include: [
        {
          model: Enrollment,
          as: 'enrollments',
          include: [
            {
              model: Course,
              as: 'course',
              attributes: ['id', 'title', 'slug', 'thumbnail', 'level']
            }
          ]
        }
      ]
    });

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    applicationLogger.api(`User profile accessed: ${user.email}`);

    res.json({
      success: true,
      data: { user }
    });
  })
);

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private (Own profile or Admin)
 */
router.put('/:id',
  ownerOrAdmin(),
  [
    body('first_name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('First name must be between 1 and 50 characters'),
    body('last_name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Last name must be between 1 and 50 characters'),
    body('phone')
      .optional()
      .trim()
      .matches(/^[+]?[\d\s\-()]+$/)
      .withMessage('Invalid phone number format'),
    body('role')
      .optional()
      .isIn(['student', 'teacher', 'lecturer', 'admin'])
      .withMessage('Invalid role'),
    body('status')
      .optional()
      .isIn(['active', 'inactive', 'suspended', 'pending'])
      .withMessage('Invalid status')
  ],
  checkValidationErrors,
  asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    const { first_name, last_name, phone, date_of_birth, gender, role, status } = req.body;

    // Regular users can only update their own basic info
    if (req.user.id === user.id && !req.user.isAdmin()) {
      if (first_name !== undefined) user.first_name = first_name.trim();
      if (last_name !== undefined) user.last_name = last_name.trim();
      if (phone !== undefined) user.phone = phone ? phone.trim() : null;
      if (date_of_birth !== undefined) user.date_of_birth = date_of_birth;
      if (gender !== undefined) user.gender = gender;
    }
    
    // Only admins can update role and status
    if (req.user.isAdmin()) {
      if (first_name !== undefined) user.first_name = first_name.trim();
      if (last_name !== undefined) user.last_name = last_name.trim();
      if (phone !== undefined) user.phone = phone ? phone.trim() : null;
      if (date_of_birth !== undefined) user.date_of_birth = date_of_birth;
      if (gender !== undefined) user.gender = gender;
      if (role !== undefined) user.role = role;
      if (status !== undefined) user.status = status;
    }

    await user.save();

    applicationLogger.api(`User updated: ${user.email} by ${req.user.email}`);

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        user: user.toSafeObject()
      }
    });
  })
);

/**
 * @desc    Delete/Deactivate user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
router.delete('/:id',
  authorize('admin', 'system_admin'),
  asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Don't allow deleting system admin
    if (user.role === 'system_admin') {
      throw new AppError('Cannot delete system administrator', 403, 'CANNOT_DELETE_SYSTEM_ADMIN');
    }

    // Soft delete - just deactivate
    user.is_active = false;
    user.status = 'inactive';
    await user.save();

    applicationLogger.api(`User deactivated: ${user.email} by ${req.user.email}`);

    res.json({
      success: true,
      message: 'User deactivated successfully'
    });
  })
);

/**
 * @desc    Get user statistics
 * @route   GET /api/users/:id/stats
 * @access  Private (Own stats or Admin)
 */
router.get('/:id/stats',
  ownerOrAdmin(),
  asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Get user statistics
    const enrollmentsCount = await Enrollment.count({
      where: { user_id: req.params.id }
    });

    const activeEnrollmentsCount = await Enrollment.count({
      where: { user_id: req.params.id, status: 'active' }
    });

    const completedEnrollmentsCount = await Enrollment.count({
      where: { user_id: req.params.id, status: 'completed' }
    });

    const totalTimeSpent = await Enrollment.sum('total_time_spent', {
      where: { user_id: req.params.id }
    });

    const progressStats = await Progress.findAll({
      where: { user_id: req.params.id },
      attributes: [
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'total_contents'],
        [require('sequelize').fn('COUNT', require('sequelize').literal("CASE WHEN status = 'completed' THEN 1 END")), 'completed_contents'],
        [require('sequelize').fn('AVG', require('sequelize').col('progress_percentage')), 'avg_progress']
      ],
      raw: true
    });

    const recentActivity = await ActivityLog.findAll({
      where: { user_id: req.params.id },
      order: [['created_at', 'DESC']],
      limit: 10,
      attributes: ['action', 'resource_type', 'created_at']
    });

    const stats = {
      enrollments: {
        total: enrollmentsCount || 0,
        active: activeEnrollmentsCount || 0,
        completed: completedEnrollmentsCount || 0
      },
      learning: {
        total_time_spent: totalTimeSpent || 0,
        total_contents: parseInt(progressStats[0]?.total_contents) || 0,
        completed_contents: parseInt(progressStats[0]?.completed_contents) || 0,
        average_progress: parseFloat(progressStats[0]?.avg_progress) || 0
      },
      recent_activity: recentActivity,
      profile: {
        member_since: user.created_at,
        last_login: user.last_login,
        login_count: user.login_count || 0
      }
    };

    res.json({
      success: true,
      data: { stats }
    });
  })
);

/**
 * @desc    Get user courses
 * @route   GET /api/users/:id/courses
 * @access  Private (Own courses or Admin)
 */
router.get('/:id/courses',
  ownerOrAdmin(),
  [
    query('status')
      .optional()
      .isIn(['pending', 'active', 'completed', 'dropped'])
      .withMessage('Invalid enrollment status'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50')
  ],
  checkValidationErrors,
  asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { status } = req.query;

    const whereClause = { user_id: req.params.id };
    if (status) whereClause.status = status;

    const { count, rows: enrollments } = await Enrollment.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'slug', 'thumbnail', 'level', 'duration_hours', 'average_rating']
        }
      ],
      order: [['enrolled_at', 'DESC']],
      limit,
      offset
    });

    res.json({
      success: true,
      data: {
        enrollments,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(count / limit),
          total_items: count,
          items_per_page: limit
        }
      }
    });
  })
);

/**
 * @desc    Change user password
 * @route   PUT /api/users/:id/password
 * @access  Private (Own password or Admin)
 */
router.put('/:id/password',
  ownerOrAdmin(),
  [
    body('current_password')
      .if((value, { req }) => req.user.id === req.params.id)
      .notEmpty()
      .withMessage('Current password is required'),
    body('new_password')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long'),
    body('confirm_password')
      .custom((value, { req }) => {
        if (value !== req.body.new_password) {
          throw new Error('Password confirmation does not match');
        }
        return true;
      })
  ],
  checkValidationErrors,
  asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    const { current_password, new_password } = req.body;

    // If user is changing their own password, verify current password
    if (req.user.id === user.id) {
      const isCurrentPasswordValid = await user.validatePassword(current_password);
      if (!isCurrentPasswordValid) {
        throw new AppError('Current password is incorrect', 400, 'INVALID_CURRENT_PASSWORD');
      }
    }

    // Update password
    user.password = new_password;
    await user.save();

    applicationLogger.auth(`Password changed for user: ${user.email} by ${req.user.email}`);

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  })
);

module.exports = router;
