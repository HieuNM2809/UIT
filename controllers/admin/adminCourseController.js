const { Course, User, Category, Enrollment } = require('../../models');
const { Op } = require('sequelize');
const ExcelJS = require('exceljs');

/**
 * List all courses (Admin)
 */
exports.index = async (req, res) => {
  try {
    const { search, status, page = 1 } = req.query;
    const limit = 5;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { slug: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (status) {
      whereClause.status = status;
    }

    // Get courses with pagination
    const { count, rows: courses } = await Course.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Get categories for filter
    const categories = await Category.findAll({
      where: { is_active: true },
      order: [['name', 'ASC']]
    });

    const totalPages = Math.ceil(count / limit);

    res.locals.currentPath = '/admin/courses';
    res.render('pages/admin/courses/index', {
      title: 'Quản lý khóa học',
      pageHeader: 'Quản lý khóa học',
      courses,
      categories,
      pagination: {
        current_page: parseInt(page),
        total_pages: totalPages,
        total_items: count,
        has_prev: page > 1,
        has_next: page < totalPages
      },
      currentFilters: {
        search: search || '',
        status: status || ''
      }
    });
  } catch (error) {
    console.error('Admin courses list error:', error);
    res.status(500).render('error', {
      title: 'Lỗi hệ thống',
      error: {
        status: 500,
        message: 'Đã xảy ra lỗi khi tải danh sách khóa học'
      }
    });
  }
};

/**
 * Export courses to Excel
 */
exports.export = async (req, res) => {
  try {
    const { search, status } = req.query;

    // Build where clause (same as list route)
    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { slug: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (status) {
      whereClause.status = status;
    }

    // Get all courses (no pagination for export)
    const courses = await Course.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Danh sách khóa học');

    // Set column headers
    worksheet.columns = [
      { header: 'STT', key: 'stt', width: 8 },
      { header: 'Tiêu đề', key: 'title', width: 40 },
      { header: 'Slug', key: 'slug', width: 30 },
      { header: 'Giảng viên', key: 'instructor', width: 25 },
      { header: 'Email giảng viên', key: 'instructor_email', width: 30 },
      { header: 'Danh mục', key: 'category', width: 20 },
      { header: 'Độ khó', key: 'level', width: 15 },
      { header: 'Giá (VND)', key: 'price', width: 15 },
      { header: 'Trạng thái', key: 'status', width: 15 },
      { header: 'Công khai', key: 'is_public', width: 12 },
      { header: 'Số học viên', key: 'enrolled_count', width: 15 },
      { header: 'Đánh giá TB', key: 'average_rating', width: 15 },
      { header: 'Ngày tạo', key: 'created_at', width: 20 }
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Add data rows
    courses.forEach((course, index) => {
      const levelMap = {
        'beginner': 'Cơ bản',
        'intermediate': 'Trung cấp',
        'advanced': 'Nâng cao',
        'expert': 'Chuyên gia'
      };

      const statusMap = {
        'draft': 'Bản nháp',
        'published': 'Đã xuất bản',
        'archived': 'Đã lưu trữ'
      };

      worksheet.addRow({
        stt: index + 1,
        title: course.title,
        slug: course.slug,
        instructor: course.instructor ? `${course.instructor.first_name} ${course.instructor.last_name}` : 'N/A',
        instructor_email: course.instructor ? course.instructor.email : 'N/A',
        category: course.category ? course.category.name : 'Chưa phân loại',
        level: levelMap[course.level] || course.level,
        price: course.price || 0,
        status: statusMap[course.status] || course.status,
        is_public: course.is_public ? 'Có' : 'Không',
        enrolled_count: course.enrolled_count || 0,
        average_rating: course.average_rating ? parseFloat(course.average_rating).toFixed(1) : 'Chưa có',
        created_at: course.created_at ? new Date(course.created_at).toLocaleString('vi-VN') : ''
      });
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=danh-sach-khoa-hoc-${Date.now()}.xlsx`);

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Export courses error:', error);
    req.flash('error', 'Lỗi khi xuất file Excel');
    res.redirect('/admin/courses');
  }
};

/**
 * Show create course form
 */
exports.showCreateForm = async (req, res) => {
  try {
    // Get instructors and categories for form
    const instructors = await User.findAll({
      where: {
        role: { [Op.in]: ['lecturer', 'teacher', 'admin', 'system_admin'] },
        is_active: true
      },
      attributes: ['id', 'first_name', 'last_name', 'email'],
      order: [['first_name', 'ASC']]
    });

    const categories = await Category.findAll({
      where: { is_active: true },
      order: [['name', 'ASC']]
    });

    res.locals.currentPath = '/admin/courses/create';
    res.render('pages/admin/courses/form', {
      title: 'Tạo khóa học mới',
      pageHeader: 'Tạo khóa học mới',
      course: null,
      instructors,
      categories,
      isEdit: false
    });
  } catch (error) {
    console.error('Admin create course form error:', error);
    res.status(500).render('error', {
      title: 'Lỗi hệ thống',
      error: {
        status: 500,
        message: 'Đã xảy ra lỗi khi tải form'
      }
    });
  }
};

/**
 * Create new course
 */
exports.create = async (req, res) => {
  try {
    const {
      title,
      short_description,
      description,
      instructor_id,
      category_id,
      level,
      price,
      status,
      is_public,
      thumbnail
    } = req.body;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');

    // Check if slug already exists
    const existingCourse = await Course.findOne({ where: { slug } });
    if (existingCourse) {
      req.flash('error', 'Slug đã tồn tại. Vui lòng chọn tiêu đề khác.');
      return res.redirect('/admin/courses/create');
    }

    // Create course
    const course = await Course.create({
      title: title.trim(),
      slug,
      short_description: short_description ? short_description.trim() : null,
      description: description ? description.trim() : null,
      instructor_id,
      category_id: category_id || null,
      level: level || 'beginner',
      price: price ? parseFloat(price) : 0,
      status: status || 'draft',
      is_public: is_public === 'on' || is_public === true,
      thumbnail: thumbnail || null
    });

    // Update category course count if category exists
    if (category_id) {
      const category = await Category.findByPk(category_id);
      if (category) {
        await category.incrementCourseCount();
      }
    }

    req.flash('success', 'Đã tạo khóa học thành công!');
    res.redirect(`/admin/courses/${course.id}`);
  } catch (error) {
    console.error('Create course error:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      req.flash('error', 'Slug đã tồn tại. Vui lòng chọn tiêu đề khác.');
    } else {
      req.flash('error', 'Lỗi khi tạo khóa học');
    }
    res.redirect('/admin/courses/create');
  }
};

/**
 * Show edit course form
 */
exports.showEditForm = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }
      ]
    });

    if (!course) {
      req.flash('error', 'Khóa học không tìm thấy');
      return res.redirect('/admin/courses');
    }

    // Get instructors and categories for form
    const instructors = await User.findAll({
      where: {
        role: { [Op.in]: ['lecturer', 'teacher', 'admin', 'system_admin'] },
        is_active: true
      },
      attributes: ['id', 'first_name', 'last_name', 'email'],
      order: [['first_name', 'ASC']]
    });

    const categories = await Category.findAll({
      where: { is_active: true },
      order: [['name', 'ASC']]
    });

    res.locals.currentPath = `/admin/courses/${course.id}/edit`;
    res.render('pages/admin/courses/form', {
      title: `Sửa: ${course.title}`,
      pageHeader: 'Sửa khóa học',
      course,
      instructors,
      categories,
      isEdit: true
    });
  } catch (error) {
    console.error('Admin edit course form error:', error);
    req.flash('error', 'Lỗi khi tải form sửa');
    res.redirect('/admin/courses');
  }
};

/**
 * Update course
 */
exports.update = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      req.flash('error', 'Khóa học không tìm thấy');
      return res.redirect('/admin/courses');
    }

    const {
      title,
      short_description,
      description,
      instructor_id,
      category_id,
      level,
      price,
      status,
      is_public,
      thumbnail
    } = req.body;

    // Generate slug from title if title changed
    let slug = course.slug;
    if (title !== course.title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');

      // Check if new slug already exists
      const existingCourse = await Course.findOne({ 
        where: { slug, id: { [Op.ne]: course.id } }
      });
      if (existingCourse) {
        req.flash('error', 'Slug đã tồn tại. Vui lòng chọn tiêu đề khác.');
        return res.redirect(`/admin/courses/${course.id}/edit`);
      }
    }

    // Track category changes for course count
    const oldCategoryId = course.category_id;
    const newCategoryId = category_id || null;

    // Update course
    course.title = title.trim();
    course.slug = slug;
    course.short_description = short_description ? short_description.trim() : null;
    course.description = description ? description.trim() : null;
    course.instructor_id = instructor_id;
    course.category_id = newCategoryId;
    course.level = level;
    course.price = price ? parseFloat(price) : 0;
    course.status = status;
    course.is_public = is_public === 'on' || is_public === true;
    if (thumbnail) {
      course.thumbnail = thumbnail;
    }

    await course.save();

    // Update category course counts
    if (oldCategoryId !== newCategoryId) {
      if (oldCategoryId) {
        const oldCategory = await Category.findByPk(oldCategoryId);
        if (oldCategory) {
          await oldCategory.decrementCourseCount();
        }
      }
      if (newCategoryId) {
        const newCategory = await Category.findByPk(newCategoryId);
        if (newCategory) {
          await newCategory.incrementCourseCount();
        }
      }
    }

    req.flash('success', 'Đã cập nhật khóa học thành công!');
    res.redirect(`/admin/courses/${course.id}`);
  } catch (error) {
    console.error('Update course error:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      req.flash('error', 'Slug đã tồn tại. Vui lòng chọn tiêu đề khác.');
    } else {
      req.flash('error', 'Lỗi khi cập nhật khóa học');
    }
    res.redirect(`/admin/courses/${req.params.id}/edit`);
  }
};

/**
 * Show course details (Admin)
 */
exports.show = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }
      ]
    });

    if (!course) {
      return res.status(404).render('error', {
        title: 'Khóa học không tìm thấy',
        error: {
          status: 404,
          message: 'Khóa học không tồn tại'
        }
      });
    }

    // Get enrollment stats
    const allEnrollments = await Enrollment.findAll({
      where: { course_id: course.id }
    });
    
    const enrollmentStats = allEnrollments.reduce((acc, enrollment) => {
      const status = enrollment.status || 'active';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    const enrollmentStatsArray = Object.entries(enrollmentStats).map(([status, count]) => ({
      status,
      count
    }));

    // Get ratings (if Rating model exists)
    let ratings = [];
    try {
      const { Rating } = require('../../models');
      if (Rating) {
        ratings = await Rating.findAll({
          where: { course_id: course.id },
          include: [
            {
              model: User,
              attributes: ['first_name', 'last_name', 'email']
            }
          ],
          order: [['created_at', 'DESC']],
          limit: 10
        });
      }
    } catch (error) {
      console.log('Rating model not available');
    }

    res.locals.currentPath = `/admin/courses/${course.id}`;
    res.render('pages/admin/courses/show', {
      title: `Quản lý: ${course.title}`,
      pageHeader: 'Chi tiết khóa học',
      course,
      enrollmentStats: enrollmentStatsArray,
      ratings
    });
  } catch (error) {
    console.error('Admin course show error:', error);
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
 * Update course status
 */
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['draft', 'published', 'archived'].includes(status)) {
      req.flash('error', 'Trạng thái không hợp lệ');
      return res.redirect(`/admin/courses/${req.params.id}`);
    }

    const course = await Course.findByPk(req.params.id);
    if (!course) {
      req.flash('error', 'Khóa học không tìm thấy');
      return res.redirect('/admin/courses');
    }

    course.status = status;
    await course.save();

    req.flash('success', `Đã cập nhật trạng thái khóa học thành "${status}"`);
    res.redirect(`/admin/courses/${course.id}`);
  } catch (error) {
    console.error('Update course status error:', error);
    req.flash('error', 'Lỗi khi cập nhật trạng thái');
    res.redirect(`/admin/courses/${req.params.id}`);
  }
};

/**
 * Delete course
 */
exports.delete = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      req.flash('error', 'Khóa học không tìm thấy');
      return res.redirect('/admin/courses');
    }

    await course.destroy();

    req.flash('success', 'Đã xóa khóa học thành công');
    res.redirect('/admin/courses');
  } catch (error) {
    console.error('Delete course error:', error);
    req.flash('error', 'Lỗi khi xóa khóa học');
    res.redirect(`/admin/courses/${req.params.id}`);
  }
};

