const { Blog, User, Category } = require('../models');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');

// Create blog images directory if it doesn't exist
const blogImagesDir = path.join(__dirname, '../uploads/images');
const ensureBlogImagesDir = async () => {
  try {
    await fs.access(blogImagesDir);
  } catch {
    await fs.mkdir(blogImagesDir, { recursive: true });
  }
};

// Multer configuration for blog featured image upload
const blogImageStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await ensureBlogImagesDir();
      cb(null, blogImagesDir);
    } catch (error) {
      console.error('Error ensuring blog images directory:', error);
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    const userId = req.session.user?.id || 'unknown';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `blog-${userId}-${uniqueSuffix}${ext}`);
  }
});

// File filter - only images
const blogImageFileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)'), false);
  }
};

// Multer upload middleware for CKEditor images (field name 'upload')
exports.uploadBlogImageForEditor = multer({
  storage: blogImageStorage,
  fileFilter: blogImageFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
}).single('upload');

// Multer upload middleware for form featured_image (field name 'featured_image')
exports.uploadBlogImageForForm = multer({
  storage: blogImageStorage,
  fileFilter: blogImageFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
}).single('featured_image');

/**
 * Show user's blogs (my blogs)
 */
exports.myBlogs = async (req, res) => {
  try {
    if (!req.session.user) {
      req.flash('error', 'Bạn cần đăng nhập để xem bài viết của mình');
      return res.redirect('/auth/login');
    }

    const { status, page = 1 } = req.query;
    const limit = 5;
    const offset = (parseInt(page) - 1) * limit;

    // Build where clause
    const whereClause = {
      author_id: req.session.user.id
    };

    if (status && ['draft', 'published', 'archived'].includes(status)) {
      whereClause.status = status;
    }

    // Get blogs with pagination
    const { count, rows: blogs } = await Blog.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug'],
          required: false
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Count blogs by status
    const statusCounts = {
      all: await Blog.count({ where: { author_id: req.session.user.id } }),
      draft: await Blog.count({ where: { author_id: req.session.user.id, status: 'draft' } }),
      published: await Blog.count({ where: { author_id: req.session.user.id, status: 'published' } }),
      archived: await Blog.count({ where: { author_id: req.session.user.id, status: 'archived' } })
    };

    res.locals.currentPath = '/blogs/my-blogs';
    res.render('pages/blogs/my-blogs', {
      title: 'Quản lý bài viết',
      pageHeader: 'Quản lý bài viết',
      blogs,
      statusCounts,
      currentStatus: status || 'all',
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(count / limit),
        total_items: count,
        has_prev: page > 1,
        has_next: page < Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('My blogs error:', error);
    req.flash('error', 'Lỗi khi tải danh sách bài viết');
    res.redirect('/blogs');
  }
};

/**
 * Show all blogs
 */
exports.index = async (req, res) => {
  try {
    const { search, category, tag, author, page = 1 } = req.query;
    const limit = 12;
    const offset = (parseInt(page) - 1) * limit;

    // Build where clause
    const whereClause = {
      status: 'published'
    };

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } },
        { excerpt: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (tag) {
      whereClause.tags = { [Op.contains]: [tag] };
    }

    if (author) {
      whereClause.author_id = author;
    }

    // Build include clause
    const includeClause = [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'first_name', 'last_name', 'avatar']
      }
    ];

    // Add category filter if provided
    if (category) {
      includeClause.push({
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug'],
        where: { id: category },
        required: true
      });
    } else {
      includeClause.push({
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug'],
        required: false
      });
    }

    // Get blogs with pagination
    const { count, rows: blogs } = await Blog.findAndCountAll({
      where: whereClause,
      include: includeClause,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Get categories for filter
    const categories = await Category.findAll({
      where: { is_active: true },
      order: [['name', 'ASC']]
    });

    res.locals.currentPath = '/blogs';
    res.render('pages/blogs/index', {
      title: 'Blog',
      pageHeader: 'Blog',
      pageDescription: 'Khám phá các bài viết từ cộng đồng UIT',
      blogs,
      categories,
      currentFilters: { search, category, tag, author },
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(count / limit),
        total_items: count,
        has_prev: page > 1,
        has_next: page < Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Blog listing error:', error);
    req.flash('error', 'Lỗi khi tải danh sách blog');
    res.redirect('/');
  }
};

/**
 * Show single blog
 */
exports.show = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      where: { slug: req.params.slug },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'first_name', 'last_name', 'avatar', 'email']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug'],
          required: false
        }
      ]
    });

    if (!blog) {
      return res.status(404).render('error', {
        title: 'Bài viết không tìm thấy',
        error: {
          status: 404,
          message: 'Bài viết bạn tìm kiếm không tồn tại'
        }
      });
    }

    // Check if not published and user doesn't have access
    if (blog.status !== 'published') {
      if (!req.session.user || 
          (blog.author_id !== req.session.user.id && 
           !['admin', 'system_admin'].includes(req.session.user?.role))) {
        return res.status(404).render('error', {
          title: 'Bài viết không tìm thấy',
          error: {
            status: 404,
            message: 'Bài viết bạn tìm kiếm không tồn tại'
          }
        });
      }
    }

    // Increment view count
    await blog.incrementViewCount();

    // Get related blogs (same category)
    const relatedBlogs = await Blog.findAll({
      where: {
        status: 'published',
        category_id: blog.category_id,
        id: { [Op.ne]: blog.id }
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['first_name', 'last_name']
        }
      ],
      limit: 4,
      order: [['created_at', 'DESC']]
    });

    res.locals.currentPath = `/blogs/${blog.slug}`;
    res.render('pages/blogs/show', {
      title: blog.title,
      blog,
      relatedBlogs
    });

  } catch (error) {
    console.error('Blog show error:', error);
    res.status(500).render('error', {
      title: 'Lỗi hệ thống',
      error: {
        status: 500,
        message: 'Đã xảy ra lỗi khi tải bài viết'
      }
    });
  }
};

/**
 * Show create blog form
 */
exports.create = async (req, res) => {
  try {
    if (!req.session.user) {
      req.flash('error', 'Bạn cần đăng nhập để tạo blog');
      return res.redirect('/auth/login');
    }

    // Get categories for dropdown
    const categories = await Category.findAll({
      where: { is_active: true },
      order: [['name', 'ASC']]
    });

    res.locals.currentPath = '/blogs/create';
    res.render('pages/blogs/form', {
      title: 'Tạo bài viết mới',
      pageHeader: 'Tạo bài viết mới',
      blog: null,
      categories,
      formAction: '/blogs',
      formMethod: 'POST'
    });

  } catch (error) {
    console.error('Blog create form error:', error);
    req.flash('error', 'Lỗi khi tải form tạo blog');
    res.redirect('/blogs');
  }
};

/**
 * Upload image for CKEditor
 */
exports.uploadImage = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({
        error: {
          message: 'Bạn cần đăng nhập để upload ảnh'
        }
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: {
          message: 'Không có file được upload'
        }
      });
    }

    try {
      // Process and optimize image
      const imagePath = req.file.path;
      const fileExt = path.extname(imagePath);
      const fileBaseName = path.basename(imagePath, fileExt);
      let finalPath = path.join(path.dirname(imagePath), `${fileBaseName}.jpg`);

      try {
        await sharp(imagePath)
          .resize(1200, null, { 
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({ quality: 85 })
          .toFile(finalPath);

        if (imagePath !== finalPath) {
          try {
            await fs.unlink(imagePath);
          } catch (unlinkError) {
            console.error('Error deleting original file:', unlinkError);
          }
        }
      } catch (sharpError) {
        console.error('Error processing image:', sharpError);
        finalPath = imagePath;
      }

      const imageUrl = `/uploads/images/${path.basename(finalPath)}`;

      // CKEditor expects this format
      res.json({
        url: imageUrl
      });

    } catch (error) {
      console.error('Image upload error:', error);
      res.status(500).json({
        error: {
          message: 'Lỗi khi xử lý ảnh'
        }
      });
    }

  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({
      error: {
        message: 'Lỗi khi upload ảnh'
      }
    });
  }
};

/**
 * Store new blog
 */
exports.store = async (req, res) => {
  try {
    if (!req.session.user) {
      req.flash('error', 'Bạn cần đăng nhập để tạo blog');
      return res.redirect('/auth/login');
    }

    // Handle file upload first (multer needs to parse multipart/form-data)
    let featuredImageUrl = null;
    await new Promise((resolve) => {
      exports.uploadBlogImageForForm(req, res, async (err) => {
        if (err) {
          console.error('File upload error:', err);
        }
        
        if (req.file) {
          try {
            const imagePath = req.file.path;
            const fileExt = path.extname(imagePath);
            const fileBaseName = path.basename(imagePath, fileExt);
            let finalPath = path.join(path.dirname(imagePath), `${fileBaseName}.jpg`);
            
            try {
              await sharp(imagePath)
                .resize(1200, null, { 
                  fit: 'inside',
                  withoutEnlargement: true
                })
                .jpeg({ quality: 85 })
                .toFile(finalPath);

              if (imagePath !== finalPath) {
                try {
                  await fs.unlink(imagePath);
                } catch (unlinkError) {
                  console.error('Error deleting original file:', unlinkError);
                }
              }
            } catch (sharpError) {
              console.error('Error processing image:', sharpError);
              finalPath = imagePath;
            }

            featuredImageUrl = `/uploads/images/${path.basename(finalPath)}`;
          } catch (error) {
            console.error('Error processing uploaded image:', error);
          }
        }
        resolve();
      });
    });

    // Now get form data (after multer has parsed it)
    const { title, content, excerpt, featured_image, status, tags, category_id, action } = req.body;
    
    // Manual validation
    if (!title || !title.trim()) {
      req.flash('error', 'Tiêu đề không được để trống');
      return res.redirect('back');
    }
    
    if (title.trim().length < 3 || title.trim().length > 200) {
      req.flash('error', 'Tiêu đề phải từ 3 đến 200 ký tự');
      return res.redirect('back');
    }
    
    if (!content || !content.trim()) {
      req.flash('error', 'Nội dung không được để trống');
      return res.redirect('back');
    }
    
    const textContent = content.replace(/<[^>]*>/g, '').trim();
    if (textContent.length < 50) {
      req.flash('error', 'Nội dung phải có ít nhất 50 ký tự');
      return res.redirect('back');
    }
    
    // Use uploaded image URL or fallback to provided URL
    if (!featuredImageUrl && featured_image) {
      featuredImageUrl = featured_image;
    }
    
    // Determine status based on action button
    let finalStatus = status || 'draft';
    if (action === 'publish') {
      finalStatus = 'published';
    } else if (action === 'draft') {
      finalStatus = 'draft';
    }

    // Process tags
    let processedTags = [];
    if (tags) {
      if (typeof tags === 'string') {
        try {
          processedTags = JSON.parse(tags);
        } catch {
          processedTags = tags.split(',').map(t => t.trim()).filter(t => t);
        }
      } else if (Array.isArray(tags)) {
        processedTags = tags.map(t => typeof t === 'string' ? t.trim() : String(t).trim()).filter(t => t);
      }
    }

    // Create blog
    const blog = await Blog.create({
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt ? excerpt.trim() : null,
      featured_image: featuredImageUrl,
      status: finalStatus,
      tags: processedTags,
      category_id: category_id || null,
      author_id: req.session.user.id
    });

    req.flash('success', 'Tạo bài viết thành công!');
    res.redirect(`/blogs/${blog.slug}`);

  } catch (error) {
    console.error('Blog store error:', error);
    req.flash('error', 'Lỗi khi tạo bài viết: ' + (error.message || 'Vui lòng thử lại'));
    
    // Get categories for form
    const categories = await Category.findAll({
      where: { is_active: true },
      order: [['name', 'ASC']]
    });

    res.render('pages/blogs/form', {
      title: 'Tạo bài viết mới',
      pageHeader: 'Tạo bài viết mới',
      blog: req.body,
      categories,
      formAction: '/blogs',
      formMethod: 'POST'
    });
  }
};

/**
 * Show edit blog form
 */
exports.edit = async (req, res) => {
  try {
    if (!req.session.user) {
      req.flash('error', 'Bạn cần đăng nhập để chỉnh sửa blog');
      return res.redirect('/auth/login');
    }

    const blog = await Blog.findByPk(req.params.id);

    if (!blog) {
      req.flash('error', 'Bài viết không tìm thấy');
      return res.redirect('/blogs');
    }

    // Check if user is author or admin
    if (blog.author_id !== req.session.user.id && 
        !['admin', 'system_admin'].includes(req.session.user.role)) {
      req.flash('error', 'Bạn không có quyền chỉnh sửa bài viết này');
      return res.redirect(`/blogs/${blog.slug}`);
    }

    // Get categories for dropdown
    const categories = await Category.findAll({
      where: { is_active: true },
      order: [['name', 'ASC']]
    });

    res.locals.currentPath = `/blogs/${blog.slug}/edit`;
    res.render('pages/blogs/form', {
      title: `Chỉnh sửa: ${blog.title}`,
      pageHeader: 'Chỉnh sửa bài viết',
      blog,
      categories,
      formAction: `/blogs/${blog.id}`,
      formMethod: 'PUT'
    });

  } catch (error) {
    console.error('Blog edit form error:', error);
    req.flash('error', 'Lỗi khi tải form chỉnh sửa blog');
    res.redirect('/blogs');
  }
};

/**
 * Update blog
 */
exports.update = async (req, res) => {
  try {
    if (!req.session.user) {
      req.flash('error', 'Bạn cần đăng nhập để chỉnh sửa blog');
      return res.redirect('/auth/login');
    }

    const blog = await Blog.findByPk(req.params.id);

    if (!blog) {
      req.flash('error', 'Bài viết không tìm thấy');
      return res.redirect('/blogs');
    }

    // Check if user is author or admin
    if (blog.author_id !== req.session.user.id && 
        !['admin', 'system_admin'].includes(req.session.user.role)) {
      req.flash('error', 'Bạn không có quyền chỉnh sửa bài viết này');
      return res.redirect(`/blogs/${blog.slug}`);
    }

    // Handle file upload first
    const { title, content, excerpt, featured_image, status, tags, category_id, action } = req.body;
    let featuredImageUrl = featured_image || blog.featured_image;
    await new Promise((resolve) => {
      exports.uploadBlogImageForForm(req, res, async (err) => {
        if (err) {
          console.error('File upload error:', err);
        }
        
        if (req.file) {
          // Delete old image if exists
          if (blog.featured_image && blog.featured_image.startsWith('/uploads/')) {
            try {
              const oldImagePath = path.join(__dirname, '../..', blog.featured_image);
              await fs.unlink(oldImagePath);
            } catch (error) {
              console.error('Error deleting old image:', error);
            }
          }
          
          try {
            const imagePath = req.file.path;
            const fileExt = path.extname(imagePath);
            const fileBaseName = path.basename(imagePath, fileExt);
            let finalPath = path.join(path.dirname(imagePath), `${fileBaseName}.jpg`);
            
            try {
              await sharp(imagePath)
                .resize(1200, null, { 
                  fit: 'inside',
                  withoutEnlargement: true
                })
                .jpeg({ quality: 85 })
                .toFile(finalPath);

              if (imagePath !== finalPath) {
                try {
                  await fs.unlink(imagePath);
                } catch (unlinkError) {
                  console.error('Error deleting original file:', unlinkError);
                }
              }
            } catch (sharpError) {
              console.error('Error processing image:', sharpError);
              finalPath = imagePath;
            }

            featuredImageUrl = `/uploads/images/${path.basename(finalPath)}`;
          } catch (error) {
            console.error('Error processing uploaded image:', error);
          }
        }
        resolve();
      });
    });
    
    // Manual validation
    if (title && (title.trim().length < 3 || title.trim().length > 200)) {
      req.flash('error', 'Tiêu đề phải từ 3 đến 200 ký tự');
      return res.redirect('back');
    }
    
    if (content) {
      const textContent = content.replace(/<[^>]*>/g, '').trim();
      if (textContent.length < 50) {
        req.flash('error', 'Nội dung phải có ít nhất 50 ký tự');
        return res.redirect('back');
      }
    }
    
    // Determine status based on action button
    let finalStatus = status || blog.status;
    if (action === 'publish') {
      finalStatus = 'published';
    } else if (action === 'draft') {
      finalStatus = 'draft';
    }

    // Process tags
    let processedTags = blog.tags || [];
    if (tags) {
      if (typeof tags === 'string') {
        try {
          processedTags = JSON.parse(tags);
        } catch {
          processedTags = tags.split(',').map(t => t.trim()).filter(t => t);
        }
      } else if (Array.isArray(tags)) {
        processedTags = tags.map(t => typeof t === 'string' ? t.trim() : String(t).trim()).filter(t => t);
      }
    }

    // Update blog
    if (title) blog.title = title.trim();
    if (content) blog.content = content.trim();
    if (excerpt !== undefined) blog.excerpt = excerpt ? excerpt.trim() : null;
    blog.featured_image = featuredImageUrl;
    blog.status = finalStatus;
    blog.tags = processedTags;
    if (category_id !== undefined) blog.category_id = category_id || null;

    // Regenerate slug if title changed
    if (title && title !== blog.title) {
      blog.slug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
    }

    await blog.save();

    req.flash('success', 'Cập nhật bài viết thành công!');
    res.redirect(`/blogs/${blog.slug}`);

  } catch (error) {
    console.error('Blog update error:', error);
    req.flash('error', 'Lỗi khi cập nhật bài viết: ' + (error.message || 'Vui lòng thử lại'));
    res.redirect('back');
  }
};

/**
 * Delete blog
 */
exports.destroy = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: 'Bạn cần đăng nhập để xóa blog'
      });
    }

    const blog = await Blog.findByPk(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Bài viết không tìm thấy'
      });
    }

    // Check if user is author or admin
    if (blog.author_id !== req.session.user.id && 
        !['admin', 'system_admin'].includes(req.session.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xóa bài viết này'
      });
    }

    // Delete featured image if exists
    if (blog.featured_image && blog.featured_image.startsWith('/uploads/')) {
      try {
        const imagePath = path.join(__dirname, '../..', blog.featured_image);
        await fs.unlink(imagePath);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    await blog.destroy();

    res.json({
      success: true,
      message: 'Xóa bài viết thành công'
    });

  } catch (error) {
    console.error('Blog delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa bài viết: ' + (error.message || 'Vui lòng thử lại')
    });
  }
};
