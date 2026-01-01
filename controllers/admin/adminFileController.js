const minioService = require('../../services/minioService');
const multer = require('multer');
const { applicationLogger } = require('../../config/logger');

// Multer memory storage for MinIO upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types
    cb(null, true);
  }
});

/**
 * Show file management page
 */
exports.index = async (req, res) => {
  try {
    const { search, page = 1 } = req.query;
    const limit = 20;
    const offset = (parseInt(page) - 1) * limit;

    if (!minioService.isEnabled()) {
      return res.render('pages/admin/files/index', {
        title: 'Quản lý File',
        pageHeader: 'Quản lý File',
        files: [],
        pagination: {
          current_page: 1,
          total_pages: 0,
          total_items: 0,
          has_prev: false,
          has_next: false
        },
        minioEnabled: false,
        error: 'MinIO chưa được kích hoạt. Vui lòng cấu hình MINIO_ENABLED=true trong .env'
      });
    }

    let allFiles = await minioService.listFiles('', true);
    
    // Filter by search if provided
    if (search) {
      allFiles = allFiles.filter(file => 
        file.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort by last modified (newest first)
    allFiles.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

    // Pagination
    const totalItems = allFiles.length;
    const totalPages = Math.ceil(totalItems / limit);
    const paginatedFiles = allFiles.slice(offset, offset + limit);

    res.locals.currentPath = '/admin/files';
    res.render('pages/admin/files/index', {
      title: 'Quản lý File',
      pageHeader: 'Quản lý File',
      files: paginatedFiles,
      pagination: {
        current_page: parseInt(page),
        total_pages: totalPages,
        total_items: totalItems,
        has_prev: page > 1,
        has_next: page < totalPages
      },
      search: search || '',
      minioEnabled: true
    });
  } catch (error) {
    console.error('Admin files index error:', error);
    req.flash('error', 'Lỗi khi tải danh sách file');
    res.redirect('/admin');
  }
};

/**
 * Upload file to MinIO
 */
exports.upload = [
  upload.single('file'),
  async (req, res) => {
    try {
      if (!minioService.isEnabled()) {
        return res.status(400).json({
          success: false,
          message: 'MinIO chưa được kích hoạt'
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Không có file được upload'
        });
      }

      const fileBuffer = req.file.buffer;
      const fileName = req.file.originalname;
      const contentType = req.file.mimetype;

      const result = await minioService.uploadFile(fileBuffer, fileName, contentType);

      applicationLogger.info('File uploaded to MinIO', {
        objectName: result.objectName,
        fileName: fileName,
        size: result.size,
        uploadedBy: req.session.user.id
      });

      res.json({
        success: true,
        message: 'Upload file thành công',
        data: result
      });
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi upload file: ' + error.message
      });
    }
  }
];

/**
 * Delete file from MinIO
 */
exports.delete = async (req, res) => {
  try {
    if (!minioService.isEnabled()) {
      return res.status(400).json({
        success: false,
        message: 'MinIO chưa được kích hoạt'
      });
    }

    const { objectName } = req.body;

    if (!objectName) {
      return res.status(400).json({
        success: false,
        message: 'Tên file không hợp lệ'
      });
    }

    await minioService.deleteFile(objectName);

    applicationLogger.info('File deleted from MinIO', {
      objectName: objectName,
      deletedBy: req.session.user.id
    });

    res.json({
      success: true,
      message: 'Xóa file thành công'
    });
  } catch (error) {
    console.error('File delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa file: ' + error.message
    });
  }
};

/**
 * Get file info
 */
exports.getInfo = async (req, res) => {
  try {
    if (!minioService.isEnabled()) {
      return res.status(400).json({
        success: false,
        message: 'MinIO chưa được kích hoạt'
      });
    }

    const { objectName } = req.params;

    const fileInfo = await minioService.getFileInfo(objectName);

    if (!fileInfo) {
      return res.status(404).json({
        success: false,
        message: 'File không tìm thấy'
      });
    }

    res.json({
      success: true,
      data: fileInfo
    });
  } catch (error) {
    console.error('Get file info error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin file: ' + error.message
    });
  }
};

