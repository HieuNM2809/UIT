const express = require('express');
const { Course, User, Category, Enrollment } = require('../../models');
const { Op } = require('sequelize');

const router = express.Router();

/**
 * @desc    Get all courses (API)
 * @route   GET /api/courses
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const { search, category, level, page = 1, limit = 12, instructor_id } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {
      status: 'published',
      is_public: true
    };

    if (search) {
      whereClause.title = { [Op.iLike]: `%${search}%` };
    }

    if (level) {
      whereClause.level = level;
    }

    if (instructor_id) {
      whereClause.instructor_id = instructor_id;
    }

    // Get courses with pagination
    const { count, rows: courses } = await Course.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'first_name', 'last_name', 'avatar']
        }
      ],
      order: [['enrolled_count', 'DESC'], ['average_rating', 'DESC'], ['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      message: 'Lấy danh sách khóa học thành công',
      data: {
        courses,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / limit),
          total_items: count,
          per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('API Courses listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tải danh sách khóa học'
    });
  }
});

/**
 * @desc    Get single course (API)
 * @route   GET /api/courses/:id
 * @access  Private
 */
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'first_name', 'last_name', 'avatar', 'email']
        }
      ]
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Khóa học không tìm thấy'
      });
    }

    // Check if not published and user doesn't have access
    if (course.status !== 'published' || !course.is_public) {
      if (course.instructor_id !== req.user.id && 
          !['admin', 'system_admin'].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Bạn không có quyền truy cập khóa học này'
        });
      }
    }

    // Check if user is enrolled
    const enrollment = await Enrollment.findOne({
      where: {
        user_id: req.user.id,
        course_id: course.id
      }
    });

    res.json({
      success: true,
      message: 'Lấy thông tin khóa học thành công',
      data: {
        course,
        enrollment
      }
    });

  } catch (error) {
    console.error('API Course show error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tải thông tin khóa học'
    });
  }
});

/**
 * @desc    Enroll in course (API)
 * @route   POST /api/courses/:id/enroll
 * @access  Private
 */
router.post('/:id/enroll', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Khóa học không tìm thấy'
      });
    }

    if (course.status !== 'published' || !course.is_public) {
      return res.status(403).json({
        success: false,
        message: 'Khóa học này không khả dụng để đăng ký'
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      where: {
        user_id: req.user.id,
        course_id: course.id
      }
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Bạn đã đăng ký khóa học này rồi'
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      user_id: req.user.id,
      course_id: course.id,
      enrolled_at: new Date(),
      status: 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Đăng ký khóa học thành công',
      data: {
        enrollment
      }
    });

  } catch (error) {
    console.error('API Course enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đăng ký khóa học'
    });
  }
});

/**
 * @desc    Get user's enrolled courses (API)
 * @route   GET /api/courses/my/enrolled
 * @access  Private
 */
router.get('/my/enrolled', async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      where: {
        user_id: req.user.id,
        status: 'active'
      },
      include: [
        {
          model: Course,
          as: 'course',
          include: [
            {
              model: User,
              as: 'instructor',
              attributes: ['id', 'first_name', 'last_name', 'avatar']
            }
          ]
        }
      ],
      order: [['enrolled_at', 'DESC']]
    });

    res.json({
      success: true,
      message: 'Lấy danh sách khóa học đã đăng ký thành công',
      data: {
        enrollments: enrollments.map(enrollment => ({
          ...enrollment.toJSON(),
          course: enrollment.course
        }))
      }
    });

  } catch (error) {
    console.error('API My courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tải danh sách khóa học đã đăng ký'
    });
  }
});

module.exports = router;
