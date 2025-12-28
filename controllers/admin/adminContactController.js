const { Contact, User } = require('../../models');
const { Op } = require('sequelize');

/**
 * List all contacts (Admin)
 */
exports.index = async (req, res) => {
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
};

/**
 * Show contact details (Admin)
 */
exports.show = async (req, res) => {
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
};

/**
 * Update contact status
 */
exports.updateStatus = async (req, res) => {
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
};

/**
 * Update contact priority
 */
exports.updatePriority = async (req, res) => {
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
};

/**
 * Update admin notes
 */
exports.updateNotes = async (req, res) => {
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
};

/**
 * Delete contact
 */
exports.delete = async (req, res) => {
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
};

