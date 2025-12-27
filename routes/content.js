const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { Op } = require('sequelize');

const { 
  Content, 
  Course, 
  User, 
  Progress, 
  Enrollment,
  Discussion
} = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
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
 * @desc    Get content by course
 * @route   GET /api/content/course/:courseId
 * @access  Private
 */
router.get('/course/:courseId', 
  [
    query('include_drafts')
      .optional()
      .isBoolean()
      .withMessage('include_drafts must be boolean')
  ],
  checkValidationErrors,
  asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const { include_drafts } = req.query;

    // Get course and check access
    const course = await Course.findByPk(courseId);
    if (!course) {
      throw new AppError('Course not found', 404, 'COURSE_NOT_FOUND');
    }

    // Check if user can access course content
    let enrollment = null;
    if (!course.is_public && course.status !== 'published') {
      if (course.instructor_id !== req.user.id && !req.user.isAdmin()) {
        throw new AppError('Course not found', 404, 'COURSE_NOT_FOUND');
      }
    } else {
      enrollment = await Enrollment.findByUserAndCourse(req.user.id, courseId);
    }

    // Build where clause
    const whereClause = { course_id: courseId };
    
    // Only show published content unless user is instructor/admin or specifically requesting drafts
    if (!(course.instructor_id === req.user.id || req.user.isAdmin()) || !include_drafts) {
      whereClause.status = 'published';
    }

    const contents = await Content.findByCourse(courseId, {
      where: whereClause,
      include: [
        {
          model: Progress,
          as: 'progress',
          where: { user_id: req.user.id },
          required: false
        }
      ]
    });

    // Filter content based on user access
    const accessibleContents = contents.filter(content => {
      return content.isAccessibleBy(req.user, enrollment);
    });

    applicationLogger.api(`Course content accessed: ${course.title} by ${req.user.email}`);

    res.json({
      success: true,
      data: {
        contents: accessibleContents,
        course: {
          id: course.id,
          title: course.title,
          instructor_id: course.instructor_id
        }
      }
    });
  })
);

/**
 * @desc    Create new content
 * @route   POST /api/content
 * @access  Private/Teacher
 */
router.post('/',
  authorize('teacher', 'lecturer', 'admin', 'system_admin'),
  [
    body('course_id')
      .isUUID()
      .withMessage('Valid course ID is required'),
    body('title')
      .trim()
      .isLength({ min: 3, max: 255 })
      .withMessage('Title must be between 3 and 255 characters'),
    body('content_type')
      .isIn(['lesson', 'video', 'document', 'quiz', 'assignment', 'discussion', 'resource', 'live_session'])
      .withMessage('Invalid content type'),
    body('content_format')
      .optional()
      .isIn(['text', 'html', 'markdown', 'video', 'audio', 'pdf', 'image', 'interactive'])
      .withMessage('Invalid content format'),
    body('order_index')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Order index must be a non-negative integer'),
    body('estimated_duration')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Estimated duration must be a positive number')
  ],
  checkValidationErrors,
  asyncHandler(async (req, res) => {
    const {
      course_id,
      title,
      description,
      content_type,
      content_format,
      body: contentBody,
      video_url,
      video_duration,
      order_index,
      is_free,
      is_preview,
      estimated_duration,
      difficulty_level,
      learning_objectives,
      prerequisites
    } = req.body;

    // Verify course exists and user has permission
    const course = await Course.findByPk(course_id);
    if (!course) {
      throw new AppError('Course not found', 404, 'COURSE_NOT_FOUND');
    }

    if (course.instructor_id !== req.user.id && !req.user.isAdmin()) {
      throw new AppError('Not authorized to add content to this course', 403, 'NOT_AUTHORIZED');
    }

    // Create content
    const content = await Content.create({
      course_id,
      title: title.trim(),
      description: description ? description.trim() : null,
      content_type,
      content_format: content_format || 'text',
      body: contentBody || null,
      video_url: video_url || null,
      video_duration: video_duration || null,
      order_index: order_index || 0,
      is_free: is_free || false,
      is_preview: is_preview || false,
      estimated_duration: estimated_duration || null,
      difficulty_level: difficulty_level || 'easy',
      learning_objectives: learning_objectives || [],
      prerequisites: prerequisites || [],
      status: 'draft'
    });

    applicationLogger.api(`Content created: ${content.title} in course ${course.title} by ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Content created successfully',
      data: { content }
    });
  })
);

/**
 * @desc    Get content by ID
 * @route   GET /api/content/:id
 * @access  Private
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const content = await Content.findByPk(req.params.id, {
    include: [
      {
        model: Course,
        as: 'course',
        attributes: ['id', 'title', 'instructor_id', 'is_public', 'status'],
        include: [
          {
            model: User,
            as: 'instructor',
            attributes: ['id', 'first_name', 'last_name', 'email']
          }
        ]
      },
      {
        model: Progress,
        as: 'progress',
        where: { user_id: req.user.id },
        required: false
      },
      {
        model: Discussion,
        as: 'discussions',
        limit: 5,
        order: [['created_at', 'DESC']],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'first_name', 'last_name', 'avatar']
          }
        ]
      }
    ]
  });

  if (!content) {
    throw new AppError('Content not found', 404, 'CONTENT_NOT_FOUND');
  }

  // Check access permissions
  const enrollment = await Enrollment.findByUserAndCourse(req.user.id, content.course.id);
  
  if (!content.isAccessibleBy(req.user, enrollment)) {
    throw new AppError('Content not found', 404, 'CONTENT_NOT_FOUND');
  }

  // Check prerequisites
  if (content.prerequisites && content.prerequisites.length > 0) {
    const userProgress = await Progress.findAll({
      where: { 
        user_id: req.user.id,
        course_id: content.course_id 
      }
    });

    if (!content.canUserAccess(req.user, userProgress)) {
      throw new AppError('Prerequisites not met', 403, 'PREREQUISITES_NOT_MET');
    }
  }

  // Increment view count
  await content.incrementView();

  // Create or update progress
  let progress = await Progress.findByUserAndContent(req.user.id, content.id);
  if (!progress && enrollment) {
    progress = await Progress.create({
      user_id: req.user.id,
      course_id: content.course_id,
      content_id: content.id,
      enrollment_id: enrollment.id,
      status: 'in_progress',
      started_at: new Date()
    });
  } else if (progress && progress.status === 'not_started') {
    await progress.start();
  }

  applicationLogger.api(`Content accessed: ${content.title} by ${req.user.email}`);

  res.json({
    success: true,
    data: {
      content,
      progress: progress || null
    }
  });
}));

/**
 * @desc    Update content
 * @route   PUT /api/content/:id
 * @access  Private (Instructor or Admin)
 */
router.put('/:id',
  [
    body('title')
      .optional()
      .trim()
      .isLength({ min: 3, max: 255 })
      .withMessage('Title must be between 3 and 255 characters'),
    body('content_type')
      .optional()
      .isIn(['lesson', 'video', 'document', 'quiz', 'assignment', 'discussion', 'resource', 'live_session'])
      .withMessage('Invalid content type'),
    body('status')
      .optional()
      .isIn(['draft', 'published', 'archived'])
      .withMessage('Invalid status')
  ],
  checkValidationErrors,
  asyncHandler(async (req, res) => {
    const content = await Content.findByPk(req.params.id, {
      include: [{ model: Course, as: 'course' }]
    });

    if (!content) {
      throw new AppError('Content not found', 404, 'CONTENT_NOT_FOUND');
    }

    // Check permissions
    if (content.course.instructor_id !== req.user.id && !req.user.isAdmin()) {
      throw new AppError('Not authorized to update this content', 403, 'NOT_AUTHORIZED');
    }

    const {
      title,
      description,
      content_type,
      content_format,
      body: contentBody,
      video_url,
      video_duration,
      order_index,
      is_free,
      is_preview,
      status,
      estimated_duration,
      difficulty_level,
      learning_objectives,
      prerequisites
    } = req.body;

    // Update fields
    if (title !== undefined) content.title = title.trim();
    if (description !== undefined) content.description = description ? description.trim() : null;
    if (content_type !== undefined) content.content_type = content_type;
    if (content_format !== undefined) content.content_format = content_format;
    if (contentBody !== undefined) content.body = contentBody;
    if (video_url !== undefined) content.video_url = video_url;
    if (video_duration !== undefined) content.video_duration = video_duration;
    if (order_index !== undefined) content.order_index = order_index;
    if (is_free !== undefined) content.is_free = is_free;
    if (is_preview !== undefined) content.is_preview = is_preview;
    if (status !== undefined) content.status = status;
    if (estimated_duration !== undefined) content.estimated_duration = estimated_duration;
    if (difficulty_level !== undefined) content.difficulty_level = difficulty_level;
    if (learning_objectives !== undefined) content.learning_objectives = learning_objectives;
    if (prerequisites !== undefined) content.prerequisites = prerequisites;

    await content.save();

    applicationLogger.api(`Content updated: ${content.title} by ${req.user.email}`);

    res.json({
      success: true,
      message: 'Content updated successfully',
      data: { content }
    });
  })
);

/**
 * @desc    Delete content
 * @route   DELETE /api/content/:id
 * @access  Private (Instructor or Admin)
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  const content = await Content.findByPk(req.params.id, {
    include: [{ model: Course, as: 'course' }]
  });

  if (!content) {
    throw new AppError('Content not found', 404, 'CONTENT_NOT_FOUND');
  }

  // Check permissions
  if (content.course.instructor_id !== req.user.id && !req.user.isAdmin()) {
    throw new AppError('Not authorized to delete this content', 403, 'NOT_AUTHORIZED');
  }

  // Soft delete - archive the content
  content.status = 'archived';
  await content.save();

  applicationLogger.api(`Content archived: ${content.title} by ${req.user.email}`);

  res.json({
    success: true,
    message: 'Content archived successfully'
  });
}));

/**
 * @desc    Mark content as completed
 * @route   POST /api/content/:id/complete
 * @access  Private
 */
router.post('/:id/complete', asyncHandler(async (req, res) => {
  const content = await Content.findByPk(req.params.id);
  
  if (!content) {
    throw new AppError('Content not found', 404, 'CONTENT_NOT_FOUND');
  }

  // Find user's progress
  let progress = await Progress.findByUserAndContent(req.user.id, content.id);
  
  if (!progress) {
    // Create progress if it doesn't exist
    const enrollment = await Enrollment.findByUserAndCourse(req.user.id, content.course_id);
    if (!enrollment) {
      throw new AppError('Not enrolled in this course', 403, 'NOT_ENROLLED');
    }

    progress = await Progress.create({
      user_id: req.user.id,
      course_id: content.course_id,
      content_id: content.id,
      enrollment_id: enrollment.id
    });
  }

  // Mark as completed
  await progress.complete();
  await content.incrementCompletion();

  // Update enrollment progress
  const enrollment = await Enrollment.findByPk(progress.enrollment_id);
  if (enrollment) {
    // Calculate overall course progress
    const totalContents = await Content.count({
      where: { course_id: content.course_id, status: 'published' }
    });
    
    const completedContents = await Progress.count({
      where: { 
        user_id: req.user.id, 
        course_id: content.course_id, 
        status: 'completed' 
      }
    });

    const progressPercentage = totalContents > 0 ? (completedContents / totalContents) * 100 : 0;
    await enrollment.updateProgress(progressPercentage);
  }

  applicationLogger.api(`Content completed: ${content.title} by ${req.user.email}`);

  res.json({
    success: true,
    message: 'Content marked as completed',
    data: { progress }
  });
}));

/**
 * @desc    Update content progress
 * @route   POST /api/content/:id/progress
 * @access  Private
 */
router.post('/:id/progress',
  [
    body('progress_percentage')
      .isFloat({ min: 0, max: 100 })
      .withMessage('Progress percentage must be between 0 and 100'),
    body('time_spent')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Time spent must be a positive integer'),
    body('last_position')
      .optional()
      .isObject()
      .withMessage('Last position must be an object')
  ],
  checkValidationErrors,
  asyncHandler(async (req, res) => {
    const content = await Content.findByPk(req.params.id);
    
    if (!content) {
      throw new AppError('Content not found', 404, 'CONTENT_NOT_FOUND');
    }

    const { progress_percentage, time_spent, last_position } = req.body;

    // Find or create progress
    let progress = await Progress.findByUserAndContent(req.user.id, content.id);
    
    if (!progress) {
      const enrollment = await Enrollment.findByUserAndCourse(req.user.id, content.course_id);
      if (!enrollment) {
        throw new AppError('Not enrolled in this course', 403, 'NOT_ENROLLED');
      }

      progress = await Progress.create({
        user_id: req.user.id,
        course_id: content.course_id,
        content_id: content.id,
        enrollment_id: enrollment.id
      });
    }

    // Update progress
    await progress.updateProgress(progress_percentage, last_position);
    
    if (time_spent) {
      await progress.addTimeSpent(time_spent);
    }

    res.json({
      success: true,
      message: 'Progress updated successfully',
      data: { progress }
    });
  })
);

module.exports = router;
