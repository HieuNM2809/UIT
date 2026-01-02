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
      status: 'published'
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
    if (course.status !== 'published') {
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

    // Get free contents (published and is_free = true) - visible to all users
    const freeContents = await Content.findAll({
      where: {
        course_id: course.id,
        status: 'published',
        is_free: true
      },
      order: [['order_index', 'ASC'], ['created_at', 'ASC']],
      attributes: ['id', 'title', 'slug', 'description', 'content_type', 'order_index', 'estimated_duration']
    });

    // Get similar courses
    const similarCourses = await Course.findAll({
      where: {
        status: 'published',
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
      freeContents,
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
 * Preview free content (no enrollment required)
 */
exports.previewContent = async (req, res) => {
  try {
    const { slug, contentId } = req.params;

    const course = await Course.findOne({
      where: { slug },
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
          message: 'Khóa học bạn tìm kiếm không tồn tại'
        }
      });
    }

    // Check if course is published
    if (course.status !== 'published') {
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

    // Get the specific free content
    const content = await Content.findOne({
      where: {
        id: contentId,
        course_id: course.id,
        status: 'published',
        is_free: true
      }
    });

    if (!content) {
      req.flash('error', 'Nội dung này không khả dụng hoặc không miễn phí');
      return res.redirect(`/courses/${course.slug}`);
    }

    // Get all free contents for navigation
    const freeContents = await Content.findAll({
      where: {
        course_id: course.id,
        status: 'published',
        is_free: true
      },
      order: [['order_index', 'ASC'], ['created_at', 'ASC']],
      attributes: ['id', 'title', 'slug', 'content_type', 'order_index']
    });

    // Check if user is enrolled (optional, for showing enrollment prompt)
    let enrollment = null;
    if (req.session.user) {
      enrollment = await Enrollment.findOne({
        where: {
          user_id: req.session.user.id,
          course_id: course.id
        }
      });
    }

    res.locals.currentPath = `/courses/${course.slug}`;
    res.render('pages/courses/preview', {
      title: `${content.title} - ${course.title}`,
      pageHeader: content.title,
      course,
      content,
      freeContents,
      enrollment,
      isPreview: true
    });

  } catch (error) {
    console.error('Preview content error:', error);
    req.flash('error', 'Đã xảy ra lỗi khi tải nội dung');
    res.redirect('/courses');
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

    // Get all progress records for this user and course
    const userProgresses = await Progress.findAll({
      where: {
        user_id: req.session.user.id,
        course_id: course.id
      },
      attributes: ['content_id', 'status', 'progress_percentage']
    });

    // Create a map of content_id -> progress for quick lookup
    const progressMap = {};
    userProgresses.forEach(progress => {
      progressMap[progress.content_id] = {
        status: progress.status,
        progress_percentage: progress.progress_percentage,
        isCompleted: progress.status === 'completed'
      };
    });

    // Attach progress info to each content
    const contentsWithProgress = contents.map(content => {
      const progress = progressMap[content.id] || {
        status: 'not_started',
        progress_percentage: 0,
        isCompleted: false
      };
      return {
        ...content.toJSON(),
        progress: progress
      };
    });

    // Update last accessed time
    enrollment.last_accessed = new Date();
    await enrollment.save();

    // Calculate progress
    const totalContents = contents.length;
    const completedContents = contentsWithProgress.filter(c => c.progress.isCompleted).length;

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
      contents: contentsWithProgress,
      progress: {
        total: totalContents,
        completed: completedContents,
        percentage: progressPercentage
      },
      currentUserId: req.session.user.id
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

    // Check if course is published
    if (course.status !== 'published') {
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

/**
 * Complete course (API)
 */
exports.complete = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user?.id || req.session?.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Bạn cần đăng nhập để hoàn thành khóa học'
      });
    }

    // Check if course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Khóa học không tìm thấy'
      });
    }

    // Check if user is enrolled
    const enrollment = await Enrollment.findOne({
      where: {
        user_id: userId,
        course_id: courseId
      }
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'Bạn chưa đăng ký khóa học này'
      });
    }

    // Check if already completed
    if (enrollment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Bạn đã hoàn thành khóa học này rồi'
      });
    }

    // Get all contents for the course
    const totalContents = await Content.count({
      where: {
        course_id: courseId,
        status: 'published'
      }
    });

    // Get completed contents count
    const completedContents = await Progress.count({
      where: {
        user_id: userId,
        course_id: courseId,
        status: 'completed'
      }
    });

    // Calculate progress percentage
    const progressPercentage = totalContents > 0 
      ? Math.round((completedContents / totalContents) * 100) 
      : 100;

    // Update enrollment to completed
    enrollment.status = 'completed';
    enrollment.progress_percentage = 100; // Set to 100% when manually completing
    await enrollment.save();

    // Log activity
    try {
      const elasticsearchService = require('../services/elasticsearchService');
      await elasticsearchService.logActivity({
        user_id: userId,
        action: 'complete_course',
        route_name: 'courses',
        route_path: `/api/courses/${courseId}/complete`,
        route_base: '/api/courses',
        resource_type: 'course',
        resource_id: courseId,
        ip_address: req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0],
        user_agent: req.get('user-agent'),
        session_id: req.sessionID,
        execution_time_ms: null,
        details: {
          method: req.method,
          course_id: courseId,
          progress_percentage: progressPercentage,
          total_contents: totalContents,
          completed_contents: completedContents
        }
      });
    } catch (logError) {
      // Log error but don't fail the request
      const { applicationLogger } = require('../config/logger');
      applicationLogger.error('Failed to log course completion activity', logError);
    }

    res.json({
      success: true,
      message: 'Chúc mừng! Bạn đã hoàn thành khóa học!',
      data: {
        enrollment: {
          id: enrollment.id,
          status: enrollment.status,
          progress_percentage: enrollment.progress_percentage
        },
        progress: {
          total: totalContents,
          completed: completedContents,
          percentage: 100
        }
      }
    });
  } catch (error) {
    const { applicationLogger } = require('../config/logger');
    applicationLogger.error('Complete course error', error, {
      type: 'course',
      operation: 'complete',
      courseId: req.params.id,
      userId: req.user?.id || req.session?.user?.id
    });
    res.status(500).json({
      success: false,
      message: 'Lỗi khi hoàn thành khóa học'
    });
  }
};

