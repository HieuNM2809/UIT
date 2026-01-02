const { PersonalNote, Content, Course } = require('../models');
const { applicationLogger } = require('../config/logger');
const { AppError } = require('../middleware/errorHandler');

/**
 * Get or create personal note for a content
 */
exports.getOrCreate = async (req, res) => {
  try {
    const { contentId } = req.params;
    const userId = req.session.user.id;

    // Verify content exists
    const content = await Content.findByPk(contentId);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Nội dung không tồn tại'
      });
    }

    // Find or create note
    let note = await PersonalNote.findOne({
      where: {
        user_id: userId,
        content_id: contentId
      }
    });

    if (!note) {
      // Create note with empty string (now allowed by model validation)
      note = await PersonalNote.create({
        user_id: userId,
        content_id: contentId,
        course_id: content.course_id,
        note: '',
        is_pinned: false
      });
    }

    applicationLogger.info('Personal note retrieved', {
      type: 'personal_note',
      operation: 'get_or_create',
      userId: userId,
      contentId: contentId
    });

    res.json({
      success: true,
      data: {
        note: {
          id: note.id,
          note: note.note,
          is_pinned: note.is_pinned,
          created_at: note.created_at,
          updated_at: note.updated_at
        }
      }
    });
  } catch (error) {
    applicationLogger.error('Error getting personal note', error, {
      type: 'personal_note',
      operation: 'get_or_create',
      userId: req.session.user?.id,
      contentId: req.params.contentId
    });

    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy ghi chú'
    });
  }
};

/**
 * Update personal note
 */
exports.update = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { note, is_pinned } = req.body;
    const userId = req.session.user.id;

    // Find note
    const personalNote = await PersonalNote.findByPk(noteId);
    if (!personalNote) {
      return res.status(404).json({
        success: false,
        message: 'Ghi chú không tồn tại'
      });
    }

    // Verify ownership
    if (personalNote.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền chỉnh sửa ghi chú này'
      });
    }

    // Validate note length (allow empty string)
    if (note !== undefined && note.length > 10000) {
      return res.status(400).json({
        success: false,
        message: 'Ghi chú không được vượt quá 10000 ký tự'
      });
    }

    // Update note
    if (note !== undefined) {
      personalNote.note = note;
    }
    if (is_pinned !== undefined) {
      personalNote.is_pinned = is_pinned;
    }

    await personalNote.save();

    applicationLogger.info('Personal note updated', {
      type: 'personal_note',
      operation: 'update',
      userId: userId,
      noteId: noteId
    });

    res.json({
      success: true,
      data: {
        note: {
          id: personalNote.id,
          note: personalNote.note,
          is_pinned: personalNote.is_pinned,
          updated_at: personalNote.updated_at
        }
      }
    });
  } catch (error) {
    applicationLogger.error('Error updating personal note', error, {
      type: 'personal_note',
      operation: 'update',
      userId: req.session.user?.id,
      noteId: req.params.noteId
    });

    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật ghi chú'
    });
  }
};

/**
 * Delete personal note
 */
exports.delete = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.session.user.id;

    // Find note
    const personalNote = await PersonalNote.findByPk(noteId);
    if (!personalNote) {
      return res.status(404).json({
        success: false,
        message: 'Ghi chú không tồn tại'
      });
    }

    // Verify ownership
    if (personalNote.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xóa ghi chú này'
      });
    }

    await personalNote.destroy();

    applicationLogger.info('Personal note deleted', {
      type: 'personal_note',
      operation: 'delete',
      userId: userId,
      noteId: noteId
    });

    res.json({
      success: true,
      message: 'Đã xóa ghi chú'
    });
  } catch (error) {
    applicationLogger.error('Error deleting personal note', error, {
      type: 'personal_note',
      operation: 'delete',
      userId: req.session.user?.id,
      noteId: req.params.noteId
    });

    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa ghi chú'
    });
  }
};

/**
 * Get all notes for a course
 */
exports.getByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.session.user.id;

    const notes = await PersonalNote.findAll({
      where: {
        user_id: userId,
        course_id: courseId
      },
      include: [
        {
          model: Content,
          as: 'content',
          attributes: ['id', 'title', 'content_type']
        }
      ],
      order: [
        ['is_pinned', 'DESC'],
        ['updated_at', 'DESC']
      ]
    });

    res.json({
      success: true,
      data: {
        notes: notes.map(note => ({
          id: note.id,
          note: note.note,
          is_pinned: note.is_pinned,
          content: {
            id: note.content.id,
            title: note.content.title,
            content_type: note.content.content_type
          },
          created_at: note.created_at,
          updated_at: note.updated_at
        }))
      }
    });
  } catch (error) {
    applicationLogger.error('Error getting notes by course', error, {
      type: 'personal_note',
      operation: 'get_by_course',
      userId: req.session.user?.id,
      courseId: req.params.courseId
    });

    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách ghi chú'
    });
  }
};

/**
 * Get all pinned notes for current user
 */
exports.getPinnedNotes = async (req, res) => {
  try {
    const userId = req.session.user.id;

    const notes = await PersonalNote.findAll({
      where: {
        user_id: userId,
        is_pinned: true
      },
      include: [
        {
          model: Content,
          as: 'content',
          attributes: ['id', 'title', 'content_type', 'course_id']
        },
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'slug']
        }
      ],
      order: [
        ['updated_at', 'DESC']
      ]
    });

    applicationLogger.info('Pinned notes retrieved', {
      type: 'personal_note',
      operation: 'get_pinned_notes',
      userId: userId,
      count: notes.length
    });

    res.render('pages/personal-notes/pinned', {
      title: 'Ghi chú đã ghim',
      pageHeader: 'Ghi chú đã ghim',
      notes: notes.map(note => ({
        id: note.id,
        note: note.note,
        is_pinned: note.is_pinned,
        content: {
          id: note.content.id,
          title: note.content.title,
          content_type: note.content.content_type
        },
        course: {
          id: note.course.id,
          title: note.course.title,
          slug: note.course.slug
        },
        created_at: note.created_at,
        updated_at: note.updated_at
      })),
      currentUserId: userId
    });
  } catch (error) {
    applicationLogger.error('Error getting pinned notes', error, {
      type: 'personal_note',
      operation: 'get_pinned_notes',
      userId: req.session.user?.id
    });

    res.status(500).render('error', {
      title: 'Lỗi hệ thống',
      error: {
        status: 500,
        message: 'Đã xảy ra lỗi khi tải danh sách ghi chú đã ghim'
      }
    });
  }
};

