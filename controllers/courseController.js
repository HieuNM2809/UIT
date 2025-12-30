const { Course, User, Category, Enrollment, Content, Progress } = require('../models');
const { Op } = require('sequelize');

/**
 * Show all courses
 */
exports.index = async (req, res) => {
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
      whereClause.title = { [Op.iLike]: `%${search}%` };
    }

    if (level) {
      whereClause.level = level;
    }

    // Build include clause for category filter
    const includeClause = [
      {
        model: User,
        as: 'instructor',
        attributes: ['id', 'first_name', 'last_name', 'avatar']
      }
    ];

    // Add category filter if provided
    if (category) {
      includeClause.push({
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug'],
        where: {
          id: category
        },
        required: true
      });
    } else {
      // Include category even if not filtering
      includeClause.push({
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug'],
        required: false
      });
    }

    // Get courses with pagination
    const { count, rows: courses } = await Course.findAndCountAll({
      where: whereClause,
      include: includeClause,
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
};

/**
 * Show single course
 */
exports.show = async (req, res) => {
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
        id: { [Op.ne]: course.id }
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
      scripts: ['/js/course.js', '/js/comments.js']
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
};

/**
 * Learn course (enrolled users only)
 */
exports.learn = async (req, res) => {
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

    // Check if user is enrolled
    const enrollment = await Enrollment.findOne({
      where: {
        user_id: req.session.user.id,
        course_id: course.id,
        status: { [Op.in]: ['active', 'completed'] }
      }
    });

    if (!enrollment) {
      req.flash('error', 'Bạn cần đăng ký khóa học này để học');
      return res.redirect(`/courses/${course.slug}`);
    }

    // Check if course is accessible
    if (course.status !== 'published' && 
        course.instructor_id !== req.session.user.id && 
        !['admin', 'system_admin'].includes(req.session.user.role)) {
      return res.status(403).render('error', {
        title: 'Không có quyền truy cập',
        error: {
          status: 403,
          message: 'Bạn không có quyền truy cập khóa học này'
        }
      });
    }

    // Get course contents (published only, ordered by order_index)
    const contents = await Content.findAll({
      where: {
        course_id: course.id,
        status: 'published'
      },
      order: [['order_index', 'ASC'], ['created_at', 'ASC']]
    });

    // Update last accessed time
    enrollment.last_accessed = new Date();
    await enrollment.save();

    // Calculate progress
    const totalContents = contents.length;
    const userProgresses = await Progress.findAll({
      where: {
        user_id: req.session.user.id,
        course_id: course.id,
        status: 'completed'
      },
      attributes: ['content_id']
    });
    
    const completedContentIds = userProgresses.map(p => p.content_id);
    const completedContents = contents.filter(c => completedContentIds.includes(c.id)).length;

    const progressPercentage = totalContents > 0 
      ? Math.round((completedContents / totalContents) * 100) 
      : enrollment.progress_percentage || 0;

    // Update enrollment progress
    if (enrollment.progress_percentage !== progressPercentage) {
      enrollment.progress_percentage = progressPercentage;
      await enrollment.save();
    }

    res.locals.currentPath = `/courses/${course.slug}/learn`;
    res.render('pages/courses/learn', {
      title: `Học: ${course.title}`,
      pageHeader: course.title,
      course,
      enrollment,
      contents,
      progress: {
        total: totalContents,
        completed: completedContents,
        percentage: progressPercentage
      }
    });

  } catch (error) {
    console.error('Course learn error:', error);
    res.status(500).render('error', {
      title: 'Lỗi hệ thống',
      error: {
        status: 500,
        message: 'Đã xảy ra lỗi khi tải trang học'
      }
    });
  }
};

/**
 * Enroll in course (API)
 */
exports.enroll = async (req, res) => {
  try {
    console.log('Enroll route hit:', req.method, req.path, req.params);
    const courseId = req.params.id;
    
    // req.user should be set by authenticate middleware
    if (!req.user || !req.user.id) {
      console.log('No user found in request');
      return res.status(401).json({
        success: false,
        message: 'Bạn cần đăng nhập để đăng ký khóa học'
      });
    }
    
    console.log('User authenticated:', req.user.id);
    const userId = req.user.id;

    // Check if course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Khóa học không tìm thấy'
      });
    }

    // Check if course is published and public
    if (course.status !== 'published' || !course.is_public) {
      return res.status(403).json({
        success: false,
        message: 'Khóa học này không khả dụng'
      });
    }

    // Check if user is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      where: {
        user_id: userId,
        course_id: courseId
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
      user_id: userId,
      course_id: courseId,
      status: 'active' // Auto-activate enrollment
    });

    // Increment course enrolled_count
    await course.increment('enrolled_count');

    res.json({
      success: true,
      message: 'Đăng ký khóa học thành công!',
      data: {
        enrollment: {
          id: enrollment.id,
          status: enrollment.status,
          enrolled_at: enrollment.enrolled_at
        }
      }
    });
  } catch (error) {
    console.error('Enroll course error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đăng ký khóa học'
    });
  }
};

