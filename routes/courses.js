const express = require('express');
const { Course, User, Category } = require('../models');

const router = express.Router();

/**
 * @desc    Show all courses
 * @route   GET /courses
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { search, category, level, page = 1 } = req.query;
    const limit = 12;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {
      status: 'published',
      is_public: true
    };

    if (search) {
      whereClause.title = { [require('sequelize').Op.iLike]: `%${search}%` };
    }

    if (level) {
      whereClause.level = level;
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

    // Get categories for filter
    const categories = await Category.findAll({
      where: { is_active: true },
      order: [['name', 'ASC']]
    });

    res.locals.currentPath = '/courses';
    res.render('pages/courses/index', {
      title: 'Khóa học',
      pageHeader: 'Khóa học',
      pageDescription: 'Khám phá các khóa học chất lượng cao tại UIT',
      courses,
      categories,
      currentFilters: { search, category, level },
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(count / limit),
        total_items: count,
        has_prev: page > 1,
        has_next: page < Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Courses listing error:', error);
    req.flash('error', 'Lỗi khi tải danh sách khóa học');
    res.redirect('/');
  }
});

/**
 * @desc    Show single course
 * @route   GET /courses/:slug
 * @access  Public
 */
router.get('/:slug', async (req, res) => {
  try {
    const course = await Course.findOne({
      where: { slug: req.params.slug },
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'first_name', 'last_name', 'avatar', 'email']
        }
      ]
    });

    if (!course) {
      return res.status(404).render('error', {
        title: 'Khóa học không tìm thấy',
        error: {
          status: 404,
          message: 'Khóa học bạn tìm kiếm không tồn tại',
          details: 'Vui lòng kiểm tra lại đường dẫn hoặc tìm kiếm khóa học khác.'
        }
      });
    }

    // Check if not published and user doesn't have access
    if (course.status !== 'published' || !course.is_public) {
      if (!req.session.user || 
          (course.instructor_id !== req.session.user.id && 
           !['admin', 'system_admin'].includes(req.session.user.role))) {
        return res.status(404).render('error', {
          title: 'Khóa học không tìm thấy',
          error: {
            status: 404,
            message: 'Khóa học bạn tìm kiếm không tồn tại'
          }
        });
      }
    }

    // Check if user is enrolled (if logged in)
    let enrollment = null;
    if (req.session.user) {
      const { Enrollment } = require('../models');
      enrollment = await Enrollment.findOne({
        where: {
          user_id: req.session.user.id,
          course_id: course.id
        }
      });
    }

    // Get similar courses
    const similarCourses = await Course.findAll({
      where: {
        status: 'published',
        is_public: true,
        level: course.level,
        id: { [require('sequelize').Op.ne]: course.id }
      },
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['first_name', 'last_name']
        }
      ],
      limit: 4,
      order: [['average_rating', 'DESC']]
    });

    res.locals.currentPath = `/courses/${course.slug}`;
    res.render('pages/courses/show', {
      title: course.title,
      course,
      enrollment,
      similarCourses,
      scripts: ['/js/course.js']
    });

  } catch (error) {
    console.error('Course show error:', error);
    res.status(500).render('error', {
      title: 'Lỗi hệ thống',
      error: {
        status: 500,
        message: 'Đã xảy ra lỗi khi tải thông tin khóa học'
      }
    });
  }
});

module.exports = router;