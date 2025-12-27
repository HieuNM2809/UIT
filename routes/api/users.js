const express = require('express');
const { User, Course, Enrollment } = require('../../models');
const { Op } = require('sequelize');

const router = express.Router();

/**
 * @desc    Get all users (API) - Admin only
 * @route   GET /api/users
 * @access  Private (Admin)
 */
router.get('/', async (req, res) => {
  try {
    // Check admin permission
    if (!['admin', 'system_admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền truy cập danh sách người dùng'
      });
    }

    const { search, role, status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { first_name: { [Op.iLike]: `%${search}%` } },
        { last_name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (role) {
      whereClause.role = role;
    }

    if (status !== undefined) {
      whereClause.is_active = status === 'active';
    }

    // Get users with pagination
    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password', 'reset_password_token', 'reset_password_expires'] },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      message: 'Lấy danh sách người dùng thành công',
      data: {
        users,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / limit),
          total_items: count,
          per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('API Users listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tải danh sách người dùng'
    });
  }
});

/**
 * @desc    Get single user (API)
 * @route   GET /api/users/:id
 * @access  Private
 */
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Users can only view their own profile unless they are admin
    if (req.user.id !== parseInt(userId) && 
        !['admin', 'system_admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xem thông tin người dùng này'
      });
    }

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password', 'reset_password_token', 'reset_password_expires'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tìm thấy'
      });
    }

    // Get user's courses if instructor
    let courses = [];
    if (user.role === 'instructor') {
      courses = await Course.findAll({
        where: { instructor_id: user.id },
        attributes: ['id', 'title', 'slug', 'status', 'created_at', 'student_count'],
        order: [['created_at', 'DESC']]
      });
    }

    // Get user's enrollments if student
    let enrollments = [];
    if (user.role === 'student') {
      enrollments = await Enrollment.findAll({
        where: { user_id: user.id },
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'title', 'slug', 'status']
          }
        ],
        order: [['enrolled_at', 'DESC']]
      });
    }

    res.json({
      success: true,
      message: 'Lấy thông tin người dùng thành công',
      data: {
        user,
        courses,
        enrollments
      }
    });

  } catch (error) {
    console.error('API User show error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tải thông tin người dùng'
    });
  }
});

/**
 * @desc    Update user profile (API)
 * @route   PUT /api/users/:id
 * @access  Private
 */
router.put('/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Users can only update their own profile unless they are admin
    if (req.user.id !== parseInt(userId) && 
        !['admin', 'system_admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền cập nhật thông tin người dùng này'
      });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tìm thấy'
      });
    }

    // Fields that can be updated
    const allowedFields = ['first_name', 'last_name', 'phone', 'date_of_birth', 'bio'];
    const updateData = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Admin can update additional fields
    if (['admin', 'system_admin'].includes(req.user.role)) {
      const adminFields = ['role', 'is_active'];
      adminFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });
    }

    await user.update(updateData);

    res.json({
      success: true,
      message: 'Cập nhật thông tin người dùng thành công',
      data: {
        user: user.toSafeObject()
      }
    });

  } catch (error) {
    console.error('API User update error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật thông tin người dùng'
    });
  }
});

/**
 * @desc    Delete/Deactivate user (API) - Admin only
 * @route   DELETE /api/users/:id
 * @access  Private (Admin)
 */
router.delete('/:id', async (req, res) => {
  try {
    // Check admin permission
    if (!['admin', 'system_admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xóa người dùng'
      });
    }

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tìm thấy'
      });
    }

    // Prevent deleting system admin
    if (user.role === 'system_admin') {
      return res.status(403).json({
        success: false,
        message: 'Không thể xóa tài khoản quản trị viên hệ thống'
      });
    }

    // Soft delete by deactivating
    await user.update({ is_active: false });

    res.json({
      success: true,
      message: 'Vô hiệu hóa người dùng thành công'
    });

  } catch (error) {
    console.error('API User delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa người dùng'
    });
  }
});

/**
 * @desc    Get user statistics (API)
 * @route   GET /api/users/:id/stats
 * @access  Private
 */
router.get('/:id/stats', async (req, res) => {
  try {
    const userId = req.params.id;

    // Users can only view their own stats unless they are admin
    if (req.user.id !== parseInt(userId) && 
        !['admin', 'system_admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xem thống kê của người dùng này'
      });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tìm thấy'
      });
    }

    let stats = {};

    if (user.role === 'instructor') {
      // Instructor statistics
      const courseCount = await Course.count({ where: { instructor_id: user.id } });
      const publishedCourses = await Course.count({ 
        where: { instructor_id: user.id, status: 'published' } 
      });
      const totalStudents = await Course.sum('student_count', { 
        where: { instructor_id: user.id } 
      }) || 0;

      stats = {
        total_courses: courseCount,
        published_courses: publishedCourses,
        draft_courses: courseCount - publishedCourses,
        total_students: totalStudents
      };

    } else if (user.role === 'student') {
      // Student statistics
      const enrollmentCount = await Enrollment.count({ 
        where: { user_id: user.id, status: 'active' } 
      });
      const completedCourses = await Enrollment.count({ 
        where: { user_id: user.id, status: 'completed' } 
      });

      stats = {
        enrolled_courses: enrollmentCount,
        completed_courses: completedCourses,
        in_progress_courses: enrollmentCount - completedCourses
      };
    }

    res.json({
      success: true,
      message: 'Lấy thống kê người dùng thành công',
      data: {
        user_id: user.id,
        role: user.role,
        stats
      }
    });

  } catch (error) {
    console.error('API User stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tải thống kê người dùng'
    });
  }
});

module.exports = router;
