const { Category, Course } = require('../../models');
const { Op } = require('sequelize');

/**
 * List all categories (Admin)
 */
exports.index = async (req, res) => {
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
};

/**
 * Show create category form
 */
exports.showCreateForm = async (req, res) => {
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
};

/**
 * Create new category
 */
exports.create = async (req, res) => {
  try {
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
};

/**
 * Show edit category form
 */
exports.showEditForm = async (req, res) => {
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
};

/**
 * Update category
 */
exports.update = async (req, res) => {
  try {
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
};

/**
 * Show category details (Admin)
 */
exports.show = async (req, res) => {
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
};

/**
 * Update category status
 */
exports.updateStatus = async (req, res) => {
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
};

/**
 * Delete category
 */
exports.delete = async (req, res) => {
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
};

