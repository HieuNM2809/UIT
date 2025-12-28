const { Content, Course, User } = require('../../models');
const { Op } = require('sequelize');
const slugify = require('slugify');

/**
 * List all contents (Admin)
 */
exports.index = async (req, res) => {
  try {
    const { search, course_id, content_type, status, page = 1 } = req.query;
    const limit = 10;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { slug: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (course_id && course_id !== '') {
      whereClause.course_id = course_id;
    }
    if (content_type && content_type !== '') {
      whereClause.content_type = content_type;
    }
    if (status && status !== '') {
      whereClause.status = status;
    }

    // Get contents with pagination
    const { count, rows: contents } = await Content.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'slug'],
          include: [
            {
              model: User,
              as: 'instructor',
              attributes: ['id', 'first_name', 'last_name', 'email']
            }
          ]
        }
      ],
      order: [['course_id', 'ASC'], ['order_index', 'ASC'], ['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Get all courses for filter dropdown
    const courses = await Course.findAll({
      attributes: ['id', 'title', 'slug'],
      order: [['title', 'ASC']]
    });

    const totalPages = Math.ceil(count / limit);

    // Statistics
    const stats = {
      total: await Content.count(),
      published: await Content.count({ where: { status: 'published' } }),
      draft: await Content.count({ where: { status: 'draft' } }),
      archived: await Content.count({ where: { status: 'archived' } })
    };

    res.locals.currentPath = '/admin/contents';
    res.render('pages/admin/contents/index', {
      title: 'Quản lý nội dung khóa học',
      pageHeader: 'Quản lý nội dung khóa học',
      contents,
      courses,
      pagination: {
        current_page: parseInt(page),
        total_pages: totalPages,
        total_items: count,
        has_prev: page > 1,
        has_next: page < totalPages
      },
      currentFilters: {
        search: search || '',
        course_id: course_id || '',
        content_type: content_type || '',
        status: status || ''
      },
      stats,
      contentTypes: [
        { value: 'lesson', label: 'Bài học' },
        { value: 'video', label: 'Video' },
        { value: 'document', label: 'Tài liệu' },
        { value: 'quiz', label: 'Câu hỏi' },
        { value: 'assignment', label: 'Bài tập' }
      ]
    });
  } catch (error) {
    console.error('Admin contents list error:', error);
    req.flash('error', 'Đã xảy ra lỗi khi tải danh sách nội dung');
    res.redirect('/admin');
  }
};

/**
 * Show create content form
 */
exports.showCreateForm = async (req, res) => {
  try {
    // Get all courses for dropdown
    const courses = await Course.findAll({
      attributes: ['id', 'title', 'slug'],
      order: [['title', 'ASC']]
    });

    res.locals.currentPath = '/admin/contents/create';
    res.render('pages/admin/contents/form', {
      title: 'Tạo nội dung mới',
      pageHeader: 'Tạo nội dung mới',
      content: null,
      courses,
      isEdit: false,
      contentTypes: [
        { value: 'lesson', label: 'Bài học' },
        { value: 'video', label: 'Video' },
        { value: 'document', label: 'Tài liệu' },
        { value: 'quiz', label: 'Câu hỏi' },
        { value: 'assignment', label: 'Bài tập' }
      ]
    });
  } catch (error) {
    console.error('Admin create content form error:', error);
    req.flash('error', 'Đã xảy ra lỗi khi tải form');
    res.redirect('/admin/contents');
  }
};

/**
 * Create new content
 */
exports.create = async (req, res) => {
  try {
    const {
      course_id,
      title,
      slug,
      description,
      content_type,
      body,
      video_url,
      order_index,
      is_free,
      status,
      estimated_duration
    } = req.body;

    // Generate slug if not provided
    let contentSlug = slug || slugify(title, { lower: true, strict: true });
    
    // Ensure unique slug
    let slugExists = await Content.findOne({ where: { slug: contentSlug, course_id } });
    let counter = 1;
    while (slugExists) {
      contentSlug = `${slugify(title, { lower: true, strict: true })}-${counter}`;
      slugExists = await Content.findOne({ where: { slug: contentSlug, course_id } });
      counter++;
    }

    // Create content
    const content = await Content.create({
      course_id,
      title,
      slug: contentSlug,
      description: description || null,
      content_type: content_type || 'lesson',
      body: body || null,
      video_url: video_url || null,
      order_index: parseInt(order_index) || 0,
      is_free: is_free === 'true' || is_free === true,
      status: status || 'draft',
      estimated_duration: estimated_duration ? parseInt(estimated_duration) : null
    });

    req.flash('success', 'Tạo nội dung thành công');
    res.redirect(`/admin/contents/${content.id}`);
  } catch (error) {
    console.error('Admin create content error:', error);
    req.flash('error', 'Đã xảy ra lỗi khi tạo nội dung');
    res.redirect('/admin/contents/create');
  }
};

/**
 * Show edit content form
 */
exports.showEditForm = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await Content.findByPk(id, {
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'slug']
        }
      ]
    });

    if (!content) {
      req.flash('error', 'Không tìm thấy nội dung');
      return res.redirect('/admin/contents');
    }

    // Get all courses for dropdown
    const courses = await Course.findAll({
      attributes: ['id', 'title', 'slug'],
      order: [['title', 'ASC']]
    });

    res.locals.currentPath = `/admin/contents/${id}/edit`;
    res.render('pages/admin/contents/form', {
      title: 'Chỉnh sửa nội dung',
      pageHeader: 'Chỉnh sửa nội dung',
      content,
      courses,
      isEdit: true,
      contentTypes: [
        { value: 'lesson', label: 'Bài học' },
        { value: 'video', label: 'Video' },
        { value: 'document', label: 'Tài liệu' },
        { value: 'quiz', label: 'Câu hỏi' },
        { value: 'assignment', label: 'Bài tập' }
      ]
    });
  } catch (error) {
    console.error('Admin edit content form error:', error);
    req.flash('error', 'Đã xảy ra lỗi khi tải form');
    res.redirect('/admin/contents');
  }
};

/**
 * Update content
 */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      course_id,
      title,
      slug,
      description,
      content_type,
      body,
      video_url,
      order_index,
      is_free,
      status,
      estimated_duration
    } = req.body;

    const content = await Content.findByPk(id);
    if (!content) {
      req.flash('error', 'Không tìm thấy nội dung');
      return res.redirect('/admin/contents');
    }

    // Generate slug if not provided or changed
    let contentSlug = slug || slugify(title, { lower: true, strict: true });
    
    // Ensure unique slug (excluding current content)
    if (contentSlug !== content.slug) {
      let slugExists = await Content.findOne({
        where: {
          slug: contentSlug,
          course_id,
          id: { [Op.ne]: id }
        }
      });
      let counter = 1;
      while (slugExists) {
        contentSlug = `${slugify(title, { lower: true, strict: true })}-${counter}`;
        slugExists = await Content.findOne({
          where: {
            slug: contentSlug,
            course_id,
            id: { [Op.ne]: id }
          }
        });
        counter++;
      }
    }

    // Update content
    await content.update({
      course_id,
      title,
      slug: contentSlug,
      description: description || null,
      content_type: content_type || 'lesson',
      body: body || null,
      video_url: video_url || null,
      order_index: parseInt(order_index) || 0,
      is_free: is_free === 'true' || is_free === true,
      status: status || 'draft',
      estimated_duration: estimated_duration ? parseInt(estimated_duration) : null
    });

    req.flash('success', 'Cập nhật nội dung thành công');
    res.redirect(`/admin/contents/${content.id}`);
  } catch (error) {
    console.error('Admin update content error:', error);
    req.flash('error', 'Đã xảy ra lỗi khi cập nhật nội dung');
    res.redirect(`/admin/contents/${id}/edit`);
  }
};

/**
 * Show content details
 */
exports.show = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await Content.findByPk(id, {
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'slug', 'thumbnail'],
          include: [
            {
              model: User,
              as: 'instructor',
              attributes: ['id', 'first_name', 'last_name', 'email', 'avatar']
            }
          ]
        }
      ]
    });

    if (!content) {
      req.flash('error', 'Không tìm thấy nội dung');
      return res.redirect('/admin/contents');
    }

    res.locals.currentPath = `/admin/contents/${id}`;
    res.render('pages/admin/contents/show', {
      title: content.title,
      pageHeader: 'Chi tiết nội dung',
      content
    });
  } catch (error) {
    console.error('Admin show content error:', error);
    req.flash('error', 'Đã xảy ra lỗi khi tải thông tin nội dung');
    res.redirect('/admin/contents');
  }
};

/**
 * Update content status
 */
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'published', 'archived'].includes(status)) {
      req.flash('error', 'Trạng thái không hợp lệ');
      return res.redirect(`/admin/contents/${id}`);
    }

    const content = await Content.findByPk(id);
    if (!content) {
      req.flash('error', 'Không tìm thấy nội dung');
      return res.redirect('/admin/contents');
    }

    await content.update({ status });

    req.flash('success', 'Cập nhật trạng thái thành công');
    res.redirect(`/admin/contents/${id}`);
  } catch (error) {
    console.error('Admin update content status error:', error);
    req.flash('error', 'Đã xảy ra lỗi khi cập nhật trạng thái');
    res.redirect(`/admin/contents/${id}`);
  }
};

/**
 * Delete content
 */
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await Content.findByPk(id);
    if (!content) {
      req.flash('error', 'Không tìm thấy nội dung');
      return res.redirect('/admin/contents');
    }

    await content.destroy();

    req.flash('success', 'Xóa nội dung thành công');
    res.redirect('/admin/contents');
  } catch (error) {
    console.error('Admin delete content error:', error);
    req.flash('error', 'Đã xảy ra lỗi khi xóa nội dung');
    res.redirect(`/admin/contents/${id}`);
  }
};

