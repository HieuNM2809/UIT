const express = require('express');
const minioService = require('../services/minioService');

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
      console.error('MinIO stat error:', statError);
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
      console.error('MinIO stream error:', error);
      if (!res.headersSent) {
        res.status(500).send('Error reading file');
      }
    });
    
    // Pipe the stream to response
    stream.pipe(res);
    
  } catch (error) {
    console.error('MinIO proxy error:', error);
    if (!res.headersSent) {
      res.status(500).send('Internal server error');
    }
  }
});

module.exports = router;

