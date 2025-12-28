const express = require('express');
const { body, validationResult } = require('express-validator');
const { Course, User, Category, Enrollment, Contact, sequelize } = require('../models');
const { Op } = require('sequelize');
const ExcelJS = require('exceljs');

const router = express.Router();

// Set admin layout for all admin routes
router.use((req, res, next) => {
    res.locals.layout = 'layouts/admin';
    next();
});

/**
 * @desc    Admin Dashboard
 * @route   GET /admin
 * @access  Private (Admin only)
 */
router.get('/', async (req, res) => {
  try {
    // Get statistics
    const totalCourses = await Course.count();
    const publishedCourses = await Course.count({ where: { status: 'published' } });
    const draftCourses = await Course.count({ where: { status: 'draft' } });
    const totalUsers = await User.count();
    const totalEnrollments = await Enrollment.count();
    
    // Count courses with ratings
    const coursesWithRatings = await Course.count({
      where: {
        average_rating: { [Op.ne]: null }
      }
    });
    const totalRatings = coursesWithRatings;

    // Get recent courses
    const recentCourses = await Course.findAll({
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['first_name', 'last_name']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['name']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: 10
    });

    res.locals.currentPath = '/admin';
    res.render('pages/admin/index', {
      title: 'Bảng điều khiển Admin',
      pageHeader: 'Bảng điều khiển Admin',
      stats: {
        totalCourses,
        publishedCourses,
        draftCourses,
        totalUsers,
        totalEnrollments,
        totalRatings
      },
      recentCourses
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).render('error', {
      title: 'Lỗi hệ thống',
      error: {
        status: 500,
        message: 'Đã xảy ra lỗi khi tải bảng điều khiển'
      }
    });
  }
});

/**
 * @desc    List all courses (Admin)
 * @route   GET /admin/courses
 * @access  Private (Admin only)
 */
router.get('/courses', async (req, res) => {
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
});

/**
 * @desc    Export courses to Excel
 * @route   GET /admin/courses/export
 * @access  Private (Admin only)
 */
router.get('/courses/export', async (req, res) => {
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
});

/**
 * @desc    Show create course form
 * @route   GET /admin/courses/create
 * @access  Private (Admin only)
 */
router.get('/courses/create', async (req, res) => {
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
});

/**
 * @desc    Create new course
 * @route   POST /admin/courses/create
 * @access  Private (Admin only)
 */
router.post('/courses/create',
  [
    body('title')
      .trim()
      .isLength({ min: 3, max: 255 })
      .withMessage('Tiêu đề phải từ 3-255 ký tự'),
    body('instructor_id')
      .isUUID()
      .withMessage('Giảng viên không hợp lệ'),
    body('level')
      .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
      .withMessage('Độ khó không hợp lệ'),
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Giá phải là số dương'),
    body('status')
      .isIn(['draft', 'published', 'archived'])
      .withMessage('Trạng thái không hợp lệ')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.redirect('/admin/courses/create');
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
  }
);

/**
 * @desc    Show edit course form
 * @route   GET /admin/courses/:id/edit
 * @access  Private (Admin only)
 */
router.get('/courses/:id/edit', async (req, res) => {
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
});

/**
 * @desc    Update course
 * @route   POST /admin/courses/:id/edit
 * @access  Private (Admin only)
 */
router.post('/courses/:id/edit',
  [
    body('title')
      .trim()
      .isLength({ min: 3, max: 255 })
      .withMessage('Tiêu đề phải từ 3-255 ký tự'),
    body('instructor_id')
      .isUUID()
      .withMessage('Giảng viên không hợp lệ'),
    body('level')
      .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
      .withMessage('Độ khó không hợp lệ'),
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Giá phải là số dương'),
    body('status')
      .isIn(['draft', 'published', 'archived'])
      .withMessage('Trạng thái không hợp lệ')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.redirect(`/admin/courses/${req.params.id}/edit`);
      }

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
  }
);

/**
 * @desc    Show course details (Admin)
 * @route   GET /admin/courses/:id
 * @access  Private (Admin only)
 */
router.get('/courses/:id', async (req, res) => {
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
      const { Rating } = require('../models');
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
});

/**
 * @desc    Update course status
 * @route   POST /admin/courses/:id/status
 * @access  Private (Admin only)
 */
router.post('/courses/:id/status', async (req, res) => {
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
    res.redirect(`/admin/courses/${req.params.id}`);
  } catch (error) {
    console.error('Update course status error:', error);
    req.flash('error', 'Lỗi khi cập nhật trạng thái');
    res.redirect(`/admin/courses/${req.params.id}`);
  }
});

/**
 * @desc    Delete course
 * @route   POST /admin/courses/:id/delete
 * @access  Private (Admin only)
 */
router.post('/courses/:id/delete', async (req, res) => {
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
});

/**
 * @desc    List all users (Admin)
 * @route   GET /admin/users
 * @access  Private (Admin only)
 */
router.get('/users', async (req, res) => {
  try {
    const { search, role, status, page = 1 } = req.query;
    const limit = 5;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { first_name: { [Op.iLike]: `%${search}%` } },
        { last_name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { student_id: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (role) {
      whereClause.role = role;
    }
    if (status !== undefined && status !== '') {
      whereClause.is_active = status === 'active';
    }

    // Get users with pagination
    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password', 'verification_token', 'reset_password_token'] },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Get statistics
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { is_active: true } });
    const inactiveUsers = await User.count({ where: { is_active: false } });
    const studentsCount = await User.count({ where: { role: 'student' } });
    const lecturersCount = await User.count({ where: { role: { [Op.in]: ['lecturer', 'teacher'] } } });
    const adminsCount = await User.count({ where: { role: { [Op.in]: ['admin', 'system_admin'] } } });

    const totalPages = Math.ceil(count / limit);

    res.locals.currentPath = '/admin/users';
    res.render('pages/admin/users/index', {
      title: 'Quản lý người dùng',
      pageHeader: 'Quản lý người dùng',
      users,
      stats: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        studentsCount,
        lecturersCount,
        adminsCount
      },
      pagination: {
        current_page: parseInt(page),
        total_pages: totalPages,
        total_items: count,
        has_prev: page > 1,
        has_next: page < totalPages
      },
      currentFilters: {
        search: search || '',
        role: role || '',
        status: status || ''
      }
    });
  } catch (error) {
    console.error('Admin users list error:', error);
    res.status(500).render('error', {
      title: 'Lỗi hệ thống',
      error: {
        status: 500,
        message: 'Đã xảy ra lỗi khi tải danh sách người dùng'
      }
    });
  }
});

/**
 * @desc    Export users to Excel
 * @route   GET /admin/users/export
 * @access  Private (Admin only)
 */
router.get('/users/export', async (req, res) => {
  try {
    const { search, role, status } = req.query;

    // Build where clause (same as list route)
    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { first_name: { [Op.iLike]: `%${search}%` } },
        { last_name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { student_id: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (role) {
      whereClause.role = role;
    }
    if (status !== undefined && status !== '') {
      whereClause.is_active = status === 'active';
    }

    // Get all users (no pagination for export)
    const users = await User.findAll({
      where: whereClause,
      attributes: { exclude: ['password', 'verification_token', 'reset_password_token'] },
      order: [['created_at', 'DESC']]
    });

    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Danh sách người dùng');

    // Set column headers
    worksheet.columns = [
      { header: 'STT', key: 'stt', width: 8 },
      { header: 'Họ và tên', key: 'full_name', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Mã sinh viên', key: 'student_id', width: 15 },
      { header: 'Số điện thoại', key: 'phone', width: 15 },
      { header: 'Vai trò', key: 'role', width: 15 },
      { header: 'Trạng thái', key: 'is_active', width: 15 },
      { header: 'Số lần đăng nhập', key: 'login_count', width: 15 },
      { header: 'Đăng nhập lần cuối', key: 'last_login', width: 20 },
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
    users.forEach((user, index) => {
      const roleMap = {
        'student': 'Sinh viên',
        'lecturer': 'Giảng viên',
        'teacher': 'Giáo viên',
        'admin': 'Quản trị viên',
        'system_admin': 'System Admin'
      };

      worksheet.addRow({
        stt: index + 1,
        full_name: user.full_name,
        email: user.email,
        student_id: user.student_id || '',
        phone: user.phone || '',
        role: roleMap[user.role] || user.role,
        is_active: user.is_active ? 'Hoạt động' : 'Vô hiệu hóa',
        login_count: user.login_count || 0,
        last_login: user.last_login ? new Date(user.last_login).toLocaleString('vi-VN') : 'Chưa đăng nhập',
        created_at: user.created_at ? new Date(user.created_at).toLocaleString('vi-VN') : ''
      });
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=danh-sach-nguoi-dung-${Date.now()}.xlsx`);

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Export users error:', error);
    req.flash('error', 'Lỗi khi xuất file Excel');
    res.redirect('/admin/users');
  }
});

/**
 * @desc    Show user details (Admin)
 * @route   GET /admin/users/:id
 * @access  Private (Admin only)
 */
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password', 'verification_token', 'reset_password_token'] }
    });

    if (!user) {
      return res.status(404).render('error', {
        title: 'Người dùng không tìm thấy',
        error: {
          status: 404,
          message: 'Người dùng không tồn tại'
        }
      });
    }

    // Get user statistics
    const totalEnrollments = await Enrollment.count({ where: { user_id: user.id } });
    const activeEnrollments = await Enrollment.count({ 
      where: { user_id: user.id, status: 'active' } 
    });
    const completedEnrollments = await Enrollment.count({ 
      where: { user_id: user.id, status: 'completed' } 
    });

    // Get recent enrollments
    const enrollments = await Enrollment.findAll({
      where: { user_id: user.id },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'slug', 'status']
        }
      ],
      limit: 10,
      order: [['enrolled_at', 'DESC']]
    });

    res.locals.currentPath = `/admin/users/${user.id}`;
    res.render('pages/admin/users/show', {
      title: `Quản lý: ${user.full_name}`,
      pageHeader: 'Chi tiết người dùng',
      user,
      enrollments,
      stats: {
        totalEnrollments,
        activeEnrollments,
        completedEnrollments
      }
    });
  } catch (error) {
    console.error('Admin user show error:', error);
    res.status(500).render('error', {
      title: 'Lỗi hệ thống',
      error: {
        status: 500,
        message: 'Đã xảy ra lỗi khi tải thông tin người dùng'
      }
    });
  }
});

/**
 * @desc    Update user status
 * @route   POST /admin/users/:id/status
 * @access  Private (Admin only)
 */
router.post('/users/:id/status', async (req, res) => {
  try {
    const { is_active } = req.body;
    
    const user = await User.findByPk(req.params.id);
    if (!user) {
      req.flash('error', 'Người dùng không tìm thấy');
      return res.redirect('/admin/users');
    }

    // Prevent deactivating yourself
    if (user.id === req.session.user.id && is_active === 'false') {
      req.flash('error', 'Bạn không thể vô hiệu hóa chính mình');
      return res.redirect(`/admin/users/${user.id}`);
    }

    user.is_active = is_active === 'true' || is_active === true;
    await user.save();

    req.flash('success', `Đã cập nhật trạng thái người dùng thành "${user.is_active ? 'Hoạt động' : 'Vô hiệu hóa'}"`);
    res.redirect(`/admin/users/${user.id}`);
  } catch (error) {
    console.error('Update user status error:', error);
    req.flash('error', 'Lỗi khi cập nhật trạng thái');
    res.redirect(`/admin/users/${req.params.id}`);
  }
});

/**
 * @desc    Update user role
 * @route   POST /admin/users/:id/role
 * @access  Private (Admin only)
 */
router.post('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['student', 'teacher', 'lecturer', 'admin', 'system_admin'].includes(role)) {
      req.flash('error', 'Vai trò không hợp lệ');
      return res.redirect(`/admin/users/${req.params.id}`);
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      req.flash('error', 'Người dùng không tìm thấy');
      return res.redirect('/admin/users');
    }

    // Prevent changing your own role
    if (user.id === req.session.user.id) {
      req.flash('error', 'Bạn không thể thay đổi vai trò của chính mình');
      return res.redirect(`/admin/users/${user.id}`);
    }

    user.role = role;
    await user.save();

    req.flash('success', `Đã cập nhật vai trò người dùng thành "${role}"`);
    res.redirect(`/admin/users/${user.id}`);
  } catch (error) {
    console.error('Update user role error:', error);
    req.flash('error', 'Lỗi khi cập nhật vai trò');
    res.redirect(`/admin/users/${req.params.id}`);
  }
});

/**
 * @desc    Delete user (soft delete - deactivate)
 * @route   POST /admin/users/:id/delete
 * @access  Private (Admin only)
 */
router.post('/users/:id/delete', async (req, res) => {
  try {
    const { confirm_delete } = req.body;
    
    if (confirm_delete !== 'DELETE') {
      req.flash('error', 'Vui lòng nhập "DELETE" để xác nhận xóa người dùng');
      return res.redirect(`/admin/users/${req.params.id}`);
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      req.flash('error', 'Người dùng không tìm thấy');
      return res.redirect('/admin/users');
    }

    // Prevent deleting yourself
    if (user.id === req.session.user.id) {
      req.flash('error', 'Bạn không thể xóa chính mình');
      return res.redirect(`/admin/users/${user.id}`);
    }

    // Soft delete - deactivate
    user.is_active = false;
    await user.save();

    req.flash('success', 'Đã vô hiệu hóa người dùng thành công');
    res.redirect('/admin/users');
  } catch (error) {
    console.error('Delete user error:', error);
    req.flash('error', 'Lỗi khi xóa người dùng');
    res.redirect(`/admin/users/${req.params.id}`);
  }
});

/**
 * @desc    List all categories (Admin)
 * @route   GET /admin/categories
 * @access  Private (Admin only)
 */
router.get('/categories', async (req, res) => {
  try {
    const { search, is_active, page = 1 } = req.query;
    const limit = 5;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { slug: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (is_active !== undefined && is_active !== '') {
      whereClause.is_active = is_active === 'true';
    }

    // Get categories with pagination
    const { count, rows: categories } = await Category.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Category,
          as: 'parent',
          attributes: ['id', 'name', 'slug']
        }
      ],
      order: [['order_index', 'ASC'], ['name', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalPages = Math.ceil(count / limit);

    res.locals.currentPath = '/admin/categories';
    res.render('pages/admin/categories/index', {
      title: 'Quản lý danh mục',
      pageHeader: 'Quản lý danh mục',
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
        is_active: is_active || ''
      }
    });
  } catch (error) {
    console.error('Admin categories list error:', error);
    res.status(500).render('error', {
      title: 'Lỗi hệ thống',
      error: {
        status: 500,
        message: 'Đã xảy ra lỗi khi tải danh sách danh mục'
      }
    });
  }
});

/**
 * @desc    Show create category form
 * @route   GET /admin/categories/create
 * @access  Private (Admin only)
 */
router.get('/categories/create', async (req, res) => {
  try {
    // Get parent categories for dropdown
    const parentCategories = await Category.findAll({
      where: {
        parent_id: null,
        is_active: true
      },
      order: [['name', 'ASC']]
    });

    res.locals.currentPath = '/admin/categories/create';
    res.render('pages/admin/categories/form', {
      title: 'Tạo danh mục mới',
      pageHeader: 'Tạo danh mục mới',
      category: null,
      parentCategories,
      isEdit: false
    });
  } catch (error) {
    console.error('Admin create category form error:', error);
    res.status(500).render('error', {
      title: 'Lỗi hệ thống',
      error: {
        status: 500,
        message: 'Đã xảy ra lỗi khi tải form'
      }
    });
  }
});

/**
 * @desc    Create new category
 * @route   POST /admin/categories/create
 * @access  Private (Admin only)
 */
router.post('/categories/create',
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Tên danh mục phải từ 2-100 ký tự'),
    body('slug')
      .optional()
      .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .withMessage('Slug không hợp lệ'),
    body('color')
      .optional()
      .matches(/^#[0-9A-Fa-f]{6}$/)
      .withMessage('Màu sắc phải là mã hex (ví dụ: #3B82F6)'),
    body('order_index')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Thứ tự phải là số nguyên dương')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.redirect('/admin/categories/create');
      }

      const {
        name,
        slug,
        description,
        icon,
        color,
        parent_id,
        order_index,
        is_active
      } = req.body;

      // Check if slug already exists
      const finalSlug = slug || name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');

      const existingCategory = await Category.findOne({ where: { slug: finalSlug } });
      if (existingCategory) {
        req.flash('error', 'Slug đã tồn tại. Vui lòng chọn tên khác.');
        return res.redirect('/admin/categories/create');
      }

      // Create category
      const category = await Category.create({
        name: name.trim(),
        slug: finalSlug,
        description: description ? description.trim() : null,
        icon: icon || null,
        color: color || null,
        parent_id: parent_id || null,
        order_index: order_index ? parseInt(order_index) : 0,
        is_active: is_active === 'on' || is_active === true
      });

      req.flash('success', 'Đã tạo danh mục thành công!');
      res.redirect(`/admin/categories/${category.id}`);
    } catch (error) {
      console.error('Create category error:', error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        req.flash('error', 'Slug đã tồn tại. Vui lòng chọn tên khác.');
      } else {
        req.flash('error', 'Lỗi khi tạo danh mục');
      }
      res.redirect('/admin/categories/create');
    }
  }
);

/**
 * @desc    Show edit category form
 * @route   GET /admin/categories/:id/edit
 * @access  Private (Admin only)
 */
router.get('/categories/:id/edit', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: 'parent',
          attributes: ['id', 'name', 'slug']
        }
      ]
    });

    if (!category) {
      req.flash('error', 'Danh mục không tìm thấy');
      return res.redirect('/admin/categories');
    }

    // Get parent categories for dropdown (exclude self and children)
    const parentCategories = await Category.findAll({
      where: {
        parent_id: null,
        id: { [Op.ne]: category.id },
        is_active: true
      },
      order: [['name', 'ASC']]
    });

    res.locals.currentPath = `/admin/categories/${category.id}/edit`;
    res.render('pages/admin/categories/form', {
      title: `Sửa: ${category.name}`,
      pageHeader: 'Sửa danh mục',
      category,
      parentCategories,
      isEdit: true
    });
  } catch (error) {
    console.error('Admin edit category form error:', error);
    req.flash('error', 'Lỗi khi tải form sửa');
    res.redirect('/admin/categories');
  }
});

/**
 * @desc    Update category
 * @route   POST /admin/categories/:id/edit
 * @access  Private (Admin only)
 */
router.post('/categories/:id/edit',
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Tên danh mục phải từ 2-100 ký tự'),
    body('slug')
      .optional()
      .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .withMessage('Slug không hợp lệ'),
    body('color')
      .optional()
      .matches(/^#[0-9A-Fa-f]{6}$/)
      .withMessage('Màu sắc phải là mã hex (ví dụ: #3B82F6)'),
    body('order_index')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Thứ tự phải là số nguyên dương')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.redirect(`/admin/categories/${req.params.id}/edit`);
      }

      const category = await Category.findByPk(req.params.id);
      if (!category) {
        req.flash('error', 'Danh mục không tìm thấy');
        return res.redirect('/admin/categories');
      }

      const {
        name,
        slug,
        description,
        icon,
        color,
        parent_id,
        order_index,
        is_active
      } = req.body;

      // Generate slug from name if name changed and slug not provided
      let finalSlug = category.slug;
      if (name !== category.name && !slug) {
        finalSlug = name.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim('-');
      } else if (slug) {
        finalSlug = slug;
      }

      // Check if new slug already exists
      if (finalSlug !== category.slug) {
        const existingCategory = await Category.findOne({ 
          where: { slug: finalSlug, id: { [Op.ne]: category.id } }
        });
        if (existingCategory) {
          req.flash('error', 'Slug đã tồn tại. Vui lòng chọn tên khác.');
          return res.redirect(`/admin/categories/${category.id}/edit`);
        }
      }

      // Prevent setting parent to self or child
      if (parent_id === category.id) {
        req.flash('error', 'Không thể đặt danh mục cha là chính nó');
        return res.redirect(`/admin/categories/${category.id}/edit`);
      }

      // Update category
      category.name = name.trim();
      category.slug = finalSlug;
      category.description = description ? description.trim() : null;
      category.icon = icon || null;
      category.color = color || null;
      category.parent_id = parent_id || null;
      category.order_index = order_index ? parseInt(order_index) : 0;
      category.is_active = is_active === 'on' || is_active === true;

      await category.save();

      req.flash('success', 'Đã cập nhật danh mục thành công!');
      res.redirect(`/admin/categories/${category.id}`);
    } catch (error) {
      console.error('Update category error:', error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        req.flash('error', 'Slug đã tồn tại. Vui lòng chọn tên khác.');
      } else {
        req.flash('error', 'Lỗi khi cập nhật danh mục');
      }
      res.redirect(`/admin/categories/${req.params.id}/edit`);
    }
  }
);

/**
 * @desc    Show category details (Admin)
 * @route   GET /admin/categories/:id
 * @access  Private (Admin only)
 */
router.get('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: 'parent',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: Category,
          as: 'children',
          attributes: ['id', 'name', 'slug', 'course_count', 'is_active'],
          order: [['order_index', 'ASC']]
        },
        {
          model: Course,
          as: 'courses',
          attributes: ['id', 'title', 'slug', 'status', 'enrolled_count'],
          limit: 10,
          order: [['created_at', 'DESC']]
        }
      ]
    });

    if (!category) {
      return res.status(404).render('error', {
        title: 'Danh mục không tìm thấy',
        error: {
          status: 404,
          message: 'Danh mục không tồn tại'
        }
      });
    }

    res.locals.currentPath = `/admin/categories/${category.id}`;
    res.render('pages/admin/categories/show', {
      title: `Quản lý: ${category.name}`,
      pageHeader: 'Chi tiết danh mục',
      category
    });
  } catch (error) {
    console.error('Admin category show error:', error);
    res.status(500).render('error', {
      title: 'Lỗi hệ thống',
      error: {
        status: 500,
        message: 'Đã xảy ra lỗi khi tải thông tin danh mục'
      }
    });
  }
});

/**
 * @desc    Update category status
 * @route   POST /admin/categories/:id/status
 * @access  Private (Admin only)
 */
router.post('/categories/:id/status', async (req, res) => {
  try {
    const { is_active } = req.body;
    
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      req.flash('error', 'Danh mục không tìm thấy');
      return res.redirect('/admin/categories');
    }

    category.is_active = is_active === 'true' || is_active === true;
    await category.save();

    req.flash('success', `Đã cập nhật trạng thái danh mục thành "${category.is_active ? 'Hoạt động' : 'Vô hiệu hóa'}"`);
    res.redirect(`/admin/categories/${category.id}`);
  } catch (error) {
    console.error('Update category status error:', error);
    req.flash('error', 'Lỗi khi cập nhật trạng thái');
    res.redirect(`/admin/categories/${req.params.id}`);
  }
});

/**
 * @desc    Delete category
 * @route   POST /admin/categories/:id/delete
 * @access  Private (Admin only)
 */
router.post('/categories/:id/delete', async (req, res) => {
  try {
    const { confirm_delete } = req.body;
    
    if (confirm_delete !== 'DELETE') {
      req.flash('error', 'Vui lòng nhập "DELETE" để xác nhận xóa danh mục');
      return res.redirect(`/admin/categories/${req.params.id}`);
    }

    const category = await Category.findByPk(req.params.id);
    if (!category) {
      req.flash('error', 'Danh mục không tìm thấy');
      return res.redirect('/admin/categories');
    }

    // Check if category has courses
    const courseCount = await Course.count({ where: { category_id: category.id } });
    if (courseCount > 0) {
      req.flash('error', `Không thể xóa danh mục vì có ${courseCount} khóa học đang sử dụng. Vui lòng chuyển các khóa học sang danh mục khác trước.`);
      return res.redirect(`/admin/categories/${category.id}`);
    }

    // Check if category has children
    const childrenCount = await Category.count({ where: { parent_id: category.id } });
    if (childrenCount > 0) {
      req.flash('error', `Không thể xóa danh mục vì có ${childrenCount} danh mục con. Vui lòng xóa hoặc chuyển các danh mục con trước.`);
      return res.redirect(`/admin/categories/${category.id}`);
    }

    await category.destroy();

    req.flash('success', 'Đã xóa danh mục thành công');
    res.redirect('/admin/categories');
  } catch (error) {
    console.error('Delete category error:', error);
    req.flash('error', 'Lỗi khi xóa danh mục');
    res.redirect(`/admin/categories/${req.params.id}`);
  }
});

/**
 * @desc    List all contacts (Admin)
 * @route   GET /admin/contacts
 * @access  Private (Admin only)
 */
router.get('/contacts', async (req, res) => {
  try {
    const { search, status, priority, subject, page = 1 } = req.query;
    const limit = 10;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { message: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (status) {
      whereClause.status = status;
    }
    if (priority) {
      whereClause.priority = priority;
    }
    if (subject) {
      whereClause.subject = subject;
    }

    // Get contacts with pagination
    const { count, rows: contacts } = await Contact.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'email'],
          required: false
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalPages = Math.ceil(count / limit);

    // Get statistics
    const pendingCount = await Contact.count({ where: { status: 'pending' } });
    const inProgressCount = await Contact.count({ where: { status: 'in_progress' } });
    const resolvedCount = await Contact.count({ where: { status: 'resolved' } });
    const urgentCount = await Contact.count({ where: { priority: 'urgent', status: { [Op.ne]: 'resolved' } } });

    res.locals.currentPath = '/admin/contacts';
    res.render('pages/admin/contacts/index', {
      title: 'Quản lý liên hệ',
      pageHeader: 'Quản lý liên hệ',
      contacts,
      pagination: {
        current_page: parseInt(page),
        total_pages: totalPages,
        total_items: count,
        has_prev: page > 1,
        has_next: page < totalPages
      },
      currentFilters: {
        search: search || '',
        status: status || '',
        priority: priority || '',
        subject: subject || ''
      },
      stats: {
        pending: pendingCount,
        inProgress: inProgressCount,
        resolved: resolvedCount,
        urgent: urgentCount
      }
    });
  } catch (error) {
    console.error('Admin contacts list error:', error);
    res.status(500).render('error', {
      title: 'Lỗi hệ thống',
      error: {
        status: 500,
        message: 'Đã xảy ra lỗi khi tải danh sách liên hệ'
      }
    });
  }
});

/**
 * @desc    Show contact details (Admin)
 * @route   GET /admin/contacts/:id
 * @access  Private (Admin only)
 */
router.get('/contacts/:id', async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'email', 'avatar'],
          required: false
        }
      ]
    });

    if (!contact) {
      return res.status(404).render('error', {
        title: 'Liên hệ không tìm thấy',
        error: {
          status: 404,
          message: 'Liên hệ không tồn tại'
        }
      });
    }

    res.locals.currentPath = `/admin/contacts/${contact.id}`;
    res.render('pages/admin/contacts/show', {
      title: `Liên hệ: ${contact.subject}`,
      pageHeader: 'Chi tiết liên hệ',
      contact
    });
  } catch (error) {
    console.error('Admin contact show error:', error);
    res.status(500).render('error', {
      title: 'Lỗi hệ thống',
      error: {
        status: 500,
        message: 'Đã xảy ra lỗi khi tải thông tin liên hệ'
      }
    });
  }
});

/**
 * @desc    Update contact status
 * @route   POST /admin/contacts/:id/status
 * @access  Private (Admin only)
 */
router.post('/contacts/:id/status', async (req, res) => {
  try {
    const { status, admin_notes } = req.body;
    
    if (!['pending', 'in_progress', 'resolved', 'closed'].includes(status)) {
      req.flash('error', 'Trạng thái không hợp lệ');
      return res.redirect(`/admin/contacts/${req.params.id}`);
    }

    const contact = await Contact.findByPk(req.params.id);
    if (!contact) {
      req.flash('error', 'Liên hệ không tìm thấy');
      return res.redirect('/admin/contacts');
    }

    contact.status = status;
    if (status === 'resolved' && !contact.resolved_at) {
      contact.resolved_at = new Date();
    }
    if (admin_notes) {
      contact.admin_notes = admin_notes.trim();
    }
    await contact.save();

    const statusMap = {
      'pending': 'Chờ xử lý',
      'in_progress': 'Đang xử lý',
      'resolved': 'Đã giải quyết',
      'closed': 'Đã đóng'
    };

    req.flash('success', `Đã cập nhật trạng thái thành "${statusMap[status]}"`);
    res.redirect(`/admin/contacts/${contact.id}`);
  } catch (error) {
    console.error('Update contact status error:', error);
    req.flash('error', 'Lỗi khi cập nhật trạng thái');
    res.redirect(`/admin/contacts/${req.params.id}`);
  }
});

/**
 * @desc    Update contact priority
 * @route   POST /admin/contacts/:id/priority
 * @access  Private (Admin only)
 */
router.post('/contacts/:id/priority', async (req, res) => {
  try {
    const { priority } = req.body;
    
    if (!['low', 'medium', 'high', 'urgent'].includes(priority)) {
      req.flash('error', 'Mức độ ưu tiên không hợp lệ');
      return res.redirect(`/admin/contacts/${req.params.id}`);
    }

    const contact = await Contact.findByPk(req.params.id);
    if (!contact) {
      req.flash('error', 'Liên hệ không tìm thấy');
      return res.redirect('/admin/contacts');
    }

    contact.priority = priority;
    await contact.save();

    const priorityMap = {
      'low': 'Thấp',
      'medium': 'Trung bình',
      'high': 'Cao',
      'urgent': 'Khẩn cấp'
    };

    req.flash('success', `Đã cập nhật mức độ ưu tiên thành "${priorityMap[priority]}"`);
    res.redirect(`/admin/contacts/${contact.id}`);
  } catch (error) {
    console.error('Update contact priority error:', error);
    req.flash('error', 'Lỗi khi cập nhật mức độ ưu tiên');
    res.redirect(`/admin/contacts/${req.params.id}`);
  }
});

/**
 * @desc    Update admin notes
 * @route   POST /admin/contacts/:id/notes
 * @access  Private (Admin only)
 */
router.post('/contacts/:id/notes', async (req, res) => {
  try {
    const { admin_notes } = req.body;

    const contact = await Contact.findByPk(req.params.id);
    if (!contact) {
      req.flash('error', 'Liên hệ không tìm thấy');
      return res.redirect('/admin/contacts');
    }

    contact.admin_notes = admin_notes ? admin_notes.trim() : null;
    await contact.save();

    req.flash('success', 'Đã cập nhật ghi chú');
    res.redirect(`/admin/contacts/${contact.id}`);
  } catch (error) {
    console.error('Update contact notes error:', error);
    req.flash('error', 'Lỗi khi cập nhật ghi chú');
    res.redirect(`/admin/contacts/${req.params.id}`);
  }
});

/**
 * @desc    Delete contact
 * @route   POST /admin/contacts/:id/delete
 * @access  Private (Admin only)
 */
router.post('/contacts/:id/delete', async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) {
      req.flash('error', 'Liên hệ không tìm thấy');
      return res.redirect('/admin/contacts');
    }

    await contact.destroy();

    req.flash('success', 'Đã xóa liên hệ thành công');
    res.redirect('/admin/contacts');
  } catch (error) {
    console.error('Delete contact error:', error);
    req.flash('error', 'Lỗi khi xóa liên hệ');
    res.redirect(`/admin/contacts/${req.params.id}`);
  }
});

/**
 * @desc    Statistics Dashboard
 * @route   GET /admin/statistics
 * @access  Private (Admin only)
 */
router.get('/statistics', async (req, res) => {
  try {
    // Overall Statistics
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { is_active: true } });
    const totalCourses = await Course.count();
    const publishedCourses = await Course.count({ where: { status: 'published' } });
    const totalEnrollments = await Enrollment.count();
    const activeEnrollments = await Enrollment.count({ where: { status: 'active' } });
    const completedEnrollments = await Enrollment.count({ where: { status: 'completed' } });
    const totalCategories = await Category.count({ where: { is_active: true } });

    // User Statistics by Role
    const usersByRole = await User.findAll({
      attributes: [
        'role',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['role'],
      raw: true
    });

    // Course Statistics by Status
    const coursesByStatus = await Course.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // Course Statistics by Level
    const coursesByLevel = await Course.findAll({
      attributes: [
        'level',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['level'],
      raw: true
    });

    // Enrollment Statistics by Status
    const enrollmentsByStatus = await Enrollment.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // Top Courses by Enrollment
    const topCourses = await Course.findAll({
      attributes: [
        'id',
        'title',
        'slug',
        'enrolled_count',
        'average_rating'
      ],
      order: [['enrolled_count', 'DESC']],
      limit: 10
    });

    // Recent Users (Last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = await User.count({
      where: {
        created_at: {
          [Op.gte]: thirtyDaysAgo
        }
      }
    });

    // Recent Courses (Last 30 days)
    const recentCourses = await Course.count({
      where: {
        created_at: {
          [Op.gte]: thirtyDaysAgo
        }
      }
    });

    // Recent Enrollments (Last 30 days)
    const recentEnrollments = await Enrollment.count({
      where: {
        enrolled_at: {
          [Op.gte]: thirtyDaysAgo
        }
      }
    });

    // Enrollment Growth (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const enrollmentsLast7Days = await Enrollment.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('enrolled_at')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        enrolled_at: {
          [Op.gte]: sevenDaysAgo
        }
      },
      group: [sequelize.fn('DATE', sequelize.col('enrolled_at'))],
      order: [[sequelize.fn('DATE', sequelize.col('enrolled_at')), 'ASC']],
      raw: true
    });

    // User Growth (Last 7 days)
    const usersLast7Days = await User.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        created_at: {
          [Op.gte]: sevenDaysAgo
        }
      },
      group: [sequelize.fn('DATE', sequelize.col('created_at'))],
      order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']],
      raw: true
    });

    // Courses by Category - Using raw query for better performance
    const coursesByCategory = await sequelize.query(`
      SELECT 
        c.id,
        c.name,
        COUNT(co.id)::integer as count
      FROM categories c
      LEFT JOIN courses co ON co.category_id = c.id
      WHERE c.is_active = true
      GROUP BY c.id, c.name
      ORDER BY count DESC
    `, {
      type: sequelize.QueryTypes.SELECT
    });

  
    // Average Progress
    const avgProgress = await Enrollment.findAll({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('progress_percentage')), 'avg_progress']
      ],
      raw: true
    });

    res.locals.currentPath = '/admin/statistics';
    res.render('pages/admin/statistics/index', {
      title: 'Thống kê hệ thống',
      pageHeader: 'Thống kê hệ thống',
      stats: {
        totalUsers,
        activeUsers,
        totalCourses,
        publishedCourses,
        totalEnrollments,
        activeEnrollments,
        completedEnrollments,
        totalCategories,
        recentUsers,
        recentCourses,
        recentEnrollments,
        avgProgress: avgProgress[0]?.avg_progress || 0
      },
      usersByRole,
      coursesByStatus,
      coursesByLevel,
      enrollmentsByStatus,
      topCourses,
      enrollmentsLast7Days,
      usersLast7Days,
      coursesByCategory
    });
  } catch (error) {
    console.error('Admin statistics error:', error);
    res.status(500).render('error', {
      title: 'Lỗi hệ thống',
      error: {
        status: 500,
        message: 'Đã xảy ra lỗi khi tải thống kê'
      }
    });
  }
});

module.exports = router;

