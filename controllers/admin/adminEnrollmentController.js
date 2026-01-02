const { Enrollment, User, Course, Certificate } = require('../../models');
const { Op } = require('sequelize');
const ExcelJS = require('exceljs');

/**
 * List all enrollments (Admin)
 */
exports.index = async (req, res) => {
  try {
    const { search, status, course_id, user_id, page = 1 } = req.query;
    const limit = 10;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }
    if (course_id) {
      whereClause.course_id = course_id;
    }
    if (user_id) {
      whereClause.user_id = user_id;
    }

    // Build search conditions - find matching user_ids and course_ids first
    if (search) {
      // Find matching users
      const matchingUsers = await User.findAll({
        where: {
          [Op.or]: [
            { first_name: { [Op.iLike]: `%${search}%` } },
            { last_name: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } },
            { student_id: { [Op.iLike]: `%${search}%` } }
          ]
        },
        attributes: ['id']
      });
      const searchUserIds = matchingUsers.map(u => u.id);

      // Find matching courses
      const matchingCourses = await Course.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.iLike]: `%${search}%` } },
            { slug: { [Op.iLike]: `%${search}%` } }
          ]
        },
        attributes: ['id']
      });
      const searchCourseIds = matchingCourses.map(c => c.id);

      // Add search conditions to whereClause
      if (searchUserIds.length > 0 || searchCourseIds.length > 0) {
        const searchConditions = [];
        if (searchUserIds.length > 0) {
          searchConditions.push({ user_id: { [Op.in]: searchUserIds } });
        }
        if (searchCourseIds.length > 0) {
          searchConditions.push({ course_id: { [Op.in]: searchCourseIds } });
        }
        if (searchConditions.length > 0) {
          // Combine with existing conditions
          const baseConditions = { ...whereClause };
          delete baseConditions[Op.or];
          delete baseConditions[Op.and];
          
          const allConditions = [];
          if (Object.keys(baseConditions).length > 0) {
            allConditions.push(baseConditions);
          }
          allConditions.push({ [Op.or]: searchConditions });
          
          if (allConditions.length > 1) {
            whereClause[Op.and] = allConditions;
          } else {
            whereClause[Op.or] = searchConditions;
          }
        } else {
          // No matches found, return empty result
          whereClause.id = { [Op.in]: [] };
        }
      } else {
        // No matches found, return empty result
        whereClause.id = { [Op.in]: [] };
      }
    }

    // Get enrollments with pagination
    const { count, rows: enrollments } = await Enrollment.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'email', 'student_id'],
          required: false
        },
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'slug', 'status'],
          required: false
        }
      ],
      order: [['enrolled_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Get statistics
    const totalEnrollments = await Enrollment.count();
    const pendingEnrollments = await Enrollment.count({ where: { status: 'pending' } });
    const activeEnrollments = await Enrollment.count({ where: { status: 'active' } });
    const completedEnrollments = await Enrollment.count({ where: { status: 'completed' } });
    const droppedEnrollments = await Enrollment.count({ where: { status: 'dropped' } });

    // Get courses for filter
    const courses = await Course.findAll({
      where: { status: 'published' },
      attributes: ['id', 'title', 'slug'],
      order: [['title', 'ASC']],
      limit: 100
    });

    const totalPages = Math.ceil(count / limit);

    res.locals.currentPath = '/admin/enrollments';
    res.render('pages/admin/enrollments/index', {
      title: 'Quản lý đăng ký khóa học',
      pageHeader: 'Quản lý đăng ký khóa học',
      enrollments,
      courses,
      stats: {
        total: totalEnrollments,
        pending: pendingEnrollments,
        active: activeEnrollments,
        completed: completedEnrollments,
        dropped: droppedEnrollments
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
        status: status || '',
        course_id: course_id || '',
        user_id: user_id || ''
      }
    });
  } catch (error) {
    console.error('Admin enrollments list error:', error);
    res.status(500).render('error', {
      title: 'Lỗi hệ thống',
      error: {
        status: 500,
        message: 'Đã xảy ra lỗi khi tải danh sách đăng ký'
      }
    });
  }
};

/**
 * Export enrollments to Excel
 */
exports.export = async (req, res) => {
  try {
    const { search, status, course_id, user_id } = req.query;

    // Build where clause (same as list route)
    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }
    if (course_id) {
      whereClause.course_id = course_id;
    }
    if (user_id) {
      whereClause.user_id = user_id;
    }

    // Build search conditions - find matching user_ids and course_ids first
    if (search) {
      // Find matching users
      const matchingUsers = await User.findAll({
        where: {
          [Op.or]: [
            { first_name: { [Op.iLike]: `%${search}%` } },
            { last_name: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } },
            { student_id: { [Op.iLike]: `%${search}%` } }
          ]
        },
        attributes: ['id']
      });
      const searchUserIds = matchingUsers.map(u => u.id);

      // Find matching courses
      const matchingCourses = await Course.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.iLike]: `%${search}%` } },
            { slug: { [Op.iLike]: `%${search}%` } }
          ]
        },
        attributes: ['id']
      });
      const searchCourseIds = matchingCourses.map(c => c.id);

      // Add search conditions to whereClause
      if (searchUserIds.length > 0 || searchCourseIds.length > 0) {
        const searchConditions = [];
        if (searchUserIds.length > 0) {
          searchConditions.push({ user_id: { [Op.in]: searchUserIds } });
        }
        if (searchCourseIds.length > 0) {
          searchConditions.push({ course_id: { [Op.in]: searchCourseIds } });
        }
        if (searchConditions.length > 0) {
          // Combine with existing conditions
          const baseConditions = { ...whereClause };
          delete baseConditions[Op.or];
          delete baseConditions[Op.and];
          
          const allConditions = [];
          if (Object.keys(baseConditions).length > 0) {
            allConditions.push(baseConditions);
          }
          allConditions.push({ [Op.or]: searchConditions });
          
          if (allConditions.length > 1) {
            whereClause[Op.and] = allConditions;
          } else {
            whereClause[Op.or] = searchConditions;
          }
        } else {
          // No matches found, return empty result
          whereClause.id = { [Op.in]: [] };
        }
      } else {
        // No matches found, return empty result
        whereClause.id = { [Op.in]: [] };
      }
    }

    // Get all enrollments (no pagination for export)
    const enrollments = await Enrollment.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'email', 'student_id'],
          required: false
        },
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'slug', 'status'],
          required: false
        }
      ],
      order: [['enrolled_at', 'DESC']]
    });

    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Danh sách đăng ký khóa học');

    // Set column headers
    worksheet.columns = [
      { header: 'STT', key: 'stt', width: 8 },
      { header: 'Học viên', key: 'student', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Mã sinh viên', key: 'student_id', width: 15 },
      { header: 'Khóa học', key: 'course', width: 40 },
      { header: 'Trạng thái', key: 'status', width: 15 },
      { header: 'Tiến độ (%)', key: 'progress', width: 15 },
      { header: 'Thời gian học (phút)', key: 'time_spent', width: 20 },
      { header: 'Ngày đăng ký', key: 'enrolled_at', width: 20 },
      { header: 'Truy cập lần cuối', key: 'last_accessed', width: 20 }
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Add data rows
    enrollments.forEach((enrollment, index) => {
      const statusMap = {
        'pending': 'Chờ duyệt',
        'active': 'Đang học',
        'completed': 'Hoàn thành',
        'dropped': 'Đã hủy'
      };

      worksheet.addRow({
        stt: index + 1,
        student: enrollment.user ? `${enrollment.user.first_name} ${enrollment.user.last_name}` : 'N/A',
        email: enrollment.user ? enrollment.user.email : 'N/A',
        student_id: enrollment.user ? (enrollment.user.student_id || '') : '',
        course: enrollment.course ? enrollment.course.title : 'N/A',
        status: statusMap[enrollment.status] || enrollment.status,
        progress: enrollment.progress_percentage ? parseFloat(enrollment.progress_percentage).toFixed(2) : '0.00',
        time_spent: enrollment.total_time_spent ? Math.round(enrollment.total_time_spent / 60) : 0,
        enrolled_at: enrollment.enrolled_at ? new Date(enrollment.enrolled_at).toLocaleString('vi-VN') : '',
        last_accessed: enrollment.last_accessed ? new Date(enrollment.last_accessed).toLocaleString('vi-VN') : 'Chưa truy cập'
      });
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=danh-sach-dang-ky-${Date.now()}.xlsx`);

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Export enrollments error:', error);
    req.flash('error', 'Lỗi khi xuất file Excel');
    res.redirect('/admin/enrollments');
  }
};

/**
 * Show enrollment details (Admin)
 */
exports.show = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password', 'verification_token', 'reset_password_token'] }
        },
        {
          model: Course,
          as: 'course',
          include: [
            {
              model: User,
              as: 'instructor',
              attributes: ['id', 'first_name', 'last_name', 'email']
            }
          ]
        }
      ]
    });

    if (!enrollment) {
      return res.status(404).render('error', {
        title: 'Đăng ký không tìm thấy',
        error: {
          status: 404,
          message: 'Đăng ký không tồn tại'
        }
      });
    }

    // Get enrollment progress details if Progress model exists
    let progressDetails = [];
    try {
      const { Progress } = require('../../models');
      if (Progress) {
        progressDetails = await Progress.findAll({
          where: { enrollment_id: enrollment.id },
          include: [
            {
              model: require('../../models').Content,
              as: 'content',
              attributes: ['id', 'title', 'content_type', 'order_index']
            }
          ],
          order: [['created_at', 'ASC']],
          limit: 50
        });
      }
    } catch (error) {
      console.log('Progress model not available or error:', error);
    }

    // Get certificate if enrollment is completed
    let certificate = null;
    if (enrollment.status === 'completed' && enrollment.user_id && enrollment.course_id) {
      try {
        certificate = await Certificate.findOne({
          where: {
            user_id: enrollment.user_id,
            course_id: enrollment.course_id
          },
          attributes: ['id', 'certificate_number', 'issued_at', 'pdf_path']
        });
      } catch (error) {
        console.log('Certificate lookup error:', error);
      }
    }

    res.locals.currentPath = `/admin/enrollments/${enrollment.id}`;
    res.render('pages/admin/enrollments/show', {
      title: `Chi tiết đăng ký: ${enrollment.course?.title || 'N/A'}`,
      pageHeader: 'Chi tiết đăng ký khóa học',
      enrollment,
      progressDetails,
      certificate
    });
  } catch (error) {
    console.error('Admin enrollment show error:', error);
    res.status(500).render('error', {
      title: 'Lỗi hệ thống',
      error: {
        status: 500,
        message: 'Đã xảy ra lỗi khi tải thông tin đăng ký'
      }
    });
  }
};

/**
 * Update enrollment status
 */
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'active', 'completed', 'dropped'].includes(status)) {
      req.flash('error', 'Trạng thái không hợp lệ');
      return res.redirect(`/admin/enrollments/${req.params.id}`);
    }

    const enrollment = await Enrollment.findByPk(req.params.id, {
      include: [
        {
          model: Course,
          as: 'course'
        }
      ]
    });
    
    if (!enrollment) {
      req.flash('error', 'Đăng ký không tìm thấy');
      return res.redirect('/admin/enrollments');
    }

    const oldStatus = enrollment.status;
    enrollment.status = status;

    // Update enrolled_count on course if status changes
    if (oldStatus !== status) {
      const course = enrollment.course;
      if (course) {
        // If activating enrollment, increment count
        if (oldStatus !== 'active' && status === 'active') {
          await course.increment('enrolled_count');
        }
        // If deactivating enrollment, decrement count
        if (oldStatus === 'active' && status !== 'active') {
          await course.decrement('enrolled_count');
        }
      }
    }

    await enrollment.save();

    const statusMap = {
      'pending': 'Chờ duyệt',
      'active': 'Đang học',
      'completed': 'Hoàn thành',
      'dropped': 'Đã hủy'
    };

    req.flash('success', `Đã cập nhật trạng thái thành "${statusMap[status]}"`);
    res.redirect(`/admin/enrollments/${enrollment.id}`);
  } catch (error) {
    console.error('Update enrollment status error:', error);
    req.flash('error', 'Lỗi khi cập nhật trạng thái');
    res.redirect(`/admin/enrollments/${req.params.id}`);
  }
};

/**
 * Update enrollment progress
 */
exports.updateProgress = async (req, res) => {
  try {
    const { progress_percentage } = req.body;
    
    const progress = parseFloat(progress_percentage);
    if (isNaN(progress) || progress < 0 || progress > 100) {
      req.flash('error', 'Tiến độ phải là số từ 0 đến 100');
      return res.redirect(`/admin/enrollments/${req.params.id}`);
    }

    const enrollment = await Enrollment.findByPk(req.params.id);
    if (!enrollment) {
      req.flash('error', 'Đăng ký không tìm thấy');
      return res.redirect('/admin/enrollments');
    }

    enrollment.progress_percentage = progress;
    
    // Auto-update status to completed if progress is 100%
    if (progress >= 100 && enrollment.status !== 'completed') {
      enrollment.status = 'completed';
    }
    
    await enrollment.save();

    req.flash('success', `Đã cập nhật tiến độ thành ${progress.toFixed(2)}%`);
    res.redirect(`/admin/enrollments/${enrollment.id}`);
  } catch (error) {
    console.error('Update enrollment progress error:', error);
    req.flash('error', 'Lỗi khi cập nhật tiến độ');
    res.redirect(`/admin/enrollments/${req.params.id}`);
  }
};

/**
 * Delete enrollment
 */
exports.delete = async (req, res) => {
  try {
    const { confirm_delete } = req.body;
    
    if (confirm_delete !== 'DELETE') {
      req.flash('error', 'Vui lòng nhập "DELETE" để xác nhận xóa đăng ký');
      return res.redirect(`/admin/enrollments/${req.params.id}`);
    }

    const enrollment = await Enrollment.findByPk(req.params.id, {
      include: [
        {
          model: Course,
          as: 'course'
        }
      ]
    });
    
    if (!enrollment) {
      req.flash('error', 'Đăng ký không tìm thấy');
      return res.redirect('/admin/enrollments');
    }

    // Decrement course enrolled_count if enrollment was active
    if (enrollment.status === 'active' && enrollment.course) {
      await enrollment.course.decrement('enrolled_count');
    }

    await enrollment.destroy();

    req.flash('success', 'Đã xóa đăng ký thành công');
    res.redirect('/admin/enrollments');
  } catch (error) {
    console.error('Delete enrollment error:', error);
    req.flash('error', 'Lỗi khi xóa đăng ký');
    res.redirect(`/admin/enrollments/${req.params.id}`);
  }
};

