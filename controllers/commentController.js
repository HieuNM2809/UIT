const { Comment, Course, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Create a new comment
 */
exports.create = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: 'Bạn cần đăng nhập để bình luận'
      });
    }

    const { content, course_id, parent_id } = req.body;

    // Get course_id from request params if not in body (from URL like /courses/:slug/comments)
    let actualCourseId = course_id;
    
    if (!actualCourseId && req.params.slug) {
      // Find course by slug from URL params
      const course = await Course.findOne({ where: { slug: req.params.slug } });
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Khóa học không tồn tại'
        });
      }
      actualCourseId = course.id;
    } else if (actualCourseId) {
      // Check if course exists by ID
      const course = await Course.findByPk(actualCourseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Khóa học không tồn tại'
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin khóa học'
      });
    }

    // If replying to a comment, check if parent comment exists
    if (parent_id) {
      const parentComment = await Comment.findOne({
        where: {
          id: parent_id,
          course_id: actualCourseId,
          status: 'active'
        }
      });

      if (!parentComment) {
        return res.status(404).json({
          success: false,
          message: 'Bình luận gốc không tồn tại'
        });
      }

      // Don't allow nested replies (only 1 level deep)
      if (parentComment.parent_id) {
        return res.status(400).json({
          success: false,
          message: 'Không thể trả lời bình luận con'
        });
      }
    }

    // Create comment
    const comment = await Comment.create({
      content,
      course_id: actualCourseId,
      user_id: req.session.user.id,
      parent_id: parent_id || null
    });

    // Get comment with user info for response
    const commentWithUser = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'avatar', 'email']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Bình luận thành công',
      data: commentWithUser
    });

  } catch (error) {
    console.error('Comment create error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo bình luận: ' + (error.message || 'Vui lòng thử lại')
    });
  }
};

/**
 * Get comments for a course
 */
exports.list = async (req, res) => {
  try {
    const { slug } = req.params;
    const { page = 1, limit = 5, sort = 'newest' } = req.query;

    // Find course by slug
    const course = await Course.findOne({ where: { slug } });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Khóa học không tồn tại'
      });
    }

    // Build sort order
    let orderClause;
    switch (sort) {
      case 'oldest':
        orderClause = [['created_at', 'ASC']];
        break;
      case 'most_liked':
        orderClause = [['likes_count', 'DESC'], ['created_at', 'DESC']];
        break;
      default: // newest
        orderClause = [['created_at', 'DESC']];
    }

    // Get comments with pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows: comments } = await Comment.findAndCountAll({
      where: {
        course_id: course.id,
        status: 'active',
        parent_id: null // Only top-level comments
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'avatar', 'email']
        },
        {
          model: Comment,
          as: 'replies',
          where: { status: 'active' },
          required: false,
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'first_name', 'last_name', 'avatar', 'email']
            }
          ],
          order: [['created_at', 'ASC']]
        }
      ],
      order: orderClause,
      limit: parseInt(limit),
      offset: offset
    });

    res.json({
      success: true,
      data: {
        comments,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / parseInt(limit)),
          total_items: count,
          has_prev: page > 1,
          has_next: page < Math.ceil(count / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Comment list error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tải danh sách bình luận'
    });
  }
};

/**
 * Update a comment
 */
exports.update = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: 'Bạn cần đăng nhập để chỉnh sửa bình luận'
      });
    }

    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Bình luận không tồn tại'
      });
    }

    // Check if user can edit
    if (!comment.canEditBy(req.session.user)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền chỉnh sửa bình luận này'
      });
    }

    // Update comment
    comment.content = content;
    await comment.save();

    // Get updated comment with user info
    const updatedComment = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'avatar', 'email']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Cập nhật bình luận thành công',
      data: updatedComment
    });

  } catch (error) {
    console.error('Comment update error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật bình luận: ' + (error.message || 'Vui lòng thử lại')
    });
  }
};

/**
 * Delete a comment (soft delete)
 */
exports.delete = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: 'Bạn cần đăng nhập để xóa bình luận'
      });
    }

    const { id } = req.params;

    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Bình luận không tồn tại'
      });
    }

    // Check if user can delete
    if (!comment.canDeleteBy(req.session.user)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xóa bình luận này'
      });
    }

    // Soft delete by updating status
    comment.status = 'deleted';
    await comment.save();

    res.json({
      success: true,
      message: 'Xóa bình luận thành công'
    });

  } catch (error) {
    console.error('Comment delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa bình luận: ' + (error.message || 'Vui lòng thử lại')
    });
  }
};

/**
 * Like/Unlike a comment
 */
exports.toggleLike = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: 'Bạn cần đăng nhập để thích bình luận'
      });
    }

    const { id } = req.params;

    const comment = await Comment.findByPk(id);
    if (!comment || comment.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Bình luận không tồn tại'
      });
    }

    // For now, just increment/decrement likes_count
    // In a full implementation, you'd have a separate CommentLike table
    // to track who liked what and prevent duplicate likes
    
    // Simplified approach: toggle between +1 and -1
    // This is a placeholder - in production you'd want proper like tracking
    const userLiked = comment.metadata?.likedBy?.includes(req.session.user.id);
    
    if (userLiked) {
      // Unlike
      comment.likes_count = Math.max(0, comment.likes_count - 1);
      comment.metadata = {
        ...comment.metadata,
        likedBy: (comment.metadata.likedBy || []).filter(userId => userId !== req.session.user.id)
      };
    } else {
      // Like
      comment.likes_count += 1;
      comment.metadata = {
        ...comment.metadata,
        likedBy: [...(comment.metadata.likedBy || []), req.session.user.id]
      };
    }

    await comment.save();

    res.status(200).json({
      success: true,
      message: userLiked ? 'Đã bỏ thích bình luận' : 'Đã thích bình luận',
      data: {
        liked: !userLiked,
        likes_count: comment.likes_count
      }
    });

  } catch (error) {
    console.error('Comment like toggle error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi thích bình luận'
    });
  }
};

/**
 * Report a comment
 */
exports.report = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: 'Bạn cần đăng nhập để báo cáo bình luận'
      });
    }

    const { id } = req.params;
    const { reason } = req.body;

    const comment = await Comment.findByPk(id);
    if (!comment || comment.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Bình luận không tồn tại'
      });
    }

    // Increment reports count
    comment.reports_count += 1;
    
    // Add report to metadata
    comment.metadata = {
      ...comment.metadata,
      reports: [
        ...(comment.metadata.reports || []),
        {
          user_id: req.session.user.id,
          reason: reason,
          reported_at: new Date()
        }
      ]
    };

    await comment.save();

    res.json({
      success: true,
      message: 'Đã báo cáo bình luận. Chúng tôi sẽ xem xét và xử lý.'
    });

  } catch (error) {
    console.error('Comment report error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi báo cáo bình luận'
    });
  }
};
