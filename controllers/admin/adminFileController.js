const minioService = require('../../services/minioService');
const multer = require('multer');
const { applicationLogger } = require('../../config/logger');

// Multer memory storage for MinIO upload
// No file size limit, no file type restrictions
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: Infinity // No limit
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
    const limit = 5;
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
    applicationLogger.error('Admin files index error', error, {
      action: 'file_list',
      resource_type: 'file',
      user_id: req.session?.user?.id,
      ip_address: req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0],
      user_agent: req.get('user-agent')
    });
    req.flash('error', 'Lỗi khi tải danh sách file');
    res.redirect('/admin');
  }
};

/**
 * Upload file(s) to MinIO - Supports multiple files
 */
exports.upload = [
  upload.array('files', 50), // Allow up to 50 files at once
  async (req, res) => {
    try {
      if (!minioService.isEnabled()) {
        return res.status(400).json({
          success: false,
          message: 'MinIO chưa được kích hoạt'
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Không có file được upload'
        });
      }

      const uploadResults = [];
      const errors = [];

      // Upload all files
      for (const file of req.files) {
        try {
          const fileBuffer = file.buffer;
          const fileName = file.originalname;
          const contentType = file.mimetype;

          const result = await minioService.uploadFile(fileBuffer, fileName, contentType);

          applicationLogger.info('File uploaded to MinIO', {
            action: 'file_upload',
            resource_type: 'file',
            resource_id: result.objectName,
            user_id: req.session.user.id,
            objectName: result.objectName,
            fileName: fileName,
            size: result.size,
            bucket: result.bucket,
            contentType: contentType,
            url: result.url,
            ip_address: req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0],
            user_agent: req.get('user-agent')
          });

          uploadResults.push(result);
        } catch (error) {
          applicationLogger.error('File upload error', error, {
            action: 'file_upload',
            resource_type: 'file',
            user_id: req.session?.user?.id,
            fileName: file?.originalname,
            ip_address: req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0],
            user_agent: req.get('user-agent')
          });
          errors.push({
            fileName: file.originalname,
            error: error.message
          });
        }
      }

      res.json({
        success: uploadResults.length > 0,
        message: uploadResults.length > 0 
          ? `Upload thành công ${uploadResults.length} file${uploadResults.length > 1 ? 's' : ''}${errors.length > 0 ? `, ${errors.length} file lỗi` : ''}`
          : 'Tất cả file upload đều thất bại',
        data: uploadResults,
        errors: errors.length > 0 ? errors : undefined
      });
    } catch (error) {
      applicationLogger.error('File upload error', error, {
        action: 'file_upload',
        resource_type: 'file',
        user_id: req.session?.user?.id,
        ip_address: req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0],
        user_agent: req.get('user-agent')
      });
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
      action: 'file_delete',
      resource_type: 'file',
      resource_id: objectName,
      user_id: req.session.user.id,
      objectName: objectName,
      ip_address: req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0],
      user_agent: req.get('user-agent')
    });

    res.json({
      success: true,
      message: 'Xóa file thành công'
    });
  } catch (error) {
    applicationLogger.error('File delete error', error, {
      action: 'file_delete',
      resource_type: 'file',
      resource_id: req.body?.objectName,
      user_id: req.session?.user?.id,
      ip_address: req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0],
      user_agent: req.get('user-agent')
    });
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
    applicationLogger.error('Get file info error', error, {
      action: 'file_get_info',
      resource_type: 'file',
      resource_id: req.params?.objectName,
      user_id: req.session?.user?.id,
      ip_address: req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0],
      user_agent: req.get('user-agent')
    });
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin file: ' + error.message
    });
  }
};

