const express = require('express');
const minioService = require('../services/minioService');
const { applicationLogger } = require('../config/logger');

const router = express.Router();

/**
 * MinIO Proxy Route
 * Serve files from MinIO through Express to avoid CORS issues
 * 
 * @route   GET /minio/:bucket/:object(*)
 * @access  Public
 * 
 * Example: GET /minio/studymate/1767257679876-Screenshot_2025-11-25_212629.png
 */
router.get('/:bucket/:object(*)', async (req, res) => {
  try {
    if (!minioService.isEnabled() || !minioService.client) {
      return res.status(503).send('MinIO service is not available');
    }

    const { bucket, object } = req.params;
    const objectName = decodeURIComponent(object);

    // Get file metadata first
    let stat;
    try {
      stat = await minioService.client.statObject(bucket, objectName);
    } catch (statError) {
      // Only log non-404 errors (file not found is a normal case)
      if (statError.code !== 'NotFound') {
        applicationLogger.error('MinIO stat error', statError, {
          type: 'minio',
          operation: 'statObject',
          bucket: bucket,
          object: objectName
        });
      }
      // Return 404 without logging - this is expected for missing files
      return res.status(404).send('File not found');
    }

    // Get file stream from MinIO
    const stream = await minioService.client.getObject(bucket, objectName);
    
    // Set appropriate headers
    res.setHeader('Content-Type', stat.metaData['content-type'] || stat.metaData['Content-Type'] || 'application/octet-stream');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow CORS
    
    // Handle stream errors
    stream.on('error', (error) => {
      applicationLogger.error('MinIO stream error', error, {
        type: 'minio',
        operation: 'getObject',
        bucket: bucket,
        object: objectName
      });
      if (!res.headersSent) {
        res.status(500).send('Error reading file');
      }
    });
    
    // Pipe the stream to response
    stream.pipe(res);
    
  } catch (error) {
    applicationLogger.error('MinIO proxy error', error, {
      type: 'minio',
      operation: 'proxy',
      bucket: req.params.bucket,
      object: req.params.object
    });
    if (!res.headersSent) {
      res.status(500).send('Internal server error');
    }
  }
});

module.exports = router;

