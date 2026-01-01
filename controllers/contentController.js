const { Content, Course, User, Progress, Enrollment, Discussion } = require('../models');
const { Op } = require('sequelize');
const { AppError } = require('../middleware/errorHandler');
const { applicationLogger } = require('../config/logger');

/**
 * Get content by course
 */
exports.getByCourse = async (req, res) => {
  const { courseId } = req.params;
  const { include_drafts } = req.query;

  // Get course and check access
  const course = await Course.findByPk(courseId);
  if (!course) {
    throw new AppError('Course not found', 404, 'COURSE_NOT_FOUND');
  }

  // Check if user can access course content
  let enrollment = null;
  if (course.status !== 'published') {
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
};

/**
 * Create new content
 */
exports.create = async (req, res) => {
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
};

/**
 * Get content by ID
 */
exports.show = async (req, res) => {
  const content = await Content.findByPk(req.params.id, {
    include: [
      {
        model: Course,
        as: 'course',
        attributes: ['id', 'title', 'instructor_id', 'status'],
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
};

/**
 * Update content
 */
exports.update = async (req, res) => {
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
};

/**
 * Delete content
 */
exports.delete = async (req, res) => {
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
};

/**
 * Mark content as completed
 */
exports.complete = async (req, res) => {
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
};

/**
 * Update content progress
 */
exports.updateProgress = async (req, res) => {
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
};

