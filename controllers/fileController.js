const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');

const { File, User, Content } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { applicationLogger } = require('../config/logger');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
const ensureUploadsDir = async () => {
  try {
    await fs.access(uploadsDir);
  } catch {
    await fs.mkdir(uploadsDir, { recursive: true });
  }
};

// Multer configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await ensureUploadsDir();
    
    // Organize by file type
    let subDir = 'others';
    if (file.mimetype.startsWith('image/')) subDir = 'images';
    else if (file.mimetype.startsWith('video/')) subDir = 'videos';
    else if (file.mimetype.startsWith('audio/')) subDir = 'audio';
    else if (file.mimetype === 'application/pdf') subDir = 'documents';

    const fullPath = path.join(uploadsDir, subDir);
    
    try {
      await fs.access(fullPath);
    } catch {
      await fs.mkdir(fullPath, { recursive: true });
    }
    
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = [
    // Images
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    // Videos
    'video/mp4', 'video/webm', 'video/ogg',
    // Audio
    'audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg',
    // Documents
    'application/pdf', 'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain', 'text/csv'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(`File type ${file.mimetype} is not allowed`, 400, 'INVALID_FILE_TYPE'), false);
  }
};

// Multer upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 10 // Max 10 files at once
  }
});

// Export upload middleware for use in routes
exports.upload = upload;

// Helper function to determine file type
const getFileType = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype.startsWith('audio/')) return 'audio';
  if (mimetype === 'application/pdf' || 
      mimetype.includes('document') || 
      mimetype.includes('presentation') ||
      mimetype.includes('text/')) return 'document';
  return 'other';
};

// Helper function to process images
const processImage = async (filePath) => {
  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    // Generate thumbnail for images
    const thumbnailPath = filePath.replace(/(\.[^.]+)$/, '_thumb$1');
    await image
      .resize(300, 300, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath);
    
    return {
      width: metadata.width,
      height: metadata.height,
      thumbnail_path: thumbnailPath
    };
  } catch (error) {
    applicationLogger.error('Error processing image', error);
    return null;
  }
};

/**
 * Upload files
 */
exports.uploadFiles = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new AppError('No files uploaded', 400, 'NO_FILES_UPLOADED');
  }

  const { content_id, is_public } = req.body;

  // Verify content exists if content_id provided
  if (content_id) {
    const content = await Content.findByPk(content_id, {
      include: [{ model: require('../models').Course, as: 'course' }]
    });
    
    if (!content) {
      throw new AppError('Content not found', 404, 'CONTENT_NOT_FOUND');
    }

    // Check if user can upload to this content
    if (content.course.instructor_id !== req.user.id && !req.user.isAdmin()) {
      throw new AppError('Not authorized to upload to this content', 403, 'NOT_AUTHORIZED');
    }
  }

  const uploadedFiles = [];

  for (const file of req.files) {
    try {
      const fileType = getFileType(file.mimetype);
      
      // Process images
      let additionalInfo = {};
      if (fileType === 'image') {
        const imageInfo = await processImage(file.path);
        if (imageInfo) {
          additionalInfo = imageInfo;
        }
      }

      // Create file record
      const fileRecord = await File.create({
        filename: file.filename,
        original_name: file.originalname,
        mime_type: file.mimetype,
        file_size: file.size,
        file_path: file.path,
        url: `/uploads/${path.basename(path.dirname(file.path))}/${file.filename}`,
        uploaded_by: req.user.id,
        content_id: content_id || null,
        file_type: fileType,
        is_public: is_public || false,
        metadata: {
          ...additionalInfo,
          upload_date: new Date(),
          ip_address: req.ip
        }
      });

      uploadedFiles.push(fileRecord);

    } catch (error) {
      applicationLogger.error(`Error processing file ${file.originalname}`, error);
      // Clean up file if database save failed
      try {
        await fs.unlink(file.path);
      } catch (unlinkError) {
        applicationLogger.error('Error cleaning up file', unlinkError);
      }
    }
  }

  if (uploadedFiles.length === 0) {
    throw new AppError('Failed to upload any files', 500, 'UPLOAD_FAILED');
  }

  applicationLogger.file(`${uploadedFiles.length} files uploaded by ${req.user.email}`);

  res.status(201).json({
    success: true,
    message: `${uploadedFiles.length} files uploaded successfully`,
    data: { files: uploadedFiles }
  });
};

/**
 * Get file by ID
 */
exports.show = async (req, res) => {
  const file = await File.findByPk(req.params.id, {
    include: [
      {
        model: User,
        as: 'uploaded_by',
        attributes: ['id', 'first_name', 'last_name']
      },
      {
        model: Content,
        as: 'content',
        attributes: ['id', 'title'],
        include: [
          {
            model: require('../models').Course,
            as: 'course',
            attributes: ['id', 'title', 'instructor_id']
          }
        ]
      }
    ]
  });

  if (!file) {
    throw new AppError('File not found', 404, 'FILE_NOT_FOUND');
  }

  // Check access permissions
  let hasAccess = false;

  // Public files
  if (file.is_public) {
    hasAccess = true;
  }
  // File owner
  else if (file.uploaded_by === req.user.id) {
    hasAccess = true;
  }
  // Admin access
  else if (req.user.isAdmin()) {
    hasAccess = true;
  }
  // Course instructor access
  else if (file.content && file.content.course && file.content.course.instructor_id === req.user.id) {
    hasAccess = true;
  }
  // Enrolled student access (for course content files)
  else if (file.content) {
    const enrollment = await require('../models').Enrollment.findByUserAndCourse(
      req.user.id, 
      file.content.course.id
    );
    if (enrollment && enrollment.status === 'active') {
      hasAccess = true;
    }
  }

  if (!hasAccess) {
    throw new AppError('Access denied', 403, 'ACCESS_DENIED');
  }

  // Increment download count
  file.download_count = (file.download_count || 0) + 1;
  await file.save();

  // Send file
  const filePath = file.file_path;
  
  try {
    await fs.access(filePath);
    
    // Set appropriate headers
    res.setHeader('Content-Type', file.mime_type);
    res.setHeader('Content-Disposition', `inline; filename="${file.original_name}"`);
    
    applicationLogger.file(`File downloaded: ${file.original_name} by ${req.user.email}`);
    
    res.sendFile(path.resolve(filePath));
    
  } catch (error) {
    applicationLogger.error('File not found on disk', error);
    throw new AppError('File not found', 404, 'FILE_NOT_FOUND');
  }
};

/**
 * Get user's uploaded files
 */
exports.getMyFiles = async (req, res) => {
  const { page = 1, limit = 20, file_type } = req.query;
  const offset = (page - 1) * limit;

  const whereClause = { uploaded_by: req.user.id };
  if (file_type) whereClause.file_type = file_type;

  const { count, rows: files } = await File.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: Content,
        as: 'content',
        attributes: ['id', 'title']
      }
    ],
    order: [['created_at', 'DESC']],
    limit: parseInt(limit),
    offset: parseInt(offset)
  });

  res.json({
    success: true,
    data: {
      files,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(count / limit),
        total_items: count,
        items_per_page: parseInt(limit)
      }
    }
  });
};

/**
 * Update file metadata
 */
exports.update = async (req, res) => {
  const file = await File.findByPk(req.params.id);

  if (!file) {
    throw new AppError('File not found', 404, 'FILE_NOT_FOUND');
  }

  // Check permissions
  if (file.uploaded_by !== req.user.id && !req.user.isAdmin()) {
    throw new AppError('Not authorized to update this file', 403, 'NOT_AUTHORIZED');
  }

  const { original_name, is_public } = req.body;

  if (original_name !== undefined) file.original_name = original_name.trim();
  if (is_public !== undefined) file.is_public = is_public;

  await file.save();

  applicationLogger.file(`File updated: ${file.original_name} by ${req.user.email}`);

  res.json({
    success: true,
    message: 'File updated successfully',
    data: { file }
  });
};

/**
 * Delete file
 */
exports.delete = async (req, res) => {
  const file = await File.findByPk(req.params.id);

  if (!file) {
    throw new AppError('File not found', 404, 'FILE_NOT_FOUND');
  }

  // Check permissions
  if (file.uploaded_by !== req.user.id && !req.user.isAdmin()) {
    throw new AppError('Not authorized to delete this file', 403, 'NOT_AUTHORIZED');
  }

  try {
    // Delete physical file
    await fs.unlink(file.file_path);
    
    // Delete thumbnail if exists
    if (file.metadata && file.metadata.thumbnail_path) {
      try {
        await fs.unlink(file.metadata.thumbnail_path);
      } catch (error) {
        applicationLogger.error('Error deleting thumbnail', error);
      }
    }

    // Delete database record
    await file.destroy();

    applicationLogger.file(`File deleted: ${file.original_name} by ${req.user.email}`);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    applicationLogger.error('Error deleting file', error);
    throw new AppError('Failed to delete file', 500, 'DELETE_FAILED');
  }
};

/**
 * Get file statistics (Admin only)
 */
exports.getStats = async (req, res) => {
  const totalFiles = await File.count();
  const totalSize = await File.sum('file_size');
  
  const fileTypeStats = await File.findAll({
    attributes: [
      'file_type',
      [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
      [require('sequelize').fn('SUM', require('sequelize').col('file_size')), 'total_size']
    ],
    group: ['file_type'],
    raw: true
  });

  const recentUploads = await File.findAll({
    include: [
      {
        model: User,
        as: 'uploaded_by',
        attributes: ['first_name', 'last_name']
      }
    ],
    order: [['created_at', 'DESC']],
    limit: 10
  });

  const stats = {
    overview: {
      total_files: totalFiles,
      total_size: totalSize || 0,
      total_size_mb: Math.round((totalSize || 0) / (1024 * 1024))
    },
    by_type: fileTypeStats.reduce((acc, stat) => {
      acc[stat.file_type] = {
        count: parseInt(stat.count),
        size: parseInt(stat.total_size) || 0,
        size_mb: Math.round((parseInt(stat.total_size) || 0) / (1024 * 1024))
      };
      return acc;
    }, {}),
    recent_uploads: recentUploads
  };

  res.json({
    success: true,
    data: { stats }
  });
};

