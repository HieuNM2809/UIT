const { Certificate, Course, User, Enrollment } = require('../models');
const certificateService = require('../services/certificateService');
const { applicationLogger } = require('../config/logger');
const fs = require('fs').promises;
const path = require('path');

/**
 * Download certificate PDF
 */
exports.download = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const userId = req.user?.id || req.session?.user?.id;

    if (!userId) {
      req.flash('error', 'Bạn cần đăng nhập để tải chứng chỉ');
      return res.redirect('/auth/login');
    }
    // Find certificate
    const certificate = await Certificate.findOne({
      where: {
        user_id: userId,
        id: certificateId
      },
      include: [
        { model: Course, as: 'course' },
        { model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email'] }
      ]
    });

    if (!certificate) {
      req.flash('error', 'Chứng chỉ không tồn tại');
      return res.redirect('back');
    }

    // Check if PDF file exists
    if (!certificate.pdf_path) {
      // Regenerate certificate if PDF doesn't exist
      const instructor = certificate.course.instructor || await User.findByPk(certificate.course.instructor_id, {
        attributes: ['id', 'first_name', 'last_name']
      });

      const studentName = `${certificate.user.first_name} ${certificate.user.last_name}`;
      const instructorName = instructor ? `${instructor.first_name} ${instructor.last_name}` : 'StudyMate';

      const { pdfPath, filename } = await certificateService.generateCertificate({
        studentName,
        courseTitle: certificate.course.title,
        certificateNumber: certificate.certificate_number,
        instructorName
      });

      await certificate.update({
        pdf_path: filename
      });
    }

    // Get PDF file path
    const pdfPath = path.join(__dirname, '../uploads/certificates', path.basename(certificate.pdf_path));
    
    try {
      const pdfBuffer = await fs.readFile(pdfPath);
      
      // Set headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="chung-chi-${certificate.course.title.replace(/[^a-zA-Z0-9]/g, '-')}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      // Log activity
      try {
        const elasticsearchService = require('../services/elasticsearchService');
        await elasticsearchService.logActivity({
          user_id: userId,
          action: 'download_certificate',
          route_name: 'certificate',
          route_path: `/certificates/${certificateId}/download`,
          route_base: '/certificates',
          resource_type: 'certificate',
          resource_id: certificate.id,
          ip_address: req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0],
          user_agent: req.get('user-agent'),
          session_id: req.sessionID,
          execution_time_ms: null,
          details: {
            method: req.method,
            certificateId: certificate.course_id,
            certificate_number: certificate.certificate_number
          }
        });
      } catch (logError) {
        applicationLogger.error('Failed to log certificate download activity', logError);
      }

      res.send(pdfBuffer);
    } catch (fileError) {
      applicationLogger.error('Failed to read certificate PDF file', fileError, {
        type: 'certificate',
        operation: 'download',
        certificateId: certificate.id,
        pdfPath: pdfPath
      });
      
      req.flash('error', 'Không thể tải chứng chỉ. Vui lòng thử lại sau.');
      res.redirect(`/courses/${certificate.course.slug || certificate.course_id}`);
    }
  } catch (error) {
    applicationLogger.error('Certificate download error', error, {
      type: 'certificate',
      operation: 'download',
      certificateId: req.params.certificateId,
      userId: req.user?.id || req.session?.user?.id
    });
    req.flash('error', 'Đã xảy ra lỗi khi tải chứng chỉ');
    res.redirect('/courses');
  }
};

/**
 * View certificate (inline)
 */
exports.view = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const userId = req.user?.id || req.session?.user?.id;

    if (!userId) {
      req.flash('error', 'Bạn cần đăng nhập để xem chứng chỉ');
      return res.redirect('/auth/login');
    }

    // Find certificate
    const certificate = await Certificate.findOne({
      where: {
        id: certificateId,
        user_id: userId
      },
      include: [
        { model: Course, as: 'course' },
        { model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email'] }
      ]
    });

    if (!certificate) {
      req.flash('error', 'Chứng chỉ không tồn tại');
      return res.redirect('back');
    }

    // Get PDF file path
    const pdfPath = path.join(__dirname, '../uploads/certificates', path.basename(certificate.pdf_path));
    
    try {
      const pdfBuffer = await fs.readFile(pdfPath);
      
      // Set headers for inline PDF view
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="chung-chi-${certificate.course.title.replace(/[^a-zA-Z0-9]/g, '-')}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      res.send(pdfBuffer);
    } catch (fileError) {
      applicationLogger.error('Failed to read certificate PDF file', fileError, {
        type: 'certificate',
        operation: 'view',
        certificateId: certificate.id
      });
      
      req.flash('error', 'Không thể xem chứng chỉ. Vui lòng thử lại sau.');
      res.redirect(`/courses/${certificate.course.slug || certificate.course_id}`);
    }
  } catch (error) {
    applicationLogger.error('Certificate view error', error, {
      type: 'certificate',
      operation: 'view',
      certificateId: req.params.certificateId
    });
    req.flash('error', 'Đã xảy ra lỗi khi xem chứng chỉ');
    res.redirect('/courses');
  }
};

