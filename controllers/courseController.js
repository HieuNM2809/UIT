const { Course, User, Category, Enrollment, Content, Progress, Rating } = require('../models');
const { Op } = require('sequelize');
const { applicationLogger } = require('../config/logger');

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
    const { slug } = req.params;
    
    // Check if slug is a UUID (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    
    // Build where clause - try slug first, then ID if it's a UUID
    const whereClause = isUUID 
      ? { id: slug }  // If it's a UUID, search by ID
      : { slug: slug }; // Otherwise, search by slug
    
    const course = await Course.findOne({
      where: whereClause,
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
    
    // If accessed by ID, redirect to slug URL for SEO and consistency
    if (isUUID && course.slug) {
      return res.redirect(301, `/courses/${course.slug}`);
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
    let certificate = null;
    let userRating = null;
    if (req.session.user) {
      enrollment = await Enrollment.findOne({
        where: {
          user_id: req.session.user.id,
          course_id: course.id
        }
      });

      // Get certificate if enrollment is completed
      if (enrollment && enrollment.status === 'completed') {
        const { Certificate } = require('../models');
        certificate = await Certificate.findByUserAndCourse(req.session.user.id, course.id);
        
        // Get user's rating if they have completed the course
        userRating = await Rating.findOne({
          where: {
            user_id: req.session.user.id,
            course_id: course.id
          }
        });
      }
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
      certificate,
      userRating,
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
    applicationLogger.info('Enroll route hit', {
      type: 'course',
      operation: 'enroll_request',
      method: req.method,
      path: req.path,
      courseId: req.params.id,
      userId: req.user?.id || null
    });

    const courseId = req.params.id;
    
    // req.user should be set by authenticate middleware
    if (!req.user || !req.user.id) {
      applicationLogger.warn('Enroll attempt without authentication', {
        type: 'course',
        operation: 'enroll_unauthorized',
        courseId: courseId,
        ip_address: req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0]
      });
      return res.status(401).json({
        success: false,
        message: 'Bạn cần đăng nhập để đăng ký khóa học'
      });
    }
    
    const userId = req.user.id;
    applicationLogger.info('User authenticated for enrollment', {
      type: 'course',
      operation: 'enroll_authenticated',
      userId: userId,
      courseId: courseId
    });

    // Check if course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      applicationLogger.warn('Enroll attempt for non-existent course', {
        type: 'course',
        operation: 'enroll_course_not_found',
        courseId: courseId,
        userId: userId
      });
      return res.status(404).json({
        success: false,
        message: 'Khóa học không tìm thấy'
      });
    }

    // Check if course is published
    if (course.status !== 'published') {
      applicationLogger.warn('Enroll attempt for unpublished course', {
        type: 'course',
        operation: 'enroll_course_unpublished',
        courseId: courseId,
        courseStatus: course.status,
        userId: userId
      });
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
      applicationLogger.info('Enroll attempt for already enrolled course', {
        type: 'course',
        operation: 'enroll_already_enrolled',
        courseId: courseId,
        userId: userId,
        enrollmentId: existingEnrollment.id,
        enrollmentStatus: existingEnrollment.status
      });
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

    applicationLogger.info('Course enrollment successful', {
      type: 'course',
      operation: 'enroll_success',
      courseId: courseId,
      userId: userId,
      enrollmentId: enrollment.id,
      enrollmentStatus: enrollment.status,
      courseTitle: course.title
    });

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
    applicationLogger.error('Enroll course error', error, {
      type: 'course',
      operation: 'enroll_error',
      courseId: req.params.id,
      userId: req.user?.id || null,
      method: req.method,
      path: req.path,
      ip_address: req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0]
    });
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

    // Generate certificate automatically
    let certificate = null;
    try {
      const { Certificate } = require('../models');
      const certificateService = require('../services/certificateService');
      
      // Check if certificate already exists
      certificate = await Certificate.findByUserAndCourse(userId, courseId);
      
      if (!certificate) {
        // Generate certificate number
        const certificateNumber = Certificate.generateCertificateNumber();
        
        // Get user and instructor info
        const user = await User.findByPk(userId, {
          attributes: ['id', 'first_name', 'last_name', 'email']
        });
        
        const instructor = course.instructor || await User.findByPk(course.instructor_id, {
          attributes: ['id', 'first_name', 'last_name']
        });
        
        const studentName = `${user.first_name} ${user.last_name}`;
        const instructorName = instructor ? `${instructor.first_name} ${instructor.last_name}` : 'StudyMate';
        
        // Generate certificate PDF
        const { pdfPath, filename } = await certificateService.generateCertificate({
          studentName,
          courseTitle: course.title,
          certificateNumber,
          instructorName
        });
        
        // Create certificate record
        certificate = await Certificate.create({
          user_id: userId,
          course_id: courseId,
          enrollment_id: enrollment.id,
          certificate_number: certificateNumber,
          pdf_path: filename,
          metadata: {
            student_name: studentName,
            course_title: course.title,
            instructor_name: instructorName,
            progress_percentage: 100
          }
        });

        applicationLogger.info('Certificate generated automatically', {
          type: 'certificate',
          operation: 'auto_generate',
          certificateId: certificate.id,
          certificateNumber: certificateNumber,
          userId: userId,
          courseId: courseId
        });
      }
    } catch (certError) {
      // Log error but don't fail the completion
      applicationLogger.error('Failed to generate certificate', certError, {
        type: 'certificate',
        operation: 'auto_generate',
        userId: userId,
        courseId: courseId
      });
    }

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

/**
 * Submit rating for a completed course
 * POST /api/courses/:id/rate
 */
exports.submitRating = async (req, res) => {
  try {
    const { id: courseId } = req.params;
    const { rating, review } = req.body;
    const userId = req.user?.id || req.session?.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Bạn cần đăng nhập để đánh giá khóa học'
      });
    }

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Đánh giá phải từ 1 đến 5 sao'
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

    // Check if user has completed the course
    const enrollment = await Enrollment.findOne({
      where: {
        user_id: userId,
        course_id: courseId,
        status: 'completed'
      }
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'Bạn cần hoàn thành khóa học trước khi đánh giá'
      });
    }

    // Find or create rating
    const [userRating, created] = await Rating.findOrCreate({
      where: {
        user_id: userId,
        course_id: courseId
      },
      defaults: {
        rating: parseInt(rating),
        review: review || null,
        is_verified: true // Verified because user completed the course
      }
    });

    // Update if rating already exists
    if (!created) {
      userRating.rating = parseInt(rating);
      if (review !== undefined) {
        userRating.review = review || null;
      }
      await userRating.save();
    }

    // Calculate new average rating
    const allRatings = await Rating.findAll({
      where: { course_id: courseId },
      attributes: ['rating']
    });

    if (allRatings.length > 0) {
      const totalRating = allRatings.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = (totalRating / allRatings.length).toFixed(2);
      
      // Update course average rating
      course.average_rating = parseFloat(averageRating);
      await course.save();
    }

    applicationLogger.info('Course rating submitted', {
      type: 'course',
      operation: 'submit_rating',
      courseId: courseId,
      userId: userId,
      rating: parseInt(rating),
      isNew: created
    });

    res.json({
      success: true,
      message: created ? 'Cảm ơn bạn đã đánh giá khóa học!' : 'Đánh giá đã được cập nhật!',
      data: {
        rating: {
          id: userRating.id,
          rating: userRating.rating,
          review: userRating.review,
          created_at: userRating.created_at,
          updated_at: userRating.updated_at
        },
        course: {
          average_rating: course.average_rating,
          total_ratings: allRatings.length
        }
      }
    });
  } catch (error) {
    applicationLogger.error('Submit rating error', error, {
      type: 'course',
      operation: 'submit_rating',
      courseId: req.params.id,
      userId: req.user?.id || req.session?.user?.id
    });

    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi gửi đánh giá'
    });
  }
};

