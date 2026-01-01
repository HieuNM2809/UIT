const Minio = require('minio');

/**
 * Normalize file name: remove Vietnamese diacritics and replace spaces with underscores
 */
function normalizeFileName(fileName) {
  // Split filename and extension
  const lastDotIndex = fileName.lastIndexOf('.');
  const name = lastDotIndex > 0 ? fileName.substring(0, lastDotIndex) : fileName;
  const ext = lastDotIndex > 0 ? fileName.substring(lastDotIndex) : '';
  
  // Remove Vietnamese diacritics
  const normalized = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/[^a-zA-Z0-9_-]/g, '_') // Replace special characters with underscores
    .replace(/_+/g, '_') // Replace multiple underscores with single underscore
    .replace(/^_+|_+$/g, ''); // Remove leading/trailing underscores
  
  return normalized + ext;
}

class MinioService {
  constructor() {
    this.enabled = process.env.MINIO_ENABLED === 'true';
    this.endPoint = process.env.MINIO_ENDPOINT || 'localhost';
    this.port = parseInt(process.env.MINIO_PORT) || 9000;
    this.useSSL = process.env.MINIO_USE_SSL === 'true';
    this.accessKey = process.env.MINIO_ROOT_USER || 'minioadmin';
    this.secretKey = process.env.MINIO_ROOT_PASSWORD || 'minioadmin123';
    this.bucketName = process.env.MINIO_BUCKET_NAME || 'studymate';
    this.publicUrl = process.env.MINIO_PUBLIC_URL || `http://${this.endPoint}:${this.port}`;
    
    this.client = null;
    
    if (this.enabled) {
      try {
        this.client = new Minio.Client({
          endPoint: this.endPoint,
          port: this.port,
          useSSL: this.useSSL,
          accessKey: this.accessKey,
          secretKey: this.secretKey
        });
        
        // Ensure bucket exists
        this.ensureBucket();
        console.log(`✅ MinIO client initialized: ${this.publicUrl}`);
      } catch (error) {
        console.error('❌ Failed to initialize MinIO client:', error.message);
        this.enabled = false;
      }
    } else {
      console.warn('⚠️  MinIO is disabled. Set MINIO_ENABLED=true to enable.');
    }
  }

  async ensureBucket() {
    if (!this.client) return;

    try {
      const exists = await this.client.bucketExists(this.bucketName);
      if (!exists) {
        await this.client.makeBucket(this.bucketName, 'us-east-1');
        // Set bucket policy to allow public read access
        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${this.bucketName}/*`]
            }
          ]
        };
        await this.client.setBucketPolicy(this.bucketName, JSON.stringify(policy));
        console.log(`✅ Created MinIO bucket: ${this.bucketName}`);
      }
    } catch (error) {
      console.error('Error ensuring MinIO bucket:', error.message);
    }
  }

  async uploadFile(fileBuffer, fileName, contentType = 'application/octet-stream') {
    if (!this.enabled || !this.client) {
      throw new Error('MinIO is not enabled or client not initialized');
    }

    try {
      // Normalize file name: remove diacritics and replace spaces with underscores
      const normalizedFileName = normalizeFileName(fileName);
      const objectName = `${Date.now()}-${normalizedFileName}`;
      const metaData = {
        'Content-Type': contentType,
        'X-Amz-Meta-Uploaded-By': 'studymate-admin'
      };

      await this.client.putObject(this.bucketName, objectName, fileBuffer, fileBuffer.length, metaData);
      
      const publicUrl = `${this.publicUrl}/${this.bucketName}/${objectName}`;
      
      return {
        success: true,
        objectName,
        fileName: normalizedFileName, // Normalized file name (no diacritics, spaces replaced with _)
        originalFileName: fileName, // Original file name for reference
        url: publicUrl,
        bucket: this.bucketName,
        size: fileBuffer.length,
        contentType
      };
    } catch (error) {
      console.error('MinIO upload error:', error);
      throw error;
    }
  }

  async deleteFile(objectName) {
    if (!this.enabled || !this.client) {
      throw new Error('MinIO is not enabled or client not initialized');
    }

    try {
      await this.client.removeObject(this.bucketName, objectName);
      return { success: true };
    } catch (error) {
      console.error('MinIO delete error:', error);
      throw error;
    }
  }

  async listFiles(prefix = '', recursive = true) {
    if (!this.enabled || !this.client) {
      return [];
    }

    try {
      const objectsList = [];
      const stream = this.client.listObjects(this.bucketName, prefix, recursive);
      
      return new Promise((resolve, reject) => {
        stream.on('data', (obj) => {
          objectsList.push({
            name: obj.name,
            size: obj.size,
            lastModified: obj.lastModified,
            etag: obj.etag,
            url: `${this.publicUrl}/${this.bucketName}/${obj.name}`
          });
        });
        
        stream.on('end', () => {
          resolve(objectsList);
        });
        
        stream.on('error', (err) => {
          reject(err);
        });
      });
    } catch (error) {
      console.error('MinIO list error:', error);
      return [];
    }
  }

  async getFileInfo(objectName) {
    if (!this.enabled || !this.client) {
      return null;
    }

    try {
      const stat = await this.client.statObject(this.bucketName, objectName);
      return {
        name: objectName,
        size: stat.size,
        lastModified: stat.lastModified,
        etag: stat.etag,
        contentType: stat.metaData['content-type'],
        url: `${this.publicUrl}/${this.bucketName}/${objectName}`
      };
    } catch (error) {
      console.error('MinIO get file info error:', error);
      return null;
    }
  }

  getPublicUrl(objectName) {
    return `${this.publicUrl}/${this.bucketName}/${objectName}`;
  }

  isEnabled() {
    return this.enabled && this.client !== null;
  }
}

module.exports = new MinioService();

