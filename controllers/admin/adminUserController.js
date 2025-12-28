const { User, Enrollment, Course } = require('../../models');
const { Op } = require('sequelize');
const ExcelJS = require('exceljs');

/**
 * List all users (Admin)
 */
exports.index = async (req, res) => {
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
};

/**
 * Export users to Excel
 */
exports.export = async (req, res) => {
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
};

/**
 * Show user details (Admin)
 */
exports.show = async (req, res) => {
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
};

/**
 * Update user status
 */
exports.updateStatus = async (req, res) => {
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
};

/**
 * Update user role
 */
exports.updateRole = async (req, res) => {
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
};

/**
 * Delete user (soft delete - deactivate)
 */
exports.delete = async (req, res) => {
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
};

